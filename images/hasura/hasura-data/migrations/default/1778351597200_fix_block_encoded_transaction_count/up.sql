CREATE OR REPLACE FUNCTION encode_block(block_row block) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  transactions CURSOR FOR SELECT transaction.* FROM transaction
    INNER JOIN block_transaction ON transaction.internal_id = block_transaction.transaction_internal_id
    WHERE block_transaction.block_internal_id = block_row.internal_id
    ORDER BY block_transaction.transaction_index ASC;
  encoded_block bytea := encode_block_header(block_row);
  transaction_count bigint := 0;
BEGIN
  SELECT COUNT(*) INTO transaction_count
    FROM block_transaction
    WHERE block_transaction.block_internal_id = block_row.internal_id;
  encoded_block := encoded_block || encode_compact_uint(transaction_count);
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
