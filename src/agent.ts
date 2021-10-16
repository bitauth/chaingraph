/* eslint-disable max-lines */
import { cpus, loadavg } from 'os';
import { inspect } from 'util';

import type {
  BitcoreBlock,
  BitcoreBlockHeader,
  BitcoreTransaction,
} from '@chaingraph/bitcore-p2p-cash';
import {
  BitcoreInventoryType,
  internalBitcore,
} from '@chaingraph/bitcore-p2p-cash';
import LRU from 'lru-cache';

import {
  bitcoreBlockToChaingraphBlock,
  bitcoreTransactionToChaingraphTransaction,
  Peer,
} from './bitcore';
import { BlockBuffer } from './components/block-buffer';
import { BlockTree } from './components/block-tree';
import type { indexDefinitions } from './components/db-utils';
import { SyncState } from './components/sync-state';
import {
  formatBytes,
  formatByteThroughput,
  ThroughputStatistics,
} from './components/throughput-statistics';
import {
  blockBufferTargetSizeMB,
  chaingraphLogFirehose,
  chaingraphUserAgent,
  genesisBlocks,
  postgresMaxConnections,
  trustedNodes,
} from './config';
import {
  acceptBlocksViaHeaders,
  createIndexes,
  getAllKnownBlockHashes,
  getIndexCreationProgress,
  listExistingIndexes,
  pool,
  recordNodeValidation,
  reenableMempoolCleaning,
  registerTrustedNodeWithDb,
  removeStaleBlocksForNode,
  saveBlock,
  saveTransactionForNodes,
} from './db';
import { logger } from './logging';
import type { ChaingraphBlock } from './types/chaingraph';

/**
 * The fixed protocol version currently used by Chaingraph.
 *
 * This doesn't need to be configurable – changes to this value will usually
 * require other changes to Chaingraph's node connection code.
 */
const chaingraphProtocolVersion = 70012;

/**
 * The longest amount of time to wait for a block to be downloaded before
 * re-requesting the block (usually from another node). This only applies if the
 * slow node remains connected – downloads are immediately re-requested from
 * other nodes when a node disconnects.
 */
const downloadTimeout = 60_000;

const transactionCacheSize = 100_000;

export const cancelableDelay = (ms: number) => {
  // eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
  let timeoutId: number;
  const promise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, ms);
  });
  return {
    cancel: () => {
      clearTimeout(timeoutId);
    },
    completed: promise,
  };
};

const renderSyncPercentage = (value: number) => {
  const perCent = 100;
  const decimalPlaces = 3;
  return (value * perCent).toFixed(decimalPlaces);
};

const msPerSecond = 1000;
/**
 * Convert a bitcoin block header timestamp (UTC in seconds) to a `Date`.
 * @param timestamp - the block header timestamp
 */
const blockTimestampToDate = (timestamp: number) =>
  new Date(timestamp * msPerSecond);

const twoHoursAgo = () => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const twoHours = 2 * 60 * 60 * msPerSecond;
  return new Date(Date.now() - twoHours);
};

/**
 * The interval at which the agent's general status is logged (a variety of
 * syncing state and performance statistics).
 */
const loggingIntervalMs = 20_000;

interface TransactionCacheItem {
  /**
   * A boolean indicating if this transaction has been saved to the database.
   */
  db: boolean;
  /**
   * An array of object references to the nodes which have acknowledged this
   * transaction.
   */
  nodes: Agent['nodes'][string][];
}

/**
 * The Chaingraph Agent is the long-running process which connects to all
 * trusted nodes, downloads chain data, and saves everything to the database.
 *
 * After the initial sync, the agent maintains the node connections, updating
 * the database to keep it synchronized with each node.
 */
export class Agent {
  startTime = new Date();

  blockBuffer: BlockBuffer;

  blockTree: BlockTree;

  /**
   * A Set of all block hashes (as hex-encoded strings) currently saved to the
   * database. Maintaining this set in memory helps to avoid re-fetching and
   * re-writing blocks.
   *
   * Set to `undefined` until populated from the database.
   */
  blockDb: Set<string> | undefined;

  /**
   * A least-recently-used cache containing the hashes of transactions which
   * have been heard recently from a node (and may already be saved to the
   * database). Transactions in this list with `db: true` can be filtered from
   * block-saving DB mutations to reduce wasted database throughput.
   *
   * @remarks
   * Keys are hex-encoded transaction hashes (64 characters). Each value is a
   * `TransactionCacheItem`.
   */
  transactionCache = new LRU<string, TransactionCacheItem>({
    max: transactionCacheSize,
  });

  blockDownloads: {
    hash: string;
    height: number;
    requestedFromNode: string;
    requestStartTime: number;
    timeout: ReturnType<typeof setTimeout>;
  }[] = [];

  /**
   * Measures database performance of block saving. Finer-grained stats are
   * maintained by `databaseTransactionThroughput`.
   */
  databaseBlockThroughput = new ThroughputStatistics(() => ({
    blockBytes: 0,
    blocks: 0,
    transactionCacheMisses: 0,
  }));

  /**
   * Measures database performance of transaction saving. Separated from
   * `databaseBlockThroughput` to avoid needing to add statistics here for
   * fractions of blocks (since blocks are saved in chunks of transactions).
   */
  databaseThroughput = new ThroughputStatistics(() => ({
    inputs: 0,
    outputs: 0,
    transactionBytes: 0,
    transactions: 0,
  }));

  nodes: {
    [nodeName: string]: {
      disconnect: () => void;
      /**
       * Initially `false`, set to true when the headers sync has been completed
       * for this node.
       */
      headersSynced: boolean;
      /**
       * Initially `undefined`, is set after the node connection is ready and
       * the node has been inserted or updated in the database.
       */
      internalId: number | undefined;
      /**
       * Resolves once the node is has been inserted or updated in the database.
       * This is also when `internalId` and `syncState` are guaranteed to be
       * available.
       */
      nodeRegistered: Promise<void>;
      peer: Peer;
      /**
       * Initially `undefined`, is set after the node connection is ready and
       * the sync state has been restored from the database.
       */
      syncState: SyncState | undefined;
      /**
       * Measures the download performance from this node in bytes/millisecond.
       */
      downloadThroughput: ThroughputStatistics<{ bytes: number }>;
    };
  };

