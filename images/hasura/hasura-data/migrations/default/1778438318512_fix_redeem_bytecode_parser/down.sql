CREATE OR REPLACE FUNCTION parse_bytecode_pattern_redeem(bytecode bytea) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  maybe_redeem bytea;
  selected_byte integer;
  length_value integer;
  scratch bytea;
  i integer := 0;
  bytecode_length integer := octet_length(bytecode);
BEGIN
  WHILE i < bytecode_length LOOP
    selected_byte := get_byte(bytecode, i);
    IF selected_byte > 78 OR selected_byte = 0 THEN
        -- OP_0 (0) and all opcodes after OP_PUSHDATA_4 (78) are single-byte instructions
      i := i + 1;
      maybe_redeem := NULL;
    ELSIF selected_byte > 0 AND selected_byte <= 75 THEN
      -- OP_PUSHBYTES_1 (1) through OP_PUSHBYTES_75 (75) directly indicate the length of pushed data
      maybe_redeem := substring(bytecode from (i + 2) for selected_byte);
      i := i + 1 + selected_byte;
    ELSIF selected_byte = 76 THEN
      -- OP_PUSHDATA_1 reads one length-byte
      length_value := get_byte(bytecode, (i + 1));
      maybe_redeem := substring(bytecode from (i + 3) for length_value);
      i := i + 2 + length_value;
    ELSIF selected_byte = 77 THEN
      -- OP_PUSHDATA_2 reads two length-bytes
      scratch := substring(bytecode from (i + 2) for 2);
      -- parse scratch as unsigned, two byte, little-endian number:
      length_value := ((get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
      maybe_redeem := substring(bytecode from (i + 4) for length_value);
      i := i + 3 + length_value;
    ELSIF selected_byte = 78 THEN
      -- OP_PUSHDATA_4 reads four length-bytes
      scratch := substring(bytecode from (i + 2) for 4);
      -- parse scratch as unsigned, four byte, little-endian number:
      length_value := ((get_byte(scratch, 3) << 24) | (get_byte(scratch, 2) << 16) | (get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
      maybe_redeem := substring(bytecode from (i + 6) for length_value);
      i := i + 5 + length_value;
    END IF;
  END LOOP;
  IF maybe_redeem = NULL THEN
    RETURN maybe_redeem;
  ELSE
    RETURN parse_bytecode_pattern(maybe_redeem);
  END IF;
END;
$$;
