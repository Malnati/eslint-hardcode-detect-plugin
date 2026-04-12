---
title: "MCP Inspector"
source: "https://modelcontextprotocol.io/docs/tools/inspector"
author:
published:
created: 2026-04-12
description: "In-depth guide to using the MCP Inspector for testing and debugging Model Context Protocol servers"
tags:
  - "clippings"
---
The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive developer tool for testing and debugging MCP servers. While the [Debugging Guide](https://modelcontextprotocol.io/docs/tools/debugging) covers the Inspector as part of the overall debugging toolkit, this document provides a detailed exploration of the Inspector’s features and capabilities.

## Getting started

### Installation and basic usage

The Inspector runs directly through `npx` without requiring installation:

```shellscript
npx @modelcontextprotocol/inspector <command>
```

```shellscript
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

#### Inspecting servers from npm or PyPI

A common way to start server packages from [npm](https://npmjs.com/) or [PyPI](https://pypi.org/).

- npm package
- PyPI package

```shellscript
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# For example
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/username/Desktop
```

#### Inspecting locally developed servers

To inspect servers locally developed or downloaded as a repository, the most common way is:

- TypeScript
- Python

```shellscript
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

Please carefully read any attached README for the most accurate instructions.

## Feature overview

![](https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=2500&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=4fbcddae467e84daef4739e0816ab698)

The MCP Inspector interface

The Inspector provides several features for interacting with your MCP server:

### Server connection pane

- Allows selecting the [transport](https://modelcontextprotocol.io/specification/latest/basic/transports) for connecting to the server
- For local servers, supports customizing the command-line arguments and environment

### Resources tab

- Lists all available resources
- Shows resource metadata (MIME types, descriptions)
- Allows resource content inspection
- Supports subscription testing

### Prompts tab

- Displays available prompt templates
- Shows prompt arguments and descriptions
- Enables prompt testing with custom arguments
- Previews generated messages

### Tools tab

- Lists available tools
- Shows tool schemas and descriptions
- Enables tool testing with custom inputs
- Displays tool execution results

### Notifications pane

- Presents all logs recorded from the server
- Shows notifications received from the server

## Best practices

### Development workflow

1. Start Development
2. Iterative testing
3. Test edge cases

## Next steps

## [Inspector Repository](https://github.com/modelcontextprotocol/inspector)

Check out the MCP Inspector source code

## [Debugging Guide](https://modelcontextprotocol.io/docs/tools/debugging)

Learn about broader debugging strategies