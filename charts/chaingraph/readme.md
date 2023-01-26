# Chaingraph Helm Chart

This Chaingraph Helm chart simplifies deployment and management of Chaingraph installations. 

**Please review this entire document before deploying Chaingraph in a production environment.** By default, the chart will deploy a fast-syncing, development-friendly, testnet configuration of Chaingraph. **To run Chaingraph safely in production, it's necessary to perform several security-hardening steps described below.**

This document describes some important chart options. For a higher level introduction, see the [Quick Start Guide](../../README.md#quick-start). For definitive descriptions of all Chaingraph chart options, see [values.yaml](./values.yaml).

For information on Helm usage, including on overriding chart values during upgrades, see the [Helm Usage Guide](https://helm.sh/docs/intro/using_helm/).

## Enabling/Disabling Trusted Nodes

Chaingraph can connect to nodes already running in your infrastructure, and it can also spin up, configure, and manage a set of nodes itself. 

### Internal Nodes

Chaingraph currently supports internal management of mainnet and testnet BCHN nodes, and future versions may support automatic deployment of other popular node implementations. (Pull requests welcome.)

#### BCHN (Mainnet)

A [BCHN](https://bitcoincashnode.org/) node configured to connect to `mainnet` is disabled by default. It can be enabled with the following option:

```sh
--set bitcoinCashNode.enable=true # --set postgres.volumeSize=730Gi
```

When enabling mainnet, ensure the volume assigned to Postgres is large enough to hold the database with additional space for indexing (see [Approximate Space Usage](../../docs/schema.md#approximate-space-usage)). If using the internally-managed Postgres instance, this can be configured with the `postgres.volumeSize` value. (See also: [Expanding Volumes](#expanding-volumes).)

Note, it's usually a good idea to initially sync mainnet on a new Chaingraph deployment rather than adding a mainnet node to an existing testnet deployment. Chaingraph optimizes the speed of initial sync by only building expensive indexes after all historical data has been loaded into the database – previously-synced deployments will already have these indexes, so sync speed may be significantly reduced.

Of course, this advice does not apply when adding additional mainnet nodes to an existing mainnet-supporting deployment (as the database already contains all mainnet blocks and transactions). The additional node can also operate in pruned mode, as Chaingraph will catch up exclusively via headers.

#### BCHN (Chipnet)

A [BCHN](https://bitcoincashnode.org/) node configured to connect to `chipnet` is enabled by default. It can be disabled with the following option:

```sh
--set bitcoinCashNodeChipnet.enable=false
```

#### BCHN (Testnet4)

A [BCHN](https://bitcoincashnode.org/) node configured to connect to `testnet4` is enabled by default. It can be disabled with the following option:

```sh
--set bitcoinCashNodeTestnet.enable=false
```

### External Nodes

Chaingraph can also connect to other nodes already running in your Kubernetes cluster or elsewhere. Set the `agent.externalNodes` value to provide connection information, e.g.: 

```sh
--set agent.externalNodes=node_identifier:my-node-service.some-namespace.svc.cluster.local:8333:mainnet,another_node:192.0.2.34:8333:mainnet
```

Note, Chaingraph implicitly trusts connected nodes ([performing no meaningful validation](../../docs/architecture.md#performance--scalability)), and a malicious node can lie about payments or cause downtime by filling the database with fake data. Only connect to nodes you control/trust.

**It is recommended that you configure any external nodes to avoid banning the Chaingraph agent.**

## Enable a Load Balancer (Serve API on Port 80)

Because most cloud providers charge a monthly price for load balancer usage – and Chaingraph can be tested or used for development without load balancing – this chart does not provision a load balancer by default.

To serve the GraphQL API on port 80 (rather than a random port from 30000 to 32767), set the `useLoadBalancer` option:

```sh
[--reuse-values] --set hasura.useLoadBalancer=true
```

## Configuring Hasura & Hardening for Production

Before deploying Chaingraph in a production environment, it may be valuable to review [Hasura's Production Checklist](https://hasura.io/docs/latest/graphql/core/deployment/production-checklist.html) – disabling unused APIs, configuring an allow-list, and/or customizing Chaingraph's schema permissions will help to ensure the stability of your deployment.

### Disabling Internal Hasura

By default, this chart installs and configures a Hasura instance inside the cluster. This can be disabled to either manage Hasura manually or use Hasura Cloud:

```sh
[--reuse-values] --set hasura.enable=false
```

### Enforcing an Allow-List

If using the internally-managed Hasura instance in production, consider enabling enforcement of the Hasura allow-list. While this is disabled for simplicity during development, it is important for hardening production APIs against maliciously expensive queries:

```sh
[--reuse-values] --set hasura.enableAllowList=true
```

### Using `statement_timeout`

For applications where an allow-list isn't possible (e.g. a public, development/demo instance), consider setting hasura to use a postgres user with a restricted `statement_timeout` value. Connect to the database and create a new user with all privileges:

```sql
CREATE USER hasura WITH PASSWORD 'some_password';
ALTER ROLE hasura WITH SUPERUSER; -- (for multi-tenant databases, consider limiting permissions)
ALTER ROLE hasura SET statement_timeout = '2000ms';
```

Once the user is created, upgrade the chaingraph deployment to override the connection string used by Hasura (e.g. with release namespace of `default`):

```sh
[--reuse-values] --set hasura.overrideDbUrl=postgres://hasura:some_password@postgres-service.default.svc.cluster.local:5432/chaingraph
```

## Tuning Postgres for Increased DB Memory and CPUs

By default, the internally-managed Postgres database will be tuned for best performance on a kubernetes node with 1GB of free memory and 1 available CPU. For better performance, configure the `postgres.memoryGb` and `postgres.cpus` chart values. (See also: [Speeding Up Initial Sync](#speeding-up-initial-sync).)

Deploy or upgrade Chaingraph with the new `postgres.memoryGb` and `postgres.cpus` settings, respectively:

```sh
helm upgrade [--install] [chaingraph-deployment-name] bitauth/chaingraph [--reuse-values] --set postgres.cpus=4 --set postgres.memoryGb=8
```

After the deployment completes, Helm will output instructions for tuning Postgres with these settings. If you're deploying Chaingraph for the first time (and a new internally-managed Postgres database is created), tuning will happen automatically, and the database will be restarted for you.

To avoid interfering with an existing postgres database, **the Postgres database configuration script will not run against existing databases**. To take advantage of the newly provisioned resources, you will need to manually update the Postgres configuration by running the SQL from the Helm deployment notes. After running the tuning SQL, you'll also need to manually restart postgres:

```sh
kubectl rollout restart statefulset postgres
```

## Using an External Postgres Database

The Chaingraph helm chart initializes, configures, and manages a basic Postgres database by default. This is sufficient for many applications, but it's recommended that you configure a managed, highly-available external Postgres database for uptime-critical applications.

To disable the internal Postgres database and configure an external one, set the `postgres.externalDbUrl` value, e.g.:

```sh
--set postgres.externalDbUrl=postgres://postgres_user:postgres_password@host:5432/database_name
```

**WARNING**: TLS security is not yet handled by this chart. To avoid MITM attacks, you must manually configure your deployment to secure communication between the external database and both the Chaingraph agent and Hasura.

Note, if an existing internal database is disabled, its persistent storage volume will not be deleted. To avoid being charged for the provisioned storage, you must also manually delete the volume.

## Expanding Volumes

You can quickly check the remaining disk space available on each persistent volume by executing the `df` command on each relevant pod, e.g.:
```sh
kubectl exec bitcoin-cash-node-0 -- df -h  # alias: yarn dev-cluster:df:bchn
kubectl exec postgres-0 -- df -h           # alias: yarn dev-cluster:df:postgres
```

To increase the size of persistent volumes managed by the Chaingraph Helm chart, edit the PersistentVolumeClaim for the volume in question. To view all persistent volume claims, run: `kubectl get pvc`. Then edit the claim in question, e.g.:

```sh
kubectl edit pvc postgres-volume-postgres-0
```

In the opened text editor, increase the value of `spec.resources.requests.storage`:

```yaml
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 730Gi # <- edit this value
```

If the specified volume size is larger than the existing volumes, the volumes will be automatically expanded by supporting Kubernetes systems. (Note: volume sizes cannot be reduced using this method.)

## Speeding Up Initial Sync

Because Chaingraph is a Kubernetes application, it's surprisingly easy to move across hardware. This can be very valuable during the initial sync: it's possible to sync Chaingraph on high-powered hardware, then move the application to less expensive machines for long-term maintenance (assuming you are using a cloud-based Kubernetes provider).

To perform this phased-setup, select a high-powered machine type for the initial node pool when creating the cluster with your Kubernetes provider (aim for the highest [disk write throughput](../../docs/architecture.md#performance--scalability) and adequate supporting CPUs/memory). Install Chaingraph normally, making sure to [provide DB memory and CPU information](#increase-db-memory-and-cpus) for optimal performance tuning.

Once Chaingraph is synced and all indexes are built, simply add a new "long-term maintenance" node pool to the cluster, this time selecting a less expensive configuration. When you remove or disable the initial node pool, Kubernetes will automatically begin transferring all pods over to the new node pool, and Chaingraph will simply recover from the downtime.

If you're attempting to add a new network to an existing deployment, see the [above note about post-sync indexes](#bchn-mainnet). When adding a large amount of historical data, it may be valuable to drop the [post-sync indexes](../../src/components/db-utils.ts), allowing Chaingraph to recreate them again when the initial sync is completed (happens automatically).
