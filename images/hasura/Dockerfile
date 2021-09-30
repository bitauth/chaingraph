
FROM hasura/graphql-engine:v2.0.9.cli-migrations-v3

COPY hasura-data /hasura-data

ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/hasura-data/migrations HASURA_GRAPHQL_METADATA_DIR=/hasura-data/metadata
