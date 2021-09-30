/**
 * Note: this file only logs to STDOUT and STDERR, as logging relies on the
 * `CHAINGRAPH_LOG_PATH` configuration.
 */
import { readFileSync } from 'fs';
import { isIP } from 'net';
import { homedir } from 'os';
import { join, resolve } from 'path';

import { binToHex, hexToBin, isHex } from '@bitauth/libauth';
import dotenv from 'dotenv';

import { version } from '../package.json';

import { bitcoreBlockToChaingraphBlock, messages } from './bitcore';
import type { ChaingraphBlock } from './types/chaingraph';

const dotEnvConfig = dotenv.config();
if (dotEnvConfig.parsed === undefined) {
  const error = dotEnvConfig.error ?? new Error('Unknown dotenv error.');
  // eslint-disable-next-line functional/no-throw-statement
  throw error;
}
const defaults = dotenv.parse(
  readFileSync(resolve(__filename, '../../defaults.env'))
);

const configuration = {
  ...defaults,
  ...dotEnvConfig.parsed,
  ...process.env,
} as {
  [x: string]: string | undefined;
};

const expectedOptions = [
  'CHAINGRAPH_BLOCK_BUFFER_TARGET_SIZE_MB',
  'CHAINGRAPH_GENESIS_BLOCKS',
  'CHAINGRAPH_HEALTH_CHECK_PORT',
  'CHAINGRAPH_LOG_FIREHOSE',
  'CHAINGRAPH_LOG_LEVEL_STDOUT',
  'CHAINGRAPH_LOG_PATH',
  'CHAINGRAPH_POSTGRES_CONNECTION_STRING',
  'CHAINGRAPH_POSTGRES_MAX_CONNECTIONS',
  'CHAINGRAPH_TRUSTED_NODES',
  'CHAINGRAPH_USER_AGENT',
  'NODE_ENV',
] as const;
const requireStringValues = (
  conf: { [x: string]: string | undefined },
  keys: typeof expectedOptions
): conf is { [key in typeof expectedOptions[number]]: string } => {
  const missing = keys.find((key) => typeof conf[key] !== 'string');
  if (missing !== undefined) {
    // eslint-disable-next-line no-console
    console.error(`\n\nERROR: missing variable: ${missing}\n\n`);
    return false;
  }
  return true;
};
if (!requireStringValues(configuration, expectedOptions)) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error('Missing expected environment variable.');
}

/**
 * Set via the `CHAINGRAPH_POSTGRES_CONNECTION_STRING` environment variable.
 */
const postgresConnectionString =
  configuration.CHAINGRAPH_POSTGRES_CONNECTION_STRING;

/**
 * Set via the `CHAINGRAPH_BLOCK_BUFFER_TARGET_SIZE_MB` environment variable.
 */
const blockBufferTargetSizeMB = Number(
  configuration.CHAINGRAPH_BLOCK_BUFFER_TARGET_SIZE_MB
);
if (isNaN(blockBufferTargetSizeMB) || blockBufferTargetSizeMB <= 0) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(
    'The CHAINGRAPH_BLOCK_BUFFER_TARGET_SIZE_MB environment variable must be greater than 0.'
  );
}

/**
 * Set via the `CHAINGRAPH_POSTGRES_MAX_CONNECTIONS` environment variable.
 */
const postgresMaxConnections = Number(
  configuration.CHAINGRAPH_POSTGRES_MAX_CONNECTIONS
);
if (!Number.isInteger(postgresMaxConnections) || postgresMaxConnections < 1) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(
    'The CHAINGRAPH_POSTGRES_MAX_CONNECTIONS environment variable must be a number greater than 0.'
  );
}

const extendTildeAndResolvePath = (path: string) =>
  path.startsWith('~')
    ? resolve(join(homedir(), path.slice(1)))
    : resolve(path);
