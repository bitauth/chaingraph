DO $$
DECLARE
  previous_suppression text := current_setting('chaingraph.suppress_mempool_descendant_cascade', true);
BEGIN
  /*
   * The backfill archives the full existing orphan set itself. If the
   * node_transaction_history trigger is enabled while this migration runs,
   * suppress its re-entry from the archive INSERT below.
   */
  PERFORM set_config('chaingraph.suppress_mempool_descendant_cascade', 'on', true);

  BEGIN
    WITH RECURSIVE orphan_transactions AS (
        -- Seed: mempool transactions whose parent was already archived as replaced.
        SELECT nt.node_internal_id,
               nt.transaction_internal_id,
               nt.validated_at,
               nth.replaced_at
            FROM node_transaction nt
            INNER JOIN input child_input
                ON child_input.transaction_internal_id = nt.transaction_internal_id
            INNER JOIN transaction parent_transaction
                ON parent_transaction.hash = child_input.outpoint_transaction_hash
            INNER JOIN output parent_output
                ON parent_output.transaction_hash = parent_transaction.hash
               AND parent_output.output_index      = child_input.outpoint_index
            INNER JOIN node_transaction_history nth
                ON nth.transaction_internal_id = parent_transaction.internal_id
               AND nth.node_internal_id        = nt.node_internal_id
            WHERE nth.replaced_at IS NOT NULL

        UNION

        -- Recursive step: mempool transactions spending outputs of known orphans.
        SELECT child_nt.node_internal_id,
               child_nt.transaction_internal_id,
               child_nt.validated_at,
               parent_orphans.replaced_at
            FROM orphan_transactions parent_orphans
            INNER JOIN transaction parent_transaction
                ON parent_transaction.internal_id = parent_orphans.transaction_internal_id
            INNER JOIN output parent_output
                ON parent_output.transaction_hash = parent_transaction.hash
            INNER JOIN input child_input
                ON child_input.outpoint_transaction_hash = parent_output.transaction_hash
               AND child_input.outpoint_index            = parent_output.output_index
            INNER JOIN node_transaction child_nt
                ON child_nt.transaction_internal_id = child_input.transaction_internal_id
               AND child_nt.node_internal_id        = parent_orphans.node_internal_id
    ),
    orphans AS (
        -- If reachable through multiple replaced parents, use earliest invalidation.
        SELECT node_internal_id,
               transaction_internal_id,
               validated_at,
               MIN(replaced_at) AS replaced_at
            FROM orphan_transactions
            GROUP BY node_internal_id, transaction_internal_id, validated_at
    ),
    deleted_orphans AS (
        DELETE FROM node_transaction
            USING orphans
            WHERE node_transaction.node_internal_id        = orphans.node_internal_id
              AND node_transaction.transaction_internal_id = orphans.transaction_internal_id
            RETURNING node_transaction.node_internal_id,
                      node_transaction.transaction_internal_id,
                      node_transaction.validated_at,
                      orphans.replaced_at
    )
    INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
        SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at
            FROM deleted_orphans;
  EXCEPTION WHEN OTHERS THEN
    PERFORM set_config(
      'chaingraph.suppress_mempool_descendant_cascade',
      COALESCE(previous_suppression, 'off'),
      true
    );
    RAISE;
  END;

  PERFORM set_config(
    'chaingraph.suppress_mempool_descendant_cascade',
    COALESCE(previous_suppression, 'off'),
    true
  );
END;
$$;
