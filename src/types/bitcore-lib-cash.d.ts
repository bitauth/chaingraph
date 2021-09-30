/* eslint-disable functional/no-mixed-type, max-classes-per-file */

declare module 'bitcore-lib-cash' {
  export interface BitcoreBlockHeaderObject {
    bits: number;
    hash: string;
    merkleRoot: Buffer;
    nonce: number;
    prevHash: Buffer;
    time: number;
    version: number;
  }

  export interface BitcoreTransactionObject {
    hash: string;
    inputs: {
      prevTxId: string;
      outputIndex: number;
      sequenceNumber: number;
      script: string;
    }[];
    nLockTime: number;
    outputs: {
      satoshis: number;
      script: string;
    }[];
    version: number;
  }

  export interface BitcoreTransactionObjectOptions {
    inputs: {
      prevTxId: Uint8Array | string;
      outputIndex: number;
      sequenceNumber: number;
      script: BitcoreScript | Uint8Array | string;
    }[];
    nLockTime: number;
    outputs: {
      satoshis: number;
      script: BitcoreScript | Uint8Array | string;
    }[];
    version: number;
  }

  export interface BitcoreBlockHeader {
    hash: string;
    prevHash: Buffer;
    toObject: () => BitcoreBlockHeaderObject;
  }

  export class BitcoreScript {
    toHex: () => string;
  }

  export class Transaction {
    toObject: () => BitcoreTransactionObject;

    toBuffer: () => Uint8Array;

    isCoinbase: () => boolean;

    hash: string;

    inputs: {
      prevTxId: string;
      outputIndex: number;
      sequenceNumber: number;
      script: BitcoreScript;
    }[];

    nLockTime: number;

    outputs: {
      satoshis: number;
      script: BitcoreScript;
    }[];

    version: number;

    constructor(hexOrObject: BitcoreTransactionObjectOptions | string);
  }

  export class Block {
    static fromObject: (contents: unknown) => Block;

    static fromString: (raw: string) => Block;

    toBuffer: () => Uint8Array;

    header: BitcoreBlockHeader;

    transactions: Transaction[];
  }
}
