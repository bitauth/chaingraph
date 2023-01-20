import type {
  BitcoreBlock,
  BitcoreTransaction,
} from '@chaingraph/bitcore-p2p-cash';
import bitcoreP2pCash from '@chaingraph/bitcore-p2p-cash';

import type {
  ChaingraphBlock,
  ChaingraphTransaction,
} from './types/chaingraph.js';

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
      fungibleTokenAmount:
        output.tokenData === undefined
          ? undefined
          : BigInt(output.tokenData.amount),
      lockingBytecode: output.script,
      nonfungibleTokenCapability: output.tokenData?.nft?.capability,
      nonfungibleTokenCommitment: output.tokenData?.nft?.commitment,
      tokenCategory: output.tokenData?.category,
      valueSatoshis: BigInt(output.satoshis),
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

export const messages = new bitcoreP2pCash.Messages();
