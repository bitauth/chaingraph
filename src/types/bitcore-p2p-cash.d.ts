/* eslint-disable max-classes-per-file, @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */

declare module '@chaingraph/bitcore-p2p-cash' {
  import { EventEmitter } from 'events';

  import type {
    BitcoreBlockHeader,
    Block,
    Transaction,
  } from 'bitcore-lib-cash';
  import type bitcoreModule from 'bitcore-lib-cash';
  import type { StrictEventEmitter } from 'strict-event-emitter-types';

  export const internalBitcore: typeof bitcoreModule;

  export type {
    BitcoreBlockHeader,
    Block as BitcoreBlock,
    Transaction as BitcoreTransaction,
  };

  export class Messages {
    Block: {
      fromBuffer: (rawBlock: Buffer) => BlockMessage;
    };
  }

  export const enum BitcoreInventoryType {
    ERROR = 0,
    MSG_TX = 1,
    MSG_BLOCK = 2,
    MSG_FILTERED_BLOCK = 3,
    MSG_COMPACT_BLOCK = 4,
  }

  export interface BitcoreInventory {
    hash: Buffer;
    type: BitcoreInventoryType;
  }

  export class Message<T = any> {
    fromBuffer: (buffer: Buffer) => T;

    toBuffer: () => Buffer;
  }

  export class BlockMessage extends Message<BlockMessage> {
    block: Block;

    Block: typeof Block;

    constructor(block?: Block);
  }
  export class GetHeadersMessage extends Message<GetHeadersMessage> {
    starts: Buffer[];

    stop: Buffer;

    constructor(contents: { starts: string[]; stop: string });
  }
  export class GetDataMessage extends Message<GetDataMessage> {
    inventory: BitcoreInventory[];
    constructor(contents: { inventory: string[] });
  }
  export class HeadersMessage extends Message<HeadersMessage> {
    headers: BitcoreBlockHeader[];
    constructor(headers: BitcoreBlockHeader[]);
  }
  export class InventoryMessage extends Message<InventoryMessage> {
    inventory: BitcoreInventory[];
  }
  export class SendHeadersMessage extends Message<SendHeadersMessage> {}

  export class TransactionMessage extends Message<TransactionMessage> {
    transaction: Transaction;

    Transaction: typeof Transaction;

    constructor(transaction?: Transaction);
  }

  interface PeerEvents {
    '*': (message: Message, eventName: string) => void;
    block: (message: BlockMessage) => void;
    connect: () => void;
    disconnect: () => void;
    error: (error: unknown) => void;
    getdata: () => void;
    headers: (message: HeadersMessage) => void;
    inv: (message: InventoryMessage) => void;
    ready: () => void;
    tx: (message: TransactionMessage) => void;
  }
  type PeerEmitter = StrictEventEmitter<EventEmitter, PeerEvents>;
  export class Peer extends (EventEmitter as new () => PeerEmitter) {
    connect: () => void;

    disconnect: () => void;

    sendMessage: <M extends Message>(message: M) => void;

    status: 'connected' | 'connecting' | 'disconnected' | 'ready';

    messages: {
      Block: typeof BlockMessage;
      GetData: {
        forBlock: (blockHash: Buffer | string) => GetDataMessage;
        forTransaction: (transactionHash: Buffer | string) => GetDataMessage;
      };
      GetHeaders: typeof GetHeadersMessage;
      Headers: typeof HeadersMessage;
      Inventory: {
        forBlock: (blockHash: Buffer | string) => InventoryMessage;
        forTransaction: (transactionHash: Buffer | string) => InventoryMessage;
      };
      SendHeaders: typeof SendHeadersMessage;
      Transaction: typeof TransactionMessage;
    };

    bestHeight: number;

    host: string;

    port: number;

    version: number;

    subversion: string;

    constructor(config: {
      host?: string;
      network?: string;
      port?: number;
      relay?: boolean;
      subversion?: string;
      version?: number;
    });
  }

  interface PoolEvents {
    '*': (peer: Peer, message: Message, eventName: string) => void;
    peergetheaders: (peer: Peer, message: GetHeadersMessage) => void;
    peergetdata: (peer: Peer, message: GetDataMessage) => void;
    peerready: (peer: Peer, addr: any) => void;
    peerconnect: (peer: Peer, addr: any) => void;
  }
  type PoolEmitter = StrictEventEmitter<EventEmitter, PoolEvents>;
  export class Pool extends (EventEmitter as new () => PoolEmitter) {
    listen: () => void;
    constructor(config: {
      dnsSeed?: boolean;
      listenAddr?: boolean;
      maxSize?: number;
      network?: string;
      relay?: boolean;
      subversion?: string;
      version?: number;
    });
  }
}