const disabled = 'false';
/**
 * Set via the `CHAINGRAPH_LOG_PATH` environment variable. The tilde character
 * (`~`) is expanded via `os.homedir()`, and all paths are `path.resolve()`ed. A
 * value of `false` disables logging to files.
 */
const chaingraphLogPath =
  configuration.CHAINGRAPH_LOG_PATH === disabled
    ? false
    : extendTildeAndResolvePath(configuration.CHAINGRAPH_LOG_PATH);

const allowedLevels = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;
const isValidLoggingLevel = (
  level: string
): level is typeof allowedLevels[number] =>
  allowedLevels.includes(level as unknown as typeof allowedLevels[number]);

if (!isValidLoggingLevel(configuration.CHAINGRAPH_LOG_LEVEL_STDOUT)) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(
    `Invalid level provided in the 'CHAINGRAPH_LOG_LEVEL_STDOUT' environment variable: ${
      configuration.CHAINGRAPH_LOG_LEVEL_STDOUT
    }. Must be one of the following: ${allowedLevels.join(', ')}`
  );
}
/**
 * Set via the `CHAINGRAPH_LOG_LEVEL_STDOUT` environment variable.
 */
const chaingraphLogLevelStdout = configuration.CHAINGRAPH_LOG_LEVEL_STDOUT;

if (
  configuration.CHAINGRAPH_LOG_FIREHOSE.toLowerCase() !== 'true' &&
  configuration.CHAINGRAPH_LOG_FIREHOSE.toLowerCase() !== 'false'
) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(
    `Invalid value provided in the 'CHAINGRAPH_LOG_FIREHOSE' environment variable: ${configuration.CHAINGRAPH_LOG_FIREHOSE}. Must be one of the following: true, false`
  );
}
/**
 * Set via the `CHAINGRAPH_LOG_FIREHOSE` environment variable.
 */
const chaingraphLogFirehose = configuration.CHAINGRAPH_LOG_FIREHOSE === 'true';

const networkMagicHexLength = 8;
/**
 * `0xe3e1f3e8` – from `utf8ToBin('cash').map(x => x | 128)`
 */
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const networkMagicBchMainnet = Uint8Array.from([0xe3, 0xe1, 0xf3, 0xe8]);
/**
 * `0xdab5bffa` (origin currently unknown)
 */
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const networkMagicBchTestnet = Uint8Array.from([0xda, 0xb5, 0xbf, 0xfa]);
// eslint-disable-next-line complexity
const validateNetworkMagic = (input: string) => {
  const magicBytes =
    input === 'main'
      ? networkMagicBchMainnet
      : input === 'test'
      ? networkMagicBchTestnet
      : isHex(input) && input.length === networkMagicHexLength
      ? hexToBin(input)
      : undefined;
  if (magicBytes === undefined) {
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(
      'Improperly formatted network magic bytes. Must be `main`, `test`, or 4 hex-encoded bytes, e.g. `e3e1f3e8`.'
    );
  }
  return binToHex(magicBytes);
};

/**
 * Set via the `CHAINGRAPH_GENESIS_BLOCKS` environment variable.
 *
 * The `genesisBlocks` map is guaranteed to include the genesis block for every
 * network used by `trustedNodes` (an error is thrown at startup if any trusted
 * nodes reference a `NETWORK` for which the genesis block is unknown).
 */
const genesisBlocks = configuration.CHAINGRAPH_GENESIS_BLOCKS.split(
  ','
).reduce<{
  [networkMagicHex: string]: ChaingraphBlock;
}>((all, entry) => {
  const [networkMagicHex, hex] = entry.split(':');
  if (networkMagicHex.length !== networkMagicHexLength) {
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(
      `Improperly formatted 'CHAINGRAPH_GENESIS_BLOCKS' environment variable.

Expected format: NETWORK_MAGIC:RAW_GENESIS_BLOCK_HEX,NETWORK_MAGIC:RAW_GENESIS_BLOCK_HEX,...
E.g.: ${defaults.CHAINGRAPH_GENESIS_BLOCKS}

Invalid segment: ${entry}`
    );
  }
  return {
    ...all,
    [networkMagicHex]: bitcoreBlockToChaingraphBlock(
      messages.Block.fromBuffer(Buffer.from(hexToBin(hex))).block,
      0
    ),
  };
}, {});

