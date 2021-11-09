# Architecture

Chaingraph is a [Kubernetes](https://kubernetes.io/) application which can be installed using [Helm](https://helm.sh/). The primary application component – the Chaingraph agent – connects to a set of trusted nodes using the standard P2P network protocol, writing all blocks and transactions relayed by those nodes to a [Postgres SQL](https://www.postgresql.org/) database. Separately, one or more [Hasura](https://hasura.io/) instances handle user API requests by reading from the Postgres database.

### Default Configuration

By default the Chaingraph chart automatically deploys all necessary application components to the most appropriate Kubernetes node(s): a testnet BCHN node and persistent storage volume, a Postgres database and persistent storage volume, a Hasura instance, and the agent instance.

While this default should work well for most use cases, users can also toggle most application components in the [Helm chart](../charts/chaingraph/readme.md) to manage them another way (e.g. using a hosted Postgres database, connecting to an existing set of trusted nodes, using Hasura Cloud, or deploying with another Kubernetes templating or management system).

### Initial Sync

When Chaingraph is first installed, any configured nodes will immediately begin syncing with the public network, the internal Postgres database will be created and configured (if enabled), and the agent will begin syncing historical blockchain data from the nodes to the configured database.

Note, most nodes derived from the Satoshi codebase are very unresponsive during their own Initial Block Download (IBD) phase, so it can take several hours before Chaingraph is able to get reliable responses from newly created nodes.

After the initial sync, the agent will pause syncing and create any enabled indexes before continuing to sync all transactions and blocks in realtime. Once started, if any application components experience downtime, they will be automatically restarted by Kubernetes.

### Codebase

This repo contains [templates for the Helm chart](../charts/chaingraph/), [Hasura configuration information](../images/hasura/hasura-data/) (including [Postgres database migrations](../images/hasura/hasura-data/migrations/)), the Chaingraph Agent [source code and tests](../src) (written in TypeScript), sources for [all container images](../images), a [package.json](../package.json) with a variety of scripts for common build and development tasks, and a [docs](./) directory.

### Cluster Requirements

Chaingraph can be installed on any Kubernetes cluster. For smaller, private, or test deployments, consider using the [`dev-cluster` deployment scripts](../.github/CONTRIBUTING.md) provided in this repo. For public deployments, the Chaingraph Helm chart can be installed on any in-house or cloud provider-managed cluster which supports persistent volume provisioning (e.g. DigitalOcean, AWS AKS, Google Cloud GKE, Azure, etc.).

Generally, it’s worth provisioning higher-powered Kubernetes nodes to speed up the initial sync and index creation, but ongoing maintenance can be handled by relatively lower-powered Kubernetes nodes.

Sync and index performance is typically bottlenecked on Postgres SSD read/write speed: if possible, provision NVMe SSD storage for the Postgres database (or use an external, managed Postgres database). Providing additional memory and compute power to the Postgres database can also significantly improve initial indexing times.

### Node Storage

During initial sync, Chaingraph relies on trusted nodes to provide historical blockchain data. After initial sync, it’s possible to switch trusted nodes to pruned mode, significantly reducing their storage requirements (this is not yet well supported, and periods of downtime greater than 48 hours will require nodes to be re-synced in unpruned mode).

Because node storage is not typically a bottleneck, it may also be possible to save resources by using slower disks for node storage than are used for Postgres storage.

### Database Storage

Blockchain data is normalized in the database – no blocks or transactions are duplicated even if received from nodes following two different chain tips (e.g. BCH and BTC). Because common history is shared between nodes, it’s often possible to add many different node versions and implementations without significantly impacting database storage requirements.

See also [Chaingraph's API Schema &rarr;](./schema.md)

### Performance & Scalability

Chaingraph is designed to focus on its role as an indexer and API backend – by design, it does not perform any validation on the data received from its trusted nodes. In effect, Chaingraph's purpose is to record what each connected node believes rather than to reach conclusions of its own.

This specialization significantly improves Chaingraph's performance. While node implementations must evaluate VM bytecode, compute all hashes, and check signatures, Chaingraph need only format and save data. As such, Chaingraph's only meaningful performance bottleneck is index access and disk write speed.

To benchmark Chaingraph's maximum performance on a particular cluster, connect a previously-synced Chaingraph instance to a new network (e.g. start with `testnet`, then add `mainnet`), allowing Chaingraph to sync the unknown history as it would be synced under real-time load. Performance is typically slower than initial sync because Postgres must also maintain indexes which aren't maintained during a typical [initial sync](#initial-sync).

As of October 2021, on a modest, directly connected SSD (as used in many laptops), Chaingraph typically saves 2000 to 6000 transactions per second (higher if the connected nodes are reading over the network or from a different disk). Using a single, dedicated NVMe SSD, Chaingraph can already reach 15000 or more transactions per second (equivalent to ~5GB blocks). Beyond these configurations, Chaingraph's theoretical maximum throughput is that of its [PostgreSQL](https://www.postgresql.org/) database, and common Postgres scaling strategies, like partitioning, tablespaces, and foreign-data wrappers, might be useful.
