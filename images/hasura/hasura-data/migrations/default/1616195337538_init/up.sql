CREATE TABLE block (
  internal_id bigint NOT NULL,
  height bigint NOT NULL,
  version bigint NOT NULL,
  "timestamp" bigint NOT NULL,
  hash bytea NOT NULL,
  previous_block_hash bytea NOT NULL,
  merkle_root bytea NOT NULL,
  bits bigint NOT NULL,
  nonce bigint NOT NULL,
  size_bytes bigint NOT NULL
);
CREATE SEQUENCE block_internal_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
ALTER SEQUENCE block_internal_id_seq OWNED BY block.internal_id;
ALTER TABLE ONLY block ALTER COLUMN internal_id SET DEFAULT nextval('block_internal_id_seq'::regclass);
ALTER TABLE ONLY block
  ADD CONSTRAINT block_hash_key UNIQUE (hash);
ALTER TABLE ONLY block
  ADD CONSTRAINT block_internal_id_key UNIQUE (internal_id);
ALTER TABLE ONLY block
  ADD CONSTRAINT block_pkey PRIMARY KEY (internal_id);
COMMENT ON TABLE block IS 'A blockchain block.';
COMMENT ON COLUMN block.internal_id IS 'A unique, int64 identifier for this block assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.';
COMMENT ON COLUMN block.height IS 'The height of this block: the number of blocks mined between this block and its genesis block (block 0).';
COMMENT ON COLUMN block.version IS 'The "version" field of this block; a 4-byte field typically represented as an int32. While originally designed to indicate a block''s version, this field has been used for several other purposes. BIP34 ("Height in Coinbase") enforced a minimum version of 2, BIP66 ("Strict DER Signatures") enforced a minimum version of 3, then BIP9 repurposed most bits of the version field for network signaling. In recent years, the version field is also used for the AsicBoost mining optimization.';
COMMENT ON COLUMN block.timestamp IS 'The uint32 current Unix timestamp claimed by the miner at the time this block was mined. By consensus, block timestamps must be within ~2 hours of the actual time, but timestamps are not guaranteed to be accurate. Timestamps of later blocks can also be earlier than their parent blocks.';
COMMENT ON COLUMN block.hash IS 'The 32-byte, double-sha256 hash of the block header (encoded using the standard P2P network format) in big-endian byte order. This is used as a universal, unique identifier for the block. Big-endian byte order is typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).';
COMMENT ON COLUMN block.previous_block_hash IS 'The 32-byte, double-sha256 hash of the previous block''s header in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).';
COMMENT ON COLUMN block.merkle_root IS 'The 32-byte root hash of the double-sha256 merkle tree of transactions confirmed by this block. Note, the unusual merkle tree construction used by most chains is vulnerable to CVE-2012-2459. The final node in oddly-numbered levels is duplicated, and special care is required to ensure trees contain minimal duplicatation.';
COMMENT ON COLUMN block.bits IS 'The uint32 packed representation of the difficulty target being used for this block. To be valid, the block hash value must be less than this difficulty target.';
COMMENT ON COLUMN block.nonce IS 'The uint32 nonce used for this block. This field allows miners to introduce entropy into the block header, changing the resulting hash during mining.';
COMMENT ON COLUMN block.size_bytes IS 'The network-encoded size of this block in bytes including transactions.';

CREATE TABLE transaction (
  internal_id bigint NOT NULL,
  hash bytea NOT NULL,
  version bigint NOT NULL,
  locktime bigint NOT NULL,
  size_bytes bigint NOT NULL,
  is_coinbase boolean NOT NULL
);
CREATE SEQUENCE transaction_internal_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
ALTER SEQUENCE transaction_internal_id_seq OWNED BY transaction.internal_id;
ALTER TABLE ONLY transaction ALTER COLUMN internal_id SET DEFAULT nextval('transaction_internal_id_seq'::regclass);
ALTER TABLE ONLY transaction
  ADD CONSTRAINT transaction_hash_key UNIQUE (hash);
ALTER TABLE ONLY transaction
  ADD CONSTRAINT transaction_pkey PRIMARY KEY (internal_id);
COMMENT ON TABLE transaction IS 'A transaction.';
COMMENT ON COLUMN transaction.internal_id IS 'A unique, int64 identifier for this transaction assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.';
COMMENT ON COLUMN transaction.hash IS 'The 32-byte, double-sha256 hash of this transaction (encoded using the standard P2P network format) in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).';
COMMENT ON COLUMN transaction.version IS 'The version of this transaction. In the v1 and v2 transaction formats, a 4-byte field typically represented as an int32. (Verson 2 transactions are defined in BIP68.)';
COMMENT ON COLUMN transaction.locktime IS 'The uint32 locktime at which this transaction is considered valid. Locktime can be provided as either a timestamp or a block height: values less than 500,000,000 are understood to be a block height (the current block number in the chain, beginning from block 0); values greater than or equal to 500,000,000 are understood to be a UNIX timestamp.';
COMMENT ON COLUMN transaction.size_bytes IS 'The network-encoded size of this transaction in bytes.';
COMMENT ON COLUMN transaction.is_coinbase IS 'A boolean value indicating whether this transaction is a coinbase transaction. A coinbase transaction must be the 0th transaction in a block, it must have one input which spends from the empty outpoint_transaction_hash (0x0000...) and – after BIP34 – includes the block''s height in its unlocking_bytecode (A.K.A. "coinbase" field), and it may spend the sum of the block''s transaction fees and block reward to its output(s).';

CREATE TABLE block_transaction (
  block_internal_id bigint NOT NULL,
  transaction_internal_id bigint NOT NULL,
  transaction_index bigint NOT NULL
);
ALTER TABLE ONLY block_transaction
  ADD CONSTRAINT block_transaction_pkey PRIMARY KEY (block_internal_id, transaction_internal_id);
