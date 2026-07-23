/* eslint-disable max-lines */
import pg from 'pg';

import type { Agent } from './agent.js';
import {
  computeIndexCreationProgress,
  indexDefinitions,
} from './components/db-utils.js';
import {
  postgresConnectionString,
  postgresMaxConnections,
  postgresSynchronousCommit,
} from './config.js';
import type {
  ChaingraphBlock,
  ChaingraphTransaction,
} from './types/chaingraph.js';

export const pool = new pg.Pool({
  connectionString: postgresConnectionString,
  max: postgresMaxConnections,
});

/**
 * Trim a Postgres "bytea"-formatted string (e.g. `\xc0de`), returning just the
 * hex (e.g. `c0de`).
 * @param bytea - the string in Postgres bytea format
 */
export const byteaStringToHex = (bytea: string) => bytea.replace('\\x', '');

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
  const bestHeight = Number(sortedByHeight[sortedByHeight.length - 1]!.height);
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
  /*
   * Hex-encoding in Postgres avoids materializing millions of `Buffer`s and
   * converting each to hex on the (single-threaded) agent event loop, which
   * dominated startup time on large databases.
   */
  const allKnownBlockHashes = await client.query<{ hash: string }>(
    `SELECT encode("hash", 'hex') AS "hash" from "block";`
  );
  client.release();
  return allKnownBlockHashes.rows.map(({ hash }) => hash);
};

export interface IncompleteBlock {
  hash: string;
  height: number;
  linkedSizeBytes: number;
  sizeBytes: number;
  transactionCount: number;
}

export interface IncompleteBlockScan {
  incompleteBlocks: IncompleteBlock[];
  scannedBlockCount: number;
}

export interface ExpiringMempoolTransaction {
  expiresAt: Date;
  hash: string;
  nodeInternalId: number;
  nodeName: string;
  transactionInternalId: number;
  validatedAt: Date;
}

export interface ArchivedMempoolTransaction {
  hash: string;
  nodeName: string;
  replacedAt: Date | null;
}

/**
 * Find blocks for which the locally saved block_transaction rows don't sum to
 * the block's saved byte size. This avoids the SQL block encoder so it can
 * detect incomplete blocks even if encoder functions have bugs (e.g. #75).
 */
export const getIncompleteBlocks = async ({
  heightLowerBound,
  heightUpperBound,
  limit,
  nodeInternalIds,
  excludedBlockHashes,
}: {
  excludedBlockHashes: string[];
  heightLowerBound: number;
  heightUpperBound: number;
  limit: number;
  nodeInternalIds: number[];
}): Promise<IncompleteBlockScan> => {
  if (nodeInternalIds.length === 0) {
    return { incompleteBlocks: [], scannedBlockCount: 0 };
  }
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    const incompleteBlockScan = await client.query<{
      incompleteBlocks: {
        hash: string;
        height: number | string;
        linkedSizeBytes: number | string;
        sizeBytes: number | string;
        transactionCount: number | string;
      }[];
      scannedBlockCount: string;
    }>(
      /* sql */ `
WITH linked_transactions AS (
  SELECT
    block.internal_id,
    block.height,
    block.hash,
    block.size_bytes,
    COUNT(block_transaction.transaction_internal_id)::bigint
      AS transaction_count,
    COALESCE(SUM(transaction.size_bytes), 0)::bigint
      AS transaction_size_bytes
    FROM block
    LEFT JOIN block_transaction
      ON block_transaction.block_internal_id = block.internal_id
    LEFT JOIN transaction
      ON transaction.internal_id = block_transaction.transaction_internal_id
    WHERE block.height >= $2
      AND block.height < $3
      AND NOT (encode(block.hash, 'hex') = ANY($5::text[]))
      AND EXISTS (
        SELECT 1 FROM node_block
          WHERE node_block.block_internal_id = block.internal_id
            AND node_block.node_internal_id = ANY($1::integer[])
      )
    GROUP BY block.internal_id
),
linked_block_sizes AS (
  SELECT
    hash,
    height,
    size_bytes,
    transaction_count,
    80 +
      CASE
        WHEN transaction_count <= 252 THEN 1
        WHEN transaction_count <= 65535 THEN 3
        WHEN transaction_count <= 4294967295 THEN 5
        ELSE 9
      END +
      transaction_size_bytes AS linked_size_bytes
    FROM linked_transactions
),
incomplete_blocks AS (
  SELECT
    encode(hash, 'hex') AS hash,
    height,
    linked_size_bytes,
    size_bytes,
    transaction_count
    FROM linked_block_sizes
    WHERE linked_size_bytes != size_bytes
    ORDER BY height ASC, hash ASC
    LIMIT $4
)
SELECT
  (SELECT COUNT(*)::bigint FROM linked_block_sizes) AS "scannedBlockCount",
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'hash', hash,
          'height', height,
          'linkedSizeBytes', linked_size_bytes,
          'sizeBytes', size_bytes,
          'transactionCount', transaction_count
        )
        ORDER BY height ASC, hash ASC
      )
      FROM incomplete_blocks
    ),
    '[]'::jsonb
  ) AS "incompleteBlocks";
`,
      [
        nodeInternalIds,
        heightLowerBound,
        heightUpperBound,
        limit,
        excludedBlockHashes,
      ]
    );
    const scan = incompleteBlockScan.rows[0]!;
    return {
      incompleteBlocks: scan.incompleteBlocks.map((block) => ({
        hash: block.hash,
        height: Number(block.height),
        linkedSizeBytes: Number(block.linkedSizeBytes),
        sizeBytes: Number(block.sizeBytes),
        transactionCount: Number(block.transactionCount),
      })),
      scannedBlockCount: Number(scan.scannedBlockCount),
    };
  } finally {
    client.release();
  }
};

