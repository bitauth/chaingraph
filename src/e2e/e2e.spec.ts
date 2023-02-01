/* eslint-disable max-lines */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inspect } from 'util';

import {
  binToHex,
  encodeDataPush,
  flattenBinArray,
  hexToBin,
  swapEndianness,
  utf8ToBin,
} from '@bitauth/libauth';
import type {
  BitcoreBlock,
  GetDataMessage,
  GetHeadersMessage,
  Peer,
} from '@chaingraph/bitcore-p2p-cash';
import bitcoreP2pCash, {
  BitcoreInventoryType,
} from '@chaingraph/bitcore-p2p-cash';
import test from 'ava';
import type { ExecaChildProcess } from 'execa';
import { execa } from 'execa';
import got from 'got';
import pg from 'pg';

import { chaingraphE2eLogPath, logger } from './e2e.spec.logging.helper.js';
import {
  chipnetCashTokensTx,
  chipnetCashTokensTxHash,
  generateMockchain,
  generateMockDoubleSpend,
  genesisBlock,
  genesisBlockRaw,
  halTxHash,
  halTxRaw,
  halTxSpent,
  halTxSpentRaw,
  selectHeaders,
  testnetGenesisBlockRaw,
  Transaction,
} from './e2e.spec.mockchain.helper.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Pool, internalBitcore } = bitcoreP2pCash;

/**
 * Set to `true` to log all P2P messages.
 */
const logP2pMessage = false as boolean;

logger.info('\n\n---- Beginning new E2E test run. ----\n');

const e2eTestDbName = 'chaingraph_e2e_test';
const recreateDbOnStartup = true as boolean;
const dir = dirname(fileURLToPath(import.meta.url));
const migration = (path: string) =>
  resolve(dir, '../../images/hasura/hasura-data/migrations/', path);
const dbUpMigrationPaths = [
  migration('default/1616195337538_init/up.sql'),
  migration('default/1673124945608_tokens/up.sql'),
];

const chaingraphInternalApiPort = '3201';

/**
 * TODO: test multiple network magic values
 */
/* eslint-disable no-bitwise, @typescript-eslint/no-magic-numbers */
// cspell:disable-next-line
const e2eTestNetworkMagic = Buffer.from(utf8ToBin('grph').map((x) => x | 128));
/* eslint-enable no-bitwise, @typescript-eslint/no-magic-numbers */
const e2eTestNetworkMagicHex = e2eTestNetworkMagic.toString('hex');
const e2eTestNetworkMagicAsNum = parseInt(e2eTestNetworkMagicHex, 16);
const e2eTestNetworkNode1Port = 19333;
const e2eTestNetworkNode2Port = 19334;
const e2eTestNetworkNode3Port = 19335;
const node1Version = 70012;
const node1UserAgent = '/chaingraph-e2e-node-1:0.0.0/';
const node2Version = 70013;
const node2UserAgent = '/chaingraph-e2e-node-2:0.0.0/';
const node3Version = 70014;
const node3UserAgent = '/chaingraph-e2e-node-3:0.0.0/';

const e2eTrustedNodesSet1 = `node1:127.0.0.1:${e2eTestNetworkNode1Port}:${e2eTestNetworkMagicHex},node2:127.0.0.1:${e2eTestNetworkNode2Port}:${e2eTestNetworkMagicHex},node3:127.0.0.1:${e2eTestNetworkNode3Port}:${e2eTestNetworkMagicHex}`;

const e2eTrustedNodesSet2 = `node1:127.0.0.1:${e2eTestNetworkNode1Port}:${e2eTestNetworkMagicHex},node2:127.0.0.1:${e2eTestNetworkNode2Port}:${e2eTestNetworkMagicHex},node4:127.0.0.1:${e2eTestNetworkNode3Port}:${e2eTestNetworkMagicHex}`;

internalBitcore.Networks.add({
  name: 'node1net',
  networkMagic: e2eTestNetworkMagicAsNum,
  port: e2eTestNetworkNode1Port,
});
internalBitcore.Networks.add({
  name: 'node2net',
  networkMagic: e2eTestNetworkMagicAsNum,
  port: e2eTestNetworkNode2Port,
});
internalBitcore.Networks.add({
  name: 'node3net',
  networkMagic: e2eTestNetworkMagicAsNum,
  port: e2eTestNetworkNode3Port,
});

const node1 = new Pool({
  dnsSeed: false,
  listenAddr: false,
  network: 'node1net',
  subversion: node1UserAgent,
  version: node1Version,
});
const node2 = new Pool({
  dnsSeed: false,
  listenAddr: false,
  network: 'node2net',
  subversion: node2UserAgent,
  version: node2Version,
});
const node3 = new Pool({
  dnsSeed: false,
  listenAddr: false,
  network: 'node3net',
  subversion: node3UserAgent,
  version: node3Version,
});

const host = process.env.CHAINGRAPH_E2E_POSTGRES_HOST ?? 'localhost';
const port = process.env.CHAINGRAPH_E2E_POSTGRES_PORT ?? '5432';
logger.debug(`Connecting to Postgres at port: ${port}`);
const postgresE2eConnectionStringBase = `postgres://chaingraph:very_insecure_postgres_password@${host}:${port}`;
const postgresE2eConnectionStringDefaultDb = `${postgresE2eConnectionStringBase}/postgres`;
const postgresE2eConnectionStringTestDb = `${postgresE2eConnectionStringBase}/${e2eTestDbName}`;

const e2eEnvVariables = {
  /* eslint-disable @typescript-eslint/naming-convention */
  CHAINGRAPH_GENESIS_BLOCKS: `${e2eTestNetworkMagicHex}:${genesisBlockRaw},e3e1f3e8:${genesisBlockRaw},dab5bffa:${testnetGenesisBlockRaw}`,
  CHAINGRAPH_INTERNAL_API_PORT: chaingraphInternalApiPort,
  CHAINGRAPH_LOG_FIREHOSE: logP2pMessage.toString(),
  CHAINGRAPH_LOG_PATH: chaingraphE2eLogPath,
  CHAINGRAPH_POSTGRES_CONNECTION_STRING: postgresE2eConnectionStringTestDb,
  CHAINGRAPH_TRUSTED_NODES: e2eTrustedNodesSet1,
  NODE_ENV: 'production',
  /* eslint-enable @typescript-eslint/naming-convention */
};

const e2eEnvVariables2 = {
  /* eslint-disable @typescript-eslint/naming-convention */
  ...e2eEnvVariables,
  CHAINGRAPH_TRUSTED_NODES: e2eTrustedNodesSet2,
  /* eslint-enable @typescript-eslint/naming-convention */
};

const placeholder = undefined as unknown as Peer;
/**
 * Object which holds a reference to each node's `peer`. Set to `undefined`
 * before Chaingraph connects to each node.
 */
const peers = {
  node1: placeholder,
  node2: placeholder,
  node3: placeholder,
};

test.beforeEach((t) => {
  logger.debug(`Starting test: ${t.title}`);
});

test.afterEach((t) => {
  logger.debug(`Completed test: ${t.title}`);
});

// eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
let client: pg.Client;
/**
 * Before connecting to the e2e test database, drop and recreate it:
 */
