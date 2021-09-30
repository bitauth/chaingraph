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

  constructor(initialState: InitialSyncState) {
    this.fullySyncedUpToHeight = initialState.fullySyncedUpToHeight;
    this.pendingSyncOfHeights = initialState.pendingSyncOfHeights.slice();
    this.additionalSyncedHeights = initialState.additionalSyncedHeights.slice();
  }

  markHeightAsSynced(height: number) {
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
