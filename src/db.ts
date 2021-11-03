import { Pool } from 'pg';

import type { Agent } from './agent';
import {
  computeIndexCreationProgress,
  indexDefinitions,
} from './components/db-utils';
import {
  postgresConnectionString,
  postgresMaxConnections,
  postgresSynchronousCommit,
} from './config';
import type {
  ChaingraphBlock,
  ChaingraphTransaction,
} from './types/chaingraph';

export const pool = new Pool({
  connectionString: postgresConnectionString,
  max: postgresMaxConnections,
});

/**
 * Trim a Postgres "bytea"-formatted string (e.g. `\xc0de`), returning just the
 * hex (e.g. `c0de`).
 * @param bytea - the string in Postgres bytea format
 */
export const byteaStringToHex = (bytea: string) => {
  return bytea.replace('\\x', '');
};

/**
 * Format a hex-encoded string as a Postgres "bytea" string (e.g. `\xc0de`).
 * @param bin - the Uint8Array to format
 */
export const hexToByteaString = (hex: string) => `\\x${hex}`;

/**
 * Because Postgres accepts timestamps in simplified ISO 8601 format, this
 * method does not need to remove the trailing `Z` (which indicates UTC).
 * @param date - the data to format
 */
export const dateToTimestampWithoutTimezone = (date: Date) =>
  `'${date.toISOString()}'::timestamp`;

/**
 * The JavaScript `Date` constructor assumes timestamps without a time zone are
 * in the environment's current time zone. This method simply appends a `Z` to
 * indicate UTC time prior to constructing the `Date`.
 * @param timestampWithoutTimezone - the simplified ISO 8601-formatted date
 */
export const timestampWithoutTimezoneToDate = (
  timestampWithoutTimezone: string
) => new Date(`${timestampWithoutTimezone}Z`);

/**
 * Given a list of Chaingraph blocks from the database, return an array of
 * hashes in the positions specified by `height`. If a height is missing, `null`
 * is used to fill that position.
 * @param blocks - an array of blocks where each object contains at least a
 * height and a hash (in Postgres bytea format)
 */
export const blockArrayToHashChain = (
  blocks: { height: string; hash: Buffer }[]
) => {
  if (blocks.length === 0) {
    return [];
  }
  const sortedByHeight = blocks.sort(
    (a, b) => Number(a.height) - Number(b.height)
  );
  const bestHeight = Number(sortedByHeight[sortedByHeight.length - 1].height);
  const chain = Array.from({ length: bestHeight + 1 }).fill(null) as (
    | string
    | null
  )[];
  blocks.forEach((entry) => {
    chain[Number(entry.height)] = entry.hash.toString('hex');
  });
  return chain;
};

/**
 * Request the full list of all known block hashes from the database.
 */
export const getAllKnownBlockHashes = async () => {
  const client = await pool.connect();
  const allKnownBlockHashes = await client.query<{ hash: Buffer }>(
    'SELECT "hash" from "block";'
  );
  client.release();
  const hashes = allKnownBlockHashes.rows.map(({ hash }) =>
    hash.toString('hex')
  );
  return hashes;
};

/**
 * Create or update one or more trusted node in the Chaingraph database,
 * returning it's internal ID.
 */
export const registerTrustedNodeWithDb = async (node: {
  latestConnectionBeganAt: Date;
  nodeName: string;
  protocolVersion: number;
  userAgent: string;
}) => {
  const registerNode = /* sql */ `
  INSERT INTO node (name, protocol_version, user_agent, latest_connection_began_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ON CONSTRAINT node_name_key
    DO UPDATE SET
      protocol_version = $2,
      user_agent = $3,
      latest_connection_began_at = $4
    RETURNING internal_id;
`;
  const client = await pool.connect();
  // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
  const nodeInternalIdQuery = await client.query<{ internal_id: number }>(
    registerNode,
    [
      node.nodeName,
      node.protocolVersion,
      node.userAgent,
      node.latestConnectionBeganAt,
    ]
  );
  const internalId = nodeInternalIdQuery.rows[0].internal_id;
  const acceptedBlocksQuery = await client.query<{
    height: string;
    hash: Buffer;
  }>(
    /* sql */ `
  SELECT height, hash FROM block
  WHERE EXISTS
    (SELECT 1 FROM node_block WHERE
	   node_block.block_internal_id = block.internal_id AND
	   node_block.node_internal_id = $1)
  ORDER BY height ASC;
`,
    [internalId]
  );
  client.release();
  const syncedHeaderHashChain = blockArrayToHashChain(acceptedBlocksQuery.rows);
  return { internalId, syncedHeaderHashChain };
};

