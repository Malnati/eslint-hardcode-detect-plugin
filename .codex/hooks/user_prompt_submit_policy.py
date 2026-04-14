#!/usr/bin/env python3
"""Hook UserPromptSubmit: snapshot de turno + bloqueio opcional de prompt sensível."""

from __future__ import annotations

import json

from common import git_status_paths, project_root, read_payload, save_turn_snapshot
from match_engine import detect_sensitive_prompt


def main() -> None:
    payload = read_payload()
    root = project_root(payload)

    dirty = git_status_paths(root)
    save_turn_snapshot(root, payload, dirty)

    prompt = str(payload.get("prompt") or "")
    reason = detect_sensitive_prompt(prompt)
    if reason:
        print(
            json.dumps(
                {
                    "decision": "block",
                    "reason": f"{reason} Remova o segredo antes de enviar o prompt.",
                },
                ensure_ascii=False,
            )
        )
        return

    print("{}")


if __name__ == "__main__":
    main()
