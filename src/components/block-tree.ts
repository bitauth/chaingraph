import { binToHex } from '@bitauth/libauth';
import type { BitcoreBlockHeader } from '@chaingraph/bitcore-p2p-cash';
import type pino from 'pino';

import type { InitialSyncState } from './sync-state';

/**
 * Get the current height of a chain (length - 1).
 */
const currentHeight = (chain: string[]) => chain.length - 1;

export type OnStaleBlocksCallback = (
  staleChain: string[],
  firstHeight: number,
  nodeName: string
) => void;

/**
 * Select a subset of block header hashes to use as a `getheaders` "locator"
 * using the same algorithm as the Satoshi implementation: select the latest 10
 * hashes, then double the distance between each selected hash until reaching
 * the genesis block, then add the genesis block.
 *
 * @param hashes - the full list of all known block header hashes for which to
 * create the locator.
 */
export const selectHeaderLocatorHashes = <T = string>(hashes: T[]) => {
  const locator = [] as T[];
  const tipLength = 10;
  const tip = hashes.slice(-tipLength).reverse();
  locator.push(...tip);
  if (hashes.length <= tipLength) {
    return locator;
  }
  /* eslint-disable functional/no-let */
  let step = 1;
  let nextIndex = hashes.length - 1 - tipLength;
  const backoffFactor = 2;
  // eslint-disable-next-line functional/no-loop-statement
  while (nextIndex > 0) {
    locator.push(hashes[nextIndex]);
    nextIndex -= step;
    step *= backoffFactor;
  }
  const genesisHeight = 0;
  const genesisHash = hashes[genesisHeight];
  locator.push(genesisHash);
  /* eslint-enable functional/no-let */
  return locator;
};

/**
 * The `blockTree` is an in-memory store of all trusted node block histories.
 * Each chain is kept up-to-date through block re-organization events.
 *
 * This requires around 64MB of memory per million blocks (hex-encoded strings
 * require approximately 2x the raw binary size). For resource-constrained
 * environments or applications with a very large number of nodes, this might
 * require optimization.
 *
 * When the agent starts up, the block tree is first loaded by querying the
 * database, then it is updated by requesting headers from each trusted node.
 * If a re-organization occurs, the block tree calls the `onStaleBlocks`
 * callback to update the database.
 */
export class BlockTree {
  /**
   * Chains are stored as a simple array of block header hashes. Each item is
   * the block header hash at the height of the array index, e.g.
   * `blockHeaderHashChain.nodeName[0]` is the genesis block (height `0`)
   * according to `nodeName`.
   */
  private blockHeaderHashChain: {
    [nodeName: string]: string[];
  };

  /**
   * A temporary chain of block header hashes which should be appended to the
   * equivalent `blockHeaderHashChain` and may contain `null` in indexes for
   * which the proper hash is not known.
   *
   * This is only used for chain re-organization handling when a sync has been
   * interrupted: because many blocks are written concurrently, if syncing is
   * stopped abruptly, some blocks will be missing near the synced tip of the
   * chain. If a chain re-organization then renders some of those blocks stale,
   * we need to roll back the database's view of the relevant node's chain, then
   * save or mark the new blocks as being accepted by the node in question.
   */
  private blockHeaderHashChainSparseTip: {
    [nodeName: string]: (string | null)[];
  };

  private readonly onStaleBlocks: OnStaleBlocksCallback;

  private readonly logger: pino.Logger;

  constructor(config: {
    genesisBlockByNode: { [nodeName: string]: [string] };
    logger: pino.Logger;

    /**
     * A callback to run on chains of stale blocks which a header update
     * replaces one or more block headers. The callback should handle blocks in
     * reverse order to ensure rollbacks are resumable (if the process halts
     * unexpectedly, when the `BlockTree` is restored and headers are fetched
     * again, the `onStaleBlocks` callback will be triggered with the remaining
     * array of stale blocks).
     */
    onStaleBlocks: OnStaleBlocksCallback;
  }) {
    this.blockHeaderHashChain = config.genesisBlockByNode;
    this.blockHeaderHashChainSparseTip = Object.keys(
      this.blockHeaderHashChain
    ).reduce((chains, key) => ({ ...chains, [key]: [] }), {});
    this.onStaleBlocks = config.onStaleBlocks;
    this.logger = config.logger;
  }