/**
 * Save a transaction to the known mempool of the specified nodes. If the
 * transaction already exists in the database, `transaction`, `output`, and
 * `input` insertions will be skipped, and only the new `node_transaction`s will
 * be written.
 */
export const saveTransactionForNodes = async (
  transaction: ChaingraphTransaction,
  nodeValidations: {
    nodeInternalId: number;
    validatedAt: Date;
  }[]
) => {
  const saveTransaction = /* sql */ `
WITH transaction_values (hash, version, locktime, size_bytes, is_coinbase) AS (
  VALUES ('${hexToByteaString(transaction.hash)}'::bytea, ${
    transaction.version
  }::bigint, ${transaction.locktime}::bigint, ${
    transaction.sizeBytes
  }::bigint, ${transaction.isCoinbase.toString()}::boolean)
), output_values (output_index, value_satoshis, locking_bytecode) AS (
  VALUES ${transaction.outputs
    .map(
      (output, outputIndex) =>
        `(${outputIndex}::bigint, ${
          output.satoshis
        }::bigint, '${hexToByteaString(output.lockingBytecode)}'::bytea)`
    )
    .join(',')}
), input_values (input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode) AS (
  VALUES ${transaction.inputs
    .map(
      (input, inputIndex) =>
        `(${inputIndex}::bigint, ${input.outpointIndex}::bigint, ${
          input.sequenceNumber
        }::bigint, '${hexToByteaString(
          input.outpointTransactionHash
        )}'::bytea, '${hexToByteaString(input.unlockingBytecode)}'::bytea)`
    )
    .join(',')}
), node_transaction_values (node_internal_id, validated_at) AS (
  VALUES ${nodeValidations
    .map(
      (validation) =>
        `(${
          validation.nodeInternalId
        }::bigint, ${dateToTimestampWithoutTimezone(validation.validatedAt)})`
    )
    .join(',')}
), new_transaction (transaction_hash, transaction_internal_id) AS (
  INSERT INTO transaction (hash, version, locktime, size_bytes, is_coinbase)
    SELECT hash, version, locktime, size_bytes, is_coinbase FROM transaction_values
    ON CONFLICT ON CONSTRAINT "transaction_hash_key" DO NOTHING
    RETURNING hash AS transaction_hash, internal_id AS transaction_internal_id
), insert_outputs AS (
  INSERT INTO output (transaction_hash, output_index, value_satoshis, locking_bytecode)
    SELECT transaction_hash, output_index, value_satoshis, locking_bytecode FROM output_values CROSS JOIN new_transaction
), insert_inputs AS (
  INSERT INTO input (transaction_internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode)
    SELECT transaction_internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode FROM input_values CROSS JOIN new_transaction
), new_or_existing_transaction (transaction_internal_id) AS (
  SELECT COALESCE (
    (SELECT transaction_internal_id FROM new_transaction),
    (SELECT internal_id AS transaction_internal_id FROM transaction WHERE transaction.hash = '${hexToByteaString(
      transaction.hash
    )}'::bytea)
  )
)
INSERT INTO node_transaction (node_internal_id, transaction_internal_id, validated_at)
  SELECT node_internal_id, transaction_internal_id, validated_at FROM node_transaction_values CROSS JOIN new_or_existing_transaction;
