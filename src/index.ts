import { createServer } from 'http';

import { decodeTransaction, hashTransaction, hexToBin } from '@bitauth/libauth';
import bitcoreP2pCash from '@chaingraph/bitcore-p2p-cash';

import { Agent, cancelableDelay } from './agent.js';
import { chaingraphInternalApiPort } from './config.js';
import { instantiateLogger } from './logging.js';

const logger = instantiateLogger();
logger.info(`Starting Chaingraph...`);

const shutdownTasks = [] as (() => void)[];
const agent = new Agent({
  logger,
  onShutdown: () => {
    shutdownTasks.forEach((task) => {
      logger.debug('Running shutdown tasks...');
      task();
    });
  },
});

const enum StatusCode {
  success = 200,
  badRequest = 400,
  notFound = 404,
  gatewayTimeout = 504,
}
/* eslint-disable @typescript-eslint/naming-convention, camelcase */
const headers = { 'Content-Type': 'application/json' };

interface HasuraActionRequest<Input> {
  action: { name: string };
  input: Input;
  request_query: string;
  session_variables: {
    'x-hasura-role': 'admin' | 'public';
  };
}

type SendTransactionRequest = HasuraActionRequest<{
  request: {
    encoded_hex: string;
    node_internal_id: number;
  };
}>;

/**
 * The internal API is used by Kubernetes to monitor the health of the agent,
 * and it's also used by Hasura actions to support mutations, namely
 * `send_transaction`. Note, this API should never be directly exposed to the
 * public, it is called only by other internal services.
 */
const internalApi = createServer((req, res) => {
  // eslint-disable-next-line functional/no-let
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  // eslint-disable-next-line complexity
  req.on('end', () => {
    switch (req.url) {
      case '/health-check':
        res.writeHead(StatusCode.success, headers);
        res.end('{"status":"alive"}');
        logger.trace('[API] /health-check: returned status "alive" (200)');
        return;
      case '/send-transaction':
        // eslint-disable-next-line functional/no-try-statement
        try {
          const {
            input: {
              request: { encoded_hex, node_internal_id },
            },
          } = JSON.parse(body) as SendTransactionRequest;
          if (typeof encoded_hex !== 'string') {
            res.writeHead(StatusCode.badRequest, headers);
            res.end(`{"message":"'encoded_hex' must be a string"}`);
            logger.trace(
              `[API] /send-transaction: error - 'encoded_hex' must be a string`
            );
            return;
          }
          if (typeof node_internal_id !== 'number') {
            res.writeHead(StatusCode.badRequest, headers);
            res.end(`{"message":"'node_internal_id' must be a number"}`);
            logger.trace(
              `[API] /send-transaction: error - 'node_internal_id' must be a number`
            );
            return;
          }
          const raw = hexToBin(encoded_hex);
          const transactionHash = hashTransaction(raw);
          const result = decodeTransaction(raw);
          const validationResults = {
            transaction_hash: transactionHash,
            ...(typeof result === 'string'
              ? {
                  validation_error_message: result,
                  validation_success: false,
                }
              : { validation_success: true }),
          };
          const [nodeName, node] =
            agent.nodesByInternalId[node_internal_id] ?? [];
          if (
            nodeName === undefined ||
            node === undefined ||
            node.peerTxBroadcastConnection.status !== 'ready'
          ) {
            res.writeHead(StatusCode.success, headers);
            res.end(
              JSON.stringify({
                ...validationResults,
                transmission_error_message: `Unable to connect to the requested node (node_internal_id: ${Number(
                  node_internal_id
                )}).`,
                transmission_success: false,
              })
            );
            if (node === undefined) {
              logger.trace(
                `[API] /send-transaction: error - ${node_internal_id} is not a valid node_internal_id.`
              );
              return;
            }
            logger.trace(
              `[API] /send-transaction: error - not connected to node ${node_internal_id} (name: ${nodeName!}, subversion: ${
                node.peerTxBroadcastConnection.subversion
              })`
            );
            return;
          }
          // eslint-disable-next-line functional/no-let
          let transmission_success = true;
          // eslint-disable-next-line functional/no-try-statement
          try {
            node.peerTxBroadcastConnection.sendMessage(
              new node.peerTxBroadcastConnection.messages.Transaction(
                new bitcoreP2pCash.internalBitcore.Transaction(encoded_hex)
              )
            );
          } catch {
            transmission_success = false;
          }
          res.writeHead(StatusCode.success, headers);
          res.end(
            JSON.stringify({ ...validationResults, transmission_success })
          );
          if (validationResults.validation_success) {
            logger.debug(
              `[API] /send-transaction: sent transaction ${transactionHash} to node ${node_internal_id} (subversion: ${node.peerTxBroadcastConnection.subversion}).`
            );
          } else {
            logger.debug(
              `[API] /send-transaction: attempted to send transaction that failed validation (${transactionHash}) to node ${node_internal_id} (subversion: ${node.peerTxBroadcastConnection.subversion}).`
            );
            logger.trace({ encoded_hex, validationResults });
          }
        } catch {
          res.writeHead(StatusCode.badRequest, headers);
          res.end('{"message":"malformed request"}');
          logger.warn(
            `[API] /send-transaction: malformed request. Body: ${body}`
          );
        }
        return;
      default:
        res.writeHead(StatusCode.notFound, headers);
        res.end('{"error":"not found"}');
        logger.warn(`[API] issued 404 for req.url: ${req.url!}`);
    }
  });
});
/* eslint-enable @typescript-eslint/naming-convention, camelcase */

// eslint-disable-next-line functional/no-let
let shutdownStarted = false;
const shutdown = (exitCode: 0 | 1) => {
  logger[exitCode === 1 ? 'fatal' : 'info']('Shutting down...');
  if (shutdownStarted) {
    logger.fatal('Shutdown called after shutdown began.');
    return;
  }
  shutdownStarted = true;
  const seconds = 1_000;
  const shutdownDelaySeconds = 20;
  const shutdownDelay = shutdownDelaySeconds * seconds;
  process.exitCode = exitCode;

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
      logger.fatal(
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
process.on('uncaughtException', (err) => {
  logger.fatal(err, 'uncaughtException');
  shutdown(1);
});
process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'unhandledRejection');
  shutdown(1);
});
internalApi.on('error', (err) => {
  logger.fatal(err, `Internal API server error.`);
  shutdown(1);
});
internalApi.listen(chaingraphInternalApiPort);
logger.info(`Internal API listening at port ${chaingraphInternalApiPort}...`);
shutdownTasks.push(() => {
  internalApi.close(() => {
    logger.info('Internal API server terminated.');
  });
});
