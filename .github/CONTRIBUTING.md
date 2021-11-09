# Contributing to Chaingraph

Thanks for your interest in contributing to Chaingraph! This guide should help you get started quickly.

## Install Node.js dependencies

In addition to [Node.js](https://nodejs.org/), you'll need [Yarn](https://yarnpkg.com/getting-started/install) for Node.js dependency management.

```sh
npm install -g yarn
```

Then install Chaingraph's dependencies:

```sh
yarn
```

In the rest of this document, you'll see a variety of package scripts used via yarn, e.g.:

```sh
yarn build # (builds Chaingraph from source files)
```

A variety of these package scripts have been added to establish common workflows and make development easier. You may find it valuable to read through the [`scripts` object in `package.json`](./../package.json) to get a sense for what is available.

## Install the `dev-cluster` dependencies

To start the local development cluster, you'll need [Docker](https://www.docker.com/), [`kubectl`](https://kubernetes.io/docs/reference/kubectl/overview/), [Helm](https://helm.sh/), and [`k3d`](https://github.com/rancher/k3d) installed on your machine. Below are some recommended installation strategies.

### macOS Quick Start

First, install [Docker for Desktop](https://www.docker.com/products/docker-desktop) – this is the easiest way to install and update Docker on macOS, and also provides an excellent menubar management GUI.

Once Docker for Desktop is installed, consider increasing the available resources in `Docker Desktop > Preferences...`. Additional `CPUs` and `Memory` can make syncing much faster.

Then, install [Homebrew](https://brew.sh/) (if it's not already installed) and run:

```sh
brew install kubectl k3d helm
brew link --overwrite kubernetes-cli # recommended to keep kubectl updated (Docker Desktop does not frequently updated kubectl)
```

### Ubuntu/Debian Quick Start

On Ubuntu/Debian, follow these installation guides:

- [Install Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/), then configure a `docker` user group to [allow Docker to be run by your non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
- [Install `kubectl` on Ubuntu](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-using-native-package-management)
- Install [`k3d`](https://github.com/rancher/k3d) using the installation script or by building from source.
- [Install Helm from Apt (Debian/Ubuntu)](https://helm.sh/docs/intro/install/#from-apt-debianubuntu)

### Windows Quick Start

TODO: pull requests welcome!

## Initialize your `dev-cluster`

Once the dependency are installed, initialize your `dev-cluster` with one of the following configurations:

```sh
# Built-in node instance, built-in Postgres (recommended on Linux)
yarn dev-cluster:init

# built-in Postgres (recommended on Linux with existing node)
yarn dev-cluster:init:local-node

# Local node and local Postgres (recommended on macOS and Windows)
yarn dev-cluster:init:local
```

When the command completes, review the Helm release notes printed to stdout for information about your development cluster.

The development cluster is an emulated multi-node [Kubernetes](https://kubernetes.io/) cluster running in Docker. This effectively simulates a production installation of Chaingraph while making it easy to start and stop the development cluster:

```sh
# start the cluster
yarn dev-cluster:start

# stop/pause the cluster
yarn dev-cluster:stop
```

When the development cluster is running, the built-in Bitcoin Cash node will automatically begin syncing (if configured), and all services required by Chaingraph will be available using the `dev-cluster:port-forward` package scripts. Be sure to review the [package scripts in package.json](../package.json) for a list of useful utilities.

By default, all cluster "development volumes" are placed in the `data` directory for easy access.

> Note: destroying and recreating the cluster should always leave the `data` directory in tact so the recreated cluster will continue where it left off. To also reset a volume, delete or rename the chosen directory within the `data` directory when re-creating the cluster.

If you've configured the cluster to use local resources (a locally-running node or Postgres instance), **continue with the setup instructions in the next sections**. If you're using all built-in resources, you're ready to start Chaingraph:

```sh
# Expose Hasura to local processes (in a separate shell)
yarn dev-cluster:port-forward:hasura

# Build Chaingraph
yarn build

# Start Chaingraph locally
yarn start

# Optional: open Hasura console (in a separate shell)
yarn dev-cluster:hasura:console
```

Note, Hasura CLI is installed and managed by Yarn using the [`hasura-cli`](https://www.npmjs.com/package/hasura-cli/) package. Package scripts will use the installed `hasura` binary automatically; to use the Hasura CLI manually outside of a package script, use `npx`, e.g. `npx hasura help`. (Most manual commands will also require the admin secret, i.e. `--admin-secret=very_insecure_hasura_admin_secret_key`.)

## Syncing from a local node (outside the cluster)

By default, the Chaingraph `dev-cluster` provides a good development environment on all platforms. However, for the best possible performance during development, you can also sync Chaingraph from a local Bitcoin Cash node (allowing for bare-metal node performance). With a little setup, there are several package scripts which make development faster and easier.

### Development with Bitcoin Cash Node (BCHN)

#### Connecting to an always-on node

If you're already running a node locally 24/7, you need only to add `whitelist=127.0.0.1` to your `bitcoin.conf` file, then restart the node. (This prevents your local node from banning Chaingraph during development.)

#### Running a local node during development

First, symbolically link the executable as `bitcoin-bchn` in `node_modules/.bin` or in your `$PATH`. Some examples:

```sh
cd chaingraph # (from the project root)

# using the daemon, temporary link
ln -s /path/to/bitcoin-cash-node/build/src/bitcoind node_modules/.bin/bitcoin-bchn
# GUI on macOS, temporary link
ln -s /path/to/bitcoin-cash-node/build/src/qt/BitcoinCashNode-Qt.app/Contents/MacOS/BitcoinCashNode-Qt node_modules/.bin/bitcoin-bchn
# using a globally-installed bitcoind, temporary link
ln -s $(which bitcoind) node_modules/.bin/bitcoin-bchn
# linking in $PATH (survives `yarn`/`yarn install`)
ln -s /path/to/bitcoin-cash-node/build/src/bitcoind /usr/local/bin/bitcoin-bchn
```

If you already have a data directory on the local machine, you can skip syncing by linking it directly into `data/bchn-local`. If you don't have a synced data directory locally (or want to sync from scratch), simply create the `data/bchn-local` directory.

```sh
# link an existing data directory
ln -s /path/to/existing/data/dir data/bchn-local
# sync from scratch
mkdir -p data/bchn-local
```

Finally, ensure `data/bchn-local/bitcoin.conf` exists. Here's a reasonable configuration:

```conf
printtoconsole=1
rpcallowip=::/0
rpcpassword=password
rpcuser=bitcoin

# whitelist localhost to avoid accidentally banning Chaingraph during development
whitelist=127.0.0.1
# port on which this node will listen
port=8333
# Uncomment this to debug P2P network messaging
# debug=net
```

> Tip: If you'd like to use the CLI, you can pass this `datadir` to `bitcoin-cli` to automatically use the correct RPC credentials:
>
> ```
> bitcoin-cli -datadir=$PWD/data/bchn-local
> ```

Now you can run `yarn local:bchn` to start the local node.

Once you have a local node running, you can conserve local resources by spinning down the node running inside the `dev-cluster`:

```sh
yarn dev-cluster:spin-down:bchn
```

## Using a local Postgres instance (outside the cluster)

On Windows and macOS, the performance of Postgres inside the development cluster can be be much slower than a native, local instance. (When not running on Linux, the cluster runs in a linux VM, reducing performance.)

To use a local Postgres instance, first install Postgres for your operating system, and make sure the `postgres` command works in your shell. To initialize the database run:

```sh
yarn local:postgres:init
```

This will create the database at `./data/postgres-local`. (If this directory is not on a fast SSD, consider using symlinks to move it there now – improving the disk performance for this directory will significantly speed up sync and query times.) To start the database, run:

```sh
yarn local:postgres
```

In a new shell (with the database running), run:

```sh
yarn local:postgres:tune
```

to tune the database settings for Chaingraph, then stop and restart the database in the original shell to ensure the options take effect.

To configure the dev cluster for a local Postgres instance, recreate it by running:

```sh
yarn dev-cluster:destroy
yarn dev-cluster:init:local
```

(Note: destroying and recreating the cluster should always leave the `data` directory intact, so the recreated cluster will continue where it left off. To also reset a volume, delete or rename the chosen directory within the `data` directory when re-creating the cluster.)

## Running End-to-End (E2E) Tests

Chaingraph's end-to-end (e2e) tests validate the functionality of the Chaingraph agent, the thin TypeScript application which is responsible for connecting to trusted nodes and keeping the database in sync.

The e2e tests require a Postgres database to be exposed at port 5432, but are otherwise self contained (a set of trusted nodes are emulated by the e2e tests):

```sh
# Ensure a Postgres database is available:
yarn dev-cluster:port-forward:postgres
# OR
yarn local:postgres

# In a separate session:
yarn build && yarn test:e2e

# Follow logs:
yarn log:e2e # OR for more detail: yarn log:e2e:trace
```

The e2e tests will wipe and recreate the `chaingraph_e2e_test` database, running all tests against the newly created database. To allow manual review, the `chaingraph_e2e_test` database is only deleted when the e2e tests are re-run.

### Reviewing the E2E Test Database

You can run Hasura against the `chaingraph_e2e_test` database by modifying the `Data Source` in the Hasura Console.

While running `yarn dev-cluster:hasura:console`, edit the `default` data source (http://localhost:8013/console/data/manage/edit/default) to use the proper database URL. With Chaingraph's default package script settings:

`postgres://chaingraph:very_insecure_postgres_password@host.k3d.internal:5432/chaingraph_e2e_test`

To reverse this change, reconfigure the data source to use the previously set environment variable:

`HASURA_GRAPHQL_DATABASE_URL`

### Debugging E2E Postgres Function Tests

To debug Postgres functions tested by the e2e tests, see the setup instructions in [Using PgAdmin](#using-pgadmin). You'll need to set a breakpoint in the e2e test you wish to debug (after the re-creation of the database). Once the e2e tests are paused at that breakpoint, run `CREATE EXTENSION pldbgapi;` in the newly created `chaingraph_e2e_test` database, then set a breakpoint on the proper function in PgAdmin. Once the e2e test calls the breakpoint-ed Postgres function, you'll be able to step through its execution in PgAdmin.

> Note: if you're using `yarn local:postgres` and you encounter the error `password authentication failed for user "chaingraph"` after following the above instructions, it's possible that Docker is interfering with the connection between the end-to-end tests and Postgres (even if Postgres is confirmed to be listening on port `5432`). Try restarting Docker while Postgres is running, and the issue may be resolved.

# Development Tips

This section is used to offer useful advice and document unintuitive behaviors for new contributors.

## Resolving development cluster problems

To inspect the state of your development cluster, run:

```sh
kubectl get pods
```

You can find more detailed information about each pod (and any errors) by running:

```sh
kubectl describe pod <pod-name>
```

Replace `<pod-name>` with the name of the pod returned by `get pods`.

### Networking Issues

Occasionally, local networking on a development machine will exhibit unexpected behavior while Docker is running, e.g. **web servers, local Postgres databases, and other applications apparently listening but not responding on local ports**.

Particularly for development clusters running on non-linux machines, a surprising number of networking issues can be resolved by either **restarting Docker or restarting the host machine**.

### Docker Disk Pressure Issue (`NodeHasDiskPressure`)

One of the most common issues you may eventually experience is [pod eviction due to lack of disk space in the Docker filesystem](https://k3d.io/faq/faq/#pods-evicted-due-to-lack-of-disk-space). This most often occurs when (re)creating the cluster.

If this occurs, you'll find warnings in each pod description (`kubectl describe pods`) like: `0/3 nodes are available: 3 node(s) had taint {node.kubernetes.io/disk-pressure: }, that the pod didn't tolerate.`. You can see further details with `kubectl describe nodes`.

The quickest solution is to increase the `Disk Image Size` in your Docker `Resources` settings. When Docker is restarted and the `dev-cluster` detects the newly available space, any previously failing pods will be restarted.

You can also resolve this issue by cleaning up existing Docker filesystem space, or you can try one of the [other solutions mentioned in the k3d FAQs](https://k3d.io/faq/faq/#pods-evicted-due-to-lack-of-disk-space).

## Database schema changes and Hasura migrations

To run the Hasura console, first start the port-forwarder for Hasura:

```
yarn dev-cluster:port-forward:hasura
```

Then run the Hasura console:

```sh
yarn dev-cluster:hasura:console
```

Your changes in the Hasura console will be recorded directly to both the current database and to `images/hasura/hasura-data`.

After making changes in Hasura, if you re-create the Postgres database, you will find that **your changes will not be applied during the initial migration at Hasura startup**. This is because the `chaingraph/hasura` image has not been updated inside the development cluster. Usually, the easiest solution is to simply reset the cluster:

```sh
yarn dev-cluster:reset:local
```

This will destroy and recreate the cluster, recreate the local `chaingraph/hasura` image, push the new image to the cluster, and re-deploy Chaingraph. Also, please consider [squashing migrations](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_migrate_squash.html) into a single migration.

## Using PgAdmin

The PgAdmin interface is great for monitoring DB usage and open connections, and it can also be useful for writing and debugging queries. The pgAdmin instance configured by Chaingraph is intended for use only in development environments – to use it in a production environment, you'll need to evaluate the configuration for security.

To enable pgAdmin, use `--set pgAdmin.enable=true` while installing the Chaingraph chart. To view the web interface, forward the port locally:

```sh
yarn dev-cluster:port-forward:pgadmin
```

To enable debugging, you'll need to enable the `pldbgapi` extension. If you're using the `local-node` configuration, this can be done in one command:

```sh
yarn dev-cluster:upgrade:local-node-enable-pldbgapi
# Once the cluster has restarted:
yarn local:postgres:enable-pldbgapi
```

You'll also need to first run `CREATE EXTENSION pldbgapi;` in any database you'd like to debug. Consider using [PgAdmin's debugging interface](https://www.pgadmin.org/docs/pgadmin4/latest/debugger.html) for stepping through PL/pgSQL functions.

## Using PgHero

The PgHero application is useful for identifying slow queries and indexing opportunities, reviewing database table and index sizes, and handling other performance and maintenance-related tasks. The pgAdmin instance configured by Chaingraph is intended for use only in development environments – to use it in a production environment, you'll need to evaluate and configure it for security (e.g. [set up a dedicated user](https://github.com/ankane/pghero/blob/048bb39bc55d83cdc8ece9281ad71fda413c9a12/guides/Permissions.md)).

To enable pgAdmin, use `--set pgHero.enable=true` while installing the Chaingraph chart. To view the web interface, forward the port locally:

```sh
yarn dev-cluster:port-forward:pghero
```

For full functionality, you'll also need to enable the `pg_stat_statements` extension:

```sh
# If using the built-in Postgres, make its port accessible for the next command:
yarn dev-cluster:port-forward:postgres

# Connect to the database and update settings:
yarn local:postgres:configure-pghero-step-1

# Then restart Postgres –
# If using the built-in Postgres:
yarn dev-cluster:bounce:postgres
# OR – if using the local Postgres, restart the server:
yarn local:postgres

# Once the database has restarted, run the remaining configuration script:
yarn local:postgres:configure-pghero-step-2
```

## Using Prod-Sim Scripts

A set of scripts attempt to simulate a production installation as closely as possible by building all images locally. This can be useful for debugging Kubernetes networking and configuration issues. See the relevant scripts for details:

```
grep "prod-sim" package.json
```

Note, `prod-sim` clusters are often much slower than the above `local` configurations on non-Linux operation systems (as all containers must run in VMs).

# Notes on Design Decisions

This section is used to document the rationale behind various design decisions.

## Use of `bigint` for `uint32` in Postgres

Currently, Chaingraph stores values commonly represented in `uint32` format using the `bigint` data type. This is because [Postgres doesn't support unsigned integer types](https://stackoverflow.com/questions/20810134/why-unsigned-integer-is-not-available-in-postgresql), and storing these values as `bigint` makes working with the database much simpler (at relatively little cost). This is something we might want to optimize in the future.

## Use of `transaction_hash` `bytea` type as primary key for `output`s

Each `output` could consume less storage by referencing a `transaction_internal_id` `bigint` (8 bytes) – as with `input`s – rather than the current `transaction_hash` `bytea` value (32 bytes). Multiplied across ~800,000,000 outputs (late 2020), this accounts for ~20GB of increased base database storage.

Currently, this column must be denormalized to enable the `spent_by` Hasura relationship (`input.(outpoint_index, outpoint_transaction_hash) → output.(output_index,transaction_hash)`). This space could be saved if Hasura relationships could be defined to reference "through" another table, e.g. `input.(outpoint_index, transaction.hash WHERE outpoint_transaction_id = transaction.internal_id ) → input.(outpoint_index,transaction_hash)`.

## Wrapping Hasura image for migrations/metadata

Because Hasura expects migrations to use a multi-level directory structure, mounting Hasura migrations from a Kubernetes ConfigMap is fairly complex. To keep things simpler, we create a new Docker image from the `hasura/graphql-engine` `cli-migrations-v3` image, bundling the necessary files for Chaingraph. This is potentially simpler for downstream users too, who can easily substitute their own image in the Chaingraph Helm chart.