test.before(async () => {
  if (recreateDbOnStartup) {
    const defaultClient = new pg.Client({
      connectionString: postgresE2eConnectionStringDefaultDb,
    });
    await defaultClient.connect();
    await defaultClient.query(
      `DROP DATABASE IF EXISTS ${e2eTestDbName} WITH (FORCE);`
    );
    logger.info(`Dropped database: ${e2eTestDbName}`);
    await defaultClient.query(`CREATE DATABASE ${e2eTestDbName};`);
    logger.info(`Created database: ${e2eTestDbName}`);
    await defaultClient.end();
  }
  client = new pg.Client({
    connectionString: postgresE2eConnectionStringTestDb,
  });
  await client.connect();
  if (recreateDbOnStartup) {
    await dbUpMigrationPaths.reduce<Promise<pg.QueryResult | undefined>>(
      async (chain, path) => {
        const dbUpMigration = readFileSync(path, 'utf8');
        return chain.then(async () => client.query(dbUpMigration));
      },
      Promise.resolve(undefined)
    );
  }

  node1.listen();
  node2.listen();
  node3.listen();

  const logPeerConnection = (nodeName: string, peer: Peer) => {
    logger.info(
      `${nodeName} inbound connection from host ${peer.host} at port ${peer.port}; user-agent: ${peer.subversion}`
    );
  };
  node1.on('peerready', (peer) => {
    logPeerConnection(`node1`, peer);
    if (!peer.subversion.includes('tx-broadcast')) peers.node1 = peer;
  });
  node2.on('peerready', (peer) => {
    logPeerConnection(`node2`, peer);
    if (!peer.subversion.includes('tx-broadcast')) peers.node2 = peer;
  });
  node3.on('peerready', (peer) => {
    logPeerConnection(`node3`, peer);
    if (!peer.subversion.includes('tx-broadcast')) peers.node3 = peer;
  });

  if (logP2pMessage) {
    const logNodeMessage = (
      nodeName: string,
      eventName: string,
      message: unknown
    ) => {
      logger.trace(
        `${eventName} received from chaingraph to ${nodeName}: ${inspect(
          message,
          {
            compact: true,
            depth: 5,
            maxArrayLength: 20,
            maxStringLength: 1_000,
          }
        )}`
      );
    };
    node1.on('*', (_, message, eventName) => {
      logNodeMessage('node1', eventName, message);
    });
    node2.on('*', (_, message, eventName) => {
      logNodeMessage('node2', eventName, message);
    });
    node3.on('*', (_, message, eventName) => {
      logNodeMessage('node3', eventName, message);
    });
    logger.info('E2e tests are set to log all P2P messages.');
  }
});

/**
 * Prepare each "mockchain"
 */
const splitHeight = 3000;
const mockchainBeforeFork = [
  genesisBlock,
  ...generateMockchain({
    length: splitHeight,
    previousBlockHash: genesisBlock.header.hash,
  }),
];
const preSplitLastBlockHash =
  mockchainBeforeFork[mockchainBeforeFork.length - 1]!.header.hash;
/**
 * At `splitHeight`, the mockchain splits into two tips (A) and (B):
 *  - Node1 follows (A).
 *  - Node2 follows (B).
 *  - Node3 can support either, and switches between tips when one tip finds
 *    more blocks than the other. (Note, few real implementations would allow
 *    deep reorgs, but this contrived example allows for most of Chaingraph's
 *    expected functionality to be tested.)
 *
 *  Node3 later accepts `tipAStale150`, but switches back to tip A, testing a
 * string of stale blocks.
 */

const tipLengths = 200;
const tipA = generateMockchain({
  length: tipLengths,
  previousBlockHash: preSplitLastBlockHash,
});

const tipB = generateMockchain({
  length: tipLengths,
  previousBlockHash: preSplitLastBlockHash,
});

const tipAStale150 = generateMockchain({
  length: 3,
  previousBlockHash: tipA[149]!.header.hash,
});

/**
 * Initially, all nodes agree on `mockchainBeforeFork`:
 */
const chainStates = {
  node1: [...mockchainBeforeFork],
  node2: [...mockchainBeforeFork],
  node3: [...mockchainBeforeFork],
};

const respondWithChainState =
  (peerName: string, chain: BitcoreBlock[]) =>
  (peer: Peer, message: GetHeadersMessage) => {
    const selected = selectHeaders(
      message.starts.map((hash) => hash.slice().reverse().toString('hex')),
      chain
    );
    if (selected === false) {
      logger.error(
        'Chaingraph requested headers beginning with an unknown genesis block. This is a bug in the E2E tests.'
      );
      return;
    }
    logger.debug(
      `e2e: getheaders received by ${peerName}, sending ${selected.length} headers.`
    );
    const headerMessage = new peer.messages.Headers(selected);
    peer.sendMessage(headerMessage);
  };
node1.on('peergetheaders', respondWithChainState('node1', chainStates.node1));
node2.on('peergetheaders', respondWithChainState('node2', chainStates.node2));
node3.on('peergetheaders', respondWithChainState('node3', chainStates.node3));

const invTestTx =
  'deadbeef00000000000000000000000000000000000000000000000000000000';

const mempool: { [x: string]: string | false | undefined } = {
  [swapEndianness(halTxSpent)]: halTxSpentRaw,
  [swapEndianness(invTestTx)]: false,
};

const respondToGetData = ({
  chain,
  message,
  nodeName,
  peer,
}: {
  chain: BitcoreBlock[];
  message: GetDataMessage;
  nodeName: string;
  peer: Peer;
}) => {
  // eslint-disable-next-line complexity
  message.inventory.forEach((inv) => {
    const hash = inv.hash.slice().reverse().toString('hex');
    if (inv.type === BitcoreInventoryType.MSG_BLOCK) {
      const block = chain.find((b) => b.header.hash === hash);
      if (block === undefined) {
        logger.error(
          `No matching block found in ${nodeName} chain for hash: ${hash}`
        );
        return;
      }
      peer.sendMessage(new peer.messages.Block(block));
      return;
    } else if (inv.type === BitcoreInventoryType.MSG_TX) {
      const txRaw = mempool[hash];
      logger.debug(`e2e: getdata received for hash: ${hash}`);
      if (txRaw === undefined) {
        logger.error(
          `No matching transaction found in e2e mempool for hash: ${hash}`
        );
        return;
      } else if (txRaw === false) {
        logger.debug(`e2e: ignoring request.`);
        return;
      }
      const tx = new Transaction(txRaw);
      logger.debug(`e2e: sending transaction with hash: ${tx.hash}`);
      peer.sendMessage(new peer.messages.Transaction(tx));
    }
    logger.warn(`Unhandled INV type in GetData from ${nodeName}.`);
  });
};

/**
 * Respond to `GetData` messages:
 */
node1.on('peergetdata', (peer, message) => {
  respondToGetData({
    chain: chainStates.node1,
    message,
    nodeName: 'node1',
    peer,
  });
});
node2.on('peergetdata', (peer, message) => {
  respondToGetData({
    chain: chainStates.node2,
    message,
    nodeName: 'node2',
    peer,
  });
});
node3.on('peergetdata', (peer, message) => {
  respondToGetData({
    chain: chainStates.node3,
    message,
    nodeName: 'node3',
    peer,
  });
});

logger.info(
  `Mockchain generated (${mockchainBeforeFork.length} initial blocks, ${tipLengths} blocks after split), mock nodes prepared to respond to P2P messages.`
);

// eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
let chaingraphProcess: ExecaChildProcess | undefined;
// eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
let chaingraphProcess2: ExecaChildProcess | undefined;
// eslint-disable-next-line functional/no-let, @typescript-eslint/init-declarations
let chaingraphProcess3: ExecaChildProcess | undefined;
// eslint-disable-next-line functional/no-let
let stdoutBuffer = '';
// eslint-disable-next-line functional/no-let
let waitingForStdout: { pattern: RegExp | string; resolver: () => void }[] = [];

const handleStdout = () => {
  waitingForStdout = waitingForStdout.filter((task) => {
    if (
      typeof task.pattern === 'string'
        ? stdoutBuffer.includes(task.pattern)
        : task.pattern.test(stdoutBuffer)
    ) {
      task.resolver();
      return false;
    }
    return true;
  });
};

const seconds = 1000;
const tenSeconds = 10_000;
/**
 * Returns a promise that resolves when the `search` string is found in stdout.
 * @param search - the string to search for in stdout
 *
 * TODO: if AVA is running in debug mode, disable timeout (https://github.com/avajs/ava/issues/3152)
 */
const waitForStdout = async (search: RegExp | string, timeout = tenSeconds) => {
  logger.debug(`Waiting for stdout: ${search.toString()}`);
  const timeoutId = setTimeout(() => {
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(
      `Test failed after waiting ${
        timeout / seconds
      }s for the stdout search: ${search.toString()}`
    );
  }, timeout);
  const promise = new Promise<void>((res) => {
    waitingForStdout.push({
      pattern: search,
      resolver: () => {
        logger.debug(`Heard stdout: ${search.toString()}`);
        clearTimeout(timeoutId);
        res();
      },
    });
  });
  handleStdout();
  return promise;
};

const clearStdoutBuffer = () => {
  stdoutBuffer = '';
};

test.serial('[e2e] spawn chaingraph', async (t) => {
  chaingraphProcess = execa('node', ['./bin/chaingraph.js'], {
    env: e2eEnvVariables,
    stdio: 'pipe',
  });
  if (chaingraphProcess.stdout === null) {
    t.fail('`chaingraphProcess` stdout is not available.');
    return;
  }
  chaingraphProcess.stdout.on('data', (chunk) => {
    stdoutBuffer += chunk;
    handleStdout();
  });
  await waitForStdout('Starting Chaingraph...');
  t.pass();
});

const enum StatusCode {
  success = 200,
  badRequest = 400,
  notFound = 404,
}

test.serial('[e2e] api /health-check is alive', async (t) => {
  const healthCheckResponse = await got(
    `http://localhost:${chaingraphInternalApiPort}/health-check`
  );
  t.deepEqual(healthCheckResponse.statusCode, StatusCode.success);
  t.deepEqual(healthCheckResponse.body, '{"status":"alive"}');
});

test.serial('[e2e] connects to trusted nodes', async (t) => {
  await waitForStdout('node1: connected to node');
  await waitForStdout('node2: connected to node');
  await waitForStdout('node3: connected to node');
  t.pass();
});

test.serial('[e2e] downloads all header chains', async (t) => {
  await waitForStdout(/node1[^\n]+headers-syncing completed/u);
  await waitForStdout(/node2[^\n]+headers-syncing completed/u);
  await waitForStdout(/node3[^\n]+headers-syncing completed/u);
  t.pass();
});

test.serial(
  '[e2e] restores sync-state from database on restart (during initial sync)',
  async (t) => {
    await waitForStdout(
      /Saved new block – height:\s+10[^\n]+nodes: node1, node2, node3/u
    );
    logger.info('e2e: testing sync restoration on restart. Sending SIGTERM...');
    chaingraphProcess!.kill('SIGINT');
    // chaingraphProcess!.kill('SIGTERM');
    await waitForStdout('Shutting down...');
    await waitForStdout('Exiting...');
    chaingraphProcess2 = execa('node', ['./bin/chaingraph.js'], {
      env: e2eEnvVariables,
      stdio: 'pipe',
    });
    if (chaingraphProcess2.stdout === null) {
      t.fail('`chaingraphProcess2` stdout is not available.');
      return;
    }
    chaingraphProcess2.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk;
      handleStdout();
    });
    await waitForStdout('Starting Chaingraph...');
    await waitForStdout('Restored chain for node node1');
    await waitForStdout('Restored chain for node node2');
    await waitForStdout('Restored chain for node node3');
    t.pass();
  }
);
const sleep = async (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

test.serial(
  '[e2e] ignores inbound transactions before initial sync is complete',
  async (t) => {
    peers.node1.sendMessage(
      new peers.node1.messages.Transaction(new Transaction(halTxRaw))
    );
    const delay = 1000;
    await sleep(delay);
    const result = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(hash, 'hex') FROM transaction WHERE hash = $1;`,
      [hexToBin(halTxHash)]
    );
    t.deepEqual(result.rowCount, 0);
    t.pass();
  }
);

const oneMinute = 60_000;
test.serial('[e2e] completes initial sync', async (t) => {
  t.timeout(oneMinute);
  await waitForStdout(
    /Saved new block – height:\s+3000[^\n]+nodes: node1, node2, node3/u,
    oneMinute
  );
  await waitForStdout('Agent: initial sync is complete.');
  t.pass();
});

test.serial('[e2e] creates expected indexes after initial sync', async (t) => {
  await waitForStdout('Agent: all managed indexes have been created.');
  await waitForStdout('Agent: enabled mempool tracking.');
  const indexes = (
    await client.query<{
      indexname: string;
    }>(/* sql */ `
  SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;
  `)
  ).rows.map((row) => row.indexname);
  t.deepEqual(indexes, [
    'block_hash_key',
    'block_height_index',
    'block_inclusions_index',
    'block_internal_id_key',
    'block_pkey',
    'block_transaction_pkey',
    'input_pkey',
    'node_block_history_pkey',
    'node_block_pkey',
    'node_internal_id_key',
    'node_name_key',
    'node_pkey',
    'node_transaction_pkey',
    'output_pkey',
    'output_search_index',
    'spent_by_index',
    'transaction_hash_key',
    'transaction_pkey',
  ]);
  clearStdoutBuffer();
  t.pass();
});

test.serial(
  '[e2e] after initial sync is complete, requests transactions as they are announced',
  async (t) => {
    const node3RequestedTx = new Promise((res) => {
      node3.once('peergetdata', (_, message) => {
        res(message.inventory);
      });
    });
    const announcedHash = Buffer.from(invTestTx, 'hex');
    peers.node3.sendMessage(
      peers.node3.messages.Inventory.forTransaction(announcedHash)
    );
    const result = await node3RequestedTx;
    t.deepEqual(result, [{ hash: announcedHash.reverse(), type: 1 }]);
  }
);

test.serial(
  '[e2e] after initial sync is complete, saves inbound transactions as they are received',
  async (t) => {
    peers.node1.sendMessage(
      new peers.node1.messages.Transaction(new Transaction(halTxRaw))
    );
    const delay = 1000;
    await sleep(delay);
    const result = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(encode_transaction(transaction), 'hex') FROM transaction WHERE hash = $1;`,
      [hexToBin(halTxHash)]
    );
    t.deepEqual(result.rows[0]!.encode, halTxRaw);
    t.pass();
  }
);