`;
  const client = await pool.connect();
  await client.query(saveTransaction);
  client.release();
};

/**
 * Immediately mark a node as having validated a transaction already known to
 * exist in the database.
 *
 * TODO: test
 */
export const recordNodeValidation = async (
  transactionHash: string,
  validation: {
    nodeInternalId: number;
    validatedAt: Date;
  }
) => {
  const client = await pool.connect();
  /*
   * The transaction is already saved, just insert `node_transaction`s.
   */
  await client.query(/* sql */ `
    INSERT INTO node_transaction (node_internal_id, transaction_internal_id, validated_at)
    SELECT node_internal_id, validated_at FROM (VALUES (
      ${validation.nodeInternalId}::bigint,
      ${dateToTimestampWithoutTimezone(validation.validatedAt)})
      INNER JOIN (SELECT internal_id as transaction_internal_id from transaction WHERE hash = '${hexToByteaString(
        transactionHash
      )}'::bytea);
    `);
  client.release();
};

/**
 * Save a block to the database, inserting all transactions which aren't already
 * known to exist in the database. (This method should only be used for blocks
 * which are not already saved to the database.)
 *
 * Note: this method trusts its input, and data is not sanitized. (Because all
 * inserted data is of type `number`, `boolean`, or `Uint8Array`, we assume SQL
 * injections are not a concern.)
 */
export const saveBlock = async ({
  block,
  nodeAcceptances,
  transactionCache,
}: {
  block: ChaingraphBlock;
  nodeAcceptances: {
    nodeInternalId: number;
    acceptedAt: Date | null;
    nodeName: string;
  }[];
  transactionCache: Agent['transactionCache'];
}) => {
  const blockTransactions = block.transactions.reduce<{
    /**
     * Transactions known to be successfully saved to the database.
     */
    alreadySaved: ChaingraphTransaction[];
    /**
     * Transactions in the block which aren't yet known to be saved to the
     * database. These must be saved before the block can be saved.
     */
    unknown: ChaingraphTransaction[];
  }>(
    (transactions, transaction) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      transactionCache.has(transaction.hash)
        ? transactions.alreadySaved.push(transaction)
        : transactions.unknown.push(transaction);
      return transactions;
    },
    { alreadySaved: [], unknown: [] }
  );

  const inputs: {
    inputIndex: number;
    transactionHash: string;
    content: ChaingraphTransaction['inputs'][number];
  }[] = [];
  const outputs: {
    outputIndex: number;
    transactionHash: string;
    content: ChaingraphTransaction['outputs'][number];
  }[] = [];

  blockTransactions.unknown.forEach((transaction) => {
    inputs.push(
      ...transaction.inputs.map((content, inputIndex) => ({
        content,
        inputIndex,
        transactionHash: transaction.hash,
      }))
    );
    outputs.push(
      ...transaction.outputs.map((content, outputIndex) => ({
        content,
        outputIndex,
        transactionHash: transaction.hash,
      }))
    );
  });

  const addAllTransactions = /* sql */ `
WITH unknown_transaction_values (hash, version, locktime, size_bytes, is_coinbase) AS (
  VALUES ${blockTransactions.unknown
    .map(
      (transaction) =>
        `('${hexToByteaString(transaction.hash)}'::bytea, ${
          transaction.version
        }::bigint, ${transaction.locktime}::bigint, ${
          transaction.sizeBytes
        }::bigint, ${transaction.isCoinbase.toString()}::boolean)`
    )
    .join(',')}
),
unknown_input_values (transaction_hash, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode) AS (
  VALUES ${inputs
    .map(
      (input) =>
        `('${hexToByteaString(input.transactionHash)}'::bytea, ${
          input.inputIndex
        }::bigint, ${input.content.outpointIndex}::bigint, ${
          input.content.sequenceNumber
        }::bigint, '${hexToByteaString(
          input.content.outpointTransactionHash
        )}'::bytea, '${hexToByteaString(
          input.content.unlockingBytecode
        )}'::bytea)`
    )
    .join(',')}
),
unknown_output_values (transaction_hash, output_index, value_satoshis, locking_bytecode) AS (
  VALUES ${outputs
    .map(
      (output) =>
        `('${hexToByteaString(output.transactionHash)}'::bytea, ${
          output.outputIndex
        }::bigint, ${output.content.satoshis}::bigint, '${hexToByteaString(
          output.content.lockingBytecode
        )}'::bytea)`
    )
    .join(',')}
),
newly_saved_transactions (hash, internal_id) AS (
  INSERT INTO transaction (hash, version, locktime, size_bytes, is_coinbase)
    SELECT hash, version, locktime, size_bytes, is_coinbase FROM unknown_transaction_values
    ON CONFLICT ON CONSTRAINT "transaction_hash_key" DO NOTHING
    RETURNING hash, internal_id
),
newly_saved_outputs AS (
  INSERT INTO output (transaction_hash, output_index, value_satoshis, locking_bytecode)
    SELECT transaction_hash, output_index, value_satoshis, locking_bytecode FROM unknown_output_values
    WHERE transaction_hash IN (SELECT hash FROM newly_saved_transactions)
),
newly_saved_inputs AS (
  INSERT INTO input (transaction_internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode)
    SELECT internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode
    FROM unknown_input_values val INNER JOIN newly_saved_transactions txs ON val.transaction_hash = txs.hash
)
SELECT COUNT(*) FROM newly_saved_transactions;`;

  /**
   * TODO: perf – consider baking this into `addAllTransactions` to avoid re-sending the list of transaction hashes?
   * TODO: perf – consider batching blocks during initial sync (targeting 100KB to 1MB queries)
   * TODO: perf – use prepared statements
   */
  const addBlockQuery = /* sql */ `
