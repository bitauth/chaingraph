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
      tokenData?: {
        amount: string;
        category: string;
        nft?: {
          capability: 'minting' | 'mutable' | 'none';
          commitment: string;
        };
      };
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
      tokenData?: {
        amount: string;
        category: string;
        nft?: {
          capability: 'minting' | 'mutable' | 'none';
          commitment: string;
        };
      };
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

  interface Network {
    readonly name: string;
    readonly alias: string;
    readonly pubkeyhash: number;
    readonly privatekey: number;
    readonly scripthash: number;
    readonly xpubkey: number;
    readonly xprivkey: number;
    readonly prefix: string;
    readonly prefixArray: number[];
    readonly networkMagic: number;
    readonly port: number;
    readonly dnsSeeds: string[];
  }

  export namespace Networks {
    function add(data: Partial<Network>): Network;
    function remove(network: Network): void;
    function get(nameOrAlias: string): Network;
  }
}
