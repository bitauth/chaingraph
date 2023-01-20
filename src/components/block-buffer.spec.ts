/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';

import type { ChaingraphBlock } from '../types/chaingraph.js';

import { BlockBuffer } from './block-buffer.js';

const oneMB = 1_000_000;
const maxExpectedBlockMB = oneMB;

const fakeBlock = (size: number) => ({ sizeBytes: size } as ChaingraphBlock);

test('BlockBuffer: general use', (t) => {
  const fake1Size = 1_000;
  const fake1 = fakeBlock(fake1Size);
  const fake2Size = 2_000;
  const fake2 = fakeBlock(fake2Size);
  const fake3Size = 10_000;
  const fake3 = fakeBlock(fake3Size);
  const fake4Size = 4_000;
  const fake4 = fakeBlock(fake4Size);
  const totalSize = fake1Size + fake2Size + fake3Size + fake4Size;

  const frees = 9;
  const otherAssertions = 14;
  t.plan(otherAssertions + frees);
  // eslint-disable-next-line functional/no-let
  let freedSpaceCallbackCalled = 0;
  const blockBuffer = new BlockBuffer({
    freedSpaceCallback: () => {
      freedSpaceCallbackCalled += 1;
      t.log(`freedSpaceCallback called: ${freedSpaceCallbackCalled}`);
      t.pass();
    },
    targetSize: totalSize,
  });

  blockBuffer.reserveBlock();
  blockBuffer.reserveBlock();
  blockBuffer.reserveBlock();
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), 3 * maxExpectedBlockMB);
  t.true(blockBuffer.isFull());

  blockBuffer.addBlock(fake1);
  blockBuffer.releaseReservedBlock();
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), 3 * fake1Size);
  t.false(blockBuffer.isFull());

  blockBuffer.addBlock(fake2);
  blockBuffer.releaseReservedBlock();
  t.deepEqual(
    blockBuffer.currentlyAllocatedSize(),
    fake1Size + fake2Size + (fake1Size + fake2Size) / 2
  );

  blockBuffer.addBlock(fake3);
  blockBuffer.releaseReservedBlock();
  t.deepEqual(
    blockBuffer.currentlyAllocatedSize(),
    fake1Size + fake2Size + fake3Size
  );
  t.false(blockBuffer.isFull());

  blockBuffer.addBlock(fake4);
  t.true(blockBuffer.isFull());

  blockBuffer.removeBlock(fake1);
  blockBuffer.removeBlock(fake2);
  t.false(blockBuffer.isFull());

  const remaining = fake3Size + fake4Size;
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), remaining);

  blockBuffer.reserveBlock();
  blockBuffer.reserveBlock();
  const avg = remaining / 2;
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), remaining + avg * 2);
  t.true(blockBuffer.isFull());
  blockBuffer.releaseReservedBlock();
  blockBuffer.releaseReservedBlock();
  t.false(blockBuffer.isFull());
  blockBuffer.removeBlock(fake3);
  blockBuffer.removeBlock(fake4);
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), 0);
});

test('BlockBuffer: initial reservations require 1MB', (t) => {
  const blockBuffer = new BlockBuffer({
    freedSpaceCallback: () => {
      t.pass();
    },
    targetSize: oneMB,
  });
  blockBuffer.reserveBlock();
  t.deepEqual(blockBuffer.currentlyAllocatedSize(), maxExpectedBlockMB);
  t.true(blockBuffer.isFull());
});
