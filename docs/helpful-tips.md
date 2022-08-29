# Helpful Tips

For detailed information on the Bitcoin Cash specification, check out [reference.cash](https://reference.cash/).

## Determining a Cash Address from an input

Chaingraph provides access to direct Blockchain determined, but many use cases will require some more user friendly wrapping. For instance, the GraphQL schema provides access to an input's `locking_bytecode`, but not the corresponding CashAddress. See Reference.cash for more [about locking scripts](https://reference.cash/protocol/blockchain/transaction/locking-script).

Example GraphQl call fetching information for transaction `7b1f7a00736c7d4ae0b011fa9544e5fd36a71bf139f9c57920f7f8e6d54a578e` ([transaction on Blockchair.com](https://blockchair.com/bitcoin-cash/transaction/7b1f7a00736c7d4ae0b011fa9544e5fd36a71bf139f9c57920f7f8e6d54a578e)). Note the `\\x` prefix required by the GraphQL API.

```
query GetTransactionDetails {
  transaction(where: { hash: { _eq:
  "\\x7b1f7a00736c7d4ae0b011fa9544e5fd36a71bf139f9c57920f7f8e6d54a578e"
  } } ) {
    hash
    inputs {
      outpoint {
        locking_bytecode
      }
    }
  }
}
```

Returns:

```
{
  "data": {
    "transaction": [
      {
        "hash": "\\x7b1f7a00736c7d4ae0b011fa9544e5fd36a71bf139f9c57920f7f8e6d54a578e",
        "inputs": [
          {
            "outpoint": {
              "locking_bytecode": "\\x76a914c3b6a8a716bc001eda8a31ec04954a4b5c86a42b88ac"
            }
          },
          {
            "outpoint": {
              "locking_bytecode": "\\x76a914b03c4b800bb0575f6c0f11e155541cc0661a8f9a88ac"
            }
          }
        ]
      }
    ]
  }
}
```

The `locking_bytecode` from each input can then be be translated to a CashAddress using [libauth](https://github.com/bitauth/libauth).

```
import libauth from "@bitauth/libauth"

const input1LockingBytecode = "76a914c3b6a8a716bc001eda8a31ec04954a4b5c86a42b88ac";
libauth.lockingBytecodeToCashAddress(
  libauth.hexToBin(input1LockingBytecode),
  "bitcoincash"
);
// 'bitcoincash:qrpmd298z67qq8k63gc7cpy4ff94ep4y9vrlux4dc4'

const input2LockingBytecode = "76a914b03c4b800bb0575f6c0f11e155541cc0661a8f9a88ac";
libauth.lockingBytecodeToCashAddress(
  libauth.hexToBin("76a914b03c4b800bb0575f6c0f11e155541cc0661a8f9a88ac"),
  "bitcoincash"
);
// 'bitcoincash:qzcrcjuqpwc9whmvpug7z425rnqxvx50ngl60rrjst'

// Legacy address format
const sha256 = await libauth.instantiateSha256();
const legacyAddress = libauth.lockingBytecodeToBase58Address(
  sha256,
  libauth.hexToBin(input2LockingBytecode),
  "mainnet"
);
// '1H4rA8McqZxJ83pJV4w9arE8SFaort8vo8'
```