/**
 * Find node_transaction rows which will expire before the provided timestamp.
 */
export const getMempoolTransactionsExpiringBefore = async ({
  expiresBefore,
  expirationMs,
}: {
  expirationMs: number;
  expiresBefore: Date;
}): Promise<ExpiringMempoolTransaction[]> => {
  const expirationInterval = `${expirationMs}::double precision * interval '1 millisecond'`;
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    const transactions = await client.query<{
      expiresAt: string;
      hash: string;
      nodeInternalId: string;
      nodeName: string;
      transactionInternalId: string;
      validatedAt: string;
    }>(/* sql */ `
SELECT encode(transaction.hash, 'hex') AS "hash",
       node.name AS "nodeName",
       node_transaction.node_internal_id AS "nodeInternalId",
       node_transaction.transaction_internal_id AS "transactionInternalId",
       node_transaction.validated_at::text AS "validatedAt",
       (node_transaction.validated_at + (${expirationInterval}))::text AS "expiresAt"
  FROM node_transaction
  JOIN node
    ON node.internal_id = node_transaction.node_internal_id
  JOIN transaction
    ON transaction.internal_id = node_transaction.transaction_internal_id
  WHERE node_transaction.validated_at + (${expirationInterval}) <= ${dateToTimestampWithoutTimezone(
      expiresBefore
    )}
  ORDER BY "expiresAt", "nodeName", "hash";
`);
    return transactions.rows.map((transaction) => ({
      expiresAt: timestampWithoutTimezoneToDate(transaction.expiresAt),
      hash: transaction.hash,
      nodeInternalId: Number(transaction.nodeInternalId),
      nodeName: transaction.nodeName,
      transactionInternalId: Number(transaction.transactionInternalId),
      validatedAt: timestampWithoutTimezoneToDate(transaction.validatedAt),
    }));
  } finally {
    client.release();
  }
};

/**
 * Archive node_transaction rows for transactions that are already accepted or
 * replaced by accepted blocks for the same node. This repairs historical rows
 * missed when block inclusions are added after the node_block trigger has
 * already fired.
 */
export const archiveMempoolTransactionsAcceptedByBlocks = async (): Promise<
  ArchivedMempoolTransaction[]
