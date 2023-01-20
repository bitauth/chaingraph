alter table "public"."output" add column "token_category" bytea
 null;
comment on column "public"."output"."token_category" is E'The 32-byte token category to which the token(s) in this output belong. This field is null if no tokens are present.';

alter table "public"."output" add column "fungible_token_amount" bigint
 null;
comment on column "public"."output"."fungible_token_amount" is E'The number of fungible tokens held in this output (an integer between 1 and 9223372036854775807). This field is null if 0 fungible tokens are present.';

CREATE TYPE enum_nonfungible_token_capability AS ENUM ('none', 'mutable', 'minting');
alter table "public"."output" add column "nonfungible_token_capability" enum_nonfungible_token_capability
 null;
comment on column "public"."output"."nonfungible_token_capability" is E'The capability of the non-fungible token (NFT) held in this output: "none", "mutable", or "minting". This field is null if no NFT is present.';

alter table "public"."output" add column "nonfungible_token_commitment" bytea
 null;
comment on column "public"."output"."nonfungible_token_commitment" is E'The commitment contents of the non-fungible token (NFT) held in this output (0 to 40 bytes). This field is null if no NFT is present.';

ALTER FUNCTION encode_bitcoin_var_int(bigint) RENAME TO encode_compact_uint;
COMMENT ON FUNCTION encode_compact_uint (bigint) IS 'Encode a positive bigint in compact unsigned integer format (A.K.A. "CompactSize" or "VarInt").';

-- rename encode_bitcoin_var_int to encode_compact_uint
CREATE OR REPLACE FUNCTION encode_block(block_row block) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  transactions CURSOR FOR SELECT transaction.* FROM transaction
    INNER JOIN block_transaction ON transaction.internal_id = block_transaction.transaction_internal_id
    WHERE block_transaction.block_internal_id = block_row.internal_id
    ORDER BY block_transaction.transaction_index ASC;
  encoded_block bytea := encode_block_header(block_row) || encode_compact_uint(COUNT(transactions));
BEGIN
  FOR transaction_row IN transactions
  LOOP
    encoded_block := encoded_block ||
      encode_transaction(ROW(
        transaction_row.internal_id,
        transaction_row.hash,
        transaction_row.version,
        transaction_row.locktime,
        transaction_row.size_bytes,
        transaction_row.is_coinbase)::transaction
      );
  END LOOP;
  RETURN encoded_block;
END;
$$;

CREATE OR REPLACE FUNCTION encode_transaction(transaction_row transaction) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  tx bytea := encode_int32le(transaction_row.version);
  inputs_encoded bytea := '\x'::bytea;
  input_count int := 0;
  outputs_encoded bytea := '\x'::bytea;
  output_count int := 0;
  bytecode_prefix bytea := '\x'::bytea;
  token_bitfield bit(8) := B'00000000';
  prefixed_bytecode_length int := 0;
  inputs CURSOR FOR SELECT * FROM input
    WHERE input.transaction_internal_id = transaction_row.internal_id
    ORDER BY input_index ASC;
  outputs CURSOR FOR SELECT * FROM output
    WHERE output.transaction_hash = transaction_row.hash
    ORDER BY output_index ASC;
BEGIN
  FOR input_row IN inputs
  LOOP
    input_count := input_count + 1;
    inputs_encoded := inputs_encoded ||
      reverse_bytea(input_row.outpoint_transaction_hash) ||
      encode_uint32le(input_row.outpoint_index) ||
      encode_compact_uint(octet_length(input_row.unlocking_bytecode)::bigint) ||
      input_row.unlocking_bytecode ||
      encode_uint32le(input_row.sequence_number);
  END LOOP;
  tx := tx || encode_compact_uint(input_count) || inputs_encoded;
  FOR output_row IN outputs
  LOOP
  IF output_row.token_category IS NOT NULL THEN
    bytecode_prefix := '\xef'::bytea || reverse_bytea(output_row.token_category);
    IF output_row.fungible_token_amount = 0 THEN
      token_bitfield := B'00000000';
    ELSE
      token_bitfield := B'00010000';
    END IF;
    IF output_row.nonfungible_token_commitment IS NOT NULL THEN
      token_bitfield := token_bitfield | B'00100000' | CASE
        WHEN output_row.nonfungible_token_capability =    'none'::enum_nonfungible_token_capability THEN B'00000000'
        WHEN output_row.nonfungible_token_capability = 'mutable'::enum_nonfungible_token_capability THEN B'00000001'
        WHEN output_row.nonfungible_token_capability = 'minting'::enum_nonfungible_token_capability THEN B'00000010'
      END;
      IF octet_length(output_row.nonfungible_token_commitment) = 0 THEN
        bytecode_prefix := bytecode_prefix || decode(to_hex(token_bitfield::int), 'hex');
      ELSE
        token_bitfield := token_bitfield | B'01000000';
        bytecode_prefix := bytecode_prefix ||
          decode(to_hex(token_bitfield::int), 'hex') ||
          encode_compact_uint(octet_length(output_row.nonfungible_token_commitment)::bigint) ||
          output_row.nonfungible_token_commitment;
      END IF;
    ELSE
      bytecode_prefix := bytecode_prefix || decode(to_hex(token_bitfield::int), 'hex');
    END IF;
    IF output_row.fungible_token_amount != 0 THEN
      bytecode_prefix := bytecode_prefix || encode_compact_uint(output_row.fungible_token_amount);
    END IF;
  ELSE
    bytecode_prefix := '\x'::bytea;
  END IF;
  prefixed_bytecode_length := octet_length(bytecode_prefix) + octet_length(output_row.locking_bytecode);
    output_count := output_count + 1;
    outputs_encoded := outputs_encoded ||
      encode_uint64le(output_row.value_satoshis) ||
      encode_compact_uint(prefixed_bytecode_length::bigint) ||
    bytecode_prefix ||
      output_row.locking_bytecode;
  END LOOP;
  tx := tx || encode_compact_uint(output_count) || outputs_encoded || encode_uint32le(transaction_row.locktime);
  RETURN tx;
END;
$$;
