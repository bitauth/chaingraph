CREATE OR REPLACE FUNCTION transaction_data_carrier_outputs(transaction_row transaction) RETURNS SETOF output
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT * FROM output WHERE transaction_hash = $1.hash AND (value_satoshis = 0 OR (octet_length(locking_bytecode) > 0 AND get_byte(locking_bytecode, 0) = 106));
$$;
