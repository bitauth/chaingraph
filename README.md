[![CI](https://img.shields.io/github/workflow/status/bitauth/chaingraph/Lint,%20Build,%20and%20Test%20Chaingraph?logo=github)](https://github.com/bitauth/chaingraph/actions/workflows/ci.yaml)
[![Codecov](https://img.shields.io/codecov/c/gh/bitauth/chaingraph?token=apQgrFecL5)](https://app.codecov.io/gh/bitauth/chaingraph/)
[![Follow Chaingraph on Twitter](https://img.shields.io/badge/follow-chaingraph-1DA1F2?logo=twitter)](https://twitter.com/ChaingraphCash)
[![Join Chat on Telegram](https://img.shields.io/badge/chat-Chaingraph%20Devs-0088CC?logo=telegram)](https://t.me/chaingraph_dev)
[![Docker Pulls](https://img.shields.io/docker/pulls/chaingraph/agent?label=downloads&logo=docker)](https://hub.docker.com/u/chaingraph)
[![GitHub stars](https://img.shields.io/github/stars/bitauth/chaingraph.svg?style=social&logo=github&label=Stars)](https://github.com/bitauth/chaingraph)

# Chaingraph

A multi-node blockchain indexer and GraphQL API.

For more information, and for examples of live subscriptions and complex queries, see [**chaingraph.cash**](https://chaingraph.cash/).

<a href="https://youtu.be/kYVVfiH6CVc"><img width="400" alt="chaingraph-demo-video" src="https://user-images.githubusercontent.com/904007/141193737-9c24f98c-8330-4ea4-afe4-7498ee0730b9.png"></a>


## Quick Start

Chaingraph runs on [Kubernetes](https://kubernetes.io/), making it easy to deploy for production usage across many cloud providers or on self-managed hardware.

**This guide describes a simple testnet deployment to a production Kubernetes cluster.**

To deploy Chaingraph locally, see the instructions in the [Contributing Guide](.github/CONTRIBUTING.md). For details about other configurations, see the [chart documentation](./charts/chaingraph/readme.md).

### Create a Cluster

As of late 2021, DigitalOcean is the most cost-effective cloud provider for Chaingraph deployments (differentiated primarily by pricing of egress bandwidth and persistent volume SSD storage).

To set up a new cluster, **consider using [Chaingraph's referral code for a $100
credit](https://m.do.co/c/522a68c96ba3)** (supports `demo.chaingraph.cash`); this should cover a production-ready BCH mainnet deployment for ~30 days (approximately $85/month for SSD storage, one $10/month droplet, and $10/month for the load balancer and egress bandwidth).

Whichever cloud provider you choose, for the below testnet deployment, provision at least 1 Kubernetes node of the least expensive type.

Typically, providers offer setup commands which add cluster authentication information to your local `kubectl` settings. Once your cluster is created, follow the provider's instructions for connecting to the cluster from your machine.

### Add the Chart Repo

To deploy Chaingraph to your cluster, first install [Helm](https://helm.sh), then add the `bitauth` repo:

```sh
helm repo add bitauth https://charts.bitauth.com/
```

If you have previously added the `bitauth` repo, run `helm repo update` to fetch the latest charts.

### Deploy a Release

Using the default configuration, Chaingraph will be installed with a single `testnet4` [BCHN](https://gitlab.com/bitcoin-cash-node/bitcoin-cash-node) full node, an internally-managed Postgres instance, and no load balancer.

This is an ideal configuration for experimenting with Chaingraph, as it can be deployed on very low-powered clusters (often even within the free tier provided by many cloud Kubernetes providers). See the [chart readme](./charts/chaingraph/readme.md) for information about other options.

```
helm install my-chaingraph bitauth/chaingraph
```

Review the notes which are logged after installation for more information about your deployment. You'll find an `API` section with instructions for exposing Chaingraph's GraphQL API.

Once the API is public, you're ready to start using Chaingraph. We recommend [graphqurl](https://github.com/hasura/graphqurl#graphiql) for exploring the API. Use `-i` to open the interactive GraphiQL UI:

```
npm install -g graphqurl
gq -i http://YOUR_IP:PORT/v1/graphql
```

Chaingraph's API is available during the initial sync. Try monitoring it with a subscription:

```gql
subscription MonitorSyncTips {
  node {
    name
    user_agent
    latest_tip: accepted_blocks(
      limit: 1
      order_by: { block_internal_id: desc }
    ) {
      block {
        hash
        height
        transaction_count
        size_bytes
      }
    }
  }
}
```

<details>

<summary>More details</summary>

> This subscription returns the list of nodes connected to Chaingraph, their version information, and the hash, height, size, and transaction count of the most recently saved block accepted by that node.
>
> Note, Chaingraph saves blocks asynchronously, and large blocks can take longer to save to the database. During initial sync, this may cause the subscription to occasionally update its result with lower-height (more recently saved) blocks. Regardless, this subscription will roughly track sync progress for each connected node.
>
> This query could also be ordered by block height, but because non-primary indexes are created after initial sync (to reduce time required), ordering by block height can be slow until after the initial sync is complete.

</details>

Mainnet Chaingraph deployments may take 10 hours or more to sync fully and build all indexes (depending primarily on the performance of configured nodes and the write speed of the database volume). Testnet deployments typically finish in a few minutes.

To continue exploring the Chaingraph API, check out the example queries on [**chaingraph.cash**](https://chaingraph.cash).

## Architecture

Chaingraph is a Kubernetes application which manages a stack of open source software including one or more Bitcoin Cash full nodes, a syncing agent, a Postgres SQL database, and a Hasura instance.

Learn more about [Chaingraph's Architecture &rarr;](./docs/architecture.md)

## Schema

While many indexers are designed to support only one node implementation, Chaingraph is designed from the ground up to support multiple nodes.

Rather than assuming a single-node source-of-truth view of the network, the Chaingraph database schema and GraphQL API differentiate which nodes have acknowledged any particular transaction or block, and a full timeline is maintained for transaction validation, block acceptance, observed double-spends, and block re-organizations.

This additional information makes it possible for businesses to handle unusual network behavior without manual intervention by employing [defensive consensus](https://blog.bitjson.com/defensive-consensus-getting-to-a-multi-implementation-bitcoin-network/) strategies.

Learn more about [Chaingraph's API Schema &rarr;](./docs/schema.md)

## Contributing

To set up a local cluster for development, please see the [Contributing Guide](./.github/CONTRIBUTING.md).