> => {
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    const result = await client.query<{
      hash: string;
      nodeName: string;
      replacedAt: string | null;
    }>(/* sql */ `
WITH directly_accepted AS (
    SELECT node_transaction.node_internal_id,
           node_transaction.transaction_internal_id,
           NULL::timestamp without time zone AS replaced_at
      FROM node_transaction
      JOIN block_transaction
        ON block_transaction.transaction_internal_id = node_transaction.transaction_internal_id
      JOIN node_block
        ON node_block.node_internal_id = node_transaction.node_internal_id
       AND node_block.block_internal_id = block_transaction.block_internal_id
),
replaced_by_accepted AS (
    SELECT node_transaction.node_internal_id,
           node_transaction.transaction_internal_id,
           MIN(node_block.accepted_at) AS replaced_at
      FROM node_transaction
      JOIN input mempool_input
        ON mempool_input.transaction_internal_id = node_transaction.transaction_internal_id
      JOIN input accepted_input
        ON accepted_input.outpoint_transaction_hash = mempool_input.outpoint_transaction_hash
       AND accepted_input.outpoint_index = mempool_input.outpoint_index
       AND accepted_input.transaction_internal_id != node_transaction.transaction_internal_id
      JOIN block_transaction
        ON block_transaction.transaction_internal_id = accepted_input.transaction_internal_id
      JOIN node_block
        ON node_block.node_internal_id = node_transaction.node_internal_id
       AND node_block.block_internal_id = block_transaction.block_internal_id
      WHERE mempool_input.outpoint_transaction_hash != '\\x0000000000000000000000000000000000000000000000000000000000000000'::bytea
      GROUP BY node_transaction.node_internal_id,
               node_transaction.transaction_internal_id
),
archive_candidates AS (
    SELECT node_internal_id, transaction_internal_id, replaced_at
      FROM directly_accepted
    UNION ALL
    SELECT node_internal_id, transaction_internal_id, replaced_at
      FROM replaced_by_accepted
),
archive_rows AS (
    SELECT node_internal_id,
           transaction_internal_id,
           CASE
             WHEN bool_or(replaced_at IS NULL) THEN NULL::timestamp without time zone
             ELSE MIN(replaced_at)
           END AS replaced_at
      FROM archive_candidates
      GROUP BY node_internal_id, transaction_internal_id
),
deleted_rows AS (
    DELETE FROM node_transaction
      USING archive_rows
      WHERE node_transaction.node_internal_id = archive_rows.node_internal_id
        AND node_transaction.transaction_internal_id = archive_rows.transaction_internal_id
      RETURNING node_transaction.node_internal_id,
                node_transaction.transaction_internal_id,
                node_transaction.validated_at,
                archive_rows.replaced_at
),
inserted_history AS (
    INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
      SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at
        FROM deleted_rows
      RETURNING node_internal_id, transaction_internal_id, replaced_at
)
SELECT encode(transaction.hash, 'hex') AS "hash",
       node.name AS "nodeName",
       inserted_history.replaced_at::text AS "replacedAt"
  FROM inserted_history
  JOIN node
    ON node.internal_id = inserted_history.node_internal_id
  JOIN transaction
    ON transaction.internal_id = inserted_history.transaction_internal_id
  ORDER BY "nodeName", "hash";
`);
    return result.rows.map((row) => ({
      hash: row.hash,
      nodeName: row.nodeName,
      replacedAt:
        row.replacedAt === null
          ? null
          : timestampWithoutTimezoneToDate(row.replacedAt),
    }));
  } finally {
    client.release();
  }
};

/**
 * Archive a single node_transaction row. Existing history triggers handle any
 * same-node descendants with the same replaced_at timestamp.
 */