/**
 * Derived from the `CHAINGRAPH_TRUSTED_NODES` environment variable. Format:
 * `NODE_NAME:IP_ADDRESS:PORT_NUMBER:NETWORK`, nodes are separated by commas.
 * NETWORK may be provided as `main` (0xe3e1f3e8), `test` (0xdab5bffa), or 4
 * hex-encoded "magic bytes", e.g. `e3e1f3e8`.
 *
 * E.g. `TRUSTED_NODES=bchn:127.0.0.1:8333:main,bchd:127.0.0.1:8334:main`
 */
const trustedNodes = configuration.CHAINGRAPH_TRUSTED_NODES.split(',').map(
  // eslint-disable-next-line complexity
  (node) => {
    const parts = node.split(':');
    const expectedParts = 4;
    const [name, ip, portString, networkMagic] = parts;
    const networkMagicHex = validateNetworkMagic(networkMagic);
    if (!Object.keys(genesisBlocks).includes(networkMagicHex)) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        `The 'CHAINGRAPH_TRUSTED_NODES' environment variable references a 'NETWORK' for which the genesis block is unknown: 0x${networkMagicHex}. Please provide the missing genesis block using the 'CHAINGRAPH_GENESIS_BLOCKS' environment variable.`
      );
    }
    const port = parseInt(portString, 10);
    if (
      parts.length !== expectedParts ||
      parts.every((part) => typeof part !== 'string') ||
      isIP(ip) === 0 ||
      isNaN(port)
    ) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        `Improperly formatted 'CHAINGRAPH_TRUSTED_NODES' environment variable.

Expected format: NODE_NAME:IP_ADDRESS:PORT_NUMBER:NETWORK,NODE_NAME:IP_ADDRESS:PORT_NUMBER:NETWORK,...
E.g.: TRUSTED_NODES=bchn:127.0.0.1:8333:main,bchd:127.0.0.1:8334:e3e1f3e8

Invalid segment: ${node}`
      );
    }
    return {
      /**
       * The IP address of this trusted node.
       */
      ip,
      /**
       * The name of this trusted node – used as a stable identifier between
       * restarts.
       */
      name,
      /**
       * The "network magic" expected by this node's P2P network interface.
       */
      networkMagicHex,
      /**
       * The listening port of this trusted node.
       */
      port,
    };
  }
);

/**
 * Set via the `CHAINGRAPH_HEALTH_CHECK_PORT` environment variable.
 */
const chaingraphHealthCheckPort = Number(
  configuration.CHAINGRAPH_HEALTH_CHECK_PORT
);
if (isNaN(chaingraphHealthCheckPort)) {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error('CHAINGRAPH_HEALTH_CHECK_PORT must be a number.');
}

/**
 * Can be overridden via the `CHAINGRAPH_USER_AGENT` environment variable.
 */
const chaingraphUserAgent =
  configuration.CHAINGRAPH_USER_AGENT === ''
    ? `/chaingraph:${version}/`
    : configuration.CHAINGRAPH_USER_AGENT;

/**
 * `true` if the `NODE_ENV` environment variable is `production`.
 */
const isProduction = configuration.NODE_ENV === 'production';

export {
  blockBufferTargetSizeMB,
  chaingraphHealthCheckPort,
  chaingraphLogFirehose,
  chaingraphLogPath,
  chaingraphLogLevelStdout,
  chaingraphUserAgent,
  genesisBlocks,
  postgresMaxConnections,
  postgresConnectionString,
  isProduction,
  trustedNodes,
};
