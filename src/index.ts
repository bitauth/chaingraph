import { createServer } from 'http';

import { Agent, cancelableDelay } from './agent';
import { chaingraphHealthCheckPort } from './config';
import { logger } from './logging';

logger.info(`Starting Chaingraph...`);

const healthCheck = createServer((_, res) => {
  const successCode = 200;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  res.writeHead(successCode, { 'Content-Type': 'text/plain' });
  res.end('OK');
});
healthCheck.listen(chaingraphHealthCheckPort);
logger.info(`Health check listening at port ${chaingraphHealthCheckPort}...`);

const endHealthCheck = () => {
  healthCheck.close(() => {
    logger.info('Health check terminated.');
  });
};

const agent = new Agent({ onShutdown: endHealthCheck });

const shutdown = (exitCode: 0 | 1) => {
  const seconds = 1_000;
  const shutdownDelaySeconds = 20;
  const shutdownDelay = shutdownDelaySeconds * seconds;
  process.exitCode = exitCode;
  logger.info('Shutting down...');
  const forcedShutdownTimer = cancelableDelay(shutdownDelay);
  Promise.race([
    agent.shutdown().then(async () => Promise.resolve(true)),
    forcedShutdownTimer.completed.then(async () => Promise.resolve(false)),
  ])
    .then(async (success) => {
      if (success) {
        forcedShutdownTimer.cancel();
        return;
      }
      logger.error(
        `Failed to shutdown after ${shutdownDelaySeconds} seconds. Forcing exit...`
      );
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    })
    .catch(logger.error);
};

const gracefulExit = (signal: string) => {
  logger.info(`Exit Signal: ${signal}`);
  shutdown(0);
};
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
process.on('uncaughtException', (err: Error) => {
  logger.error(err, 'uncaughtException');
  shutdown(1);
});
process.on('unhandledRejection', (err: Error) => {
  logger.error(err, 'unhandledRejection');
  shutdown(1);
});