export const archiveMempoolTransaction = async ({
  nodeInternalId,
  replacedAt,
  transactionInternalId,
}: {
  nodeInternalId: number;
  replacedAt: Date;
  transactionInternalId: number;
}) => {
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    const result = await client.query<{
      archivedCount: number;
    }>(
      /* sql */ `
WITH deleted_row AS (
    DELETE FROM node_transaction
      WHERE node_internal_id = $1
        AND transaction_internal_id = $2
      RETURNING node_internal_id,
                transaction_internal_id,
                validated_at,
                ${dateToTimestampWithoutTimezone(replacedAt)} AS replaced_at
),
inserted_history AS (
    INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
      SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at
        FROM deleted_row
      RETURNING transaction_internal_id
)
SELECT COUNT(*)::integer AS "archivedCount" FROM inserted_history;
`,
      [nodeInternalId, transactionInternalId]
    );
    return result.rows[0]!.archivedCount;
  } finally {
    client.release();
  }
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const nodeInternalIdQuery = await client.query<{ internal_id: number }>(
    registerNode,
    [
      node.nodeName,
      node.protocolVersion,
      node.userAgent,
      node.latestConnectionBeganAt,
    ]
  );
  const internalId = nodeInternalIdQuery.rows[0]!.internal_id;
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
), output_values (output_index, value_satoshis, locking_bytecode, token_category, fungible_token_amount, nonfungible_token_capability, nonfungible_token_commitment) AS (
  VALUES ${transaction.outputs
    .map(
      (output, outputIndex) =>
        `(${outputIndex}::bigint, ${output.valueSatoshis.toString()}::bigint, '${hexToByteaString(
          output.lockingBytecode
        )}'::bytea, ${
          output.tokenCategory === undefined
            ? 'NULL::bytea'
            : `'${hexToByteaString(output.tokenCategory)}'::bytea`
        }, ${
          output.fungibleTokenAmount === undefined
            ? 'NULL'
            : `${output.fungibleTokenAmount.toString()}::bigint`
        }, ${
          output.nonfungibleTokenCapability === undefined
            ? 'NULL'
            : `'${output.nonfungibleTokenCapability}'::enum_nonfungible_token_capability`
        }, ${
          output.nonfungibleTokenCommitment === undefined
            ? 'NULL'
            : `'${hexToByteaString(output.nonfungibleTokenCommitment)}'::bytea`
        })`
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
), new_transaction (transaction_hash, transaction_internal_id) AS (
  INSERT INTO transaction (hash, version, locktime, size_bytes, is_coinbase)
    SELECT hash, version, locktime, size_bytes, is_coinbase FROM transaction_values
    ON CONFLICT ON CONSTRAINT "transaction_hash_key" DO NOTHING
    RETURNING hash AS transaction_hash, internal_id AS transaction_internal_id
), insert_outputs AS (
  INSERT INTO output (transaction_hash, output_index, value_satoshis, locking_bytecode, token_category, fungible_token_amount, nonfungible_token_capability, nonfungible_token_commitment)
    SELECT transaction_hash, output_index, value_satoshis, locking_bytecode, token_category::bytea, fungible_token_amount::bigint, nonfungible_token_capability::enum_nonfungible_token_capability, nonfungible_token_commitment::bytea FROM output_values CROSS JOIN new_transaction
), insert_inputs AS (
  INSERT INTO input (transaction_internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode)
    SELECT transaction_internal_id, input_index, outpoint_index, sequence_number, outpoint_transaction_hash, unlocking_bytecode FROM input_values CROSS JOIN new_transaction
)
SELECT COUNT(*) FROM new_transaction;
`;
  const saveNodeValidations = /* sql */ `
WITH node_transaction_values (node_internal_id, validated_at) AS (
  VALUES ${nodeValidations
    .map(
      (validation) =>
        `(${
          validation.nodeInternalId
        }::bigint, ${dateToTimestampWithoutTimezone(validation.validatedAt)})`
    )
    .join(',')}
)
INSERT INTO node_transaction (node_internal_id, transaction_internal_id, validated_at)
  SELECT node_internal_id, $1::bigint, validated_at FROM node_transaction_values
  ON CONFLICT ON CONSTRAINT "node_transaction_pkey" DO NOTHING;
`;
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    await client.query('BEGIN;');
    await client.query(saveTransaction);
    const transactionInternalIdResult = await client.query<{
      internalId: string;
    }>(
      /* sql */ `SELECT internal_id AS "internalId" FROM transaction WHERE hash = $1;`,
      [Buffer.from(transaction.hash, 'hex')]
    );
    const transactionInternalId =
      transactionInternalIdResult.rows[0]?.internalId;
    if (transactionInternalId === undefined) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        `Failed to save or find transaction while recording node validation: ${transaction.hash}`
      );
    }
    await client.query(saveNodeValidations, [transactionInternalId]);
    await client.query('COMMIT;');
  } catch (err) {
    await client.query('ROLLBACK;');
    // eslint-disable-next-line functional/no-throw-statement
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Immediately mark a node as having validated a transaction already known to
 * exist in the database.
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
  // eslint-disable-next-line functional/no-try-statement
  try {
    await client.query(/* sql */ `
    WITH node_transaction_values (node_internal_id, validated_at) AS (
      VALUES (
      ${validation.nodeInternalId}::bigint,
      ${dateToTimestampWithoutTimezone(validation.validatedAt)}
      )
    ), known_transaction (transaction_internal_id) AS (
      SELECT internal_id
        FROM transaction
        WHERE hash = '${hexToByteaString(transactionHash)}'::bytea
    )
    INSERT INTO node_transaction (node_internal_id, transaction_internal_id, validated_at)
      SELECT node_internal_id, transaction_internal_id, validated_at
        FROM node_transaction_values
        CROSS JOIN known_transaction
      ON CONFLICT ON CONSTRAINT "node_transaction_pkey" DO NOTHING;
  `);
  } finally {
    client.release();
  }
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
      transactionCache.get(transaction.hash)?.db === true
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
unknown_output_values (transaction_hash, output_index, value_satoshis, locking_bytecode, token_category, fungible_token_amount, nonfungible_token_capability, nonfungible_token_commitment) AS (
  VALUES ${outputs
    .map(
      (output) =>
        `('${hexToByteaString(output.transactionHash)}'::bytea, ${
          output.outputIndex
        }::bigint, ${output.content.valueSatoshis.toString()}::bigint, '${hexToByteaString(
          output.content.lockingBytecode
        )}'::bytea, ${
          output.content.tokenCategory === undefined
            ? 'NULL::bytea'
            : `'${hexToByteaString(output.content.tokenCategory)}'::bytea`
        }, ${
          output.content.fungibleTokenAmount === undefined
            ? 'NULL::bigint'
            : `${output.content.fungibleTokenAmount.toString()}::bigint`
        }, ${
          output.content.nonfungibleTokenCapability === undefined
            ? 'NULL::enum_nonfungible_token_capability'
            : `'${output.content.nonfungibleTokenCapability}'::enum_nonfungible_token_capability`
        }, ${
          output.content.nonfungibleTokenCommitment === undefined
            ? 'NULL::bytea'
            : `'${hexToByteaString(
                output.content.nonfungibleTokenCommitment
              )}'::bytea`
        })`
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
  INSERT INTO output (transaction_hash, output_index, value_satoshis, locking_bytecode, token_category, fungible_token_amount, nonfungible_token_capability, nonfungible_token_commitment)
    SELECT transaction_hash, output_index, value_satoshis, locking_bytecode, token_category::bytea, fungible_token_amount::bigint, nonfungible_token_capability::enum_nonfungible_token_capability, nonfungible_token_commitment::bytea FROM unknown_output_values
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
new_or_existing_block (internal_id) AS (
  SELECT COALESCE (
    (SELECT internal_id FROM inserted_block),
    (SELECT internal_id FROM block WHERE block.hash = '${hexToByteaString(
      block.hash
    )}'::bytea)
  )
),
inserted_block_transactions AS (
  INSERT INTO block_transaction (block_internal_id, transaction_internal_id, transaction_index)
    SELECT blk.internal_id, tx.internal_id, tx.transaction_index
      FROM new_or_existing_block blk CROSS JOIN joined_transactions tx
    ON CONFLICT ON CONSTRAINT "block_transaction_pkey" DO NOTHING
    RETURNING transaction_internal_id
),
inserted_node_blocks AS (
  INSERT INTO node_block (node_internal_id, block_internal_id, accepted_at)
  SELECT node.node_internal_id, blk.internal_id, node.accepted_at
    FROM new_or_existing_block blk CROSS JOIN accepting_nodes node
  ON CONFLICT ON CONSTRAINT "node_block_pkey" DO NOTHING
  RETURNING block_internal_id
)
SELECT
  (SELECT COUNT(*)::bigint FROM joined_transactions) AS "joinedTransactionCount",
  (SELECT COUNT(*)::bigint FROM inserted_block_transactions) AS "insertedBlockTransactionCount",
  (SELECT COUNT(*)::bigint FROM inserted_node_blocks) AS "insertedNodeBlockCount";`;
  const client = await pool.connect();
  // eslint-disable-next-line functional/no-try-statement
  try {
    await client.query('BEGIN;');
    const saveTransactionsResult = await client.query<{ count: string }>(
      addAllTransactions
    );
    const attemptedSavedTransactions = blockTransactions.unknown;
    const savedTransactionCount = Number(saveTransactionsResult.rows[0]!.count);
    const transactionCacheMisses =
      attemptedSavedTransactions.length - savedTransactionCount;
    const addBlockResult = await client.query<{
      insertedBlockTransactionCount: string;
      insertedNodeBlockCount: string;
      joinedTransactionCount: string;
    }>(addBlockQuery);
    const joinedTransactionCount = Number(
      addBlockResult.rows[0]!.joinedTransactionCount
    );
    const linkedBlockTransactionCount = Number(
      (
        await client.query<{ count: string }>(
          /* sql */ `
          SELECT COUNT(*)::bigint AS count
            FROM block_transaction
            INNER JOIN block ON block.internal_id = block_transaction.block_internal_id
            WHERE block.hash = $1;
        `,
          [Buffer.from(block.hash, 'hex')]
        )
      ).rows[0]!.count
    );
    if (
      joinedTransactionCount !== block.transactions.length ||
      linkedBlockTransactionCount !== block.transactions.length
    ) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        `Failed to save all transactions for block ${block.height} (${block.hash}): joined ${joinedTransactionCount}/${block.transactions.length}, linked ${linkedBlockTransactionCount}/${block.transactions.length}.`
      );
    }
    await client.query('COMMIT;');
    return {
      attemptedSavedTransactions,
      transactionCacheMisses,
    };
  } catch (err) {
    await client.query('ROLLBACK;');
    // eslint-disable-next-line functional/no-throw-statement
    throw err;
  } finally {
    client.release();
  }
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
 * To maintain consistency, triggers which are disabled before initial sync must
 * be reenabled to clear any confirmed or conflicting transactions when a block
 * is accepted.
 */
