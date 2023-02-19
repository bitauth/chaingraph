-- This implementation resolves an error when parsing large OP_PUSHDATA_4 pushes
CREATE OR REPLACE FUNCTION parse_bytecode_pattern(bytecode bytea) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  pattern bytea := '\x'::bytea;
  selected_byte integer;
  scratch bytea;
  i integer := 0;
  bytecode_length integer := octet_length(bytecode);
BEGIN
  WHILE i < bytecode_length LOOP
    selected_byte := get_byte(bytecode, i);
    pattern := pattern || substring(bytecode from (i + 1) for 1);
    IF selected_byte > 78 OR selected_byte = 0 THEN
        -- OP_0 (0) and all opcodes after OP_PUSHDATA_4 (78) are single-byte instructions
      i := i + 1;
    ELSIF selected_byte > 0 AND selected_byte <= 75 THEN
      -- OP_PUSHBYTES_1 (1) through OP_PUSHBYTES_75 (75) directly indicate the length of pushed data
      i := i + 1 + selected_byte;
    ELSIF selected_byte = 76 THEN
      IF bytecode_length - i < 2 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_1 reads one length-byte
      i := i + 2 + get_byte(bytecode, (i + 1));
    ELSIF selected_byte = 77 THEN
      IF bytecode_length - i < 3 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_2 reads two length-bytes
      scratch := substring(bytecode from (i + 2) for 2);
      -- parse scratch as unsigned, two byte, little-endian number:
      i := i + 3 + ((get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
    ELSIF selected_byte = 78 THEN
      IF bytecode_length - i < 5 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_4 reads four length-bytes
      scratch := substring(bytecode from (i + 2) for 4);
      IF get_byte(scratch, 3) << 24 < 0 THEN
        -- push length exceeds maximum signed int (>2GB), return immediately
        RETURN pattern;
      END IF;
      -- parse scratch as unsigned, four byte, little-endian number:
      i := i + 5 + ((get_byte(scratch, 3) << 24) | (get_byte(scratch, 2) << 16) | (get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
    END IF;
  END LOOP;
    RETURN pattern;
END;
$$;