WITH transactions_in_block (hash, transaction_index) AS (
  VALUES ${block.transactions
    .map(
      (transaction, index) =>
        `('${hexToByteaString(transaction.hash)}'::bytea, ${index}::bigint)`
    )
    .join(',')}
),
accepting_nodes (node_internal_id, accepted_at) AS (
  VALUES ${nodeAcceptances
    .map(
      (acceptance) =>
        `(${acceptance.nodeInternalId}, ${
          acceptance.acceptedAt === null
            ? 'NULL::timestamp'
            : dateToTimestampWithoutTimezone(acceptance.acceptedAt)
        })`
    )
    .join(',')}
),
joined_transactions (internal_id, transaction_index) AS (
  SELECT db.internal_id, val.transaction_index
    FROM transaction db INNER JOIN transactions_in_block val ON val.hash = db.hash
),
inserted_block (internal_id) AS (
  INSERT INTO block (height, version, timestamp, hash, previous_block_hash, merkle_root, bits, nonce, size_bytes)
    VALUES (${block.height}, ${block.version}, ${block.timestamp},
      '${hexToByteaString(block.hash)}'::bytea,
      '${hexToByteaString(block.previousBlockHash)}'::bytea,
      '${hexToByteaString(block.merkleRoot)}'::bytea,
      ${block.bits}::bigint, ${block.nonce}::bigint, ${block.sizeBytes}::bigint)
  ON CONFLICT ON CONSTRAINT "block_hash_key" DO NOTHING
  RETURNING internal_id
),
inserted_block_transactions AS (
  INSERT INTO block_transaction (block_internal_id, transaction_internal_id, transaction_index)
    SELECT blk.internal_id, tx.internal_id, tx.transaction_index
      FROM inserted_block blk CROSS JOIN joined_transactions tx
),
new_or_existing_block (internal_id) AS (
  SELECT COALESCE (
    (SELECT internal_id FROM inserted_block),
    (SELECT internal_id FROM block WHERE block.hash = '${hexToByteaString(
      block.hash
    )}'::bytea)
  )
)
INSERT INTO node_block (node_internal_id, block_internal_id, accepted_at)
  SELECT node.node_internal_id, blk.internal_id, node.accepted_at
    FROM new_or_existing_block blk CROSS JOIN accepting_nodes node
  ON CONFLICT ON CONSTRAINT "node_block_pkey" DO NOTHING`;
  const client = await pool.connect();
  await client.query('BEGIN;');
  const saveTransactionsResult = await client.query<{ count: string }>(
    addAllTransactions
  );
  const attemptedSavedTransactions = blockTransactions.unknown;
  const savedTransactionCount = Number(saveTransactionsResult.rows[0].count);
  const transactionCacheMisses =
    attemptedSavedTransactions.length - savedTransactionCount;
  await client.query(addBlockQuery);
  await client.query('COMMIT;');
  client.release();
  return {
    attemptedSavedTransactions,
    transactionCacheMisses,
  };
};

/**
 * Used when a node catches up to one or more other nodes via headers-sync.
 *
 * Returns the number of node_blocks inserted.
 */
export const acceptBlocksViaHeaders = async (
  nodeInternalId: number,
  acceptedBlocks: {
    height: number;
    hash: string;
  }[],
  acceptedAt: Date
) => {
  const secondsPerMs = 1_000;
  const acceptedAtTimestamp = acceptedAt.getTime() / secondsPerMs;

  const twoHoursSeconds = 7200;
  /**
   * Chaingraph does not save "acceptedAt" times for blocks older than 2 hours.
   * See `agent.saveBlock` for details.
   */
  const nullifyAcceptedTimeBeforeBlockTimestamp = Math.round(
    acceptedAtTimestamp - twoHoursSeconds
  );

  const insertNodeBlocks = /* sql */ `
  WITH matching_blocks (internal_id, use_null) AS (
    SELECT internal_id, (timestamp < ${nullifyAcceptedTimeBeforeBlockTimestamp}::bigint) AS use_null
    FROM block WHERE hash IN (VALUES ${acceptedBlocks
      .map((block) => `('${hexToByteaString(block.hash)}'::bytea)`)
      .join(',')})
  )
    INSERT INTO node_block (node_internal_id, block_internal_id, accepted_at)
      SELECT n.id, blk.internal_id, CASE WHEN blk.use_null=true THEN NULL ELSE ${dateToTimestampWithoutTimezone(
        acceptedAt
      )} END
      FROM matching_blocks blk CROSS JOIN (VALUES (${nodeInternalId}::bigint)) n(id)
      ON CONFLICT DO NOTHING
  `;
  const client = await pool.connect();
  const nodeBlockInsertResult = await client.query(insertNodeBlocks);
  client.release();
  return nodeBlockInsertResult.rowCount;
};

/**
 * Remove a list of stale blocks for the specified node. This is called during
 * re-organizations before the newly-accepted history is synced to the database.
 *
 * This method does not re-introduce transactions from the stale blocks to the
 * node's mempool (`node_transaction`), as most most real world re-organizations
 * do not ultimately cause many confirmed transactions to become unconfirmed.
 * (Rather, the new blocks will typically include the removed transactions and
 * more.)
 *
 * For use cases which require carefully handling these transactions, downstream
 * applications should subscribe to changes in the `node_block_history` table.
 */
export const removeStaleBlocksForNode = async (
  nodeInternalId: number,
  staleChain: string[]
) => {
  const client = await pool.connect();
  await client.query(/* sql */ `
