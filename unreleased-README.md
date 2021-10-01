[![CI](https://github.com/bitauth/chaingraph/actions/workflows/ci.yaml/badge.svg)](https://github.com/bitauth/chaingraph/actions/workflows/ci.yaml)
[![Codecov](https://img.shields.io/codecov/c/gh/bitauth/chaingraph?token=apQgrFecL5)](https://app.codecov.io/gh/bitauth/chaingraph/)

# Chaingraph

A multi-node blockchain indexer and GraphQL API.

## Quick Start

Chaingraph runs on [Kubernetes](https://kubernetes.io/), making it easy to deploy for production usage across many cloud providers or on self-managed hardware.

This guide describes a simple production deployment to an existing Kubernetes cluster. To deploy Chaingraph locally, see the instructions in the [Contributing Guide](.github/CONTRIBUTING.md).

### Add the Chart Repo

To get started, first install [Helm](https://helm.sh), then add the `bitauth` repo:

```sh
helm repo add bitauth https://charts.bitauth.com/
```

If you have previously added the `bitauth` repo, run `helm repo update` to fetch the latest charts.

### Deploy a Release
