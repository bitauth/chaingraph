Chaingraph is a [Kubernetes] application which can be installed using [Helm]. The primary application component – the Chaingraph agent – connects to a set of trusted nodes over the standard P2P interface, writing all blocks and transactions relayed by those nodes to a Postgres database. Separately, one or more Hasura instances handle user API requests by reading from the Postgres database.

By default the Chaingraph chart automatically deploys all necessary application components to the most appropriate cluster machine(s): a BCHN node and persistent storage volume, a Postgres database and persistent storage volume, a Hasura instance, and the agent instance. While this default should work well for most use cases, users can also disable most application components in the Helm chart to manage them another way (e.g. using a hosted Postgres database, connecting to an existing set of trusted nodes, or deploying with another Kubernetes templating or management system).

When Chaingraph is first installed, any configured nodes will immediately begin syncing with the public network, the internal Postgres database will be created and configured (if enabled), and the agent will begin syncing historical blockchain data from the nodes to the configured database. After the initial sync, the agent will pause syncing and create any enabled indexes before continuing to sync all transactions and blocks in realtime. Once started, if any application components experience downtime, they will be automatically restarted by Kubernetes.

This repo contains [templates for the Helm chart], [Hasura configuration information] (including [Postgres database migrations]), the Chaingraph Agent [source code and tests] (written in TypeScript), a [package.json] with a variety of scripts for common build and development tasks, and a [docs] directory.

## Cluster Requirements

Chaingraph can be installed on any Kubernetes cluster. For smaller, private, or test deployments, consider using the [`dev-cluster` deployment scripts] provided in this repo. For public deployments, the Chaingraph Helm chart can be installed on any in-house or cloud provider-managed cluster which supports persistent volume provisioning (e.g. DigitalOcean, AWS AKS, Google Cloud, Azure, etc.).

Generally, it’s worth provisioning higher-powered kubelets to speed up the initial sync and index creation, but ongoing maintenance can be handled by relatively lower-powered kubelets.

Sync and index performance is typically bottlenecked on Postgres SSD read/write speed: if possible, provision NVMe SSD storage for the Postgres database. Providing additional memory and compute power to the Postgres database can also significantly improve initial indexing times.

## Node Storage

During initial sync, Chaingraph relies on trusted nodes to provide historical blockchain data. After initial sync, it’s possible to switch trusted nodes to pruned mode, significantly reducing their storage requirements (this is not yet well supported, and periods of downtime greater than 48 hours will require nodes to be re-synced in unpruned mode).

Because node storage is not typically a bottleneck, it may also be possible to save resources by using slower disks for node storage than are used for Postgres storage.

## Database Storage

Blockchain data is normalized in the database – no blocks or transactions are duplicated even if received from nodes following two different chain tips (e.g. BCH and BTC). Because common history is shared between nodes, it’s often possible to add many different node versions and implementations without significantly impacting database storage requirements.

(In general, additional node_block records will require `16 * block count` bytes per node – about 10 MB, and node_transaction records will require `24 * mempool TX count` bytes – about 2 MB.)