test.serial('[e2e] handles first chipnet CashTokens transaction', async (t) => {
  peers.node1.sendMessage(
    new peers.node1.messages.Transaction(new Transaction(chipnetCashTokensTx))
  );
  const delay = 1000;
  await sleep(delay);
  const result = await client.query<{ encode: string }>(
    /* sql */ `SELECT encode(encode_transaction(transaction), 'hex') FROM transaction WHERE hash = $1;`,
    [hexToBin(chipnetCashTokensTxHash)]
  );
  t.deepEqual(result.rows[0]!.encode, chipnetCashTokensTx);
  t.pass();
});

test.serial(
  '[e2e] after initial sync is complete, requests and saves inbound transactions as they are announced',
  async (t) => {
    peers.node1.sendMessage(
      peers.node1.messages.Inventory.forTransaction(
        Buffer.from(halTxSpent, 'hex')
      )
    );
    const delay = 1000;
    await sleep(delay);
    const result = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(encode_transaction(transaction), 'hex') FROM transaction WHERE hash = $1;`,
      [hexToBin(halTxSpent)]
    );
    t.deepEqual(result.rows[0]!.encode, halTxSpentRaw);
    t.pass();
  }
);

test.serial('[e2e] get hex-encoded genesis block header', async (t) => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const encodedHex = (
    await client.query<{ block_header_encoded_hex: string }>(
      /* sql */ `SELECT block_header_encoded_hex (block) FROM block WHERE height = 0;`
    )
  ).rows[0]!.block_header_encoded_hex;
  /* eslint-enable @typescript-eslint/naming-convention */
  t.deepEqual(
    encodedHex,
    '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c'
  );
});

test.serial('[e2e] get hex-encoded genesis block transaction', async (t) => {
  const genesisTxHash = hexToBin(
    '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'
  );
  /* eslint-disable @typescript-eslint/naming-convention */
  const encodedHex = (
    await client.query<{ transaction_encoded_hex: string }>(
      /* sql */ `SELECT transaction_encoded_hex (transaction) FROM transaction WHERE hash = $1::bytea;`,
      [genesisTxHash]
    )
  ).rows[0]!.transaction_encoded_hex;
  /* eslint-enable @typescript-eslint/naming-convention */
  t.deepEqual(
    encodedHex,
    '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000'
  );
});

test.serial(
  '[e2e] get hex-encoded genesis block (with transaction)',
  async (t) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const encodedHex = (
      await client.query<{ block_encoded_hex: string }>(
        /* sql */ `SELECT block_encoded_hex (block) FROM block WHERE height = 0;`
      )
    ).rows[0]!.block_encoded_hex;
    /* eslint-enable @typescript-eslint/naming-convention */
    t.deepEqual(encodedHex, genesisBlockRaw);
  }
);

const newBlocks = (
  node: 'node1' | 'node2' | 'node3',
  blocks: BitcoreBlock[]
) => {
  chainStates[node].push(...blocks);
  peers[node].sendMessage(
    new peers[node].messages.Headers(blocks.map((block) => block.header))
  );
};

test.serial(
  '[e2e] syncs blocks as they arrive, handles multiple chain tips',
  async (t) => {
    const [, tx1] = tipA[0]!.transactions;
    peers.node1.sendMessage(new peers.node1.messages.Transaction(tx1));
    logger.debug(`node1: sent tipA[0] transaction 0: ${tx1!.hash}`);
    newBlocks('node1', [tipA[0]!]);
    newBlocks('node2', [tipB[0]!]);
    newBlocks('node3', [tipB[0]!]);
    t.deepEqual(
      chainStates.node2.map((block) => block.header.hash),
      chainStates.node3.map((block) => block.header.hash)
    );
    await waitForStdout(/Saved new block – height:\s+3001[^\n]+nodes: node1/u);
    t.true(
      /Saved new block – height:\s+3001[^\n]+new txs: 3\/4[^\n]+nodes: node1/u.test(
        stdoutBuffer
      ),
      '3 of 4 transactions should be new in tip A block 3001. Has the mockchain changed? (If so, update this test.)'
    );
    await waitForStdout(
      /Saved new block – height:\s+3001[^\n]+nodes: node2, node3/u
    );
    t.pass();
  }
);

test.serial('[e2e] handles re-org of a single block', async (t) => {
  newBlocks('node1', [tipA[1]!]);
  newBlocks('node2', [tipB[1]!]);
  chainStates.node3.pop();
  newBlocks('node3', [tipA[0]!, tipA[1]!]);
  t.deepEqual(
    chainStates.node1.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3001. The following stale blocks were removed:/u
  );
  await waitForStdout(
    /Saved new block – height:\s+3002[^\n]+hash: a44a664d5acc560305fceb9ba3c7f195a5d78236c1705d5ae7434ba784005689[^\n]+nodes: node2/u
  );
  await waitForStdout(
    /Saved new block – height:\s+3002[^\n]+hash: 9c4feec6f35a54f2244f2ab14e1370e60713097be2ead8402e4ef68f96e07c8c[^\n]+nodes: node1, node3/u
  );
  t.pass();
});

test.serial('[e2e] handles reversal of single-block re-org', async (t) => {
  const tipStartIndex = 2;
  const tipEnd = 6;
  newBlocks('node1', tipA.slice(tipStartIndex, tipEnd));
  newBlocks('node2', tipB.slice(tipStartIndex, tipEnd));
  chainStates.node3.splice(splitHeight + 1);
  newBlocks('node3', tipB.slice(0, tipEnd));
  t.deepEqual(
    chainStates.node2.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3001. The following stale blocks were removed:/u
  );
  await waitForStdout(/Saved new block – height:\s+3006[^\n]+nodes: node1/u);
  await waitForStdout(
    /Saved new block – height:\s+3006[^\n]+nodes: node2, node3/u
  );
  t.pass();
});

test.serial('[e2e] handles re-org of 6 blocks', async (t) => {
  const tipStartIndex = 6;
  const tipEnd = 7;
  newBlocks('node1', tipA.slice(tipStartIndex, tipEnd));
  chainStates.node3.splice(splitHeight + 1);
  newBlocks('node3', tipA.slice(0, tipEnd));
  t.deepEqual(
    chainStates.node1.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3001. The following stale blocks were removed:/u
  );
  await waitForStdout(
    /Saved new block – height:\s+3007[^\n]+nodes: node1, node3/u
  );
  t.pass();
});

test.serial('[e2e] handles reversal of 6 block re-org', async (t) => {
  const tipStartIndex = 6;
  const tipEnd = 8;
  newBlocks('node2', tipB.slice(tipStartIndex, tipEnd));
  chainStates.node3.splice(splitHeight + 1);
  newBlocks('node3', tipB.slice(0, tipEnd));
  t.deepEqual(
    chainStates.node2.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3001. The following stale blocks were removed:/u
  );
  await waitForStdout(
    /Saved new block – height:\s+3008[^\n]+nodes: node2, node3/u
  );
  t.pass();
});

/**
 * Re-orgs larger than 8 blocks are only announced via INV message; this method
 * simulates blocks coming in as expected via headers messages.
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const slowFeedBlocks = (
  node: 'node1' | 'node2' | 'node3',
  blocks: BitcoreBlock[],
  chunk = 6
) => {
  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let i = 0; i < blocks.length; i += chunk) {
    newBlocks(node, blocks.slice(i, i + chunk));
  }
};

test.serial('[e2e] handles re-org of 100 blocks', async (t) => {
  const tipEnd = 101;
  slowFeedBlocks('node1', tipA.slice(7, tipEnd));
  slowFeedBlocks('node2', tipB.slice(8, tipEnd));
  chainStates.node3.splice(splitHeight + 1);
  chainStates.node3.push(...tipA.slice(0, tipEnd));
  t.deepEqual(
    chainStates.node1.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  peers.node3.sendMessage(
    peers.node3.messages.Inventory.forBlock(tipA[tipEnd - 1]!.header.hash)
  );
  await waitForStdout(
    `node3: received unexpected block inventory item with hash: ${swapEndianness(
      tipA[tipEnd - 1]!.header.hash
    )}`
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3001. The following stale blocks were removed:/u
  );
  await waitForStdout(/Saved new block – height:\s+3100[^\n]+nodes: node2/u);
  await waitForStdout(
    /Saved new block – height:\s+3100[^\n]+nodes: node1, node3/u
  );
  t.pass();
});

test.serial('[e2e] records stale blocks', async (t) => {
  const tipStartIndex = 101;
  const tipEnd1 = 150;
  const tipEnd2 = 160;
  slowFeedBlocks('node1', tipA.slice(tipStartIndex, tipEnd1));
  slowFeedBlocks('node2', tipB.slice(tipStartIndex, tipEnd1));
  slowFeedBlocks('node3', tipA.slice(tipStartIndex, tipEnd1));
  newBlocks('node3', tipAStale150);
  await waitForStdout(/Saved new block – height:\s+3153[^\n]+nodes: node3/u);
  chainStates.node3.splice(splitHeight + tipEnd1 + 1);
  slowFeedBlocks('node1', tipA.slice(tipEnd1, tipEnd2));
  slowFeedBlocks('node2', tipB.slice(tipEnd1, tipEnd2));
  slowFeedBlocks('node3', tipA.slice(tipEnd1, tipEnd2));
  t.deepEqual(
    chainStates.node1.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  await waitForStdout(
    /node3: re-organization detected beginning at height: 3151. The following stale blocks were removed:/u
  );
  await waitForStdout(/Saved new block – height:\s+3160[^\n]+nodes: node2/u);
  await waitForStdout(
    /Saved new block – height:\s+3160[^\n]+nodes: node1, node3/u
  );
  t.pass();
});
/* eslint-enable @typescript-eslint/no-magic-numbers */

test.serial(
  '[e2e] records double-spends accepted via mempool and via block',
  async (t) => {
    // eslint-disable-next-line prefer-destructuring
    const tx1 = tipA[160]!.transactions[1];
    const mock1 = generateMockDoubleSpend(tx1!.inputs, true);
    // TODO: race condition – this should work without a delay?
    const delay = 1000;
    peers.node1.sendMessage(new peers.node1.messages.Transaction(tx1));
    logger.debug(
      `node1: sent original transaction to double-spend: ${tx1!.hash}`
    );
    await sleep(delay);
    peers.node1.sendMessage(new peers.node1.messages.Transaction(mock1));
    logger.debug(`node1: sent double-spending transaction: ${mock1.hash}`);
    await sleep(delay);
    newBlocks('node1', [tipA[160]!]);
    newBlocks('node2', [tipB[160]!]);
    newBlocks('node3', [tipA[160]!]);
    logger.debug(
      `node1: sent block including original transaction: ${tx1!.hash}`
    );
    await waitForStdout(/Saved new block – height:\s+3161[^\n]+nodes: node2/u);
    await waitForStdout(
      /Saved new block – height:\s+3161[^\n]+nodes: node1, node3/u
    );
    /* eslint-disable @typescript-eslint/naming-convention */
    const res = await client.query<{
      internal_id: number;
      node_internal_id: number;
      transaction_internal_id: number;
      validated_at: string;
      replaced_at: string;
    }>(
      /* sql */ `SELECT * FROM node_transaction_history WHERE transaction_internal_id IN (SELECT internal_id FROM transaction WHERE hash IN ($1::bytea, $2::bytea)) ORDER BY validated_at ASC;
         `,
      [hexToBin(tx1!.hash), hexToBin(mock1.hash)]
    );
    /* eslint-enable @typescript-eslint/naming-convention */
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    t.deepEqual(res.rows.length, 2);
    t.deepEqual(res.rows[0]!.node_internal_id, res.rows[1]!.node_internal_id);
    t.deepEqual(res.rows[0]!.replaced_at, res.rows[1]!.validated_at);
    t.true(
      new Date(res.rows[0]!.validated_at) <= new Date(res.rows[0]!.replaced_at)
    );
    t.true(
      new Date(res.rows[1]!.validated_at) <= new Date(res.rows[1]!.replaced_at)
    );
    t.pass();
  }
);

test.serial(
  '[e2e] removes node_transaction entries which are confirmed by a block',
  async (t) => {
    const [, tx1, tx2, tx3] = tipA[161]!.transactions;
    peers.node1.sendMessage(new peers.node1.messages.Transaction(tx1));
    logger.debug(`node1: sent tx1: ${tx1!.hash}`);
    peers.node1.sendMessage(new peers.node1.messages.Transaction(tx2));
    logger.debug(`node1: sent tx2: ${tx2!.hash}`);
    peers.node1.sendMessage(new peers.node1.messages.Transaction(tx3));
    logger.debug(`node1: sent tx3: ${tx2!.hash}`);
    const delay = 100;
    await sleep(delay);
    const mempool1 = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(hash, 'hex') FROM node_transaction JOIN transaction ON node_transaction.transaction_internal_id = transaction.internal_id ORDER BY hash ASC;`
    );
    t.deepEqual(mempool1.rows, [
      { encode: tx1!.hash },
      { encode: tx3!.hash },
      { encode: tx2!.hash },
      { encode: chipnetCashTokensTxHash },
      { encode: halTxSpent },
      { encode: halTxHash },
    ]);
    newBlocks('node1', [tipA[161]!]);
    newBlocks('node2', [tipB[161]!]);
    newBlocks('node3', [tipA[161]!]);
    t.deepEqual(
      chainStates.node1.map((block) => block.header.hash),
      chainStates.node3.map((block) => block.header.hash)
    );
    await waitForStdout(/Saved new block – height:\s+3162[^\n]+nodes: node2/u);
    await waitForStdout(
      /Saved new block – height:\s+3162[^\n]+nodes: node1, node3/u
    );
    const mempool2 = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(hash, 'hex') FROM node_transaction JOIN transaction ON node_transaction.transaction_internal_id = transaction.internal_id ORDER BY hash ASC;`
    );
    t.deepEqual(mempool2.rows, [
      { encode: chipnetCashTokensTxHash },
      { encode: halTxSpent },
      { encode: halTxHash },
    ]);
    t.pass();
  }
);

test.serial('[e2e] shuts down with SIGINT', async (t) => {
  chaingraphProcess2!.kill('SIGINT');
  await waitForStdout('Shutting down...');
  await waitForStdout('Exiting...');
  await chaingraphProcess2;
  t.pass();
});

test.serial(
  '[e2e] restores sync-state from database on restart (after initial sync)',
  async (t) => {
    chaingraphProcess3 = execa('node', ['./bin/chaingraph.js'], {
      env: e2eEnvVariables2,
      stdio: 'pipe',
    });
    if (chaingraphProcess3.stdout === null) {
      t.fail('`chaingraphProcess2` stdout is not available.');
      return;
    }
    chaingraphProcess3.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk;
      handleStdout();
    });
    await waitForStdout('Starting Chaingraph...');
    await waitForStdout('Restored chain for node node1');
    await waitForStdout('Restored chain for node node2');
    await waitForStdout('Restored chain for node node4');
    t.pass();
  }
);

test.serial('[e2e] catches up a new node via headers', async (t) => {
  t.timeout(oneMinute);
  await waitForStdout(
    `node4: accepted 2000 existing blocks from height 1 to height 2000 (hash: ${
      chainStates.node3[2000]!.header.hash
    })`,
    oneMinute
  );
  await waitForStdout(
    `node4: accepted 1162 existing blocks from height 2001 to height 3162 (hash: ${
      chainStates.node3[3162]!.header.hash
    })`
  );
  const node4Blocks = await client.query<{ encode: string; height: string }>(
    /* sql */ `SELECT encode(hash, 'hex'), height from node_block JOIN node ON node.internal_id = node_block.node_internal_id JOIN block ON block.internal_id = node_block.block_internal_id WHERE node.name = 'node4' ORDER BY height DESC;`
  );
  const expectedCount = 3163;
  t.deepEqual(node4Blocks.rowCount, expectedCount);
  t.deepEqual(node4Blocks.rows[0], {
    encode: tipA[161]!.header.hash,
    height: '3162',
  });
  await waitForStdout('Agent: enabled mempool tracking.');
  t.pass();
});

test.serial(
  '[e2e] handles empty headers messages (fully-synced)',
  async (t) => {
    peers.node1.sendMessage(new peers.node1.messages.Headers([]));
    await waitForStdout(
      'node1: received empty headers message – headers-syncing completed'
    );
    t.pass();
  }
);

test.serial('[e2e] syncs remaining blocks one-by-one', async (t) => {
  const tipStartIndex = 162;
  slowFeedBlocks('node1', tipA.slice(tipStartIndex), 1);
  slowFeedBlocks('node2', tipB.slice(tipStartIndex), 1);
  /**
   * (Renamed to node4 via env variables)
   */
  slowFeedBlocks('node3', tipA.slice(tipStartIndex), 1);
  t.deepEqual(
    chainStates.node1.map((block) => block.header.hash),
    chainStates.node3.map((block) => block.header.hash)
  );
  t.deepEqual(
    chainStates.node1
      .slice(0, splitHeight + 1)
      .map((block) => block.header.hash),
    chainStates.node2
      .slice(0, splitHeight + 1)
      .map((block) => block.header.hash)
  );
  await waitForStdout(/Saved new block – height:\s+3200[^\n]+nodes: node2/u);
  await waitForStdout(
    /Saved new block – height:\s+3200[^\n]+nodes: node1, node4/u
  );
  t.pass();
});

test.serial('[e2e] [api] 404: logs unknown request urls', async (t) => {
  const res = await got(
    `http://localhost:${chaingraphInternalApiPort}/unknown-URL`,
    { throwHttpErrors: false }
  );
  t.deepEqual(res.statusCode, StatusCode.notFound);
  t.deepEqual(res.body, '{"error":"not found"}');
  await waitForStdout('[API] issued 404 for req.url: /unknown-URL');
  t.pass();
});

