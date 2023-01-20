/**
 * The "mockchain" produced by this module is very simplistic and serves only to
 * test data storage – inputs do not spend prior outputs and transactions are
 * not intended to be valid.
 *
 * TODO: simulate realistic wallets to create common types of valid transactions
 */

import type { AuthenticationInstruction } from '@bitauth/libauth';
import {
  authenticationInstructionsAreMalformed,
  decodeAuthenticationInstructions,
  encodeAuthenticationInstruction,
  range,
} from '@bitauth/libauth';
import type { BitcoreBlock } from '@chaingraph/bitcore-p2p-cash';
import bitcoreP2pCash from '@chaingraph/bitcore-p2p-cash';
import type { BitcoreTransactionObjectOptions } from 'bitcore-lib-cash';

import { Prando } from './prando.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const { Block, Transaction } = bitcoreP2pCash.internalBitcore;

const prandoSeed = 1;
const prando = new Prando(prandoSeed);

const uint8Max = 255;
const int32Max = 2147483647;
const uint32Max = 4294967295;

const getInt32 = () => prando.nextInt(0, int32Max);
const getUint32 = () => prando.nextInt(0, uint32Max);
const getBytes = (length: number) => {
  const bytes = [];
  // eslint-disable-next-line functional/no-loop-statement
  while (bytes.length < length) {
    bytes.push(prando.nextInt(0, uint8Max));
  }
  return Uint8Array.from(bytes);
};

const maxAdditionalTxsPerBlock = 10;
const maxInputs = 10;
const maxOutputs = 10;
const maxScriptLength = 200;
const maxSatoshis = 100_000_000;
const hashLength = 32;

/**
 * Generate a random parsable script (without malformed push instructions)
 */
const genScript = () => {
  const randomBytes = getBytes(prando.nextInt(1, maxScriptLength));
  const parsed = decodeAuthenticationInstructions(randomBytes);
  if (authenticationInstructionsAreMalformed(parsed)) {
    const withoutMalformedInstruction = parsed.slice(
      0,
      -1
    ) as unknown as AuthenticationInstruction;
    return encodeAuthenticationInstruction(withoutMalformedInstruction);
  }
  return randomBytes;
};
const genScriptWithoutTokenPrefix = (): Uint8Array => {
  const attempt = genScript();
  const PREFIX_TOKEN = 239;
  return attempt[0] === PREFIX_TOKEN ? genScriptWithoutTokenPrefix() : attempt;
};
const capabilities = ['none', 'mutable', 'minting'];
const maxCommitmentLength = 40;
const genOutputs = () =>
  range(prando.nextInt(1, maxOutputs)).map(() => ({
    satoshis: prando.nextInt(0, maxSatoshis),
    script: genScriptWithoutTokenPrefix(),
    ...(prando.nextBoolean()
      ? {}
      : {
          tokenData: prando.nextBoolean()
            ? {
                amount: prando.nextInt(1, Number.MAX_SAFE_INTEGER),
                category: getBytes(hashLength),
              }
            : {
                amount: prando.nextBoolean()
                  ? prando.nextInt(1, Number.MAX_SAFE_INTEGER)
                  : 0,
                category: getBytes(hashLength),
                nft: {
                  capability:
                    capabilities[prando.nextInt(0, capabilities.length)],
                  commitment: getBytes(prando.nextInt(0, maxCommitmentLength)),
                },
              },
        }),
  }));

export const generateMockDoubleSpend = (
  inputs: BitcoreTransactionObjectOptions['inputs'],
  onlyOne: boolean
) =>
  new Transaction({
    inputs: onlyOne ? [inputs[0]!] : inputs,
    nLockTime: getUint32(),
    outputs: genOutputs(),
    version: getInt32(),
  });

const generateBlock = ({
  previousBlockHash,
}: {
  previousBlockHash: string;
}) => {
  const additionalTransactions = prando.nextInt(0, maxAdditionalTxsPerBlock);

  const coinbaseTransaction = {
    inputs: [
      {
        outputIndex: 4294967295,
        prevTxId:
          '0000000000000000000000000000000000000000000000000000000000000000',
        script: genScriptWithoutTokenPrefix(),
        sequenceNumber: 4294967295,
      },
    ],
    nLockTime: getUint32(),
    outputs: genOutputs(),
    version: getInt32(),
  };

  const transactions = [
    coinbaseTransaction,
    ...range(additionalTransactions).map(() => ({
      inputs: range(prando.nextInt(1, maxInputs)).map(() => ({
        outputIndex: getUint32(),
        prevTxId: getBytes(hashLength),
        script: genScriptWithoutTokenPrefix(),
        sequenceNumber: getUint32(),
      })),
      nLockTime: getUint32(),
      outputs: genOutputs(),
      version: getInt32(),
    })),
  ];

  const generatedBlock = {
    header: {
      bits: getUint32(),
      merkleRoot:
        '0000000000000000000000000000000000000000000000000000000000000000',
      nonce: getUint32(),
      prevHash: previousBlockHash,
      time: getUint32(),
      version: getInt32(),
    },
    transactions,
  };

  return Block.fromObject(generatedBlock);
};

