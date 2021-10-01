# bitauth/charts

This repo contains charts for use by [Helm](https://helm.sh). Please refer to
[Helm's documentation](https://helm.sh/docs) to get started.

Once Helm is installed, this repo can be added:

```sh
helm repo add bitauth https://charts.bitauth.com/
```

If you have previously added this repo, run `helm repo update` to fetch the latest charts. Try `helm search repo bitauth` to review available charts.

To install a chart:

```sh
helm install <release-name> bitauth/<chart>
```

To remove the chart:

```sh
helm delete <release-name>
```
