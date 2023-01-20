# Before use, Postgres version must be updated to match version specified in values.yaml.

FROM postgres:14.6

ENV PG_MAJOR 14
ENV PG_FULL 14.6

RUN apt-get update \
  && apt-cache showpkg postgresql-$PG_MAJOR-pldebugger \
  && apt-get install -y --no-install-recommends postgresql-$PG_MAJOR-pldebugger

EXPOSE 5432

# To enable pldebugger, run `CREATE EXTENSION pldbgapi;`
# Consider using pgAdmin for debugging: https://www.pgadmin.org/docs/pgadmin4/latest/debugger.html
