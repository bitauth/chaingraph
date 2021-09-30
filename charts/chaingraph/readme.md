# Chaingraph Helm Chart

## Increase DB Memory and CPUs

By default, Chaingraph expects to run the internally-managed Postgres database on a kubernetes node with at least 1GB of memory, and 1 available CPU. For better performance, you may chose to provision a larger node for the database.

First, ensure your higher-resource node exists in your Kubernetes cluster (if you're using a cloud service provider, allocate the node using their tools). Once the node exists, deploy or upgrade Chaingraph with the new `postgres.memoryGb` and `postgres.cpus` settings, respectively:

```sh
helm upgrade [--install] [chaingraph-deployment-name] charts/chaingraph --set postgres.cpus=4 --set postgres.memoryGb=8
```

If you're deploying Chaingraph for the first time (and a new internally-managed Postgres database is created), these settings will be applied in both Kubernetes and the Postgres database settings.


To avoid interfering with an existing postgres database, **the Postgres database configuration script will not run against existing databases**. To take advantage of the newly provisioned resources, you will need to manually update the Postgres configuration by running the SQL in the Helm upgrade notes (the output produced by the above command).

## Expanding Volumes

You can quickly check the remaining disk space available on each persistent volume using the `dev-cluster:df:*` commands:
```sh
yarn dev-cluster:df:bchn # kubectl exec bitcoin-cash-node-0 -- df -h
yarn dev-cluster:df:postgres # kubectl exec postgres-0 -- df -h
```

To increase the size of persistent volumes managed by the Chaingraph Helm chart, just run an upgrade on the deployment with the new volume sizes specified. For example, here we reconfigure the `volumeSize` of both an internally managed Postgres instance and an internally managed BCHN instance:

```sh
helm upgrade [--install] [chaingraph-deployment-name] charts/chaingraph --set postgres.volumeSize=520Gi --set bitcoinCashNode.volumeSize=200Gi
```

If the specified volume size is larger than the existing volumes, the volumes will be automatically expanded by supporting Kubernetes systems. (Note: volume sizes cannot be reduced using this method.)