/* eslint-disable @typescript-eslint/naming-convention, camelcase */
const validRequestWithoutNode = {
  action: { name: 'send_transaction' },
  input: {
    request: {
      encoded_hex:
        '0100000001c9cf39d7d29ecb8ea68e8fd2019ae047ca3c36e6e4d6a2f4d8c070eced00fdd1010000006441db7f7de61e8ed43984921ded4fb6148152085a5f31725c56b1da86d929d4fc4346c516edf93ac81dcf5b84518ae1dd5dec8ad863f891ac4a464ae8fabd22375e41210334242a73fe4b0d88ddfe6dc7202fa1b60785dac3fe5f7d92a616f8792f5f3a47feffffff0200e87648170000001976a914ab4cc0d4c6ffadbce88ee74a7b856fe6dd02acb688acd4de9265170100001976a91422afddf849a9f2f27aabb7d88e06a1919c0a77d688acbc000200',
      // node_internal_id: [number],
    },
  },
  request_query:
    'mutation {\n  send_transaction(request: {node_internal_id: 1, encoded_hex: "0100000001c9cf39d7d29ecb8ea68e8fd2019ae047ca3c36e6e4d6a2f4d8c070eced00fdd1010000006441db7f7de61e8ed43984921ded4fb6148152085a5f31725c56b1da86d929d4fc4346c516edf93ac81dcf5b84518ae1dd5dec8ad863f891ac4a464ae8fabd22375e41210334242a73fe4b0d88ddfe6dc7202fa1b60785dac3fe5f7d92a616f8792f5f3a47feffffff0200e87648170000001976a914ab4cc0d4c6ffadbce88ee74a7b856fe6dd02acb688acd4de9265170100001976a91422afddf849a9f2f27aabb7d88e06a1919c0a77d688acbc000200"}) {\n    transaction_hash\n    validation_error_message\n    validation_success\n    transmission_error_message\n    transmission_success\n  }\n}\n',
  session_variables: { 'x-hasura-role': 'public' },
};