DELETE FROM node_block WHERE
  node_internal_id IN (VALUES (${nodeInternalId}::bigint)) AND
  block_internal_id IN (SELECT internal_id from block WHERE hash IN (VALUES ${staleChain
    .map((hash) => `('${hexToByteaString(hash)}'::bytea)`)
    .join(',')}))
`);
  client.release();
};

/**
 * After initial sync, Chaingraph begins tracking each node's mempool.
 *
 * To maintain consistency, a trigger which is disabled before initial sync must
 * be reenabled to clear any confirmed or conflicting transactions when a block
 * is accepted.
 */
export const reenableMempoolCleaning = async () => {
  const client = await pool.connect();
  const res = await client.query(
    `ALTER TABLE node_block ENABLE TRIGGER trigger_public_node_block_insert;`
  );
  client.release();
  return res.rowCount;
};

/**
 * If configured, disable `synchronous_commit` for the database. (Returns false
 * if synchronous_commit is not disabled.)
 *
 * Chaingraph can disable `synchronous_commit` in an effort to improve initial
 * sync performance. This would normally risk data loss (but not corruption) in
 * the event of a database crash, but because Chaingraph can simply re-request
 * blocks from the trusted nodes, synchronous commits aren't valuable during
 * initial sync.
 *
 * Note: in real-world testing, this usually reduces the speed of Chaingraph's
 * initial sync, so Chaingraph leaves "synchronous_commit = on" by default.
 */
export const optionallyDisableSynchronousCommit = async () => {
  if (postgresSynchronousCommit) {
    return false;
  }
  const client = await pool.connect();
  await client.query(
    `DO $$ BEGIN execute 'ALTER DATABASE ' || current_database() || ' SET synchronous_commit TO OFF'; END $$;`
  );
  client.release();
  return true;
};

/**
 * Re-enable `synchronous_commit` for the database.
 *
 * See `disableSynchronousCommit` for details.
 */
export const optionallyEnableSynchronousCommit = async () => {
  if (postgresSynchronousCommit) {
    return;
  }
  const client = await pool.connect();
  await client.query(
    `DO $$ BEGIN execute 'ALTER DATABASE ' || current_database() || ' SET synchronous_commit TO ON'; END $$;`
  );
  client.release();
};

/**
 * Fetch a list of all indexes which already exist in this database.
 */
export const listExistingIndexes = async () => {
  const client = await pool.connect();
  const res = await client.query<{
    indexname: string;
  }>(/* sql */ `
SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;
`);
  client.release();
  return res.rows.map((row) => row.indexname);
};

/**
 * Start building each of the provided indexes. Returns a promise which
 * completes when all indexes have been built.
 */
export const createIndexes = async (
  indexNames: (keyof typeof indexDefinitions)[]
) => {
  const indexCreations = indexNames.map(async (indexName) => {
    const client = await pool.connect();
    const res = await client.query(indexDefinitions[indexName]);
    client.release();
    return res.rowCount;
  });
  return Promise.all(indexCreations);
};

/**
 * Fetch index creation progress from the database, returning a map of index
 * names to completion percentages.
 */
export const getIndexCreationProgress = async () => {
  const client = await pool.connect();
  const res = await client.query<{
    query: string;
    /* eslint-disable camelcase, @typescript-eslint/naming-convention */
    blocks_done: string;
    blocks_total: string;
    tuples_done: string;
    tuples_total: string;
    /* eslint-enable camelcase, @typescript-eslint/naming-convention */
  }>(/* sql */ `
SELECT a.query, p.blocks_total, p.blocks_done, p.tuples_total, p.tuples_done
FROM pg_stat_progress_create_index p
JOIN pg_stat_activity a ON p.pid = a.pid;
`);
  client.release();
  return computeIndexCreationProgress(res.rows);
};
