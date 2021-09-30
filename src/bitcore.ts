import { Messages, Peer } from '@chaingraph/bitcore-p2p-cash';
import type {
  BitcoreBlock,
  BitcoreTransaction,
} from '@chaingraph/bitcore-p2p-cash';

import type {
  ChaingraphBlock,
  ChaingraphTransaction,
} from './types/chaingraph';

export const bitcoreTransactionToChaingraphTransaction = (
  bitcoreTransaction: BitcoreTransaction
): ChaingraphTransaction => {
  const txObject = bitcoreTransaction.toObject();
  const isCoinbase = bitcoreTransaction.isCoinbase();
  return {
    hash: txObject.hash,
    inputs: txObject.inputs.map((input) => ({
      outpointIndex: input.outputIndex,
      outpointTransactionHash: input.prevTxId,
      sequenceNumber: input.sequenceNumber,
      unlockingBytecode: input.script,
    })),
    isCoinbase,
    locktime: txObject.nLockTime,
    outputs: txObject.outputs.map((output) => ({
      lockingBytecode: output.script,
      satoshis: output.satoshis,
    })),
    sizeBytes: bitcoreTransaction.toBuffer().length,
    version: txObject.version,
  };
};

export const bitcoreBlockToChaingraphBlock = (
  bitcoreBlock: BitcoreBlock,
  height: number
): ChaingraphBlock => {
  const bitcoreBlockHeader = bitcoreBlock.header.toObject();
  return {
    bits: bitcoreBlockHeader.bits,
    hash: bitcoreBlockHeader.hash,
    height,
    merkleRoot: bitcoreBlockHeader.merkleRoot.toString('hex'),
    nonce: bitcoreBlockHeader.nonce,
    previousBlockHash: bitcoreBlockHeader.prevHash.toString('hex'),
    sizeBytes: bitcoreBlock.toBuffer().length,
    timestamp: bitcoreBlockHeader.time,
    transactions: bitcoreBlock.transactions.map(
      bitcoreTransactionToChaingraphTransaction
    ),
    version: bitcoreBlockHeader.version,
  };
};

export const messages = new Messages();

export { Peer };