test.serial(
  '[e2e] [api] /send-transaction: malformed (missing input)',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: { ...validRequestWithoutNode, input: {} },
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.badRequest);
    t.deepEqual(res.body, '{"message":"malformed request"}');
    await waitForStdout('[API] /send-transaction: malformed request.');
    t.pass();
  }
);

test.serial(
  '[e2e] [api] /send-transaction: malformed (missing encoded_hex)',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: {
          ...validRequestWithoutNode,
          input: { request: { node_internal_id: 1 } },
        },
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.badRequest);
    t.deepEqual(res.body, `{"message":"'encoded_hex' must be a string"}`);
  }
);

test.serial(
  '[e2e] [api] /send-transaction: malformed (missing node_internal_id)',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: validRequestWithoutNode,
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.badRequest);
    t.deepEqual(res.body, `{"message":"'node_internal_id' must be a number"}`);
  }
);

test.serial(
  '[e2e] [api] /send-transaction: malformed (node_internal_id is not a number)',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: {
          ...validRequestWithoutNode,
          input: {
            request: {
              encoded_hex: validRequestWithoutNode.input.request.encoded_hex,
              node_internal_id: 'invalid',
            },
          },
        },
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.badRequest);
    t.deepEqual(res.body, `{"message":"'node_internal_id' must be a number"}`);
  }
);

test.serial(
  '[e2e] [api] /send-transaction: malformed (encoded_hex is not a string)',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: {
          ...validRequestWithoutNode,
          input: {
            request: {
              encoded_hex: 1,
              node_internal_id: 0,
            },
          },
        },
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.badRequest);
    t.deepEqual(res.body, `{"message":"'encoded_hex' must be a string"}`);
  }
);

