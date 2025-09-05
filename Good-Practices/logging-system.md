# Production Logging System — Best Practices

## What it must have

### 1. Standardization
- **Format**: line-delimited **JSON** (one line per event).
- **Timezone**: **UTC**.
- **Timestamps**: RFC3339/ISO-8601 with milliseconds.
- **Levels**: `TRACE`(optional), `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.
- **Stable schema** (consistent keys):  
  `ts`, `level`, `msg`, `service`, `env`, `host`, `pid`, `trace_id`, `span_id`, `correlation_id`, `user_id`, `method`, `path`, `status`, `latency_ms`.

### 2. Context and Correlation
- Propagate **trace/span IDs** (OpenTelemetry) and a **correlation/request ID** across hops (gateway → service → DB).
- Include request/response metadata (without PII).

### 3. Signal Separation
- **Logs**: narrative of events.  
- **Metrics**: KPIs for alerting.  
- **Traces**: latency and dependencies.  
→ Logs for diagnosis, **metrics for alerts**, **traces for localization**.

### 4. Hygiene and Security
- **No PII/secrets/keys**. Apply **redaction/masking**.
- **Limits**: truncate oversized payloads, rate-limit noisy logs.
- **Integrity**: access control, immutability (WORM), signing if needed.
- **Compliance**: retention policies (e.g., 30–90 days hot, 180+ days cold).

### 5. Reliability and Performance
- **Non-blocking**: async logging with queues/buffers; backpressure safe.
- **Fallback**: graceful degradation with controlled loss (drop sampling).
- **Sampling**:  
  - Probabilistic for high-volume `INFO`.  
  - Always-on for `ERROR/FATAL`.  
  - Dynamic sampling during incidents.
- **Rotation**: size/age-based. In containers: stdout/stderr + runtime rotation.

### 6. Collection and Centralization
- Emit logs to **stdout** (12-Factor) in containers; collect with **Fluent Bit/Vector/Filebeat**.
- On VMs: `journald` or `logrotate` + agent.
- Send to backend: **Loki**, **Elasticsearch/OpenSearch**, **Cloud Logging**, **Datadog**, **Splunk**, etc.
- **Tiered storage**: hot/warm/cold by severity.

### 7. Integrated Observability
- Use **OpenTelemetry** (traces/metrics/logs unified).
- **Dashboards**: volume by level, top errors, route latencies.
- **Saved searches** & **canonical queries** (e.g., errors per release in 1h).
- **Alerts** on metrics (e.g., `rate(5xx)`) with deep links to correlated logs.

### 8. Operations
- **Version the schema** and validate (contracts).
- **Tests**: unit tests for minimal fields; lint logs in CI.
- **Feature flags** for temporary `DEBUG` logging.
- **Time sync**: NTP/chrony on all nodes.

### 9. Content Best Practices
- Clear, actionable messages (what failed, inputs, next step).
- One responsibility per log line.
- Stack traces only in `ERROR` and once per event.
- Use **IDs instead of payloads** (store large data externally and reference).

---

## Example Schema (JSON)

```json
{
  "ts": "2025-09-03T23:15:42.123Z",
  "level": "ERROR",
  "service": "payments-api",
  "env": "prod",
  "region": "sa-east-1",
  "host": "ip-10-0-2-15",
  "pid": 2431,
  "trace_id": "3c9a9f6a2a8f4f3c",
  "span_id": "5e41af02bb1a9e7d",
  "correlation_id": "req-7f1c1c0d",
  "method": "POST",
  "path": "/v1/charges",
  "status": 502,
  "latency_ms": 312,
  "msg": "Upstream gateway timeout",
  "upstream": "cards-gw",
  "release": "2025.09.03-1",
  "k8s_pod": "payments-api-7b6d7f5cc9-ktm2x"
}
```