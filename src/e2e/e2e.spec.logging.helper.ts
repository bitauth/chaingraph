import { mkdirSync } from 'fs';
import { dirname } from 'path';

import pino from 'pino';

export const chaingraphE2eLogPath = 'data/chaingraph/log-e2e.ndjson';

const directory = dirname(chaingraphE2eLogPath);
mkdirSync(directory, { recursive: true });

export const logger = pino(
  { level: 'trace', name: 'e2e-logger' },
  pino.destination(chaingraphE2eLogPath)
);
