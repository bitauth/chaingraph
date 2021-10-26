export interface InitialSyncState {
  fullySyncedUpToHeight: number;
  pendingSyncOfHeights: number[];
  additionalSyncedHeights: number[];
}

const removeValueIfPresent = (array: number[], value: number) => {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * A simple data structure to keep track of the known database syncing progress
 * for a particular node.
 */
export class SyncState {
  fullySyncedUpToHeight: number;

  pendingSyncOfHeights: number[];

  additionalSyncedHeights: number[];

  /**
   * The block time claimed by the latest synced block. Chaingraph assumes the
   * trusted node is itself not fully-synced if this time is older than 2 hours
   * (the consensus limit beyond which an inaccurate block time would render the
   * block invalid).
   *
   * As this value is used to estimate the sync progress of the trusted node, it
   * is not affected by block reorganizations.
   *
   * A value of 'caught-up' indicates to chaingraph that this node is not
   * actively syncing an unknown chain tip, and the sync state of this node can
   * be ignored when checking for initial sync completion. (If this node has
   * been synced or partially synced before, it will initialize with a value of
   * `caught-up` – if further syncing is required, this value will be quickly
   * replaced with the next synced block time.)
   *
   * A value of undefined indicates that this node has 1) not been synced
   * before, and 2) not yet successfully saved a block, so initial sync is not
   * complete.
   *
   * TODO: if other nodes were previously fully synced, initial sync should be skipped by default (to continue service for those nodes while the new node syncs)
   */
  latestSyncedBlockTime: Date | 'caught-up' | undefined;

  constructor(initialState: InitialSyncState) {
    this.fullySyncedUpToHeight = initialState.fullySyncedUpToHeight;
    this.pendingSyncOfHeights = initialState.pendingSyncOfHeights.slice();
    this.additionalSyncedHeights = initialState.additionalSyncedHeights.slice();
    this.latestSyncedBlockTime =
      initialState.fullySyncedUpToHeight > 0 ? 'caught-up' : undefined;
  }

  // eslint-disable-next-line complexity
  markHeightAsSynced(height: number, claimedBlockTime: Date | 'caught-up') {
    if (claimedBlockTime === 'caught-up') {
      this.latestSyncedBlockTime = 'caught-up';
    } else if (
      !(this.latestSyncedBlockTime instanceof Date) ||
      this.latestSyncedBlockTime < claimedBlockTime
    ) {
      this.latestSyncedBlockTime = claimedBlockTime;
    }

    if (
      this.fullySyncedUpToHeight < height &&
      !this.additionalSyncedHeights.includes(height)
    ) {
      this.additionalSyncedHeights.push(height);
      removeValueIfPresent(this.pendingSyncOfHeights, height);
    }

    // eslint-disable-next-line functional/no-let
    let nextHeight = this.fullySyncedUpToHeight + 1;
    // eslint-disable-next-line functional/no-loop-statement
    while (removeValueIfPresent(this.additionalSyncedHeights, nextHeight)) {
      this.fullySyncedUpToHeight = nextHeight;
      nextHeight += 1;
    }
  }

  markHeightAsPendingSync(height: number) {
    if (
      this.fullySyncedUpToHeight < height &&
      !this.pendingSyncOfHeights.includes(height) &&
      !this.additionalSyncedHeights.includes(height)
    ) {
      this.pendingSyncOfHeights.push(height);
    }
  }

  /**
   * Discard all syncing state at and above the provided height (any previous
   * syncing progress has been replaced by a new chain). The new
   * `fullySyncedUpToHeight` will be the block below this `height`.
   *
   * @param height - the height at which to begin discarding (inclusive)
   */
  blockReorganizationAtHeight(height: number) {
    this.fullySyncedUpToHeight =
      height > this.fullySyncedUpToHeight
        ? this.fullySyncedUpToHeight
        : height - 1;

    this.pendingSyncOfHeights = this.pendingSyncOfHeights.filter(
      (pending) => pending < height
    );
    this.additionalSyncedHeights = this.additionalSyncedHeights.filter(
      (completed) => completed < height
    );
  }

  /**
   * Get the current height which has been or is currently being synced. This is
   * useful for prioritizing syncing.
   */
  getPendingSyncHeight() {
    const handledHeights = [
      ...this.pendingSyncOfHeights,
      ...this.additionalSyncedHeights,
    ];
    // eslint-disable-next-line functional/no-let
    let firstUnhandledHeight = this.fullySyncedUpToHeight + 1;
    // eslint-disable-next-line functional/no-loop-statement
    while (handledHeights.includes(firstUnhandledHeight)) {
      firstUnhandledHeight += 1;
    }
    return firstUnhandledHeight - 1;
  }
}
