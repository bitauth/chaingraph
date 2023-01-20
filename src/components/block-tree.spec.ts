/* eslint-disable @typescript-eslint/no-magic-numbers */
import { range } from '@bitauth/libauth';
import test from 'ava';

import { selectHeaderLocatorHashes } from './block-tree.js';

test('selectHeaderLocatorHashes', async (t) => {
  const testLength = 654247;
  const headerChain = range(testLength);
  /**
   * Expected heights produced by the Satoshi implementation at height 654247.
   */
  // prettier-ignore
  const expected = [654246, 654245, 654244, 654243, 654242, 654241, 654240, 654239, 654238, 654237, 654236, 654235, 654233, 654229, 654221, 654205, 654173, 654109, 653981, 653725, 653213, 652189, 650141, 646045, 637853, 621469, 588701, 523165, 392093, 129949, 0];
  t.deepEqual(selectHeaderLocatorHashes(headerChain), expected);
});

test('selectHeaderLocatorHashes: single', async (t) => {
  const headerChain = range(1);
  const expected = [0];
  t.deepEqual(selectHeaderLocatorHashes(headerChain), expected);
});

test('selectHeaderLocatorHashes: `10`', async (t) => {
  const headerChain = range(10);
  const expected = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  t.deepEqual(selectHeaderLocatorHashes(headerChain), expected);
});

test('selectHeaderLocatorHashes: `100`', async (t) => {
  const headerChain = range(100);
  // prettier-ignore
  const expected = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 86, 82, 74, 58, 26, 0];
  t.deepEqual(selectHeaderLocatorHashes(headerChain), expected);
});
