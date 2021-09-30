import type { Input, Output, Transaction } from '@bitauth/libauth';

/**
 * Note: Postgres doesn't support an unsigned 8-byte integer format, and the
 * `numeric` type comes with performance and storage size tradeoffs. Instead,
 * Chaingraph stores satoshi values as Postgres `bigint`s – a signed, 8-byte
 * integer value. Hypothetically, some satoshi values can overflow this type,
 * however in practice, no chain should ever have enough satoshis to even
 * overflow `Number.MAX_SAFE_INTEGER`. For now, Chaingraph represents satoshi
 * values as JavaScript `Number`s before storing them in the database.
 *
 * In the future, if any networks expand the precision of their satoshi type,
 * these assumptions will need to be revisited.
 */
export interface ChaingraphTransaction
  extends Transaction<Input<string, string>, Output<string, number>> {
  hash: string;
  isCoinbase: boolean;
  sizeBytes: number;
}

export interface ChaingraphBlock {
  bits: number;
  /**
   * hex-encoded
   */
  hash: string;
  height: number;
  /**
   * hex-encoded
   */
  merkleRoot: string;
  nonce: number;
  /**
   * hex-encoded
   */
  previousBlockHash: string;
  sizeBytes: number;
  timestamp: number;
  version: number;
  transactions: ChaingraphTransaction[];
}
