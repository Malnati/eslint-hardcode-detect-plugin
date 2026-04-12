---
title: "Self-Hosted Pool | Cursor Docs"
source: "https://cursor.com/docs/cloud-agent/self-hosted-pool"
author:
published:
created: 2026-04-12
description: "Deploy and operate a pool of self-hosted Cloud Agent workers for teams and enterprise environments."
tags:
  - "clippings"
---
Cloud Agents

## Self-Hosted Pool

Self-Hosted Pool is for teams that want Cloud Agents to run inside company-managed infrastructure. Instead of each developer starting a worker on a personal machine, admins operate a pool of workers that can be assigned to agents across the organization.

Use a pool when you need:

- Centrally managed workers for a team or organization
- Service account authentication instead of individual browser logins
- Kubernetes, autoscaling, or fleet management
- Labels that route work to the right environment, team, repo, or hardware profile
- Enterprise controls around network access, secrets, build artifacts, and monitoring

For a fast personal setup, see [My Machines](https://cursor.com/docs/cloud-agent/my-machines).

## How it works

A worker opens a long-lived outbound HTTPS connection to Cursor's cloud. The agent loop (inference and planning) runs in Cursor's cloud and sends tool calls over this connection. The worker executes those tool calls locally in your infrastructure: terminal commands, file edits, browser actions, and access to internal services.

Your repos, build artifacts, secrets, and tool execution stay in your environment while Cursor handles orchestration, model access, and the Cloud Agent experience.

Workers only need outbound access. No inbound ports, public IPs, or VPN tunnels are required.

Self-Hosted Cloud Agents support up to 10 workers per user and 50 per team. For larger company-wide deployments, [contact us](https://cursor.com/contact-sales?source=self-hosted-agents) to discuss scaling.

## Prerequisites

- A **Cursor team plan**
- **Allow Self-Hosted Agents** enabled by a team admin in the [Cloud Agents dashboard](https://cursor.com/dashboard/cloud-agents#self-hosted-agents)
- A **service account API key** for production workers
- A worker machine or image with:
	- `agent` CLI installed
		- `git` installed and available on `PATH`
		- A cloned repository with a configured remote
		- Access to the build tools, package registries, secrets, and internal services your agents need

## Install the CLI

```
# macOS, Linux, and WSL
curl https://cursor.com/install -fsS | bash

# Windows PowerShell
irm 'https://cursor.com/install?win32=true' | iex
```

Confirm the CLI is available:

```
agent --version
```

## Authenticate workers

Use a [service account API key](https://cursor.com/docs/account/enterprise/service-accounts) for deployed workers.

```
export CURSOR_API_KEY="your-service-account-api-key"
```

You can also pass the key directly:

```
agent worker start --api-key "your-service-account-api-key"
```

## Start a pool worker

Run the worker from the git repo it should serve:

```
cd /path/to/repo
agent worker start --pool
```

`--pool` registers the worker for pool assignment. Each Cloud Agent session claims one worker at a time. For orchestrated environments, combine it with `--idle-release-timeout` so the process exits cleanly after work completes:

```
agent worker start --pool --idle-release-timeout 600
```

`--idle-release-timeout` keeps the worker alive for a window (in seconds) after a session ends to handle follow-up messages. If a follow-up arrives, the timer resets. Once the timeout fires, the CLI exits with code 0.

## Hooks

Self-hosted workers run project hooks committed in your repository through `.cursor/hooks.json`.

If you're on Enterprise, self-hosted workers also support team hooks and enterprise-managed hooks.

See [Hooks](https://cursor.com/docs/hooks) for configuration details.

## Labels

Labels are key-value pairs that describe a worker. They control how Cloud Agent sessions route to the right pool.

Good for quick testing or small pools:

```
agent worker start --pool \
  --label team=backend \
  --label env=production
```

The `repo` label is reserved and automatically derived from the worker directory's git remote. You don't need to set it manually.

## MCP servers

MCP servers on self-hosted workers are routed by transport type:

| Transport | Runs on | Use case |
| --- | --- | --- |
| Command (stdio) | Worker | The MCP process starts on the worker and can reach private networks, internal APIs, and services behind your firewall. |
| HTTP / SSE (url) | Cursor backend | Cursor handles OAuth, session caching, and auth for HTTP-based MCP servers. |

If your MCP server needs to access private-network endpoints, use the command (stdio) transport. The process runs directly on the worker and shares its network. For HTTP-based MCP servers, Cursor manages the connection from its backend, handling OAuth and session caching.

## Kubernetes

We provide a Helm chart and Kubernetes operator for managing worker pools at scale. See the [Kubernetes deployment guide](https://cursor.com/docs/cloud-agent/self-hosted-k8s) for setup instructions.

## Fleet management API

For non-Kubernetes environments, use the fleet management API to monitor utilization and build autoscaling.

Authenticate with your API key via Basic auth or Bearer token.

### List workers

```
curl --request GET \
  --url "https://api.cursor.com/v0/private-workers?status=idle&limit=50" \
  -u "$CURSOR_API_KEY:"
```

| Parameter | Type | Default | Description | |---|---|---| | `status` | `all` | `in_use` | `idle` | `all` | Filter by worker status | | `limit` | integer (1-100) | 50 | Results per page | | `nextPageToken` | string | | Pagination cursor |

### Get summary

```
curl --request GET \
  --url "https://api.cursor.com/v0/private-workers/summary" \
  -u "$CURSOR_API_KEY:"
```

Returns connected and in-use counts for your user and team. Use this to trigger scaling when utilization is high:

```
const summary = await response.json();
const team = summary.teamSummary;
if (team && team.totalConnected > 0) {
  const utilization = team.inUse / team.totalConnected;
  if (utilization >= 0.9) {
    // Scale up: provision additional workers
  }
}
```

### Get worker by ID

```
curl --request GET \
  --url "https://api.cursor.com/v0/private-workers/pw_123" \
  -u "$CURSOR_API_KEY:"
```

## Monitoring

The management server exposes `GET /metrics`, `GET /healthz`, and `GET /readyz` when you start a worker with `--management-addr`:

```
agent worker start --pool --management-addr ":8080"
```

Scrape metrics from your worker:

```
curl http://localhost:8080/metrics
```

### Available metrics

**Gauges**

| Metric | Type | Description |
| --- | --- | --- |
| `cursor_self_hosted_worker_connected` | Gauge | `1` when the outbound connection to Cursor's cloud is active, `0` otherwise. |
| `cursor_self_hosted_worker_session_active` | Gauge | `1` when a cloud agent session is running on this worker, `0` when idle. |
| `cursor_self_hosted_worker_last_activity_unix_seconds` | Gauge | Unix timestamp of the last frame or heartbeat from Cursor's cloud. `0` if no activity yet. |

**Counters**

| Metric | Type | Description |
| --- | --- | --- |
| `cursor_self_hosted_worker_connect_attempts_total` | Counter | Outbound connection attempts to Cursor's cloud. |
| `cursor_self_hosted_worker_connect_retry_total` | Counter | Connection retries after a failed attempt. |
| `cursor_self_hosted_worker_session_ends_total` | Counter | Agent sessions ended on this worker, labeled by `reason`. |

### Session end reasons

The `cursor_self_hosted_worker_session_ends_total` counter includes a `reason` label with one of these values:

| Reason | Description |
| --- | --- |
| `stream_end` | Connection closed normally. |
| `stream_error` | Connection failed with an error. |
| `session_closed` | HTTP/2 session closed cleanly. |
| `session_error` | HTTP/2 session entered an error state. |
| `connection_timeout` | Initial connection timed out before streaming started. |
| `session_aborted` | Session was aborted, for example because the worker was stopped. |

## Security

Forward Return Inference (LLM) loop

<svg width="900" height="420" viewBox="0 0 900 420" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;"><rect x="16" y="16" width="488" height="390" rx="12" stroke-dasharray="6 4" style="stroke: rgb(0, 0, 0); stroke-opacity: 0.35; fill: rgb(0, 0, 0); fill-opacity: 0.06;"></rect><text x="260" y="396" font-family="monospace" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="0.1em" style="fill: rgb(0, 0, 0); fill-opacity: 0.45;">AGENT LOOP · CURSOR CLOUD</text> <rect x="556" y="16" width="330" height="390" rx="12" stroke-dasharray="6 4" style="stroke: rgb(0, 0, 0); stroke-opacity: 0.35; fill: rgb(0, 0, 0); fill-opacity: 0.06;"></rect><text x="721" y="396" font-family="monospace" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="0.1em" style="fill: rgb(0, 0, 0); fill-opacity: 0.45;">TOOL EXECUTION · YOUR NETWORK</text> <rect x="593" y="26" width="256" height="22" rx="6" style="fill: rgb(0, 0, 0); fill-opacity: 0.14;"></rect><text x="721" y="41" font-family="sans-serif" font-size="10" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0); fill-opacity: 0.7;">Outbound-only · no inbound from Cursor</text> <rect x="210" y="40" width="148" height="54" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.55;"></rect><text x="284" y="63" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Inference (LLM)</text> <text x="284" y="81" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">model inference</text> <rect x="597" y="58" width="248" height="56" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.55;"></rect><text x="721" y="80" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">agent-cli</text> <text x="721" y="100" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">agent worker start</text> <rect x="36" y="168" width="120" height="68" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0);"></rect><text x="96" y="196" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Cursor UI</text> <text x="96" y="216" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">web / IDE</text> <rect x="196" y="168" width="176" height="68" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.55;"></rect><text x="284" y="192" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Agent Loop</text> <text x="284" y="210" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">orchestration</text> <text x="284" y="224" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">state management</text> <rect x="410" y="168" width="100" height="68" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0);"></rect><text x="460" y="196" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Bridge</text> <text x="460" y="216" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">frame routing</text> <rect x="610" y="168" width="220" height="68" rx="8" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.55;"></rect><text x="720" y="196" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Worker</text> <text x="720" y="216" font-family="monospace" font-size="10" text-anchor="middle" style="fill: rgb(0, 0, 0);">worker runtime</text> <rect x="586" y="286" width="268" height="84" rx="8" style="fill: rgb(0, 0, 0); fill-opacity: 0.5; stroke: rgb(0, 0, 0); stroke-opacity: 0.2;"></rect><text x="720" y="302" font-family="sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="0.05em" style="fill: rgb(0, 0, 0);">Tools</text> <rect x="598" y="310" width="72" height="48" rx="6" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.35;"></rect><text x="634" y="338" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Terminal</text> <rect x="680" y="310" width="80" height="48" rx="6" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.35;"></rect><text x="720" y="338" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Filesystem</text> <rect x="770" y="310" width="72" height="48" rx="6" style="fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-opacity: 0.35;"></rect><text x="806" y="338" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="middle" style="fill: rgb(0, 0, 0);">Browser</text> <line x1="156" y1="190" x2="193" y2="190" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="193,187 199,190 193,193" style="fill: rgb(0, 0, 0);"></polygon><text x="176" y="183" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0);">start run</text> <line x1="372" y1="190" x2="407" y2="190" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="407,187 413,190 407,193" style="fill: rgb(0, 0, 0);"></polygon><text x="391" y="183" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0);">tool call</text> <line x1="196" y1="218" x2="159" y2="218" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="159,215 153,218 159,221" style="fill: rgb(0, 0, 0);"></polygon><text x="176" y="231" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0);">stream to UI</text> <line x1="410" y1="218" x2="375" y2="218" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="375,215 369,218 375,221" style="fill: rgb(0, 0, 0);"></polygon><text x="391" y="231" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0);">results</text> <polygon points="492,202 520,184 520,190 608,190 608,214 520,214 520,220" style="fill: rgb(0, 0, 0); fill-opacity: 0.3;"></polygon><text x="560" y="178" font-family="monospace" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0); fill-opacity: 0.75;">outbound HTTP/2</text> <line x1="514" y1="196" x2="600" y2="196" stroke-width="1.5" style="stroke: rgb(0, 0, 0);"></line><polygon points="600,193.5 608,196 600,198.5" style="fill: rgb(0, 0, 0);"></polygon><line x1="606" y1="208" x2="520" y2="208" stroke-width="1.5" style="stroke: rgb(0, 0, 0);"></line><polygon points="520,205.5 512,208 520,210.5" style="fill: rgb(0, 0, 0);"></polygon><line x1="264" y1="168" x2="264" y2="97" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="261,97 264,91 267,97" style="fill: rgb(0, 0, 0);"></polygon><text x="250" y="136" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="end" style="fill: rgb(0, 0, 0);">prompt</text> <line x1="304" y1="94" x2="304" y2="165" stroke-width="2" style="stroke: rgb(0, 0, 0);"></line><polygon points="301,165 304,171 307,165" style="fill: rgb(0, 0, 0);"></polygon><text x="318" y="136" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="start" style="fill: rgb(0, 0, 0);">tool calls</text> <line x1="721" y1="114" x2="721" y2="165" stroke-width="1.5" style="stroke: rgb(0, 0, 0); stroke-opacity: 0.5;"></line><polygon points="718,165 721,171 724,165" style="fill: rgb(0, 0, 0); fill-opacity: 0.5;"></polygon><text x="721" y="143" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="middle" style="fill: rgb(0, 0, 0);">starts worker</text> <line x1="740" y1="236" x2="740" y2="283" stroke-width="1.5" style="stroke: rgb(0, 0, 0); stroke-opacity: 0.5;"></line><polygon points="737,283 740,289 743,283" style="fill: rgb(0, 0, 0); fill-opacity: 0.5;"></polygon><text x="754" y="264" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="start" style="fill: rgb(0, 0, 0);">exec tool calls</text> <line x1="700" y1="286" x2="700" y2="239" stroke-width="1.5" style="stroke: rgb(0, 0, 0); stroke-opacity: 0.5;"></line><polygon points="697,239 700,233 703,239" style="fill: rgb(0, 0, 0); fill-opacity: 0.5;"></polygon><text x="686" y="264" font-family="sans-serif" font-size="9" font-weight="500" text-anchor="end" style="fill: rgb(0, 0, 0);">results</text></svg>

**Data flow.** Only the file chunks the model reads during inference leave your network. Your repos, build artifacts, and secrets stay on your machines.

**Outbound-only.** Workers connect outbound over HTTPS. No inbound ports or firewall changes required.

**Privacy mode.** Self-hosted Cloud Agents respect Cursor's [privacy mode](https://cursor.com/data-use), which enables zero data retention across all model providers. None of your code is stored or used for training.

**Isolation.** Each agent session gets its own dedicated worker. Sessions are not shared across workers.

**Authentication.** Workers authenticate with [service account API keys](https://cursor.com/docs/account/enterprise/service-accounts). We recommend service accounts for all production deployments.

**Dashboard visibility.** Team admins can see all connected workers. Team members see only workers assigned to them.

## CLI reference

```
agent worker start [options]
```

| Flag | Env var | Description |
| --- | --- | --- |
| `--worker-dir <path>` |  | Working directory. Must be a git repo. Default: current directory. |
| `--management-addr <addr>` |  | Address for `/healthz`, `/readyz`, and `/metrics` endpoints, for example `:8080`. |
| `--label <key=value>` |  | Add a label. Repeatable. Mutually exclusive with `--labels-file`. |
| `--labels-file <path>` | `CURSOR_WORKER_LABELS_FILE` | Path to JSON or TOML labels file. Mutually exclusive with `--label`. |
| `--idle-release-timeout <sec>` | `CURSOR_WORKER_IDLE_RELEASE_TIMEOUT` | Seconds to stay connected after a session ends. Default: no timeout. |
| `--pool` |  | Register for pool assignment. Each session claims one worker at a time. |
| `--single-use` |  | Legacy alias for `--pool`. |
| `--api-key <key>` | `CURSOR_API_KEY` | Service account API key. |
| `-e, --endpoint <url>` |  | API endpoint. Default: `https://api2.cursor.sh`. |

## FAQ

## Related

- [My Machines](https://cursor.com/docs/cloud-agent/my-machines)
- [Kubernetes deployment guide](https://cursor.com/docs/cloud-agent/self-hosted-k8s)
- [Cloud Agent security and network](https://cursor.com/docs/cloud-agent/security-network)
- [Service accounts](https://cursor.com/docs/account/enterprise/service-accounts)