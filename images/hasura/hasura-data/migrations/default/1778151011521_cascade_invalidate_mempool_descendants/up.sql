CREATE OR REPLACE FUNCTION trigger_node_transaction_history_insert() RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  /*
   * The recursive CTE archives the full descendant set in one pass. The
   * archive INSERT below re-fires this trigger, but that re-entry should return
   * immediately rather than attempting another cascade.
   */
  IF current_setting('chaingraph.suppress_mempool_descendant_cascade', true) = 'on' THEN
    RETURN NULL;
  END IF;

  -- Confirmations and empty batches do not invalidate descendants.
  IF NOT EXISTS (SELECT 1 FROM new_table WHERE replaced_at IS NOT NULL) THEN
    RETURN NULL;
  END IF;

  PERFORM set_config('chaingraph.suppress_mempool_descendant_cascade', 'on', true);

  BEGIN
    /*
     * If another session deletes matching descendants before this DELETE
     * reaches them, this archives zero rows. Suppression still prevents empty
     * self-reentry.
     */
    WITH RECURSIVE descendant_transactions AS (
        -- Seed: mempool transactions spending outputs of newly replaced parents.
        SELECT nt.node_internal_id,
               nt.transaction_internal_id,
               nt.validated_at,
               replaced_parents.replaced_at
            FROM new_table replaced_parents
            INNER JOIN transaction parent_transaction
                ON parent_transaction.internal_id = replaced_parents.transaction_internal_id
            INNER JOIN output parent_output
                ON parent_output.transaction_hash = parent_transaction.hash
            INNER JOIN input
                ON input.outpoint_transaction_hash = parent_output.transaction_hash
               AND input.outpoint_index            = parent_output.output_index
            INNER JOIN node_transaction nt
                ON nt.transaction_internal_id = input.transaction_internal_id
               AND nt.node_internal_id        = replaced_parents.node_internal_id
            WHERE replaced_parents.replaced_at IS NOT NULL

        UNION

        -- Recursive step: mempool transactions spending outputs of descendants.
        SELECT child_nt.node_internal_id,
               child_nt.transaction_internal_id,
               child_nt.validated_at,
               parent_descendants.replaced_at
            FROM descendant_transactions parent_descendants
            INNER JOIN transaction parent_transaction
                ON parent_transaction.internal_id = parent_descendants.transaction_internal_id
            INNER JOIN output parent_output
                ON parent_output.transaction_hash = parent_transaction.hash
            INNER JOIN input
                ON input.outpoint_transaction_hash = parent_output.transaction_hash
               AND input.outpoint_index            = parent_output.output_index
            INNER JOIN node_transaction child_nt
                ON child_nt.transaction_internal_id = input.transaction_internal_id
               AND child_nt.node_internal_id        = parent_descendants.node_internal_id
    ),
    descendants AS (
        -- If reachable through multiple replaced parents, use earliest invalidation.
        SELECT node_internal_id,
               transaction_internal_id,
               validated_at,
               MIN(replaced_at) AS replaced_at
            FROM descendant_transactions
            GROUP BY node_internal_id, transaction_internal_id, validated_at
    ),
    deleted_descendants AS (
        DELETE FROM node_transaction
            USING descendants
            WHERE node_transaction.node_internal_id        = descendants.node_internal_id
              AND node_transaction.transaction_internal_id = descendants.transaction_internal_id
            RETURNING node_transaction.node_internal_id,
                      node_transaction.transaction_internal_id,
                      node_transaction.validated_at,
                      descendants.replaced_at
    )
    INSERT INTO node_transaction_history (node_internal_id, transaction_internal_id, validated_at, replaced_at)
        SELECT node_internal_id, transaction_internal_id, validated_at, replaced_at
            FROM deleted_descendants;
  EXCEPTION WHEN OTHERS THEN
    PERFORM set_config('chaingraph.suppress_mempool_descendant_cascade', 'off', true);
    RAISE;
  END;

  PERFORM set_config('chaingraph.suppress_mempool_descendant_cascade', 'off', true);
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_public_node_transaction_history_insert
    AFTER INSERT ON node_transaction_history
    REFERENCING NEW TABLE AS new_table
    FOR EACH STATEMENT EXECUTE FUNCTION trigger_node_transaction_history_insert();
COMMENT ON TRIGGER trigger_public_node_transaction_history_insert ON node_transaction_history
  IS 'Cascades mempool invalidation recursively: when a node_transaction is archived to history with replaced_at set, all same-node descendants still present in node_transaction are archived with a deterministic replaced_at timestamp.';

-- disabled until initial sync is complete (when mempool transactions begin to be accepted)
ALTER TABLE node_transaction_history DISABLE TRIGGER trigger_public_node_transaction_history_insert;