  /**
   * Restore a hash chain as it exists in the database. Returns an
   * `InitialSyncState` for the restored chain.
   *
   * @remarks
   * Because blocks can be written concurrently during sync, some blocks may be
   * missing and their hash unknown (represented by `null`). Beginning with the
   * first `null` hash, the portion of the chain which must be revalidated is
   * temporarily saved to the equivalent `blockHeaderHashChainSparseTip`.
   * @param nodeName - a valid `node.name` as provided during construction.
   * @param hashChain - see `blockHeaderHashChainSparseTip`
   */
  restoreChainForNode(
    nodeName: string,
    hashChain: (string | null)[]
  ): InitialSyncState {
    const firstNullIndex = hashChain.indexOf(null);
    const { contiguousChain, remainingSparseTip } =
      firstNullIndex === -1
        ? { contiguousChain: hashChain as string[], remainingSparseTip: [] }
        : {
            contiguousChain: hashChain.slice(0, firstNullIndex) as string[],
            remainingSparseTip: hashChain.slice(firstNullIndex),
          };
    /**
     * Validated `nodeName`
     */
    this.getHashChain(nodeName);
    this.blockHeaderHashChain[nodeName] = contiguousChain;
    this.blockHeaderHashChainSparseTip[nodeName] = remainingSparseTip;
    const fullySyncedUpToHeight = currentHeight(
      this.blockHeaderHashChain[nodeName]
    );
    const additionalSyncedHeights = this.blockHeaderHashChainSparseTip[nodeName]
      .map((hash, additionalHeight) =>
        hash === null ? undefined : fullySyncedUpToHeight + 1 + additionalHeight
      )
      .filter((value): value is number => value !== undefined);
    const additionalHeightsList =
      additionalSyncedHeights.length === 0
        ? '(none)'
        : additionalSyncedHeights.join(', ');
    this.logger.debug(
      `Restored chain for node ${nodeName} – fully synced to height ${fullySyncedUpToHeight}, additional heights: ${additionalHeightsList}`
    );
    return {
      additionalSyncedHeights,
      fullySyncedUpToHeight,
      pendingSyncOfHeights: [],
    };
  }

  /**
   * Returns the latest block "locator" array if the sync is not complete, or
   * `false` if the sync is complete.
   * @param nodeName - a valid `node.name` as provided during construction.
   * @param headers - the array of headers from a `headers` message
   */
  updateHeaders(nodeName: string, headers: BitcoreBlockHeader[]) {
    const chain = this.getHashChain(nodeName);
    if (headers.length === 0) {
      this.logger.debug(
        `${nodeName}: received empty headers message – headers-syncing completed. Current height: ${currentHeight(
          chain
        )}`
      );
      return false;
    }
    const [firstHeader] = headers;
    const previousHeaderHash = binToHex(
      Uint8Array.from(firstHeader.prevHash).reverse()
    );

    const previousHeight = chain.lastIndexOf(previousHeaderHash);
    if (previousHeight === -1) {
      this.logger.warn(
        `BlockTree: an unexpected block header was received from '${nodeName}' – the previous hash (${previousHeaderHash}) of the header '${firstHeader.hash}' is unknown. Requesting headers using a fresh locator...`
      );
      return this.getLocatorForNode(nodeName);
    }
    const firstHeight = previousHeight + 1;
    const newHashes = headers.map((header) => header.hash);
    const staleHashes = chain.splice(
      firstHeight,
      newHashes.length,
      ...newHashes
    );
    if (staleHashes.length !== 0) {
      this.logger.warn(
        `${nodeName}: removed ${staleHashes.length} stale block(s) from the block tree.`
      );
      this.onStaleBlocks(staleHashes, firstHeight, nodeName);
    }
    this.logger.debug(
      `${nodeName}: added ${
        newHashes.length
      } headers to block tree. Latest height: ${currentHeight(chain)} – hash: ${
        chain[currentHeight(chain)]
      }`
    );

    const maximumHeaderCount = 2000;
    if (newHashes.length < maximumHeaderCount) {
      const bestHeight = currentHeight(chain);
      this.logger.debug(
        `${nodeName}: headers message contained only ${newHashes.length} headers (of maximum ${maximumHeaderCount}) – headers-syncing completed. Best height: ${bestHeight}`
      );
      return false;
    }
    return this.getLocatorForNode(nodeName);
  }

  getLocatorForNode(nodeName: string) {
    return selectHeaderLocatorHashes(this.getHashChain(nodeName));
  }

  getBestHeights() {
    return Object.entries(this.blockHeaderHashChain).reduce<{
      [nodeName: string]: number;
    }>(
      (all, [nodeName, chain]) => ({
        ...all,
        [nodeName]: currentHeight(chain),
      }),
      {}
    );
  }

  /**
   * Scan backwards through a node's chain to find the height of the provided
   * hash.
   * @param nodeName - the node name of the chain to search
   * @param hash - the block header hash to find
   */
  getBlockHeightAccordingToNode(nodeName: string, hash: string) {
    const index = this.getHashChain(nodeName).lastIndexOf(hash);
    return index === -1 ? undefined : index;
  }

  /**
   * Get the latest list of nodes known to include the specified block in their
   * best block chain.
   * @param hash - the header hash of the block
   * @param height - the height of the block
   */
  getNodesWithBlock(hash: string, height: number) {
    return Object.keys(this.blockHeaderHashChain).filter(
      (nodeName) => this.blockHeaderHashChain[nodeName][height] === hash
    );
  }

  getBlockHeaderHash(nodeName: string, height: number) {
    return this.getHashChain(nodeName)[height] as string | undefined;
  }

  getSourceNodesForBlockHeader(hash: string, height: number) {
    return Object.keys(this.blockHeaderHashChain).reduce<string[]>(
      (all, nodeName) => {
        const hasHeader = this.blockHeaderHashChain[nodeName][height] === hash;
        return hasHeader ? [...all, nodeName] : all;
      },
      []
    );
  }

  private getHashChain(nodeName: string) {
    if (!(nodeName in this.blockHeaderHashChain)) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`The node '${nodeName}' is not in this BlockTree.`);
    }
    return this.blockHeaderHashChain[nodeName];
  }
}
