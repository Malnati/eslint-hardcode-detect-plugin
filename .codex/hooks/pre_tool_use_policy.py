#!/usr/bin/env python3
"""Hook PreToolUse: guardrail para comandos Bash destrutivos."""

from __future__ import annotations

import json

from common import read_payload
from match_engine import should_block_bash_command


def main() -> None:
    payload = read_payload()
    command = str((payload.get("tool_input") or {}).get("command") or "")

    blocked, reason = should_block_bash_command(command)
    if blocked:
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": reason,
                    }
                },
                ensure_ascii=False,
            )
        )
        return

    print("{}")


if __name__ == "__main__":
    main()
