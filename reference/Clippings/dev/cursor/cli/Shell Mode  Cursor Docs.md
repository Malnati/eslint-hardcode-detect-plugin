---
title: "Shell Mode | Cursor Docs"
source: "https://cursor.com/docs/cli/shell-mode"
author:
published:
created: 2026-04-12
description: "Use Cursor CLI in Shell Mode for continuous interaction with Agent. Leverage context persistence and command history for complex development tasks."
tags:
  - "clippings"
---
CLI

## Shell Mode

Shell Mode runs shell commands directly from the CLI without leaving your conversation. Use it for quick, non-interactive commands with safety checks and output displayed in the conversation.

<video src="https://cursor.com/docs-static/images/cli/shell-mode/cli-shell-mode.mp4" controls=""></video>

## Command execution

Commands run in your login shell (`$SHELL`) with the CLI's working directory and environment. Chain commands to run in other directories:

```
cd subdir && npm test
```

## Output

Large outputs are truncated automatically and long-running processes timeout to maintain performance.

## Limitations

- Commands timeout after 30 seconds
- Long-running processes, servers, and interactive prompts are not supported
- Use short, non-interactive commands for best results

## Permissions

Commands are checked against your permissions and team settings before execution. See [Permissions](https://cursor.com/docs/cli/reference/permissions) for detailed configuration.

Admin policies may block certain commands, and commands with redirection cannot be allowlisted inline.

## Usage guidelines

Shell Mode works well for status checks, quick builds, file operations, and environment inspection.

Avoid long-running servers, interactive applications, and commands requiring input.

Each command runs independently - use `cd <dir> && ...` to run commands in other directories.

## Troubleshooting

- If a command hangs, cancel with Ctrl+C and add non-interactive flags
- When prompted for permissions, approve once or add to allowlist with Tab
- For truncated output, use Ctrl+O to expand
- To run in different directories, use `cd <dir> && ...` since changes don't persist
- Shell Mode supports zsh and bash from your `$SHELL` variable