import { mkdirSync } from 'fs';
import { dirname } from 'path';

import type P from 'pino';
import pino from 'pino';
import pinoMultiStream from 'pino-multi-stream';

// TODO: upgrade Pino after resolved: https://github.com/pinojs/pino/issues/1138

import {
  chaingraphLogLevelStdout,
  chaingraphLogPath,
  isProduction,
} from './config';

if (typeof chaingraphLogPath === 'string') {
  const directory = dirname(chaingraphLogPath);
  mkdirSync(directory, { recursive: true });
}

const stdout = isProduction
  ? pino.destination(1)
  : pinoMultiStream.prettyStream({
      prettyPrint: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l Z',
      },
    });
export const logger: P.Logger = pinoMultiStream({
  streams:
    chaingraphLogPath === false
      ? [{ level: chaingraphLogLevelStdout, stream: stdout }]
      : [
          { level: chaingraphLogLevelStdout, stream: stdout },
          { level: 'trace', stream: pino.destination(chaingraphLogPath) },
        ],
});

switch (chaingraphLogLevelStdout) {
  case 'fatal':
    logger.fatal(`Logging level set to: fatal`);
    break;
  case 'error':
    logger.error(`Logging level set to: error`);
    break;
  case 'warn':
    logger.warn(`Logging level set to: warn`);
    break;
  case 'info':
    logger.info(`Logging level set to: info`);
    break;
  case 'debug':
    logger.debug(`Logging level set to: debug`);
    break;
  case 'trace':
    logger.trace(`Logging level set to: trace`);
    break;
}

if (chaingraphLogPath !== false) {
  logger.debug(`Also logging at level 'trace' to: ${chaingraphLogPath}`);
}

export { pino };
