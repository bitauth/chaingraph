/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';

import { SyncState } from './sync-state';

test('SyncState', (t) => {
  const state = new SyncState({
    additionalSyncedHeights: [],
    fullySyncedUpToHeight: 0,
    pendingSyncOfHeights: [],
  });
  state.markHeightAsPendingSync(1);
  state.markHeightAsPendingSync(2);
  state.markHeightAsPendingSync(3);
  t.deepEqual(state.pendingSyncOfHeights, [1, 2, 3]);
  t.deepEqual(state.getPendingSyncHeight(), 3);
  state.markHeightAsPendingSync(2);
  state.markHeightAsPendingSync(1);
  t.deepEqual(state.pendingSyncOfHeights, [1, 2, 3]);
  t.deepEqual(state.getPendingSyncHeight(), 3);
  state.markHeightAsSynced(2);
  state.markHeightAsSynced(2);
  state.markHeightAsPendingSync(5);
  t.deepEqual(state.fullySyncedUpToHeight, 0);
  t.deepEqual(state.pendingSyncOfHeights, [1, 3, 5]);
  t.deepEqual(state.additionalSyncedHeights, [2]);
  t.deepEqual(state.getPendingSyncHeight(), 3);
  state.markHeightAsSynced(1);
  state.markHeightAsPendingSync(4);
  t.deepEqual(state.fullySyncedUpToHeight, 2);
  t.deepEqual(state.pendingSyncOfHeights, [3, 5, 4]);
  t.deepEqual(state.additionalSyncedHeights, []);
  t.deepEqual(state.getPendingSyncHeight(), 5);
  state.markHeightAsSynced(1);
  state.markHeightAsPendingSync(5);
  t.deepEqual(state.fullySyncedUpToHeight, 2);
  t.deepEqual(state.pendingSyncOfHeights, [3, 5, 4]);
  t.deepEqual(state.additionalSyncedHeights, []);
  state.markHeightAsSynced(3);
  state.blockReorganizationAtHeight(4);
  t.deepEqual(state.fullySyncedUpToHeight, 3);
  t.deepEqual(state.pendingSyncOfHeights, []);
  t.deepEqual(state.additionalSyncedHeights, []);
  state.markHeightAsPendingSync(4);
  state.markHeightAsPendingSync(5);
  state.markHeightAsSynced(5);
  t.deepEqual(state.fullySyncedUpToHeight, 3);
  t.deepEqual(state.pendingSyncOfHeights, [4]);
  t.deepEqual(state.additionalSyncedHeights, [5]);
  state.blockReorganizationAtHeight(3);
  t.deepEqual(state.fullySyncedUpToHeight, 2);
  t.deepEqual(state.pendingSyncOfHeights, []);
  t.deepEqual(state.additionalSyncedHeights, []);
});
