import { mkdirSync } from 'fs';
import { dirname } from 'path';

import { pino } from 'pino';

import {
  chaingraphLogLevelPath,
  chaingraphLogLevelStdout,
  chaingraphLogPath,
  isProduction,
} from './config.js';

/**
 * Enables the logger to be easily imported in components for debugging; not
 * accessible until after `instantiateLogger` has been called.
 */
export const instances: { logger?: pino.BaseLogger } = {};

// eslint-disable-next-line complexity
export const instantiateLogger = () => {
  if (typeof chaingraphLogPath === 'string') {
    const directory = dirname(chaingraphLogPath);
    mkdirSync(directory, { recursive: true });
  }

  const pathLevel = pino.levels.values[chaingraphLogLevelPath]!;
  const stdoutLevel = pino.levels.values[chaingraphLogLevelStdout]!;
  const minLevel =
    pathLevel < stdoutLevel ? chaingraphLogLevelPath : chaingraphLogLevelStdout;

  const logger = pino(
    { level: minLevel },
    // TODO: fix pino types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    pino.transport({
      targets: [
        isProduction
          ? {
              level: chaingraphLogLevelStdout,
              options: { destination: '1' },
              target: 'pino/file',
            }
          : {
              level: chaingraphLogLevelStdout,
              options: {
                colorize: true,
                ignore: 'hostname',
                translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l Z',
              },
              target: 'pino-pretty',
            },
        ...(chaingraphLogPath === false
          ? []
          : [
              {
                level: chaingraphLogLevelPath,
                options: { destination: chaingraphLogPath },
                target: 'pino/file',
              },
            ]),
      ],
    })
  );

  logger.info(
    `Logging in ${
      isProduction ? 'production' : 'development'
    } mode at level '${chaingraphLogLevelStdout}'.`
  );

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
    logger.info(
      `Also logging at level '${chaingraphLogLevelPath}' to: ${chaingraphLogPath}`
    );
  }

  instances.logger = logger;
  return logger;
};
