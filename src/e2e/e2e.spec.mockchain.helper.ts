import type { AuthenticationInstruction } from '@bitauth/libauth';
import {
  authenticationInstructionsAreMalformed,
  parseBytecode,
  range,
  serializeAuthenticationInstruction,
} from '@bitauth/libauth';
import type { BitcoreBlock } from '@chaingraph/bitcore-p2p-cash';
import { Peer } from '@chaingraph/bitcore-p2p-cash';
import type { BitcoreTransactionObjectOptions } from 'bitcore-lib-cash';
import Prando from 'prando';

/**
 * Unfortunately, this is the least-bad way of getting access to the `Block` and
 * `Transaction` classes used within `bitcore-p2p-cash`. By importing from
 * `bitcore-lib-cash`, we avoid any chance of having multiple instances of
 * `bitcore-lib-cash`: https://github.com/bitpay/bitcore/issues/1457
 *
 * This solution continues working even when testing modifications to the
 * underlying `bitcore-lib-cash` used in this project.
 */
const { messages } = new Peer({});
// eslint-disable-next-line @typescript-eslint/naming-convention
export const { Block } = new messages.Block();
// eslint-disable-next-line @typescript-eslint/naming-convention
export const { Transaction } = new messages.Transaction();

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

/**
 * Generate a random parsable script (without malformed push instructions)
 */
const genScript = () => {
  const randomBytes = getBytes(prando.nextInt(1, maxScriptLength));
  const parsed = parseBytecode(randomBytes);
  if (authenticationInstructionsAreMalformed(parsed)) {
    const withoutMalformedInstruction = parsed.slice(
      0,
      -1
    ) as unknown as AuthenticationInstruction;
    return serializeAuthenticationInstruction(withoutMalformedInstruction);
  }
  return randomBytes;
};
const genOutputs = () =>
  range(prando.nextInt(1, maxOutputs)).map(() => ({
    satoshis: prando.nextInt(0, maxSatoshis),
    script: genScript(),
  }));

const hashLength = 32;

export const generateMockDoubleSpend = (
  inputs: BitcoreTransactionObjectOptions['inputs'],
  onlyOne: boolean
) => {
  return new Transaction({
    inputs: onlyOne ? [inputs[0]] : inputs,
    nLockTime: getUint32(),
    outputs: genOutputs(),
    version: getInt32(),
  });
};

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
        script: genScript(),
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
        script: genScript(),
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
    const lastBlock = chain[chain.length - 1] as BitcoreBlock | undefined;
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
