---
title: "MCP Install Links | Cursor Docs"
source: "https://cursor.com/docs/mcp/install-links"
author:
published:
created: 2026-04-12
description: "Create one-click install links for MCP servers in Cursor."
tags:
  - "clippings"
---
Customizing

## MCP Install Links

Looking to share MCP servers, rules, and more? [Plugins](https://cursor.com/docs/plugins) make it easier to bundle and distribute everything in one package. You can publish to the [Cursor Marketplace](https://cursor.com/docs/plugins#the-marketplace) or your [team's private marketplace](https://cursor.com/docs/plugins#team-marketplaces).

MCP servers can be installed with Cursor deeplinks. It uses the same format as [`mcp.json`](https://cursor.com/docs/mcp) with a name and transport configuration.

Install links:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG
```

| Component | Description |
| --- | --- |
| `cursor://` | Protocol scheme |
| `anysphere.cursor-deeplink` | Deeplink handler |
| `/mcp/install` | Path |
| `name` | Query parameter for server name |
| `config` | Query parameter for base64 encoded JSON configuration |

## Generate install link

1. Get name and JSON configuration of server
2. `JSON.stringify` the configuration then base64 encode it
3. Replace `$NAME` and `$BASE64_ENCODED_CONFIG` with the name and encoded config

Helper for generating links:

No server detected

Click to copy. Paste in README

## Example

Try this JSON in the MCP install link generator:

Single MCP server config

```
{
  "postgres": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-postgres",
      "postgresql://localhost/mydb"
    ]
  }
}
```

Result:

| Format | Example |
| --- | --- |
| Text link | [cursor://anysphere.curs...](cursor://anysphere.cursor-deeplink/mcp/install?name=postgres&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBtb2RlbGNvbnRleHRwcm90b2NvbC9zZXJ2ZXItcG9zdGdyZXMiLCJwb3N0Z3Jlc3FsOi8vbG9jYWxob3N0L215ZGIiXX0=) |
| Dark button |  |
| Light button |  |

## Install server

1. Click the link or paste into browser
2. Cursor prompts to install the server
3. Use the server in Cursor