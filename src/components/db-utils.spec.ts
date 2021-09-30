/* eslint-disable camelcase, @typescript-eslint/naming-convention */
import test from 'ava';

import { computeIndexCreationProgress, indexDefinitions } from './db-utils';

test('computeIndexCreationProgress: single index, phase: "building index: scanning table" 10%', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '5714116',
      blocks_total: '22856465',
      query: indexDefinitions.spent_by_index,
      tuples_done: '0',
      tuples_total: '0',
    },
  ]);
  t.deepEqual(result, [['spent_by_index', '10']]);
});

test('computeIndexCreationProgress: single index, phase: "building index: scanning table" 20%', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '11428232',
      blocks_total: '22856465',
      query: indexDefinitions.spent_by_index,
      tuples_done: '0',
      tuples_total: '0',
    },
  ]);
  t.deepEqual(result, [['spent_by_index', '20']]);
});

test('computeIndexCreationProgress: single index, phase: "building index: sorting live tuples"', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '0',
      blocks_total: '0',
      query: indexDefinitions.spent_by_index,
      tuples_done: '0',
      tuples_total: '816150325',
    },
  ]);
  t.deepEqual(result, [['spent_by_index', '4*']]);
});

test('computeIndexCreationProgress: single index, phase: "building index: loading tuples in tree" 70%', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '0',
      blocks_total: '0',
      query: indexDefinitions.spent_by_index,
      tuples_done: '408075162',
      tuples_total: '816150325',
    },
  ]);
  t.deepEqual(result, [['spent_by_index', '70']]);
});

test('computeIndexCreationProgress: unknown index', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '50',
      blocks_total: '100',
      query: 'CREATE INDEX unknown_index ON something_else (column_name);',
      tuples_done: '0',
      tuples_total: '0',
    },
  ]);
  t.deepEqual(result, []);
});

test('computeIndexCreationProgress: multiple indexes', async (t) => {
  const result = computeIndexCreationProgress([
    {
      blocks_done: '30',
      blocks_total: '80',
      query: indexDefinitions.block_height_index,
      tuples_done: '0',
      tuples_total: '0',
    },
    {
      blocks_done: '60',
      blocks_total: '80',
      query: indexDefinitions.spent_by_index,
      tuples_done: '0',
      tuples_total: '0',
    },
    {
      blocks_done: '50',
      blocks_total: '100',
      query: 'CREATE INDEX unknown_index ON something_else (column_name);',
      tuples_done: '0',
      tuples_total: '0',
    },
  ]);
  t.deepEqual(result, [
    ['block_height_index', '15'],
    ['spent_by_index', '30'],
  ]);
});