/**
 * Generate a mock blockchain for use in E2E testing. All contents are
 * deterministically generated, so results are reproducible.
 *
 * Note, the pseudo-random number generator is managed internally, successive
 * calls to `generateMockchain` will produce different results.
 */
export const generateMockchain = ({
  length,
  previousBlockHash,
}: {
  length: number;
  previousBlockHash: string;
}) => {
  const chain: BitcoreBlock[] = [];
  // eslint-disable-next-line functional/no-loop-statement
  while (chain.length < length) {
    const lastBlock = chain[chain.length - 1];
    const prevBlockHash = lastBlock?.header.hash ?? previousBlockHash;
    const block = generateBlock({
      previousBlockHash: prevBlockHash,
    });
    chain.push(block);
  }
  return chain;
};

export const genesisBlockRaw =
  '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000';

export const testnetGenesisBlockRaw =
  '0100000043497fd7f826957108f4a30fd9cec3aeba79972084e90ead01ea330900000000bac8b0fa927c0ac8234287e33c5f74d38d354820e24756ad709d7038fc5f31f020e7494dffff001d03e4b6720101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0e0420e7494d017f062f503253482fffffffff0100f2052a010000002321021aeaf2f8638a129a3156fbe7e5ef635226b0bafd495ff03afe2c843d7e3a4b51ac00000000';

export const genesisBlock = Block.fromString(genesisBlockRaw);

/**
 * Return a list of headers fulfilling a GetHeaders request beginning from the
 * latest start hash. If not matching headers are found, returns `false`.
 * @param starts - the array of start hashes, big-endian and hex-encoded
 * @param chain - the chain from which to select
 */
export const selectHeaders = (starts: string[], chain: BitcoreBlock[]) => {
  const headersPerMessage = 2000;
  const firstMatch =
    chain.length -
    [...chain]
      .reverse()
      .findIndex((block) => starts.includes(block.header.hash));
  return firstMatch === -1
    ? false
    : chain
        .slice(firstMatch, firstMatch + headersPerMessage)
        .map((block) => block.header);
};

export const halTxHash =
  'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16';

export const halTxRaw =
  '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000';

export const halTxSpent =
  'ea44e97271691990157559d0bdd9959e02790c34db6c006d779e82fa5aee708e';

export const halTxSpentRaw =
  '0100000001169e1e83e930853391bc6f35f605c6754cfead57cf8387639d3b4096c54f18f400000000484730440220576497b7e6f9b553c0aba0d8929432550e092db9c130aae37b84b545e7f4a36c022066cb982ed80608372c139d7bb9af335423d5280350fe3e06bd510e695480914f01ffffffff0100ca9a3b000000001976a914340cfcffe029e6935f4e4e5839a2ff5f29c7a57188ac00000000';

export const chipnetCashTokensTxHash =
  'a0152b142c7acafbc2af757754797dfde62582db3ed0edd380a0e977cae0f777';

export const chipnetCashTokensTx =
  '02000000020f8f33f03ab5f1b730e0f3d16b48e436d9ea4439a021be2c30b707768a7b6c8500000000644193a6da81a0e8b450da0c4b7cb0f902fbaecbff9854757b254b33b5e23dc2177c2b9e415330db601b19ae10e5a7fc457a5f940dd86d024f7f7dcaa6e7d34d7ecf61210286a8bcf759f185897babfc08d69c84dcc627fa70f8952d4152f1f6afb186fd3b00000000c7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a000000006441f871109bf0dbf8a44a57cf7e534ddb76fe4f4f84c06f598d2244cf99bb7346d0fad90a9ea3770b2fc668a2a4ecf7ac89c4480127655009e13a6c4ae583cea85c61210286a8bcf759f185897babfc08d69c84dcc627fa70f8952d4152f1f6afb186fd3b0000000009a08601000000000042efc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a31ff08fefefffeffff7fa91406c841f122afb58b095c30e238e769bf082244da8710270000000000006eef0f8f33f03ab5f1b730e0f3d16b48e436d9ea4439a021be2c30b707768a7b6c85622801020304050607080910111213141516171819202122232425262728293031323334353637383940aa206f906e2c68bce70eed90113203158cae49f072ac7a3a02257ba76be68a80db1f8710270000000000006eefc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a10feffffffff52210286a8bcf759f185897babfc08d69c84dcc627fa70f8952d4152f1f6afb186fd3b21028e068c5cd8de3e20625f3df40aa5a84d97552f326001160c793a0eb78b5e7f2c52ae10270000000000003eefc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a10fdffff76a914c5eb5dde0efe57884810d3e5ada12c6ada6a06b188ac102700000000000048efc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a10fdfd00210286a8bcf759f185897babfc08d69c84dcc627fa70f8952d4152f1f6afb186fd3bac102700000000000046efc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a10fc210286a8bcf759f185897babfc08d69c84dcc627fa70f8952d4152f1f6afb186fd3bac204e00000000000041efc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a600568656c6c6f76a914c5eb5dde0efe57884810d3e5ada12c6ada6a06b188ace80300000000000040efc7ed9d1a3b65dc43109117f426ae8b516c23ffdc445803819131cae22fbd293a6004f09f8c8e76a914c5eb5dde0efe57884810d3e5ada12c6ada6a06b188ac0000000000000000116a04010101010a43617368546f6b656e7300000000';
