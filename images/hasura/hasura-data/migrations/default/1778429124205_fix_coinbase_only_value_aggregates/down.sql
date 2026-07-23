CREATE OR REPLACE FUNCTION transaction_input_value_satoshis(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT SUM(inputs.input_value_satoshis)::bigint FROM (
    SELECT input_value_satoshis (input) FROM input WHERE transaction_internal_id = transaction_row.internal_id
  ) as "inputs"
$$;

CREATE OR REPLACE FUNCTION block_input_count(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_input_count)::bigint FROM (
    SELECT transaction_input_count (transaction) FROM transaction WHERE internal_id  IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id)
  ) as "transactions"
$$;

CREATE OR REPLACE FUNCTION block_input_value_satoshis(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_input_value_satoshis)::bigint FROM (
    SELECT transaction_input_value_satoshis (transaction) FROM transaction WHERE internal_id  IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id)
  ) as "transactions"
$$;

CREATE OR REPLACE FUNCTION block_output_count(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_output_count)::bigint FROM (
    SELECT transaction_output_count (transaction) FROM transaction WHERE internal_id  IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id)
  ) as "transactions"
$$;

CREATE OR REPLACE FUNCTION block_output_value_satoshis(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_output_value_satoshis)::bigint FROM (
    SELECT transaction_output_value_satoshis (transaction) FROM transaction WHERE internal_id  IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id)
  ) as "transactions"
$$;

CREATE OR REPLACE FUNCTION transaction_fee_satoshis(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT transaction_input_value_satoshis(transaction_row) - transaction_output_value_satoshis(transaction_row)
$$;

CREATE OR REPLACE FUNCTION block_fee_satoshis(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_fee_satoshis)::bigint FROM (
    SELECT transaction_fee_satoshis (transaction) FROM transaction WHERE internal_id IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id )
  ) as "transactions"
$$;

CREATE OR REPLACE FUNCTION block_generated_value_satoshis(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT (block_output_value_satoshis(block) - block_input_value_satoshis(block))::bigint FROM block WHERE internal_id = block_row.internal_id;
$$;
