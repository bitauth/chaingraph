/* eslint-disable camelcase, @typescript-eslint/naming-convention */
export const indexDefinitions = {
  block_height_index: /* sql */ `CREATE INDEX block_height_index ON block USING btree (height);`,
  block_inclusions_index: /* sql */ `CREATE INDEX block_inclusions_index ON block_transaction USING btree (transaction_internal_id);`,
  output_search_index: /* sql */ `CREATE INDEX output_search_index ON output USING btree (substring(locking_bytecode, 0, 26));`,
  spent_by_index: /* sql */ `CREATE INDEX spent_by_index ON input USING btree (outpoint_transaction_hash, outpoint_index);`,
};
/* eslint-enable camelcase, @typescript-eslint/naming-convention */

/**
 * Based on the typical Chaingraph workload, the table scanning phase of index
 * building is counted as 40% of progress, while the 'loading tuples in tree'
 * phase is counted as the remaining 60%. Because there is a pause between these
 * step which can't be measured, this method will briefly return `4*` until
 * tuple loading has begun.
 */
export const computeIndexCreationProgress = (
  progressQueryResult: {
    query: string;
    /* eslint-disable camelcase, @typescript-eslint/naming-convention */
    blocks_done: string;
    blocks_total: string;
    tuples_done: string;
    tuples_total: string;
    /* eslint-enable camelcase, @typescript-eslint/naming-convention */
  }[]
) => {
  const tableScanningPhasePercent = 40;
  const tupleLoadingPhasePercent = 60;
  return progressQueryResult
    .map((row) => {
      const indexName = Object.keys(indexDefinitions).find((name) =>
        row.query.includes(name)
      );
      if (indexName === undefined) {
        return undefined;
      }
      return [
        indexName,
        row.tuples_total === '0'
          ? Math.round(
              (Number(row.blocks_done) / Number(row.blocks_total)) *
                tableScanningPhasePercent
            ).toString()
          : row.tuples_done === '0'
          ? '4*'
          : Math.round(
              (Number(row.tuples_done) / Number(row.tuples_total)) *
                tupleLoadingPhasePercent +
                tableScanningPhasePercent
            ).toString(),
      ] as [keyof typeof indexDefinitions, string];
    })
    .filter(
      (progressItem): progressItem is [keyof typeof indexDefinitions, string] =>
        progressItem !== undefined
    );
};
