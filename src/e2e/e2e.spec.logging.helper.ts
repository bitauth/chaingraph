import { mkdirSync } from 'fs';
import { dirname } from 'path';

import { pino } from 'pino';

const uniqueFiles = false as boolean;

export const chaingraphE2eLogPath = uniqueFiles
  ? `data/chaingraph/e2e/log_e2e_${new Date()
      .toISOString()
      .replace(/[-:.]/gu, '_')}.ndjson`
  : `data/chaingraph/log-e2e.ndjson`;

const directory = dirname(chaingraphE2eLogPath);
mkdirSync(directory, { recursive: true });

export const logger = pino(
  { level: 'trace', name: 'e2e-logger' },
  pino.destination(chaingraphE2eLogPath)
);