  loggingInterval: NodeJS.Timeout;

  scheduledBlockBufferFill = false;

  syncedAtLastFillAttempt = false;

  /**
   * Each time the Agent restarts, it attempts to perform an initial sync with
   * as few indexes as possible. After this initial sync is complete, any new
   * indexes are built, then the agent switches to maintenance mode.
   */
  completedInitialSync = false;

  blockDbRestored = false;

  successfullyInitialized = false;

  /**
   * Chaingraph does not currently support live transaction saving during
   * the initial sync and index building steps, as retaining this
   * information would require more complex logic, heavier memory usage,
   * and/or concurrently building indexes (slower). Until indexes have been
   * built, inbound transaction announcements are ignored.
   */
  saveInboundTransactions = false;

  /**
   * A list of indexes which are managed by Chaingraph. If these don't exist in
   * the database, they will be created after initial sync is complete.
   */
  managedIndexes: (keyof typeof indexDefinitions)[] = [
    'block_height_index',
    'block_inclusions_index',
    'output_search_index',
    'spent_by_index',
  ];

  /**
   * Set to `true` if `shutdown` has been called.
   */
  willShutdown = false;

  shutdownPromise: Promise<void> | undefined;

  onShutdown: () => void;

  constructor(config: { onShutdown: () => void }) {
    this.onShutdown = config.onShutdown;
    this.loggingInterval = setInterval(() => {
      this.logAgentStatus();
    }, loggingIntervalMs);

    this.blockTree = new BlockTree({
      genesisBlockByNode: trustedNodes.reduce(
        (all, node) => ({
          ...all,
          [node.name]: [genesisBlocks[node.networkMagicHex].hash],
        }),
        {}
      ),
      logger,
      onStaleBlocks: (
        staleChain: string[],
        firstHeight: number,
        nodeName: string
      ) => {
        this.handleStaleBlocks(staleChain, firstHeight, nodeName);
      },
    });

    const MB = 1_000_000;
    this.blockBuffer = new BlockBuffer({
      freedSpaceCallback: () => {
        this.scheduleBlockBufferFill();
      },
      targetSize: blockBufferTargetSizeMB * MB,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAllKnownBlockHashes().then((hashes) => {
      this.blockDb = new Set(hashes);
      this.blockDbRestored = true;
    });

    logger.info(
      trustedNodes,
      `Connecting to ${trustedNodes.length} trusted node(s)`
    );
    this.nodes = trustedNodes.reduce<Agent['nodes']>((all, node) => {
      const connectionStatus = {
        /**
         * A short timer which starts when a connection is retried. If the
         * connection fails within the "connection stability" period, the
         * connection is considered "unstable", and Chaingraph will retry the
         * connection after growing delays.
         *
         * Once a new connection has been maintained for a full "connection
         * stability" period, the retry period resets.
         *
         * Set to `undefined` for stable connections.
         */
        connectionStabilityTimer: undefined as
          | ReturnType<typeof setTimeout>
          | undefined,
        /**
         * The number off times this connection has been retried since a stable
         * connection was maintained.
         */
        retriesSinceStableConnection: 0,
        /**
         * If `true`, the connection will be retried on failure.
         */
        shouldRetryConnection: true,
      };

      /**
       * Bitcore doesn't error on duplicate Network additions, so we just use
       * the networkMagic hex as the name. All other fields are left undefined,
       * they aren't needed by Chaingraph.
       *
       * TODO: replace all uses of bitcore
       */
      internalBitcore.Networks.add({
        name: node.networkMagicHex,
        networkMagic: parseInt(node.networkMagicHex, 16),
      });
      const peer = new Peer({
        host: node.host,
        network: node.networkMagicHex,
        port: node.port,
        subversion: chaingraphUserAgent,
        version: chaingraphProtocolVersion,
      });

      if (chaingraphLogFirehose) {
        peer.on('*', (message, eventName) => {
          logger.trace(
            `${eventName} received from peer - ${node.name}: ${inspect(
              message,
              {
                compact: true,
                depth: 5,
                maxArrayLength: 20,
                maxStringLength: 1_000,
              }
            )}`
          );
        });
      }

      // eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
      let nodeRegisteredResolver: () => void;
      const nodeRegistered = new Promise<void>((resolve) => {
        nodeRegisteredResolver = resolve;
      });

      peer.on('ready', () => {
        logger.info(
          {
            bestHeight: peer.bestHeight,
            protocolVersion: peer.version,
            userAgent: peer.subversion,
          },
          `${node.name}: connected to node`
        );

        /**
         * Request block announcements as `headers` messages. In the Satoshi client,
         * when the trusted node accepts a new best block, it will send the new
         * header immediately rather than sending an `inv` message, saving a
         * round-trip.
         *
         * If the new best block is a re-organization (building on a previous stale
         * block), it will also send up to 8 of the parent blocks mined since the
         * fork. If a re-organization is deeper than 8 blocks, it will be announced
         * via `inv` message (the original block relay method).
         */
        peer.sendMessage(new peer.messages.SendHeaders());

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        registerTrustedNodeWithDb({
          latestConnectionBeganAt: new Date(),
          nodeName: node.name,
          protocolVersion: peer.version,
          userAgent: peer.subversion,
        }).then(({ internalId, syncedHeaderHashChain }) => {
          logger.trace(`Trusted node registered: ${node.name}`);
          const expectedGenesisBlock = genesisBlocks[node.networkMagicHex];
          this.nodes[node.name].internalId = internalId;
          const needsGenesisBlock = syncedHeaderHashChain.length === 0;
          const initialSyncState = this.blockTree.restoreChainForNode(
            node.name,
            needsGenesisBlock
              ? [expectedGenesisBlock.hash]
              : syncedHeaderHashChain
          );
          this.nodes[node.name].syncState = new SyncState(initialSyncState);
          const genesisBlockHeaderFromDb = this.blockTree.getBlockHeaderHash(
            node.name,
            0
          )!;
          if (needsGenesisBlock) {
            logger.trace(
              `Genesis block unsaved for: ${node.name}, saving block with hash: ${expectedGenesisBlock.hash}`
            );
            /**
             * Buffer the genesis block for this node (as if it were received over
             * the P2P interface).
             */
            this.bufferParsedBlock(expectedGenesisBlock, new Date());
          } else if (genesisBlockHeaderFromDb !== expectedGenesisBlock.hash) {
            logger.error(
              `Fatal error: attempted to restore chain for node ${node.name}, but the genesis block hash in the database differs from the one provided by the agent. This is likely a configuration error – shutting down to avoid corrupting the database. Block 0 hash expected: ${expectedGenesisBlock.hash} – from database: ${genesisBlockHeaderFromDb}`
            );
            this.shutdown().catch((err) => {
              logger.error(err);
            });
            return;
          }
          nodeRegisteredResolver();
          this.requestHeaders(node.name);
        });
      });

      peer.on('disconnect', () => {
        logger.info(`${node.name}: disconnected`);
        if (connectionStatus.shouldRetryConnection) {
          this.rescheduleDownloadsForNode(node.name);
          logger.debug(
            `${node.name}: unexpected disconnection – attempting to reconnect...`
          );
          if (connectionStatus.connectionStabilityTimer !== undefined) {
            clearTimeout(connectionStatus.connectionStabilityTimer);
            connectionStatus.retriesSinceStableConnection += 1;
          }

          const additionalDelayPerRetry = 5_000;
          const maximumConnectionDelay = 60_000;
          const nextDelay = Math.min(
            connectionStatus.retriesSinceStableConnection *
              additionalDelayPerRetry,
            maximumConnectionDelay
          );
          setTimeout(() => {
            const seconds = 1_000;
            logger.debug(
              `${node.name}: attempting to reconnect... (retry ${
                connectionStatus.retriesSinceStableConnection
              } – waited ${nextDelay / seconds} seconds)`
            );
            const connectionStabilityDelay = 10_000;
            connectionStatus.connectionStabilityTimer = setTimeout(() => {
              connectionStatus.retriesSinceStableConnection = 0;
              connectionStatus.connectionStabilityTimer = undefined;
            }, connectionStabilityDelay);
            peer.connect();
          }, nextDelay);
        } else {
          /**
           * Cancel timeouts to allow for immediate shutdown. Note: this doesn't
           * clean up all state – to reconnect properly, a new `Agent` would
           * need to be created.
           */
          this.cancelAllDownloadsForNode(node.name);
        }
      });

      peer.on('headers', (message) => {
        this.handleHeadersFromNode(node.name, message.headers);
      });

      peer.on('block', (message) => {
        this.handleBlockFromNode(node.name, message.block);
      });

      peer.on('inv', (message) => {
        message.inventory.forEach((inventoryItem) => {
          logger.trace(
            `${node.name}: inv message item - type: ${
              inventoryItem.type
            } hash: ${inventoryItem.hash.toString('hex')}`
          );
          // TODO: clean up handling of endianness (bitcore tries to be clever here)
          if (inventoryItem.type !== BitcoreInventoryType.MSG_TX) {
            if (inventoryItem.type === BitcoreInventoryType.MSG_BLOCK) {
              logger.warn(
                `${
                  node.name
                }: received unexpected block inventory item with hash: ${inventoryItem.hash.toString(
                  'hex'
                )} – does this node support SendHeaders? Attempting legacy sync:`
              );
              this.requestHeaders(node.name);
              return;
            }
            logger.warn(
              `${node.name}: received unexpected inventory item of type ${
                inventoryItem.type
              } with hash: ${inventoryItem.hash.toString('hex')}`
            );
            return;
          }
          const transactionHash = inventoryItem.hash.toString('hex');
          this.recordTransactionAnnouncementFromNode(
            node.name,
            inventoryItem.hash.toString('hex')
          );
          const isSavedTransaction =
            this.transactionCache.get(transactionHash)?.db;
          if (isSavedTransaction !== true) {
            logger.trace(
              `Requesting transaction from ${
                node.name
              } - hash: ${inventoryItem.hash.toString('hex')}`
            );
            /**
             * Chaingraph immediately requests the contents of every unknown
             * transaction inventory it receives. When connected to multiple
             * nodes, it's possible Chaingraph will request the same transaction
             * many times. If bandwidth between nodes and the Chaingraph agent
             * becomes a bottleneck (or Chaingraph agent CPU), a better strategy
             * might be to request each transaction only from the first one or
             * two nodes which announce it.
             */
            peer.sendMessage(
              peer.messages.GetData.forTransaction(inventoryItem.hash)
            );
          }
        });
      });

      peer.on('tx', (message) => {
        this.handleTransactionFromNode(node.name, message.transaction).catch(
          (err) => {
            logger.error(err);
          }
        );
      });

      peer.on('error', (err) => {
        logger.error(err as Error, `Error from peer: ${node.name}`);
      });

      peer.connect();
      const nodes: Agent['nodes'] = {
        ...all,
        [node.name]: {
          disconnect: () => {
            connectionStatus.shouldRetryConnection = false;
            peer.disconnect();
          },
          downloadThroughput: new ThroughputStatistics(() => ({ bytes: 0 })),
          headersSynced: false,
          internalId: undefined,
          nodeRegistered,
          peer,
          syncState: undefined,
        },
      };

      return nodes;
    }, {});
  }

  /**
   * Chaingraph confirms all configured nodes connect and are successfully
   * registered in the database before beginning to fill the block buffer. This
   * simplifies syncing logic, ensures node connectivity issues are easily
   * noticed, and avoids wasting cluster bandwidth when a node configuration
   * issue requires that Chaingraph be restarted.
   */
  checkInitialization() {
    const uninitializedNodes = Object.entries(this.nodes).reduce<string[]>(
      (nodes, [id, node]) =>
        node.internalId === undefined ? [...nodes, id] : nodes,
      []
    );
    if (uninitializedNodes.length > 0 || !this.blockDbRestored) {
      // warn if more than 5 seconds have passed since this.startTime
      const warnAfterDelayMs = 5000;
      const second = 1000;
      const currentDelay = Date.now() - this.startTime.getTime();
      if (currentDelay > warnAfterDelayMs) {
        if (this.blockDbRestored) {
          logger.warn(
            `The following nodes are taking longer than ${Math.round(
              currentDelay / second
            )} seconds to initialize and may be misconfigured: ${uninitializedNodes.join(
              ','
            )}`
          );
        } else {
          logger.warn(
            `Could not restore block hashes from the database within 5 seconds. There may be a database configuration or connectivity problem.`
          );
        }
      }
      setTimeout(() => {
        this.scheduleBlockBufferFill();
      }, second);
    } else {
      this.successfullyInitialized = true;
      this.scheduleBlockBufferFill();
    }
  }

  /**
   * This method should be called any time the block buffer might have available
   * space and un-synced blocks might be available.
   *
   * Block buffer filling will only begin after all nodes have been initialized.
   * See `checkInitialization` for details.
   */
  scheduleBlockBufferFill() {
    if (!this.scheduledBlockBufferFill) {
      setImmediate(() => {
        this.scheduledBlockBufferFill = false;
        if (this.successfullyInitialized) {
          this.fillBlockBuffer();
        } else {
          this.checkInitialization();
        }
      });
      this.scheduledBlockBufferFill = true;
    }
  }

  /**
   * If the block buffer is not already full, start filling it.
   */
  // eslint-disable-next-line complexity
  fillBlockBuffer() {
    logger.trace(
      `Attempting to fill block buffer. (size: ${this.blockBuffer.currentlyAllocatedSize()} | count: ${this.blockBuffer.count()} | reserved: ${
        this.blockBuffer.reservedBlocks
      })`
    );
    if (!this.blockBuffer.isFull() && !this.willShutdown) {
      const nextBlock = this.selectNextBlockToDownload();
      if (nextBlock === false) {
        logger.trace('fillBlockBuffer: no next block.');
        if (this.syncedAtLastFillAttempt) {
          logger.trace(
            'fillBlockBuffer: synced at last attempt, testing for completion.'
          );
          if (
            !this.completedInitialSync &&
            this.blockBuffer.count() === 0 &&
            Object.values(this.nodes).every(
              (node) =>
                node.headersSynced &&
                node.syncState?.latestSyncedBlockTime !== undefined &&
                (node.syncState.latestSyncedBlockTime === 'caught-up' ||
                  node.syncState.latestSyncedBlockTime > twoHoursAgo())
            )
          ) {
            this.completedInitialSync = true;
            logger.info(`Agent: initial sync is complete.`);
            this.buildIndexes()
              .then(async () => {
                logger.info(`Agent: all managed indexes have been created.`);
                return reenableMempoolCleaning().then(() => {
                  logger.info('Agent: enabled mempool tracking.');
                  this.saveInboundTransactions = true;
                });
              })
              .catch((err) => {
                logger.error(err);
              });
          }
        } else {
          this.syncedAtLastFillAttempt = true;
          logger.trace(
            `Agent: no next block yet – all blocks are pending or synced.`
          );
        }
        return;
      }
      this.syncedAtLastFillAttempt = false;
      this.blockBuffer.reserveBlock();
      const { hash, height, sourceNodes } = nextBlock;
      this.requestBlock(hash, height);
      sourceNodes.forEach((nodeName) => {
        this.nodes[nodeName].syncState!.markHeightAsPendingSync(height);
      });
      this.scheduleBlockBufferFill();
    }
  }

  /**
   * Build any Chaingraph-managed indexes which don't already exist.
   *
   * With Postgres, it's more efficient to complete the initial sync with as few
   * indexes as possible, then build the remaining indexes.
   *
   * This method is called any time Chaingraph is restarted – if the Chaingraph
   * database has previously finished the initial sync and index creation, this
   * method will simply confirm that all Chaingraph-managed indexes still exist.
   */
  async buildIndexes() {
    const existingIndexes = await listExistingIndexes();
    const missingIndexes = this.managedIndexes.filter(
      (requiredIndex) => !existingIndexes.includes(requiredIndex)
    );
    const indexCreationCompletion = createIndexes(missingIndexes);
    const indexLogDelayMs = 5000;
    const progressPercentageMinLength = 2;
    const logIndexCreationProgress = () => {
      getIndexCreationProgress()
        .then((progress) => {
          if (progress.length > 0) {
            logger.info(
              `Building indexes: ${progress
                .map(
                  ([name, percentage]) =>
                    `${name}: ${percentage.padStart(
                      progressPercentageMinLength,
                      ' '
                    )}%`
                )
                .join(', ')}`
            );
          }
        })
        .catch((err) => {
          logger.error(err);
        });
    };
    logIndexCreationProgress();
    const progressLogInterval = setInterval(
      logIndexCreationProgress,
      indexLogDelayMs
    );
    indexCreationCompletion.finally(() => {
      clearInterval(progressLogInterval);
    });
    return indexCreationCompletion;
  }

  /**
   * Internal method used to identify sync status of all nodes. Returns a list
   * of nodes in order from least-synced to most-synced. (Nodes which have not
   * finished connecting are excluded from the list.)
   */
  getChainSyncPercentages() {
    const bestHeights = this.blockTree.getBestHeights();
    const syncPercentages = Object.keys(this.nodes)
      .map((nodeName) => {
        const bestHeight = bestHeights[nodeName];
        const { syncState } = this.nodes[nodeName];
        if (syncState === undefined) return undefined;
        const pendingHeight = syncState.getPendingSyncHeight();
        return {
          bestHeight,
          nodeName,
          pendingHeight,
          syncPercentage: bestHeight === 0 ? 1 : pendingHeight / bestHeight,
        };
      })
      .filter(
        (
          nodeResults
        ): nodeResults is {
          bestHeight: number;
          nodeName: string;
          pendingHeight: number;
          syncPercentage: number;
        } => nodeResults !== undefined
      );
    return syncPercentages.sort((a, b) => a.syncPercentage - b.syncPercentage);
  }

  selectNextBlockToDownload() {
    const percentages = this.getChainSyncPercentages();
    const [leastSyncedChain] = percentages;
    if (leastSyncedChain.pendingHeight >= leastSyncedChain.bestHeight) {
      logger.trace(
        `All remaining blocks from least-synced chain are pending – ${
          leastSyncedChain.nodeName
        }: ${leastSyncedChain.pendingHeight}/${
          leastSyncedChain.bestHeight
        } (${renderSyncPercentage(leastSyncedChain.syncPercentage)}%)`
      );
      return false;
    }
    const { nodeName, pendingHeight } = leastSyncedChain;
    const height = pendingHeight + 1;
    logger.trace(
      `Selecting next block from least-synced chain – node: ${
        leastSyncedChain.nodeName
      } | selected: ${height} | best: ${
        leastSyncedChain.bestHeight
      } | synced: ${renderSyncPercentage(leastSyncedChain.syncPercentage)}%`
    );
    const hash = this.blockTree.getBlockHeaderHash(nodeName, height)!;
    const sourceNodes = this.blockTree.getSourceNodesForBlockHeader(
      hash,
      height
    );
    return { hash, height, sourceNodes };
  }

  /**
   * Check to see if any un-synced block header hashes are already known to the
   * database. If so, we can quickly mark these blocks as accepted by the node.
   */
  catchUpViaHeaders() {
    logger.trace('Attempting to catch up via headers.');
    const bestHeights = this.blockTree.getBestHeights();
    // eslint-disable-next-line complexity
    Object.keys(this.nodes).forEach((nodeName) => {
      const { syncState } = this.nodes[nodeName];
      if (this.blockDb === undefined || syncState === undefined) {
        logger.trace(
          `${nodeName}: catchUpViaHeaders - DB not yet connected, or syncState unknown.`
        );
        return;
      }
      const acceptedBlocks = [] as {
        height: number;
        hash: string;
      }[];
      // eslint-disable-next-line functional/no-loop-statement
      for (
        // eslint-disable-next-line functional/no-let
        let nextHeight = syncState.getPendingSyncHeight() + 1;
        nextHeight <= bestHeights[nodeName];
        nextHeight = syncState.getPendingSyncHeight() + 1
      ) {
        const nextHash = this.blockTree.getBlockHeaderHash(
          nodeName,
          nextHeight
        );
        if (nextHash !== undefined && this.blockDb.has(nextHash)) {
          acceptedBlocks.push({ hash: nextHash, height: nextHeight });
          syncState.markHeightAsPendingSync(nextHeight);
        } else {
          break;
        }
      }
      if (acceptedBlocks.length === 0) {
        return;
      }
      const acceptedAt = new Date();
      acceptBlocksViaHeaders(
        this.nodes[nodeName].internalId!,
        acceptedBlocks,
        acceptedAt
      )
        .then(() => {
          const lastAcceptedBlock = acceptedBlocks[acceptedBlocks.length - 1];
          logger.debug(
            `${nodeName}: accepted ${acceptedBlocks.length} existing blocks from height ${acceptedBlocks[0].height} to height ${lastAcceptedBlock.height} (hash: ${lastAcceptedBlock.hash})`
          );
          acceptedBlocks.forEach((block) => {
            syncState.markHeightAsSynced(block.height, 'caught-up');
          });
          this.scheduleBlockBufferFill();
        })
        .catch((err) => {
          logger.error(err);
        });
    });
  }

  /**
   * Sort a list of nodes by expected download speed (from fastest to slowest).
   *
   * For each node connection, the average download speed of recent downloads is
   * divided by the current number of pending downloads. This roughly balances
   * downloads across all available nodes while still biasing downloads toward
   * the fastest connection.
   *
   * @param nodeNames - the list of nodes to sort
   */
  orderNodesByExpectedDownloadSpeed(nodeNames: string[]) {
    const downloadCountByNode = this.getDownloadCountByNode();
    /**
     * TODO: occasionally sample download speeds using `this.nodes[name].downloadThroughput.aggregateStatistics()`
     */
    const rawSpeeds = nodeNames.map(() => 1);
    const expectedSpeeds = rawSpeeds.map((rawSpeed, i) => {
      const nodeName = nodeNames[i];
      const speed = rawSpeed;
      const activeDownloads = downloadCountByNode[nodeName] ?? 0;
      return {
        expectedSpeed: activeDownloads === 0 ? speed : speed / activeDownloads,
        nodeName,
      };
    });
    return expectedSpeeds
      .sort((a, b) => b.expectedSpeed - a.expectedSpeed)
      .map((s) => s.nodeName);
  }

  /**
   * Request the specified block from the node expected to return it the
   * fastest.
   *
   * TODO: avoid scheduling downloads from pruned nodes (and/or factor in pending downloads to expected speed)
   * TODO: request block from a second node too? (Let them race, downloads are fast and cheap.)
   *
   * @param hash - the header hash of the block to request
   * @param height - the known height of the block to request
   */
  requestBlock(hash: string, height: number) {
    const nodeNames = this.blockTree.getNodesWithBlock(hash, height);
    if (
      this.blockDownloads.filter((download) => download.hash === hash)
        .length !== 0
    ) {
      logger.error(
        `Agent: called requestBlock for a block which is already being downloaded.`
      );
      return;
    }
    const [node] = this.orderNodesByExpectedDownloadSpeed(nodeNames);
    logger.trace(`Requesting block ${height} (${hash}) from node: ${node}`);
    const download = {
      hash,
      height,
      requestStartTime: Date.now(),
      requestedFromNode: node,
      timeout: setTimeout(() => {
        // TODO: how do pruned nodes respond? Do we get some indication that no response is coming back? (We should avoid asking for old blocks from pruned nodes)
        this.clearDownload(download);
        this.requestBlock(download.hash, download.height);
      }, downloadTimeout),
    };
    this.blockDownloads.push(download);
    const { peer } = this.nodes[node];
    peer.sendMessage(peer.messages.GetData.forBlock(hash));
  }

  /**
   * Remove the given download from the list of active downloads and cancel it's
   * timeout. (If the timeout has passed, this does nothing.)
   * @param download - the download object from `this.blockDownloads`
   */
  clearDownload(download: Agent['blockDownloads'][number]) {
    this.blockDownloads.splice(this.blockDownloads.indexOf(download), 1);
    clearTimeout(download.timeout);
  }

  getDownloadsForNode(nodeName: string) {
    return this.blockDownloads.filter(
      (download) => download.requestedFromNode === nodeName
    );
  }

  cancelAllDownloadsForNode(nodeName: string) {
    this.getDownloadsForNode(nodeName).forEach((download) => {
      this.clearDownload(download);
    });
  }

  rescheduleDownloadsForNode(nodeName: string) {
    this.getDownloadsForNode(nodeName).forEach((download) => {
      this.clearDownload(download);
      this.requestBlock(download.hash, download.height);
    });
  }

  requestHeaders(
    nodeName: string,
    locator = this.blockTree.getLocatorForNode(nodeName)
  ) {
    if (this.nodes[nodeName].internalId === undefined) {
      logger.trace(
        'Attempted to requestHeaders before node registered, will retry after registration.'
      );
      /**
       * To simplify logic (and debugging), we wait to request headers
       * until after we've confirmed the node exists in the database.
       */
      this.nodes[nodeName].nodeRegistered
        .then(() => {
          logger.trace('Node registered, reattempting requestHeaders.');
          this.requestHeaders(nodeName, locator);
        })
        .catch((err) => {
          logger.error(err);
        });
      return;
    }
    logger.trace(
      `Requesting headers from node: ${nodeName}, first locator hash: ${locator[0]}`
    );
    const { peer } = this.nodes[nodeName];
    const noStopHash =
      '0000000000000000000000000000000000000000000000000000000000000000';
    peer.sendMessage(
      new peer.messages.GetHeaders({
        starts: locator,
        stop: noStopHash,
      })
    );
  }

  handleHeadersFromNode(nodeName: string, headers: BitcoreBlockHeader[]) {
    logger.trace(`Handling ${headers.length} headers from node: ${nodeName}`);
    const nextLocator = this.blockTree.updateHeaders(nodeName, headers);
    if (nextLocator === false) {
      this.nodes[nodeName].headersSynced = true;
      logger.trace(`Headers marked as synced for node: ${nodeName}`);
    } else {
      this.requestHeaders(nodeName, nextLocator);
    }
    this.catchUpViaHeaders();
    this.scheduleBlockBufferFill();
  }

  handleBlockFromNode(nodeName: string, bitcoreBlock: BitcoreBlock) {
    const { hash } = bitcoreBlock.header;
    const finishedDownloadAt = Date.now();
    const download = this.blockDownloads.find((d) => d.hash === hash);
    if (download === undefined) {
      logger.info(
        `${nodeName}: received an un-requested block – hash: ${hash} – this likely means the block was mined by this node.`
      );
      this.blockTree.updateHeaders(nodeName, [bitcoreBlock.header]);
      const height = this.blockTree.getBlockHeightAccordingToNode(
        nodeName,
        hash
      );

      if (height === undefined) {
        logger.warn(
          `${nodeName}: the parent of the un-requested block could not be found in the block tree. Discarding block and beginning headers sync...`
        );
        this.requestHeaders(nodeName);
        return;
      }
      this.scheduleBlockParse(bitcoreBlock, height);
      return;
    }
    logger.trace(
      `Downloaded block ${download.height} from ${nodeName}: ${hash}`
    );
    this.clearDownload(download);
    this.blockBuffer.releaseReservedBlock();
    const durationMs = finishedDownloadAt - download.requestStartTime;
    this.scheduleBlockParse(bitcoreBlock, download.height, (block) => {
      if (durationMs < 0) {
        logger.error(
          `download stats issue - durationMs: ${durationMs}, finishedDownloadAt: ${finishedDownloadAt} download.requestStartTime: ${download.requestStartTime}`
        );
      }
      this.nodes[nodeName].downloadThroughput.addStatistic({
        durationMs: durationMs === 0 ? 1 : durationMs,
        metrics: { bytes: block.sizeBytes },
        startTime: download.requestStartTime,
      });
    });
  }

  /**
   * Because parsing a block can be expensive (all transactions must be
   * re-serialized and hashed), parsing is scheduled to avoid blocking the
   * current iteration of the event loop.
   *
   * TODO: efficiency – parse the transactions/block as it comes in (modify or replace `bitcore-p2p-cash`)
   */
  scheduleBlockParse(
    bitcoreBlock: BitcoreBlock,
    height: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    callback = (_block: ChaingraphBlock) => {}
  ) {
    /**
     * Save the time at which this block was received.
     *
     * Note: if a node is delayed in accepting this block, but has "caught up"
     * and accepted the block by the time the DB mutation is executed, it
     * will be "credited" with this acceptance time, even though it had not yet
     * accepted the block until a few moments later. This inaccuracy is
     * acceptable (and even preferred), since small differences in acceptance
     * times are mostly noise for downstream consumers. With this strategy,
     * only meaningful differences in acceptance time are likely to be recorded.
     */
    const receivedTime = new Date();
    setImmediate(() => {
      const block = bitcoreBlockToChaingraphBlock(bitcoreBlock, height);
      this.bufferParsedBlock(block, receivedTime);
      callback(block);
    });
  }

  bufferParsedBlock(block: ChaingraphBlock, receivedTime: Date) {
    logger.trace(`bufferParsedBlock: ${block.hash}`);
    this.blockBuffer.addBlock(block);
    this.saveBlock(block, receivedTime)
      .then(() => {
        this.scheduleBlockBufferFill();
      })
      .catch((err) => {
        logger.error(err);
      });
    this.scheduleBlockBufferFill();
  }

  /**
   * Save a block to the database including any previously-unseen transactions.
   *
   * This also marks the nodes by which the block has been accepted and removes
   * the blocks transactions from each of those nodes' "mempool" (the
   * `node_transaction` table).
   *
   * @param block - the block to save to the database
   * @param nodeAcceptances - a list of nodes which have accepted this block
   */
  async saveBlock(block: ChaingraphBlock, firstAcceptedAt: Date) {
    logger.trace(`saveBlock: ${block.hash}`);
    const acceptedBy = this.blockTree.getNodesWithBlock(
      block.hash,
      block.height
    );

    const blockTime = blockTimestampToDate(block.timestamp);
    /**
     * We only begin recording block times once Chaingraph has "caught up"
     * with the chain. Blocks not accepted "live" are given an `accepted_at`
     * value of `null` (since we don't know when these blocks were "first
     * heard" on the network).
     *
     * Because timestamps up to 2 hours in the future are considered valid,
     * Chaingraph considers a block to be accepted "live" if the block is
     * timestamped for any time after 2 hours ago.
     *
     * This can delay the `accepted_at` time of blocks mined in the 2 hours
     * before Chaingraph's initial sync is complete, but other than this
     * ~12 block window, `accepted_at` times are expected to be accurate.
     */
    const acceptedAt = blockTime > twoHoursAgo() ? firstAcceptedAt : null;
    const nodeAcceptances = acceptedBy
      .map((nodeName) => ({
        acceptedAt,
        nodeInternalId: this.nodes[nodeName].internalId,
        nodeName,
      }))
      /**
       * When saving genesis blocks, `internalId` may be `undefined` for other
       * nodes.
       */
      .filter(
        (
          acceptance
        ): acceptance is {
          acceptedAt: Date | null;
          nodeInternalId: number;
          nodeName: string;
        } => acceptance.nodeInternalId !== undefined
      );

    const startTime = Date.now();
    const { attemptedSavedTransactions, transactionCacheMisses } =
      await saveBlock({
        block,
        nodeAcceptances,
        transactionCache: this.transactionCache,
      });
    const completionTime = Date.now();

    const durationMs = completionTime - startTime;
    if (durationMs < 0) {
      logger.error(
        `db stats issue - durationMs: ${durationMs}, startTime: ${startTime} completionTime: ${completionTime}`
      );
    }
    const transactions = attemptedSavedTransactions.length;
    const inputs = attemptedSavedTransactions.reduce(
      (total, tx) => total + tx.inputs.length,
      0
    );
    const outputs = attemptedSavedTransactions.reduce(
      (total, tx) => total + tx.outputs.length,
      0
    );
    const transactionBytes = attemptedSavedTransactions.reduce(
      (total, tx) => total + tx.sizeBytes,
      0
    );
    this.databaseThroughput.addStatistic({
      durationMs,
      metrics: { inputs, outputs, transactionBytes, transactions },
      startTime,
    });
    this.databaseBlockThroughput.addStatistic({
      durationMs,
      metrics: {
        blockBytes: block.sizeBytes,
        blocks: 1,
        transactionCacheMisses,
      },
      startTime,
    });

    const heightMinWidth = 6;
    const isHistoricalSync = acceptedAt === null;
    const blockSyncLog = `Saved new block – height: ${block.height
      .toString()
      .padStart(heightMinWidth, ' ')} | timestamp: ${blockTimestampToDate(
      block.timestamp
    ).toISOString()} | hash: ${block.hash} | new txs: ${
      transactions - transactionCacheMisses
    }/${block.transactions.length.toString()} (${transactionCacheMisses} cache misses) | nodes: ${nodeAcceptances
      .map((acceptance) => acceptance.nodeName)
      .join(', ')}`;
    if (isHistoricalSync) {
      logger.debug(blockSyncLog);
    } else {
      logger.info(blockSyncLog);
    }

    nodeAcceptances.forEach((acceptance) => {
      const { syncState } = this.nodes[acceptance.nodeName];
      syncState!.markHeightAsSynced(
        block.height,
        blockTimestampToDate(block.timestamp)
      );
    });
    this.blockBuffer.removeBlock(block);
  }

  /**
   * This method is called during re-organizations: when a previously-accepted
   * chain of blocks is made stale because the connected node has accepted an
   * alternative history.
   */
  handleStaleBlocks(
    staleChain: string[],
    firstHeight: number,
    nodeName: string
  ) {
    removeStaleBlocksForNode(this.nodes[nodeName].internalId!, staleChain)
      .then(() => {
        logger.info(
          staleChain,
          `${nodeName}: re-organization detected beginning at height: ${firstHeight}. The following stale blocks were removed:`
        );
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  /**
   * Record a transaction announcement (from either an `inv` or `tx` message)
   * from a given node. If the transaction is already in the database,
   * immediately mark it as having been acknowledged by the given node. Then
   * update the transaction in the transaction cache.
   *
   * @param nodeName - the node name to record
   * @param transactionHash - the hex-encoded transaction hash
   */
  recordTransactionAnnouncementFromNode(
    nodeName: string,
    transactionHash: string
  ) {
    const node = this.nodes[nodeName];
    const txCacheItem = this.getCachedTransactionOrDefault(transactionHash);
    if (!txCacheItem.nodes.includes(node)) {
      txCacheItem.nodes.push(node);
      this.transactionCache.set(transactionHash, txCacheItem);
      if (txCacheItem.db) {
        /**
         * This is the first time we've recorded this node acknowledging the
         * transaction, and the transaction is already in the database.
         * Immediately mark the acceptance.
         */
        logger.trace(
          `${nodeName}: validated known tx – hash: ${transactionHash}`
        );
        recordNodeValidation(transactionHash, {
          nodeInternalId: node.internalId!,
          validatedAt: new Date(),
        }).catch((err) => {
          logger.error(err);
        });
        this.markTransactionSavedToDb(transactionHash);
      }
    }
  }

  getCachedTransactionOrDefault(transactionHash: string) {
    return (
      this.transactionCache.get(transactionHash) ?? {
        db: false,
        nodes: [],
      }
    );
  }

  /**
   * Mark a transaction in the transaction cache as having been successfully
   * saved to the database.
   *
   * @param transactionHash - the hex-encoded hash of the transaction
   */
  markTransactionSavedToDb(transactionHash: string) {
    const txCacheItem = this.getCachedTransactionOrDefault(transactionHash);
    txCacheItem.db = true;
    this.transactionCache.set(transactionHash, txCacheItem);
    logger.trace(`Marked transaction saved to DB - hash: ${transactionHash}`);
  }

  /**
   * Record a transaction from the given node, saving it to the database if it
   * is not already known to exist in the database.
   * @param nodeName - the node from which the transaction was heard
   * @param transaction - the full transaction object
   */
  async handleTransactionFromNode(
    nodeName: string,
    transaction: BitcoreTransaction
  ) {
    if (!this.saveInboundTransactions) {
      return;
    }
    const validatedAt = new Date();
    const tx = bitcoreTransactionToChaingraphTransaction(transaction);
    logger.trace(`${nodeName}: announced transaction hash: ${tx.hash}`);
    this.recordTransactionAnnouncementFromNode(nodeName, tx.hash);
    const txCacheItem = this.getCachedTransactionOrDefault(tx.hash);
    if (!txCacheItem.db) {
      /**
       * Because `txCacheItem.db` is not updated until after the mutation is
       * complete, it's possible multiple saves may be queued for the same
       * transaction. (Later saves do not overwrite earlier `node_validations`.)
       */
      const latestCachedItem = this.getCachedTransactionOrDefault(tx.hash);
      await Promise.all(
        latestCachedItem.nodes.map(async (node) => node.nodeRegistered)
      );
      const validations = latestCachedItem.nodes.map((node) => ({
        nodeInternalId: node.internalId!,
        validatedAt,
      }));
      logger.trace(
        `Transaction not cached as saved to DB, saving validations for ${validations
          .map((v) => v.nodeInternalId)
          .join(', ')} - hash: ${tx.hash}`
      );
      // TODO: collect statistics on save speed
      await saveTransactionForNodes(tx, validations);
      this.markTransactionSavedToDb(tx.hash);
    }
  }

  getDownloadCountByNode() {
    return this.blockDownloads.reduce<{
      [nodeName: string]: number | undefined;
    }>((all, download) => {
      const last = all[download.requestedFromNode] ?? 0;
      return { ...all, [download.requestedFromNode]: last + 1 };
    }, {});
  }

  logAgentStatus() {
    // TODO: do we want any continuous logs after initial sync?
    if (!this.completedInitialSync) {
      const bestHeights = this.blockTree.getBestHeights();
      const downloadStatsByNode = this.getDownloadCountByNode();

      // eslint-disable-next-line functional/no-let
      let logOutput = '';

      const decimalPlaces = 2;
      Object.keys(this.nodes).forEach((nodeName) => {
        const node = this.nodes[nodeName];
        const { syncState } = node;
        if (syncState === undefined) {
          return;
        }

        const pendingHeight = syncState.getPendingSyncHeight();
        const bestHeight = bestHeights[nodeName];
        const blockTime =
          syncState.latestSyncedBlockTime === undefined ||
          syncState.latestSyncedBlockTime === 'caught-up'
            ? 'n/a'
            : syncState.latestSyncedBlockTime.toISOString();
        logOutput += `Syncing ${nodeName} – completed height: ${
          syncState.fullySyncedUpToHeight
        } | completed block time: ${blockTime} | pending height: ${pendingHeight} (${renderSyncPercentage(
          pendingHeight / bestHeight
        )}%) | best height: ${bestHeight} \n `;

        const pendingDownloads = downloadStatsByNode[nodeName] ?? 0;
        const downloadStats = node.downloadThroughput.aggregateStatistics(
          Date.now()
        );

        logOutput += `${nodeName}: Downloads – pending: ${pendingDownloads} | avg: ${formatByteThroughput(
          downloadStats.average.perActiveSecond.bytes,
          msPerSecond
        )} (last 300s – completed: ${
          downloadStats.statisticsCount
        } | avg duration: ${downloadStats.average.duration.toFixed(
          decimalPlaces
        )}ms | avg concurrency: ${downloadStats.average.concurrency.toFixed(
          decimalPlaces
        )} | total: ${formatBytes(downloadStats.totals.bytes)}) \n `;
      });

      const loadDecimalPlaces = 3;

      logOutput += `PG Pool – idle: ${pool.idleCount}/${
        pool.totalCount
      } | waiting requests: ${
        pool.waitingCount
      } (concurrency: ${postgresMaxConnections}) | system load avg: ${loadavg()
        .map((load) => load.toFixed(loadDecimalPlaces))
        .join(', ')} (${cpus().length} CPUs) \n `;

      const now = Date.now();
      const txThroughput = this.databaseThroughput.aggregateStatistics(now);
      const blockThroughput =
        this.databaseBlockThroughput.aggregateStatistics(now);

      logOutput += `block throughput – ${formatByteThroughput(
        blockThroughput.average.perActiveSecond.blockBytes,
        msPerSecond
      )} – ${blockThroughput.average.perActiveSecond.blocks.toFixed(
        decimalPlaces
      )} blocks/s – avg concurrency: ${Math.round(
        blockThroughput.average.concurrency
      ).toFixed(decimalPlaces)} | duration: ${Math.round(
        blockThroughput.average.duration
      )}ms (last 300s – ${
        blockThroughput.totals.blocks
      } blocks | bytes: ${formatBytes(
        blockThroughput.totals.blockBytes
      )} | TX cache misses: ${
        blockThroughput.totals.transactionCacheMisses
      } ) \n `;

      logOutput += `tx throughput – ${formatByteThroughput(
        txThroughput.average.perActiveSecond.transactionBytes,
        msPerSecond
      )} – ${Math.round(
        txThroughput.average.perActiveSecond.transactions
      )} tx/s | ${Math.round(
        txThroughput.average.perActiveSecond.inputs
      )} in/s | ${Math.round(
        txThroughput.average.perActiveSecond.outputs
      )} out/s – avg concurrency: ${Math.round(
        txThroughput.average.concurrency
      ).toFixed(decimalPlaces)} | duration: ${Math.round(
        txThroughput.average.duration
      )}ms (last 300s – ${txThroughput.totals.transactions} txs | ${
        txThroughput.totals.inputs
      } inputs | ${txThroughput.totals.outputs} outputs | bytes: ${formatBytes(
        txThroughput.totals.transactionBytes
      )}) \n `;

      logOutput += `Block buffer – count: ${this.blockBuffer.count()} | size: ${formatBytes(
        this.blockBuffer.currentTotalBytes()
      )} | target: ${formatBytes(
        this.blockBuffer.targetSizeBytes
      )} | Block DB hashes: ${
        this.blockDb?.size ?? 0
      } – transaction DB hashes: ${this.transactionCache.length} \n`;

      logger.info(logOutput);
    }
  }

  async shutdown() {
    logger.trace('Attempting shutdown...');
    if (this.shutdownPromise !== undefined) {
      logger.error(`Already shutting down.`);
      return this.shutdownPromise;
    }
    this.willShutdown = true;
    clearInterval(this.loggingInterval);
    Object.values(this.nodes).forEach((connection) => {
      connection.disconnect();
    });
    this.shutdownPromise = this.blockBuffer
      .drain()
      .then(async () => {
        logger.debug('Block buffer drained, stopping PG pool...');
        return pool.end();
      })
      .then(() => {
        logger.debug('PG pool cleared.');
        logger.info('Exiting...');
      });
    this.onShutdown();
    return this.shutdownPromise;
  }
}