COMMENT ON TABLE block_transaction IS 'A many-to-many relationship between blocks and transactions.';
COMMENT ON COLUMN block_transaction.block_internal_id IS 'The internal_id (assigned by Chaingraph) of the block referenced by this block_transaction.';
COMMENT ON COLUMN block_transaction.transaction_internal_id IS 'The internal_id (assigned by Chaingraph) of the transaction referenced by this block_transaction.';
COMMENT ON COLUMN block_transaction.transaction_index IS 'The zero-based index of the referenced transaction in the referenced block. (Transaction ordering is critical for reconstructing a block or its merkle tree.)';

CREATE TABLE input (
  transaction_internal_id bigint NOT NULL,
  input_index bigint NOT NULL,
  outpoint_index bigint NOT NULL,
  sequence_number bigint NOT NULL,
  outpoint_transaction_hash bytea NOT NULL,
  unlocking_bytecode bytea NOT NULL
);
ALTER TABLE ONLY input
  ADD CONSTRAINT input_pkey PRIMARY KEY (transaction_internal_id, input_index);
COMMENT ON TABLE input IS 'A transaction input.';
COMMENT ON COLUMN input.transaction_internal_id IS 'The internal_id (assigned by Chaingraph) of the transaction which includes this input.';
COMMENT ON COLUMN input.input_index IS 'The zero-based index of this input in the transaction.';
COMMENT ON COLUMN input.outpoint_index IS 'The zero-based index of the output being spent by this input. (An outpoint is a reference/pointer to a specific output in a previous transaction.)';
COMMENT ON COLUMN input.sequence_number IS 'The uint32 "sequence number" for this input, a complex bitfield which can encode several input properties: sequence age support – whether or not the input can use OP_CHECKSEQUENCEVERIFY; sequence age – the minimum number of blocks or length of time claimed to have passed since this input''s source transaction was mined (up to approximately 1 year); locktime support – whether or not the input can use OP_CHECKLOCKTIMEVERIFY.';
COMMENT ON COLUMN input.outpoint_transaction_hash IS 'The 32-byte, double-sha256 hash of the network-encoded transaction from which this input is spent in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).';
COMMENT ON COLUMN input.unlocking_bytecode IS 'The bytecode used to unlock a transaction output. To spend an output, unlocking bytecode must be included in a transaction input which – when evaluated in the authentication virtual machine with the locking bytecode – completes in valid state.';

CREATE TABLE output (
  transaction_hash bytea NOT NULL,
  output_index bigint NOT NULL,
  value_satoshis bigint NOT NULL,
  locking_bytecode bytea NOT NULL
);
ALTER TABLE ONLY output
  ADD CONSTRAINT output_pkey PRIMARY KEY (transaction_hash, output_index);
COMMENT ON TABLE output IS 'A transaction output.';
COMMENT ON COLUMN output.transaction_hash IS 'The 32-byte, double-sha256 hash of the network-encoded transaction containing this output in big-endian byte order. This is the byte order typically seen in block explorers and user interfaces (as opposed to little-endian byte order, which is used in standard P2P network messages).';
COMMENT ON COLUMN output.output_index IS 'The zero-based index of this output in the transaction.';
COMMENT ON COLUMN output.value_satoshis IS 'The value of this output in satoshis.';
COMMENT ON COLUMN output.locking_bytecode IS 'The bytecode used to encumber this transaction output. To spend the output, unlocking bytecode must be included in a transaction input which – when evaluated before this locking bytecode – completes in a valid state.';

