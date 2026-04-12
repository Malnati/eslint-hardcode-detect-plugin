---
title: "My Machines | Cursor Docs"
source: "https://cursor.com/docs/cloud-agent/my-machines"
author:
published:
created: 2026-04-12
description: "Run Cloud Agents on a machine you already use, like your laptop, devbox, or remote VM."
tags:
  - "clippings"
---
Cloud Agents

## My Machines

My Machines lets you run Cloud Agents on a machine you already use: your laptop, a devbox, or a remote VM. It is the fastest way to give Cloud Agents access to your local repo, dependencies, build cache, and private network.

A worker on your machine opens an outbound connection to Cursor. The agent loop runs in Cursor's cloud, but terminal commands, file edits, browser actions, and other tool calls execute on your machine. No inbound ports or firewall changes are required.

Use My Machines when you want to:

- Use a devbox or remote workstation that already has your repo and tools
- Run Cloud Agents against services only available from your network
- Keep builds, test artifacts, and secrets on your machine
- Try self-hosted Cloud Agents quickly

For org-wide worker fleets, see [Self-Hosted Pool](https://cursor.com/docs/cloud-agent/self-hosted-pool).

## Quickstart

### 1\. Install the CLI

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

### 2\. Sign in

For a personal machine, browser login is the easiest path:

```
agent login
```

### 3\. Start the worker

```
agent worker start
```

Keep this process running while you use the machine. By default, a My Machines worker is long-lived: it stays connected until you stop it and can be reused for future Cloud Agent sessions.

### 4\. Run an agent

1. Go to [cursor.com/agents](https://cursor.com/agents).
2. The machine should show up in the environment dropdown.
3. Send a task.

## Common options

### Name the machine

Use a friendly name when you have multiple machines for the same repo:

```
agent worker start --name "my-devbox"
```

### Run from a different repo directory

```
agent worker start --worker-dir /path/to/repo
```

### Use an API key

For shared devboxes or automation, use a service account API key:

```
agent worker start --api-key "your-api-key"
```

## Networking

Workers only need outbound HTTPS access to:

- `api2.cursor.sh`
- `api2direct.cursor.sh`

No inbound ports, public IPs, or VPN tunnels are required. If you use a proxy, set `HTTPS_PROXY` or `https_proxy`.

## MCP servers

MCP servers are routed by transport type:

| Transport | Runs on | Use case |
| --- | --- | --- |
| Command (stdio) | Your machine | The MCP process starts on your machine and can reach private networks, internal APIs, and local services. |
| HTTP / SSE (url) | Cursor backend | Cursor handles OAuth, session caching, and auth for HTTP-based MCP servers. |

If your MCP server needs to reach endpoints on your private network, use the command (stdio) transport. The process runs directly on your machine and shares its network. For HTTP-based MCP servers, Cursor manages the connection from its backend.

## Troubleshooting

Run a preflight debug report:

```
agent worker start --debug
```

This checks authentication, privacy routing, repo labels, and whether Cursor can see matching workers.

## Related

- [Self-Hosted Pool](https://cursor.com/docs/cloud-agent/self-hosted-pool)
- [Cloud Agent security and network](https://cursor.com/docs/cloud-agent/security-network)
- [Service accounts](https://cursor.com/docs/account/enterprise/service-accounts)