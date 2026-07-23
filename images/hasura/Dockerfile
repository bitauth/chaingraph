
# Multi-arch tag; digest of the manifest list as of 2026-07-20:
# sha256:da573f6420bfbc330023dd4b816c1e6fcb50ab6a00fd3e1d8c70088532d5fa7f
# NOTE: first startup against an existing database performs a ONE-WAY
# metadata catalog upgrade (47 -> current). Snapshot/backup hdb_catalog
# before deploying to an instance you may want to roll back.
FROM hasura/graphql-engine:v2.49.5.cli-migrations-v3

COPY hasura-data /hasura-data

ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/hasura-data/migrations HASURA_GRAPHQL_METADATA_DIR=/hasura-data/metadata
