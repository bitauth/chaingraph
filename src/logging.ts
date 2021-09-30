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
      ? [{ stream: stdout }]
      : [
          { level: chaingraphLogLevelStdout, stream: stdout },
          { level: 'trace', stream: pino.destination(chaingraphLogPath) },
        ],
});

export { pino };
