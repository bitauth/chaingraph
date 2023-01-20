import type { ChaingraphBlock } from '../types/chaingraph.js';

export class BlockBuffer {
  targetSizeBytes: number;

  bufferedBlocks = [] as ChaingraphBlock[];

  reservedBlocks = 0;

  isDraining = false;

  drainPromise: Promise<void>;

  drainResolve!: () => void;

  freedSpaceCallback: () => void;

  constructor(config: { targetSize: number; freedSpaceCallback: () => void }) {
    this.targetSizeBytes = config.targetSize;
    this.freedSpaceCallback = config.freedSpaceCallback;

    this.drainPromise = new Promise((resolve) => {
      this.drainResolve = resolve;
    });
  }

  checkDrainStatus() {
    if (this.isDraining && this.count() === 0) {
      this.drainResolve();
    }
  }

  async drain() {
    this.isDraining = true;
    this.checkDrainStatus();
    return this.drainPromise;
  }

  freedSpace() {
    this.checkDrainStatus();
    this.freedSpaceCallback();
  }

  /**
   * Add a block to the buffer.
   * @param block - the block to add
   */
  addBlock(block: ChaingraphBlock) {
    this.bufferedBlocks.push(block);
  }

  count() {
    return this.bufferedBlocks.length;
  }

  /**
   * Remove a block which was previously added to the buffer.
   * @param block - a reference to the block
   */
  removeBlock(block: ChaingraphBlock) {
    this.bufferedBlocks.splice(this.bufferedBlocks.indexOf(block), 1);
    this.freedSpace();
  }

  /**
   * Reserve space for a block which is being downloaded.
   */
  reserveBlock() {
    this.reservedBlocks += 1;
  }

  /**
   * Release a space reserved by `reserveBlock`.
   */
  releaseReservedBlock() {
    this.reservedBlocks -= 1;
    this.freedSpace();
  }

  currentTotalBytes() {
    return this.bufferedBlocks.reduce(
      (totalBytes, block) => totalBytes + block.sizeBytes,
      0
    );
  }

  currentlyAllocatedSize() {
    /**
     * Used before any blocks are buffered. To avoid consuming more than the
     * target memory amount of memory on startup, this value should be set to
     * the maximum expected block size.
     *
     * After blocks have been downloaded, the expected size of each next block
     * is the average of all currently buffered blocks.
     *
     * TODO: future proofing: `assumedMaxBlockSize` should be 32MB, but setting it that high currently causes intermittent e2e test failures when `this.count()` is `0` and reservations take up all available space. There may be a bug with reservations not being released.
     */
    const assumedMaxBlockSize = 1_000_000;
    const currentTotal = this.currentTotalBytes();
    const currentLength = this.bufferedBlocks.length;
    const averageBlock =
      currentLength === 0
        ? assumedMaxBlockSize
        : Math.ceil(currentTotal / currentLength);
    const reservedSpace = averageBlock * this.reservedBlocks;
    return currentTotal + reservedSpace;
  }

  isFull() {
    return this.currentlyAllocatedSize() >= this.targetSizeBytes;
  }
}
