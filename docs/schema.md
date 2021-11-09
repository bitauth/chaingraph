# Chaingraph Schema

This document describes the database schema used by Chaingraph, including the rationale behind various design decisions.

## Overview

Chaingraph stores all chain data in a Postgres SQL database, maintaining consistency between a set of trusted nodes and the Chaingraph database state.

## Data Model

This section details the data model used by Chaingraph, including tables, columns, computed fields, relationships, and indexes.

> This section is derived from the comments/documentation which are built into the SQL schema. Changes to this section should be applied in the database via [SQL migration](../images/hasura/hasura-data/migrations/).

_TODO: auto-generate from GraphQL schema._ <!-- TODO: export schema from SQL COMMENTs/Hasura -->

**For now please [review the database initialization SQL file](../images/hasura/hasura-data/migrations/default/1616195337538_init/up.sql).**

## Mutability

The Chaingraph data model reduces the base table sizes by de-duplicating many common fields.

For example, where other indexers might store `fee_satoshis` in each `transaction` row, Chaingraph uses a stored procedure to compute each `fee_satoshis` value when requested. For applications which commonly require this field, the `transaction_fee_satoshis_index` can be created to effectively pre-compute this value for all transactions. This strategy offers the best of both worlds: applications which don't require fast aggregation of this field save `~2.5GB`, while applications which require fast aggregation can still get equivalent performance to an in-table `fee_satoshis` column.

This field de-duplication strategy can significantly reduce database storage requirements, but to achieve good performance, it requires a strict immutability policy across many tables: if – for example – a single `output` record is deleted, the `transaction` record it references will begin to misreport its `fee_satoshis` value, since the `transaction_fee_satoshis` method subtracts the sum of output values from the sum of input values.

For this reason, the database schema includes triggers which serve to prevent various child records from being deleted without also deleting the parent record. These limitations are important for avoiding data corruption: applications which attempt to delete or mutate records should carefully evaluate if those strategies compromise the integrity of the Chaingraph database.

<!-- TODO: additional triggers to prevent corruption via deletions -->

## Approximate Space Usage

The Chaingraph database **requires approximately 300% of raw blockchain size** (approximately the base storage space required by the Satoshi implementation without `txindex`). Up to ~10% of this overhead is due to less storage-efficient integers in Postgres ([`bigint` is the minimum-sized column](../.github/CONTRIBUTING.md#use-of-bigint-for-uint32-in-postgres)), and the remaining overhead is due to required indexes – primary keys and indexes which enable fast lookups by hash, height, locking bytecode, and spent output.

Immediately after the initial sync, Chaingraph attempts to build any missing required indexes – depending on the memory available to Postgres, index building can require significantly more storage space than is ultimately needed after index creation. To accommodate, it can be valuable to allocate ~20% of additional storage space for initial indexing (and future expansion), for a total of ~320% of raw blockchain size.

_For example, as of October 2021, archival, mainnet [BCHN](https://bitcoincashnode.org/) full nodes required ~191 GB, while Chaingraph's Postgres database required ~574 GB. Given the 320% target, the recommended Postgres volume size was at least ~611 GB to sync a new Chaingraph deployment._

If index creation fails, Chaingraph will restart and try again – simply [expand the volume](../charts/chaingraph/readme.md#expanding-volumes) provisioned to Postgres, and index creation should complete successfully.

Multi-node, multi-chain deployments share common history, so only divergent blocks require additional block space. Independent transaction validation and block acceptance histories are stored for each node, increasing storage requirements by a negligible amount. (Additional `node_block` records require `16 bytes * block count` bytes per node – about 10 MB on BCH mainnet, and `node_transaction` records require `24 bytes * mempool TX count` per node – about 2.5 MB for 100,000 transactions.)
