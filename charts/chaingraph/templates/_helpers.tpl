{{/* Expand the name of the chart. */}}
{{- define "chaingraph.name" -}}
  {{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chaingraph.chart" -}}
  {{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Common labels */}}
{{- define "chaingraph.labels" -}}
helm.sh/chart: {{ include "chaingraph.chart" . }}
{{ include "chaingraph.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/* Selector labels */}}
{{- define "chaingraph.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chaingraph.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* Postgres configuration */}}
{{- define "chaingraph.postgres.init-db-config" -}}
ALTER SYSTEM SET shared_buffers = '{{ div (mul 1024 .Values.postgres.memoryGb) 4 }}MB';
ALTER SYSTEM SET effective_cache_size = '{{ mul 3 (div (mul 1024 .Values.postgres.memoryGb) 4) }}MB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET min_wal_size = '4GB';
ALTER SYSTEM SET max_wal_size = '16GB';
ALTER SYSTEM SET default_statistics_target = '500';
ALTER SYSTEM SET random_page_cost = '1.1';
ALTER SYSTEM SET effective_io_concurrency = '200';
ALTER SYSTEM SET max_connections = '50';
ALTER SYSTEM SET work_mem = '8MB';
ALTER SYSTEM SET max_worker_processes = '{{ .Values.postgres.cpus }}';
ALTER SYSTEM SET max_parallel_workers_per_gather = '{{ max 1 (div .Values.postgres.cpus 2) }}';
ALTER SYSTEM SET max_parallel_workers = '{{ .Values.postgres.cpus }}';
ALTER SYSTEM SET max_parallel_maintenance_workers = '{{ max 1 (div .Values.postgres.cpus 2) }}';
{{- end }}

{{/* Chaingraph trusted nodes */}}
{{- define "chaingraph.trustedNodes" -}}
  {{- $trustedNodes := list "PLACEHOLDER" -}}
  {{- if .Values.agent.externalNodes -}}
    {{- $trustedNodes = append $trustedNodes .Values.agent.externalNodes -}}
  {{- end -}}
  {{- if .Values.bitcoinCashNode.enable -}}
    {{- $trustedNodes = append $trustedNodes (print "bchn:bitcoin-cash-node-service." .Release.Namespace ".svc.cluster.local:8333:mainnet") -}}
  {{- end -}}
  {{- if .Values.bitcoinCashNodeTestnet.enable -}}
    {{- $trustedNodes = append $trustedNodes (print "tbchn:bitcoin-cash-node-testnet-service." .Release.Namespace ".svc.cluster.local:28333:testnet") -}}
  {{- end -}}
  {{- $trustedNodes | join "," | trimPrefix "PLACEHOLDER," -}}
{{- end }}