CREATE TABLE node (
  name text NOT NULL,
  internal_id integer NOT NULL,
  protocol_version integer NOT NULL,
  user_agent text NOT NULL,
  first_connected_at timestamp without time zone DEFAULT now() NOT NULL,
  latest_connection_began_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE node_internal_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
ALTER SEQUENCE node_internal_id_seq OWNED BY node.internal_id;
ALTER TABLE ONLY node ALTER COLUMN internal_id SET DEFAULT nextval('node_internal_id_seq'::regclass);
ALTER TABLE ONLY node
  ADD CONSTRAINT node_internal_id_key UNIQUE (internal_id);
ALTER TABLE ONLY node
  ADD CONSTRAINT node_name_key UNIQUE (name);
ALTER TABLE ONLY node
  ADD CONSTRAINT node_pkey PRIMARY KEY (internal_id);
COMMENT ON TABLE node IS 'A trusted node which has been connected to this Chaingraph instance.';
COMMENT ON COLUMN node.name IS 'The name configured as a stable identifier for this particular trusted node.';
COMMENT ON COLUMN node.internal_id IS 'A unique, int32 identifier for this node assigned by Chaingraph. This value is not guaranteed to be consistent between Chaingraph instances.';
COMMENT ON COLUMN node.protocol_version IS 'The protocol version reported by this node during the most recent connection handshake.';
COMMENT ON COLUMN node.user_agent IS 'The user agent reported by this node during the most recent connection handshake.';
COMMENT ON COLUMN node.first_connected_at IS 'The UTC timestamp at which this node was first connected to Chaingraph.';
COMMENT ON COLUMN node.latest_connection_began_at IS 'The UTC timestamp at which this node began its most recent connection to Chaingraph.';

CREATE TABLE node_block (
  node_internal_id integer NOT NULL,
  block_internal_id bigint NOT NULL,
  accepted_at timestamp without time zone
);
ALTER TABLE ONLY node_block
  ADD CONSTRAINT node_block_pkey PRIMARY KEY (node_internal_id, block_internal_id);
COMMENT ON TABLE node_block IS 'A many-to-many relationship between nodes and blocks.';
COMMENT ON COLUMN node_block.node_internal_id IS 'The internal_id (assigned by Chaingraph) of the node referenced by this node_block.';
COMMENT ON COLUMN node_block.block_internal_id IS 'The internal_id (assigned by Chaingraph) of the block referenced by this node_block.';
COMMENT ON COLUMN node_block.accepted_at IS 'The UTC timestamp at which the referenced block was accepted by the referenced node. Set to NULL if the true acceptance time is unknown (the block was accepted by this node before Chaingraph began monitoring). In the event of a blockchain reorganization, the record is deleted from node_block and saved to node_block_history.';

CREATE TABLE node_block_history (
  internal_id bigint NOT NULL,
  node_internal_id integer NOT NULL,
  block_internal_id bigint NOT NULL,
  accepted_at timestamp without time zone,
  removed_at timestamp without time zone DEFAULT timezone('UTC', now()) NOT NULL
);
CREATE SEQUENCE node_block_history_internal_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
ALTER SEQUENCE node_block_history_internal_id_seq OWNED BY node_block_history.internal_id;
ALTER TABLE ONLY node_block_history ALTER COLUMN internal_id SET DEFAULT nextval('node_block_history_internal_id_seq'::regclass);
ALTER TABLE ONLY node_block_history
  ADD CONSTRAINT node_block_history_pkey PRIMARY KEY (internal_id);
COMMENT ON TABLE node_block_history IS 'An archive of deleted node_blocks.';
COMMENT ON COLUMN node_block_history.internal_id IS 'The internal_id (assigned by Chaingraph) of this node_block_history record.';
COMMENT ON COLUMN node_block_history.node_internal_id IS 'The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_block.';
COMMENT ON COLUMN node_block_history.block_internal_id IS 'The internal_id (assigned by Chaingraph) of the block referenced by the deleted node_block.';
COMMENT ON COLUMN node_block_history.accepted_at IS 'The UTC timestamp at which the referenced block was accepted by the referenced node in the deleted node_block. Set to NULL if the true acceptance time was unknown (the block was accepted by this node before Chaingraph began monitoring).';
COMMENT ON COLUMN node_block_history.removed_at IS 'The UTC timestamp at which the referenced block was removed by the referenced node.';

CREATE TABLE node_transaction (
  node_internal_id integer NOT NULL,
  transaction_internal_id bigint NOT NULL,
  validated_at timestamp without time zone
);
ALTER TABLE ONLY node_transaction
  ADD CONSTRAINT node_transaction_pkey PRIMARY KEY (transaction_internal_id, node_internal_id);
COMMENT ON TABLE node_transaction IS 'A many-to-many relationship between nodes and unconfirmed transactions, A.K.A. "mempool". Transactions which are first heard in a block are never recorded as node_transactions, but skip directly to being record by a pair of node_block and block_transaction relationships.';
COMMENT ON COLUMN node_transaction.node_internal_id IS 'The internal_id (assigned by Chaingraph) of the node referenced by this node_transaction.';
COMMENT ON COLUMN node_transaction.transaction_internal_id IS 'The internal_id (assigned by Chaingraph) of the transaction referenced by this node_transaction.';
COMMENT ON COLUMN node_transaction.validated_at IS 'The UTC timestamp at which the referenced transaction was validated by the referenced node.';

CREATE TABLE node_transaction_history (
  internal_id bigint NOT NULL,
  node_internal_id integer NOT NULL,
  transaction_internal_id bigint NOT NULL,
  validated_at timestamp without time zone,
  replaced_at timestamp without time zone
);
CREATE SEQUENCE node_transaction_history_internal_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
ALTER SEQUENCE node_transaction_history_internal_id_seq OWNED BY node_transaction_history.internal_id;
ALTER TABLE ONLY node_transaction_history ALTER COLUMN internal_id SET DEFAULT nextval('node_transaction_history_internal_id_seq'::regclass);
COMMENT ON TABLE node_transaction_history IS 'An archive of deleted node_transactions.';
COMMENT ON COLUMN node_transaction_history.internal_id IS 'The internal_id (assigned by Chaingraph) of this node_transaction_history record.';
COMMENT ON COLUMN node_transaction_history.node_internal_id IS 'The internal_id (assigned by Chaingraph) of the node referenced by the deleted node_transaction.';
COMMENT ON COLUMN node_transaction_history.transaction_internal_id IS 'The internal_id (assigned by Chaingraph) of the transaction referenced by the deleted node_transaction.';
COMMENT ON COLUMN node_transaction_history.validated_at IS 'The UTC timestamp at which the referenced transaction was validated by the referenced node in the deleted node_transaction.';
COMMENT ON COLUMN node_transaction_history.replaced_at IS 'The UTC timestamp at which the referenced transaction was marked as replaced (A.K.A. double-spent) by the referenced node.';

ALTER TABLE ONLY block_transaction
  ADD CONSTRAINT block_transaction_block_internal_id_fkey FOREIGN KEY (block_internal_id) REFERENCES block(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY block_transaction
  ADD CONSTRAINT block_transaction_transaction_internal_id_fkey FOREIGN KEY (transaction_internal_id) REFERENCES transaction(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY input
  ADD CONSTRAINT input_transaction_internal_id_fkey FOREIGN KEY (transaction_internal_id) REFERENCES transaction(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY output
  ADD CONSTRAINT output_transaction_hash_fkey FOREIGN KEY (transaction_hash) REFERENCES transaction(hash) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY node_block
  ADD CONSTRAINT node_block_block_internal_id_fkey FOREIGN KEY (block_internal_id) REFERENCES block(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY node_block
  ADD CONSTRAINT node_block_node_internal_id_fkey FOREIGN KEY (node_internal_id) REFERENCES node(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY node_block_history
  ADD CONSTRAINT node_block_history_block_internal_id_fkey FOREIGN KEY (block_internal_id) REFERENCES block(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY node_block_history
  ADD CONSTRAINT node_block_history_node_internal_id_fkey FOREIGN KEY (node_internal_id) REFERENCES node(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY node_transaction
  ADD CONSTRAINT node_transaction_node_internal_id_fkey FOREIGN KEY (node_internal_id) REFERENCES node(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY node_transaction
  ADD CONSTRAINT node_transaction_transaction_internal_id_fkey FOREIGN KEY (transaction_internal_id) REFERENCES transaction(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY node_transaction_history
  ADD CONSTRAINT node_transaction_history_transaction_internal_id_fkey FOREIGN KEY (transaction_internal_id) REFERENCES transaction(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY node_transaction_history
  ADD CONSTRAINT node_transaction_history_node_internal_id_fkey FOREIGN KEY (node_internal_id) REFERENCES node(internal_id) ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE FUNCTION trigger_node_block_delete() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO node_block_history (node_internal_id, block_internal_id, accepted_at)
    VALUES(OLD.node_internal_id, OLD.block_internal_id, OLD.accepted_at);
  RETURN OLD;
END;
$$;
CREATE TRIGGER trigger_public_node_block_delete BEFORE DELETE ON node_block FOR EACH ROW EXECUTE FUNCTION trigger_node_block_delete();
COMMENT ON TRIGGER trigger_public_node_block_delete ON node_block IS 'A trigger to add a node_block_history row on node_block row deletions.';

CREATE OR REPLACE FUNCTION trigger_node_transaction_insert() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
WITH newly_spent AS (
	SELECT new_table.node_internal_id, new_table.transaction_internal_id, new_table.validated_at, input.outpoint_transaction_hash, input.outpoint_index
		FROM input INNER JOIN new_table ON input.transaction_internal_id = new_table.transaction_internal_id
),
possibly_replaced AS (
    SELECT newly_spent.node_internal_id, input.transaction_internal_id, newly_spent.validated_at as replaced_at
        FROM input INNER JOIN newly_spent ON input.outpoint_transaction_hash = newly_spent.outpoint_transaction_hash AND input.outpoint_index = newly_spent.outpoint_index
        WHERE input.transaction_internal_id != newly_spent.transaction_internal_id
),
deleted_node_transactions AS (
    DELETE FROM node_transaction
        USING possibly_replaced
        WHERE node_transaction.node_internal_id = possibly_replaced.node_internal_id
            AND node_transaction.transaction_internal_id = possibly_replaced.transaction_internal_id
        RETURNING node_transaction.node_internal_id, node_transaction.transaction_internal_id, validated_at, replaced_at
)
INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
	SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at FROM deleted_node_transactions;
RETURN NEW;
END;
$$;
CREATE TRIGGER trigger_public_node_transaction_insert
    AFTER INSERT ON node_transaction
    REFERENCING NEW TABLE AS new_table
    FOR EACH STATEMENT EXECUTE FUNCTION trigger_node_transaction_insert();
COMMENT ON TRIGGER trigger_public_node_transaction_insert ON node_transaction IS 'A trigger which removes previously-accepted transactions from node_transaction when the accepting node validates new transactions which would double-spend those  previously-accepted transactions. This only occurs if a node intentionally replaces previously-heard transactions (e.g. replace-by-fee, replace-by-ZCE, manual replacements, etc.).';

CREATE OR REPLACE FUNCTION trigger_node_block_insert() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
WITH accepted_transactions AS (
	SELECT node_internal_id, transaction_internal_id, accepted_at FROM block_transaction INNER JOIN new_table ON block_transaction.block_internal_id = new_table.block_internal_id
),
newly_spent AS (
	SELECT accepted_transactions.node_internal_id, accepted_transactions.transaction_internal_id, accepted_transactions.accepted_at, input.outpoint_transaction_hash, input.outpoint_index
		FROM input INNER JOIN accepted_transactions ON input.transaction_internal_id = accepted_transactions.transaction_internal_id
),
accepted_and_replaced_transactions AS (
    SELECT newly_spent.node_internal_id, input.transaction_internal_id, CASE WHEN input.transaction_internal_id != newly_spent.transaction_internal_id THEN newly_spent.accepted_at ELSE NULL END AS replaced_at
        FROM input INNER JOIN newly_spent ON input.outpoint_transaction_hash = newly_spent.outpoint_transaction_hash AND input.outpoint_index = newly_spent.outpoint_index
        WHERE input.outpoint_transaction_hash != '\x0000000000000000000000000000000000000000000000000000000000000000'::bytea
--        GROUP BY newly_spent.node_internal_id, input.transaction_internal_id, replaced -- doesn't improve performance
),
deleted_node_transactions AS (
    DELETE FROM node_transaction
        USING accepted_and_replaced_transactions
        WHERE node_transaction.node_internal_id = accepted_and_replaced_transactions.node_internal_id
            AND node_transaction.transaction_internal_id = accepted_and_replaced_transactions.transaction_internal_id
        RETURNING node_transaction.node_internal_id, node_transaction.transaction_internal_id, validated_at, accepted_and_replaced_transactions.replaced_at
)
INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
	SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at FROM deleted_node_transactions;
RETURN NEW;
END;
$$;
CREATE TRIGGER trigger_public_node_block_insert
    AFTER INSERT ON node_block
    REFERENCING NEW TABLE AS new_table
    FOR EACH STATEMENT EXECUTE FUNCTION trigger_node_block_insert();
COMMENT ON TRIGGER trigger_public_node_block_insert ON node_block IS 'A trigger which removes previously-accepted transactions from node_transaction when nodes accept blocks containing transactions which would double-spend those previously-accepted transactions. This only occurs if a node intentionally replaces previously-heard transactions (e.g. replace-by-fee, replace-by-ZCE, manual replacements, etc.).';

-- disabled until initial sync is complete (when mempool transactions begin to be accepted)
ALTER TABLE node_block DISABLE TRIGGER trigger_public_node_block_insert;

CREATE FUNCTION input_value_satoshis(input_row input) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT value_satoshis from output
    WHERE output.transaction_hash = input_row.outpoint_transaction_hash AND
          output.output_index = input_row.outpoint_index
    LIMIT 1
$$;
COMMENT ON FUNCTION input_value_satoshis(input) IS 'The value in satoshis of all outpoints spent by this transaction. Set to null for coinbase transactions.';

CREATE FUNCTION transaction_input_count(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT COUNT(*) from input WHERE input.transaction_internal_id = transaction_row.internal_id
$$;
COMMENT ON FUNCTION transaction_input_count(transaction) IS 'The total number of inputs in this transaction.';

CREATE FUNCTION transaction_input_value_satoshis(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT SUM(inputs.input_value_satoshis)::bigint FROM (
    SELECT input_value_satoshis (input) FROM input WHERE transaction_internal_id = transaction_row.internal_id
  ) as "inputs"
$$;
COMMENT ON FUNCTION transaction_input_value_satoshis(transaction) IS 'The total value in satoshis of all outputs spent by inputs in this transaction.';

CREATE FUNCTION transaction_output_count(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT COUNT(*) from output WHERE output.transaction_hash = transaction_row.hash
$$;
COMMENT ON FUNCTION transaction_output_count(transaction) IS 'The total number of outputs in this transaction.';

CREATE FUNCTION transaction_output_value_satoshis(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
  AS $$
  SELECT SUM(value_satoshis)::bigint FROM output
  WHERE output.transaction_hash = transaction_row.hash
$$;
COMMENT ON FUNCTION transaction_output_value_satoshis(transaction) IS 'The total value in satoshis of all outputs created by this transaction.';

CREATE FUNCTION transaction_fee_satoshis(transaction_row transaction) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT transaction_input_value_satoshis(transaction_row) - transaction_output_value_satoshis(transaction_row)
$$;
COMMENT ON FUNCTION transaction_fee_satoshis(transaction) IS 'The fee in satoshis paid by this transaction.';

CREATE FUNCTION block_fee_satoshis(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
 SELECT SUM(transactions.transaction_fee_satoshis)::bigint FROM (
    SELECT transaction_fee_satoshis (transaction) FROM transaction WHERE internal_id  IN (SELECT transaction_internal_id from block_transaction WHERE block_internal_id = block_row.internal_id )
  ) as "transactions"
$$;
COMMENT ON FUNCTION block_fee_satoshis(block) IS 'The total fee in satoshis paid by all transactions in this block.';

CREATE FUNCTION block_transaction_count(block_row block) RETURNS bigint
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT COUNT(*) from block_transaction WHERE block_transaction.block_internal_id = block_row.internal_id
$$;
COMMENT ON FUNCTION block_transaction_count(block) IS 'The total number of transactions in this block.';

-- Note: this method expects an index: CREATE INDEX output_search_index ON output USING btree (substring(locking_bytecode, 0, 26));
CREATE OR REPLACE FUNCTION search_output (locking_bytecode_hex text[])
  RETURNS SETOF output
  LANGUAGE plpgsql STABLE
AS $$
DECLARE
  decoded bytea[];
BEGIN
  SELECT array_agg(decode(hex, 'hex')) into decoded FROM unnest(locking_bytecode_hex) as hex;
  RETURN QUERY (SELECT * FROM output
  -- use output_locking_bytecode_prefix_index
  WHERE substring(locking_bytecode from 0 for 26)
  = ANY(decoded)
  ORDER BY locking_bytecode ASC);
END;
$$;
COMMENT ON FUNCTION search_output (text[]) IS 'Return a list of outputs which match the provided locking bytecode hex (up to 25 bytes, supporting both P2PKH and P2SH outputs).';

CREATE OR REPLACE FUNCTION search_output_prefix (locking_bytecode_prefix_hex text)
  RETURNS SETOF output
  LANGUAGE sql STABLE
AS $$
  SELECT * FROM output
  -- use output_locking_bytecode_prefix_index
  WHERE substring(locking_bytecode from 0 for 26)
  LIKE decode(locking_bytecode_prefix_hex, 'hex') || '%'
  ORDER BY locking_bytecode ASC
$$;
COMMENT ON FUNCTION search_output_prefix (text) IS 'Return a list of outputs in which the first 25 bytes of the locking bytecode match the provided prefix hex.';

-- Chaingraph Utilities

CREATE FUNCTION parse_bytecode_pattern(bytecode bytea) RETURNS bytea
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
      -- parse scratch as unsigned, four byte, little-endian number:
      i := i + 5 + ((get_byte(scratch, 3) << 24) | (get_byte(scratch, 2) << 16) | (get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
    END IF;
  END LOOP;
    RETURN pattern;
END;
$$;
COMMENT ON FUNCTION parse_bytecode_pattern (bytea) IS 'Parse a sequence of bitcoin VM bytecode, extracting the first byte of each instruction. The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern, even if different data or public keys are used.';

CREATE FUNCTION output_locking_bytecode_pattern(output_row output) RETURNS text
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT encode(parse_bytecode_pattern($1.locking_bytecode), 'hex');
$$;
COMMENT ON FUNCTION output_locking_bytecode_pattern (output) IS 'Extract the first byte of each instruction for the locking bytecode of an output. The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern.';

CREATE FUNCTION input_unlocking_bytecode_pattern(input_row input) RETURNS text
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT encode(parse_bytecode_pattern($1.unlocking_bytecode), 'hex');
$$;
COMMENT ON FUNCTION input_unlocking_bytecode_pattern (input) IS 'Extract the first byte of each instruction for the unlocking bytecode of an input. The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern.';

CREATE FUNCTION parse_bytecode_pattern_with_pushdata_lengths(bytecode bytea) RETURNS bytea
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
      IF bytecode_length - i < 3 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_1 reads one length-byte
      pattern := pattern || substring(bytecode from (i + 2) for 1); -- append length byte
      i := i + 2 + get_byte(bytecode, (i + 1));
    ELSIF selected_byte = 77 THEN
      IF bytecode_length - i < 4 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_2 reads two length-bytes
      scratch := substring(bytecode from (i + 2) for 2);
      pattern := pattern || scratch; -- append length bytes
      -- parse scratch as unsigned, two byte, little-endian number:
      i := i + 3 + ((get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
    ELSIF selected_byte = 78 THEN
      IF bytecode_length - i < 6 THEN
        -- malformed, return immediately
        RETURN pattern;
      END IF;
      -- OP_PUSHDATA_4 reads four length-bytes
      scratch := substring(bytecode from (i + 2) for 4);
      pattern := pattern || scratch; -- append length bytes
      -- parse scratch as unsigned, four byte, little-endian number:
      i := i + 5 + ((get_byte(scratch, 3) << 24) | (get_byte(scratch, 2) << 16) | (get_byte(scratch, 1) << 8) | get_byte(scratch, 0));
    END IF;
  END LOOP;
    RETURN pattern;
END;
$$;
COMMENT ON FUNCTION parse_bytecode_pattern_with_pushdata_lengths (bytea) IS 'Parse a sequence of bitcoin VM bytecode, extracting the first byte of each instruction and any pushdata length bytes (for OP_PUSHDATA_1, OP_PUSHDATA_2, and OP_PUSHDATA_4). The resulting pattern excludes the contents of pushed values such that similar bytecode sequences produce the same pattern, even if different data or public keys are used.';

-- For performance, this function does not detect the otherwise valid (but useless) redeem bytecode of 'OP_1'.
-- Redeem bytecodes of 'OP_1' through 'OP_16' will always return NULL.
CREATE FUNCTION parse_bytecode_pattern_redeem(bytecode bytea) RETURNS bytea
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
COMMENT ON FUNCTION parse_bytecode_pattern_redeem (bytea) IS 'Parse VM unlocking bytecode to identify the final instruction. If the last instruction is a push, attempt to parse its contents as P2SH redeem bytecode, extracting the first byte of each instruction into a bytecode pattern (excluding length bytes and pushed data). If the last instruction is not a push, return NULL.';

CREATE FUNCTION input_redeem_bytecode_pattern(input_row input) RETURNS text
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT encode(parse_bytecode_pattern_redeem($1.unlocking_bytecode), 'hex');
$$;
COMMENT ON FUNCTION input_redeem_bytecode_pattern (input) IS 'If the final instruction of the unlocking bytecode is a push instruction, parse its contents as a P2SH redeem bytecode, extracting the first byte of each instruction into a bytecode pattern (excluding length bytes and pushed data). If the last instruction is not a push, return NULL. Note: this function does not confirm that the spent locking bytecode is P2SH. For correct results, only call this function for inputs which spend P2SH outputs.';

CREATE OR REPLACE FUNCTION encode_uint16le(number bigint) RETURNS bytea
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT
  set_byte(
    set_byte('\x0000'::bytea, 0, (number & 255)::integer),
  1, ((number >> 8) & 255)::integer);
$$;
COMMENT ON FUNCTION encode_uint16le (bigint) IS 'Encode a positive bigint as a little-endian, 2-byte unsigned integer (bytea).';

CREATE FUNCTION encode_uint32le(number bigint) RETURNS bytea
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT
  set_byte(
    set_byte(
      set_byte(
        set_byte('\x00000000'::bytea, 0, (number & 255)::integer),
      1, ((number >> 8) & 255)::integer),
    2, ((number >> 16) & 255)::integer),
  3, ((number >> 24) & 255)::integer);
$$;
COMMENT ON FUNCTION encode_uint32le (bigint) IS 'Encode a positive bigint as a little-endian, 4-byte unsigned integer (bytea).';

CREATE FUNCTION encode_int32le(number bigint) RETURNS bytea
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT encode_uint32le(number);
$$;
COMMENT ON FUNCTION encode_int32le (bigint) IS 'Encode a bigint as a little-endian, 4-byte signed integer (bytea). Writing both signed and unsigned numbers can use the same encoding algorithm (this function is an alias for encode_uint32le), but this function is provided for clarity in the encode_transaction and encode_block_header functions.';

CREATE FUNCTION encode_uint64le(number bigint) RETURNS bytea
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT
  set_byte(
    set_byte(
      set_byte(
        set_byte(
          set_byte(
            set_byte(
              set_byte(
                set_byte('\x0000000000000000'::bytea, 0, (number & 255)::integer),
              1, ((number >> 8) & 255)::integer),
            2, ((number >> 16) & 255)::integer),
          3, ((number >> 24) & 255)::integer),
        4, ((number >> 32) & 255)::integer),
      5, ((number >> 40) & 255)::integer),
    6, ((number >> 48) & 255)::integer),
  7, ((number >> 56) & 255)::integer);
$$;
COMMENT ON FUNCTION encode_uint64le (bigint) IS 'Encode a positive bigint as a little-endian, 8-byte unsigned integer (bytea). Note: the bigint type is signed, so the maximum value which can be encoded using this function is 9223372036854775807 (0xffffffffffffff7f).';

CREATE OR REPLACE FUNCTION encode_bitcoin_var_int(number bigint) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
BEGIN
  IF number <= 252 THEN
    RETURN set_byte('\x00'::bytea, 0, number::integer);
  ELSIF number <= 65535 THEN
    RETURN '\xfd'::bytea || encode_uint16le(number);
  ELSIF number <= 4294967295 THEN
    RETURN '\xfe'::bytea || encode_uint32le(number);
  ELSE
    RETURN '\xff'::bytea || encode_uint64le(number);
  END IF;
END;
$$;
COMMENT ON FUNCTION encode_bitcoin_var_int (bigint) IS 'Encode a positive bigint in bitcoin variable-length integer (Bitcoin VarInt) format.';

CREATE OR REPLACE FUNCTION reverse_bytea(source_bytes bytea) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  last_source_index integer := octet_length(source_bytes) - 1;
  reversed bytea := source_bytes; -- set result to proper length
BEGIN
  FOR i IN 0..last_source_index LOOP
    reversed := set_byte(reversed, i, get_byte(source_bytes, last_source_index - i));
  END LOOP;
  RETURN reversed;
END;
$$;
COMMENT ON FUNCTION reverse_bytea(bytea) IS 'Reverse the byte order of a bytea.';

CREATE FUNCTION encode_transaction(transaction_row transaction) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  tx bytea := encode_int32le(transaction_row.version);
  inputs_encoded bytea := '\x'::bytea;
  input_count int := 0;
  outputs_encoded bytea := '\x'::bytea;
  output_count int := 0;
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
      encode_bitcoin_var_int(octet_length(input_row.unlocking_bytecode)::bigint) ||
      input_row.unlocking_bytecode ||
      encode_uint32le(input_row.sequence_number);
  END LOOP;
	tx := tx || encode_bitcoin_var_int(input_count) || inputs_encoded;
  FOR output_row IN outputs
  LOOP
    output_count := output_count + 1;
    outputs_encoded := outputs_encoded ||
      encode_uint64le(output_row.value_satoshis) ||
      encode_bitcoin_var_int(octet_length(output_row.locking_bytecode)::bigint) ||
      output_row.locking_bytecode;
  END LOOP;
  tx := tx || encode_bitcoin_var_int(output_count) || outputs_encoded || encode_uint32le(transaction_row.locktime);
  RETURN tx;
END;
$$;
COMMENT ON FUNCTION encode_transaction(transaction) IS 'Encode a transaction using the standard P2P network format.';

CREATE FUNCTION transaction_encoded_hex(transaction_row transaction) RETURNS text
  LANGUAGE sql IMMUTABLE
  AS $$
  SELECT encode(encode_transaction(transaction_row), 'hex');
$$;
COMMENT ON FUNCTION transaction_encoded_hex(transaction) IS 'Encode a transaction using the standard P2P network format, returning the result as a hex-encoded string.';

CREATE FUNCTION encode_block_header(block_row block) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
BEGIN
  RETURN encode_int32le(block_row.version) ||
         reverse_bytea(block_row.previous_block_hash) ||
         reverse_bytea(block_row.merkle_root) ||
         encode_uint32le(block_row.timestamp) ||
         encode_uint32le(block_row.bits) ||
         encode_uint32le(block_row.nonce);
END;
$$;
COMMENT ON FUNCTION encode_block_header(block) IS 'Encode a block header using the standard P2P network format.';

CREATE FUNCTION block_header_encoded_hex(block_row block) RETURNS text
  LANGUAGE sql IMMUTABLE
  AS $$
  SELECT encode(encode_block_header(block_row), 'hex');
$$;
COMMENT ON FUNCTION block_header_encoded_hex(block) IS 'Encode a block header using the standard P2P network format, returning the result as a hex-encoded string.';

CREATE FUNCTION encode_block(block_row block) RETURNS bytea
  LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  transactions CURSOR FOR SELECT transaction.* FROM transaction
    INNER JOIN block_transaction ON transaction.internal_id = block_transaction.transaction_internal_id
    WHERE block_transaction.block_internal_id = block_row.internal_id
    ORDER BY block_transaction.transaction_index ASC;
  encoded_block bytea := encode_block_header(block_row) || encode_bitcoin_var_int(COUNT(transactions));
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
COMMENT ON FUNCTION encode_block(block) IS 'Encode a full block using the standard P2P network format.';

CREATE FUNCTION block_encoded_hex(block_row block) RETURNS text
  LANGUAGE sql IMMUTABLE
  AS $$
  SELECT encode(encode_block(block_row), 'hex');
$$;
COMMENT ON FUNCTION block_encoded_hex(block) IS 'Encode a full block using the standard P2P network format, returning the result as a hex-encoded string.';

-- Bitauth functionality

CREATE FUNCTION collect_authchains (authbase_transaction_hash bytea)
  RETURNS TABLE(authhead bytea, authchain_hashes bytea[], authchain_internal_ids bigint[], unspent_authhead boolean)
  LANGUAGE sql STABLE
AS $$
  WITH RECURSIVE cte AS (
    SELECT
        transaction_hash AS migration_hash,
        ARRAY[transaction_hash] AS authchain_hashes,
        ARRAY[transaction.internal_id] AS authchain_internal_ids,
        NOT EXISTS (SELECT NULL FROM input
          WHERE output.transaction_hash = input.outpoint_transaction_hash AND
                output.output_index = input.outpoint_index) AS is_unspent,
        false AS exceeds_max_depth,
        0 AS depth
      FROM output
      INNER JOIN transaction ON transaction.hash = transaction_hash
      WHERE transaction_hash = authbase_transaction_hash AND output_index = 0
    UNION ALL
    SELECT transaction.hash,
        cte.authchain_hashes || transaction.hash,
        cte.authchain_internal_ids || transaction.internal_id,
        -- true if the output at transaction.hash, index 0 is unspent
        NOT EXISTS (SELECT NULL
          FROM output INNER JOIN input ON
                output.transaction_hash = input.outpoint_transaction_hash AND
                output.output_index = input.outpoint_index
            WHERE
              output.transaction_hash = transaction.hash AND
              output.output_index = 0
          ) AS is_unspent,
        cte.depth > 100000 AS exceeds_max_depth,
        cte.depth + 1 AS depth
      FROM cte
        INNER JOIN input
          ON cte.migration_hash = input.outpoint_transaction_hash AND input.outpoint_index = 0
        INNER JOIN transaction
          ON input.transaction_internal_id = transaction.internal_id
        WHERE NOT (is_unspent OR exceeds_max_depth)
  ) SELECT authchain_hashes[array_upper(authchain_hashes, 1)] as authhead_transaction_hash, authchain_hashes, authchain_internal_ids, is_unspent as unspent_authhead from cte WHERE is_unspent;
$$;
COMMENT ON FUNCTION collect_authchains (bytea) IS 'Recursively scan from the provided hash, aggregating all possible authchains (across network splits) through their latest, unspent authhead. If the maximum depth of 100,000 is exceeded, the 100,000th authhead will be returned, and unspent_authhead will be set to false.';

CREATE VIEW bitauth_view AS SELECT internal_id, unspent_authhead, array_upper(authchain_internal_ids, 1) as authchain_length, hash as authbase, authhead, authchain_hashes, authchain_internal_ids
  FROM transaction, collect_authchains(transaction.hash);
COMMENT ON VIEW bitauth_view IS 'A view which generates all Bitauth-related data, containing one or more rows for each transaction. Each row represents a possible authhead for a particular transaction, and the authchain column includes the chain of migration transactions required to reach that authhead. This view provides data to other Hasura-tracked views.';

CREATE VIEW authchain_view AS SELECT internal_id as transaction_internal_id, authhead as authhead_transaction_hash, authchain_length, unspent_authhead from bitauth_view;
COMMENT ON VIEW authchain_view IS 'A view which contains one row per possible authhead per transaction.';

CREATE VIEW authchain_migrations_view AS
  SELECT v.internal_id as authbase_internal_id, a.migration_element_number - 1 AS migration_index, a.migration_transaction_internal_id
  FROM bitauth_view AS v
  LEFT JOIN LATERAL unnest(v.authchain_internal_ids) WITH ORDINALITY AS a(migration_transaction_internal_id, migration_element_number) ON TRUE;
COMMENT ON VIEW authchain_migrations_view IS 'A view which maps migration transactions to their index in a particular authchain.';

CREATE FUNCTION authchain_migration_transaction(authchain_migration_row authchain_migrations_view) RETURNS transaction
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT * FROM transaction WHERE internal_id = $1.migration_transaction_internal_id LIMIT 1;
$$;
COMMENT ON FUNCTION authchain_migration_transaction (authchain_migrations_view) IS 'This function powers the "transaction.authchains[n].migrations[n].transaction" computed field in migration objects. This is a workaround to improve performance over an equivalent "transaction" standard Hasura relationship. When implemented as a relationship, the Hasura-compiled SQL query requires a full scan of the authchain_migrations_view, which is extremely large and expensive to compute.';

CREATE FUNCTION transaction_identity_output(transaction_row transaction) RETURNS output
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT * FROM output WHERE transaction_hash = $1.hash AND output_index = 0 LIMIT 1;
$$;
COMMENT ON FUNCTION transaction_identity_output (transaction) IS 'Return a transaction''s identity output (0th output). Making this a computed field simplifies Hasura queries by returning the identity output as a single object rather than a filtered array of one output.';

CREATE FUNCTION transaction_signing_output(transaction_row transaction) RETURNS output
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT * FROM output WHERE transaction_hash = $1.hash AND output_index = 1 LIMIT 1;
$$;
COMMENT ON FUNCTION transaction_signing_output (transaction) IS 'Return a transaction''s signing output (1th output) or NULL if it does not exist. Making this a computed field simplifies Hasura queries by returning the signing output as a single object rather than a filtered array of one output.';

CREATE FUNCTION transaction_data_carrier_outputs(transaction_row transaction) RETURNS SETOF output
  LANGUAGE sql IMMUTABLE
AS $$
  SELECT * FROM output WHERE transaction_hash = $1.hash AND (value_satoshis = 0 OR get_byte(locking_bytecode, 0) = 106);
$$;
COMMENT ON FUNCTION transaction_data_carrier_outputs (transaction) IS 'Return all of this transaction''s "data carrier" outputs: outputs in which value_satoshis is 0 or locking_bytecode begins with OP_RETURN.';

-- Built-in Analysis Views ---
-- These views aren't used in normal operation; they are included to make chain analysis easier.
-- Consider creating more focused, MATERIALIZED views for active research.

CREATE VIEW p2sh_output_view AS SELECT * FROM output WHERE parse_bytecode_pattern(output.locking_bytecode) = '\xa91487'::bytea;
COMMENT ON VIEW p2sh_output_view IS 'A view containing all outputs which match the P2SH locking bytecode pattern.';

CREATE VIEW p2sh_input_view AS
  SELECT *, input_redeem_bytecode_pattern(input) AS redeem_bytecode_pattern
  FROM input INNER JOIN p2sh_output_view
    ON input.outpoint_transaction_hash = transaction_hash AND
       input.outpoint_index = output_index;
COMMENT ON VIEW p2sh_output_view IS 'A view containing all inputs which spent P2SH outputs.';

CREATE VIEW unspent_output_view AS SELECT * FROM output WHERE NOT EXISTS (SELECT NULL FROM input WHERE
                    output.transaction_hash = input.outpoint_transaction_hash AND
                    output.output_index = input.outpoint_index);
COMMENT ON VIEW p2sh_output_view IS 'A view containing all outputs which are not spent by any known transaction. This view is not split-aware: outputs spent on either side of any split will be excluded from this view, even if the output remains unspent on other networks.';