test.serial(
  '[e2e] [api] /send-transaction: unknown node_internal_id',
  async (t) => {
    const res = await got.post(
      `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
      {
        json: {
          ...validRequestWithoutNode,
          input: {
            request: {
              encoded_hex: validRequestWithoutNode.input.request.encoded_hex,
              node_internal_id: 100,
            },
          },
        },
        throwHttpErrors: false,
      }
    );
    t.deepEqual(res.statusCode, StatusCode.success);
    t.deepEqual(
      res.body,
      JSON.stringify({
        transaction_hash:
          'dd92bef1b09c1c2eaf9a9f0ce29d330bffa54a3003d44767d3e32b3f6fbab0dd',
        validation_success: true,
        // eslint-disable-next-line sort-keys
        transmission_error_message:
          'Unable to connect to the requested node (node_internal_id: 100).',
        transmission_success: false,
      })
    );
  }
);

// eslint-disable-next-line functional/no-let
let node1InternalId = 0;
test.serial('[e2e] [api] /send-transaction: invalid TX', async (t) => {
  node1InternalId = (
    await client.query<{ internal_id: number }>(
      /* sql */ `SELECT internal_id FROM node ORDER BY name ASC`
    )
  ).rows[0]!.internal_id;
  const res = await got.post(
    `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
    {
      json: {
        ...validRequestWithoutNode,
        input: {
          request: {
            encoded_hex: '00',
            node_internal_id: node1InternalId,
          },
        },
      },
    }
  );
  t.deepEqual(res.statusCode, StatusCode.success);
  t.deepEqual(
    res.body,
    JSON.stringify({
      transaction_hash:
        '9a538906e6466ebd2617d321f71bc94e56056ce213d366773699e28158e00614',
      validation_error_message:
        'Error reading transaction. Error reading Uint32LE: requires 4 bytes. Provided length: 1',
      validation_success: false,
      // eslint-disable-next-line sort-keys
      transmission_success: false,
    })
  );
});

test.serial('[e2e] [api] /send-transaction: valid', async (t) => {
  const res = await got.post(
    `http://localhost:${chaingraphInternalApiPort}/send-transaction`,
    {
      json: {
        ...validRequestWithoutNode,
        input: {
          request: {
            encoded_hex: validRequestWithoutNode.input.request.encoded_hex,
            node_internal_id: node1InternalId,
          },
        },
      },
    }
  );
  t.deepEqual(res.statusCode, StatusCode.success);
  t.deepEqual(
    res.body,
    JSON.stringify({
      transaction_hash:
        'dd92bef1b09c1c2eaf9a9f0ce29d330bffa54a3003d44767d3e32b3f6fbab0dd',
      validation_success: true,
      // eslint-disable-next-line sort-keys
      transmission_success: true,
    })
  );
});
/* eslint-enable @typescript-eslint/naming-convention, camelcase */

/**
 * The below tests run concurrently after all serial tests have completed.
 */

/**
 * Macro to test Chaingraph's built-in Postgres functions; these can also be run
 * independently via `yarn test:e2e:postgres`.
 */
const bytecodeFunction = test.macro<[string, string, string]>({
  // eslint-disable-next-line max-params
  exec: async (t, functionName, bytecodeHex, patternHex) => {
    const result = await client.query<{ encode: string }>(
      /* sql */ `SELECT encode(${functionName} ($1), 'hex');`,
      [hexToBin(bytecodeHex)]
    );
    t.deepEqual(result.rows[0]!.encode, patternHex);
  },
  // eslint-disable-next-line max-params
  title: (providedTitle, functionName, _bytecodeHex, patternHex) =>
    `[e2e] [postgres] ${functionName} – ${patternHex}: ${providedTitle ?? ''}`,
});

test(
  'P2PKH',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '76a914000000000000000000000000000000000000000088ac',
  '76a91488ac'
);
test(
  'P2SH',
  bytecodeFunction,
  'parse_bytecode_pattern',
  'a914000000000000000000000000000000000000000087',
  'a91487'
);
test(
  'OP_RETURN (fixed pushes)',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '6a04000000005120000000000000000000000000000000000000000000000000000000000000000004000000000400000000',
  '6a0451200404'
);
test(
  'OP_RETURN with OP_PUSHDATA1',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '6a026d0c090000000000000000004c5c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  '6a02094c'
);

const allOnes = 0x11;
const minPushData2 = 256;
test(
  'OP_RETURN with OP_PUSHDATA2',
  bytecodeFunction,
  'parse_bytecode_pattern',
  `6a${binToHex(
    encodeDataPush(new Uint8Array(minPushData2).fill(allOnes))
  )}515151`,
  '6a4d515151'
);

const minPushData4 = 65536;
test(
  'OP_RETURN with OP_PUSHDATA4',
  bytecodeFunction,
  'parse_bytecode_pattern',
  `6a${binToHex(
    encodeDataPush(new Uint8Array(minPushData4).fill(allOnes))
  )}515151`,
  '6a4e515151'
);

test(
  'malformed OP_PUSHBYTES',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '515102',
  '515102'
);
test(
  'malformed OP_PUSHDATA1',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '51514c',
  '51514c'
);
test(
  'malformed OP_PUSHDATA2',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '51514d11',
  '51514d'
);
test(
  'malformed OP_PUSHDATA4',
  bytecodeFunction,
  'parse_bytecode_pattern',
  '51514e112233',
  '51514e'
);

test(
  'P2PKH',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '76a914000000000000000000000000000000000000000088ac',
  '76a91488ac'
);
test(
  'P2SH',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  'a914000000000000000000000000000000000000000087',
  'a91487'
);
test(
  'OP_RETURN (fixed pushes)',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '6a04000000005120000000000000000000000000000000000000000000000000000000000000000004000000000400000000',
  '6a0451200404'
);
test(
  'OP_RETURN with OP_PUSHDATA1 (memo.cash)',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '6a026d0c090000000000000000004c5c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  '6a02094c5c'
);

test(
  'OP_RETURN with OP_PUSHDATA2',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  `6a${binToHex(
    encodeDataPush(new Uint8Array(minPushData2).fill(allOnes))
  )}515151`,
  '6a4d0001515151'
);

test(
  'OP_RETURN with OP_PUSHDATA4',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  `6a${binToHex(
    encodeDataPush(new Uint8Array(minPushData4).fill(allOnes))
  )}515151`,
  '6a4e00000100515151'
);

test(
  'malformed OP_PUSHBYTES',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '515102',
  '515102'
);
test(
  'malformed OP_PUSHDATA1',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '51514c',
  '51514c'
);
test(
  'malformed OP_PUSHDATA2',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '51514d11',
  '51514d'
);
test(
  'malformed OP_PUSHDATA4',
  bytecodeFunction,
  'parse_bytecode_pattern_with_pushdata_lengths',
  '51514e112233',
  '51514e'
);

test(
  'no redeem',
  bytecodeFunction,
  'parse_bytecode_pattern_redeem',
  `0002000051`,
  ''
);

test(
  'OP_PUSHBYTES redeem',
  bytecodeFunction,
  'parse_bytecode_pattern_redeem',
  `0003019951`,
  '0151'
);

const minPushData1 = 76;
test(
  'OP_PUSHDATA1 redeem',
  bytecodeFunction,
  'parse_bytecode_pattern_redeem',
  `00020000${binToHex(
    encodeDataPush(
      flattenBinArray([
        hexToBin('00'),
        encodeDataPush(new Uint8Array(minPushData1).fill(allOnes)),
        hexToBin('515253'),
      ])
    )
  )}`,
  '004c515253'
);

test(
  'OP_PUSHDATA2 redeem',
  bytecodeFunction,
  'parse_bytecode_pattern_redeem',
  `00020000${binToHex(
    encodeDataPush(
      flattenBinArray([
        hexToBin('00'),
        encodeDataPush(new Uint8Array(minPushData2).fill(allOnes)),
        hexToBin('515253'),
      ])
    )
  )}`,
  '004d515253'
);

test(
  'OP_PUSHDATA4 redeem',
  bytecodeFunction,
  'parse_bytecode_pattern_redeem',
  `00020000${binToHex(
    encodeDataPush(
      flattenBinArray([
        hexToBin('00'),
        encodeDataPush(new Uint8Array(minPushData4).fill(allOnes)),
        hexToBin('515253'),
      ])
    )
  )}`,
  '004e515253'
);