export const reenableMempoolCleaning = async () => {
  const client = await pool.connect();
  await client.query(
    `ALTER TABLE node_block ENABLE TRIGGER trigger_public_node_block_insert;`
  );
  const triggerExists =
    // cspell:ignore tgrelid tgname
    (
      await client.query<{ triggerExists: boolean }>(/* sql */ `
SELECT EXISTS (
  SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'node_transaction_history'::regclass
      AND tgname = 'trigger_public_node_transaction_history_insert'
) AS "triggerExists";
`)
    ).rows[0]?.triggerExists === true;
  if (triggerExists) {
    await client.query(
      `ALTER TABLE node_transaction_history ENABLE TRIGGER trigger_public_node_transaction_history_insert;`
    );
  }
  client.release();
  return triggerExists;
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
 * Re-enable `synchronous_commit` for the database. (Returns false if
 * synchronous_commit was not disabled.)
 *
 * See `disableSynchronousCommit` for details.
 */
export const optionallyEnableSynchronousCommit = async () => {
  if (postgresSynchronousCommit) {
    return false;
  }
  const client = await pool.connect();
  await client.query(
    `DO $$ BEGIN execute 'ALTER DATABASE ' || current_database() || ' SET synchronous_commit TO ON'; END $$;`
  );
  client.release();
  return true;
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
    /* eslint-disable @typescript-eslint/naming-convention */
    blocks_done: string;
    blocks_total: string;
    tuples_done: string;
    tuples_total: string;
    /* eslint-enable @typescript-eslint/naming-convention */
  }>(/* sql */ `
SELECT a.query, p.blocks_total, p.blocks_done, p.tuples_total, p.tuples_done
FROM pg_stat_progress_create_index p
JOIN pg_stat_activity a ON p.pid = a.pid;
`);
  client.release();
  return computeIndexCreationProgress(res.rows);
};