test('[e2e] [postgres] encode_uint16le', async (t) => {
  const query = async (encoded: number) =>
    (
      await client.query<{ encode: string }>(
        /* sql */ `SELECT encode(encode_uint16le ($1), 'hex');`,
        [encoded]
      )
    ).rows[0]!.encode;
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  t.deepEqual(await query(0), '0000');
  t.deepEqual(await query(1), '0100');
  t.deepEqual(await query(2), '0200');
  t.deepEqual(await query(254), 'fe00');
  t.deepEqual(await query(255), 'ff00');
  t.deepEqual(await query(256), '0001');
  t.deepEqual(await query(1000), 'e803');
  // cspell: disable-next-line
  t.deepEqual(await query(65534), 'feff');
  t.deepEqual(await query(65535), 'ffff');
  /* eslint-enable @typescript-eslint/no-magic-numbers */
});

test('[e2e] [postgres] encode_uint32le', async (t) => {
  const query = async (encoded: number) =>
    (
      await client.query<{ encode: string }>(
        /* sql */ `SELECT encode(encode_uint32le ($1), 'hex');`,
        [encoded]
      )
    ).rows[0]!.encode;
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  t.deepEqual(await query(0), '00000000');
  t.deepEqual(await query(1), '01000000');
  t.deepEqual(await query(536870912), '00000020');
  t.deepEqual(await query(541065216), '00004020');
  t.deepEqual(await query(545259520), '00008020');
  t.deepEqual(await query(549453824), '0000c020');
  t.deepEqual(await query(536928256), '00e00020');
  t.deepEqual(await query(536870913), '01000020');
  t.deepEqual(await query(536870914), '02000020');
  t.deepEqual(await query(1073676288), '0000ff3f');
  t.deepEqual(await query(1073733632), '00e0ff3f');
  t.deepEqual(await query(2147483647), 'ffffff7f');
  t.deepEqual(await query(2147483648), '00000080');
  t.deepEqual(await query(2147483649), '01000080');
  // cspell: disable-next-line
  t.deepEqual(await query(4294967294), 'feffffff');
  t.deepEqual(await query(4294967295), 'ffffffff');
  /* eslint-enable @typescript-eslint/no-magic-numbers */
});

test('[e2e] [postgres] encode_int32le', async (t) => {
  const query = async (encoded: number) =>
    (
      await client.query<{ encode: string }>(
        /* sql */ `SELECT encode(encode_int32le ($1), 'hex');`,
        [encoded]
      )
    ).rows[0]!.encode;
  /* eslint-disable @typescript-eslint/no-magic-numbers, line-comment-position */
  t.deepEqual(await query(1), '01000000');
  t.deepEqual(await query(2), '02000000');
  t.deepEqual(await query(3), '03000000'); // version of TX: 110da331fd5336038316c4709404aea5855afed21f054f5bba01bfef099d5da1
  t.deepEqual(await query(4), '04000000'); // version of TX: 6ae17e22dba03522126f9268de58de5a440ccdb334e137861f90766901e806fd
  t.deepEqual(await query(2147483647), 'ffffff7f');
  // cspell: disable-next-line
  t.deepEqual(await query(-2), 'feffffff');
  t.deepEqual(await query(-1), 'ffffffff');
  t.deepEqual(await query(0), '00000000'); // version of TX: 64147d3d27268778c9d27aa434e8f270f96b2be859658950accde95a2f0ce79d
  t.deepEqual(await query(-2147483648), '00000080');
  t.deepEqual(await query(-2147483647), '01000080');
  t.deepEqual(await query(-2130706433), 'ffffff80'); // version of TX: 35e79ee733fad376e76d16d1f10088273c2f4c2eaba1374a837378a88e530005
  t.deepEqual(await query(-2107285824), 'c05e6582'); // version of TX: 637dd1a3418386a418ceeac7bb58633a904dbf127fa47bbea9cc8f86fef7413f
  t.deepEqual(await query(-1703168784), 'f0b47b9a'); // version of TX: c659729a7fea5071361c2c1a68551ca2bf77679b27086cc415adeeb03852e369
  /* eslint-enable @typescript-eslint/no-magic-numbers, line-comment-position */
});

test('[e2e] [postgres] encode_uint64le', async (t) => {
  const query = async (encoded: bigint | number) =>
    (
      await client.query<{ encode: string }>(
        /* sql */ `SELECT encode(encode_uint64le ($1), 'hex');`,
        [encoded]
      )
    ).rows[0]!.encode;
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  t.deepEqual(await query(0), '0000000000000000');
  t.deepEqual(await query(1), '0100000000000000');
  t.deepEqual(await query(2), '0200000000000000');
  t.deepEqual(await query(254), 'fe00000000000000');
  t.deepEqual(await query(255), 'ff00000000000000');
  t.deepEqual(await query(256), '0001000000000000');
  t.deepEqual(await query(1000), 'e803000000000000');
  t.deepEqual(await query(65534), 'feff000000000000');
  t.deepEqual(await query(65535), 'ffff000000000000');
  t.deepEqual(await query(0xffffffff), 'ffffffff00000000');
  t.deepEqual(await query(BigInt('0xffffffffffff')), 'ffffffffffff0000');
  t.deepEqual(await query(BigInt('9223372036854775807')), 'ffffffffffffff7f');
  /* eslint-enable @typescript-eslint/no-magic-numbers */
});

test('[e2e] [postgres] encode_compact_uint', async (t) => {
  const query = async (encoded: bigint | number) =>
    (
      await client.query<{ encode: string }>(
        /* sql */ `SELECT encode(encode_compact_uint ($1), 'hex');`,
        [encoded]
      )
    ).rows[0]!.encode;
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  t.deepEqual(await query(0), '00');
  t.deepEqual(await query(1), '01');
  t.deepEqual(await query(2), '02');
  t.deepEqual(await query(251), 'fb');
  t.deepEqual(await query(252), 'fc');
  // cspell: disable-next-line
  t.deepEqual(await query(253), 'fdfd00');
  // cspell: disable-next-line
  t.deepEqual(await query(254), 'fdfe00');
  // cspell: disable-next-line
  t.deepEqual(await query(255), 'fdff00');
  t.deepEqual(await query(256), 'fd0001');
  // cspell: disable-next-line
  t.deepEqual(await query(65534), 'fdfeff');
  // cspell: disable-next-line
  t.deepEqual(await query(65535), 'fdffff');
  t.deepEqual(await query(65536), 'fe00000100');
  t.deepEqual(await query(65537), 'fe01000100');
  t.deepEqual(await query(65538), 'fe02000100');
  // cspell: disable-next-line
  t.deepEqual(await query(4294967294), 'fefeffffff');
  // cspell: disable-next-line
  t.deepEqual(await query(4294967295), 'feffffffff');
  t.deepEqual(await query(4294967296), 'ff0000000001000000');
  t.deepEqual(await query(4294967297), 'ff0100000001000000');
  t.deepEqual(await query(4294967298), 'ff0200000001000000');
  t.deepEqual(await query(BigInt('9223372036854775806')), 'fffeffffffffffff7f');
  t.deepEqual(await query(BigInt('9223372036854775807')), 'ffffffffffffffff7f');
  /* eslint-enable @typescript-eslint/no-magic-numbers */
});
