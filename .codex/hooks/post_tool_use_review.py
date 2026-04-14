#!/usr/bin/env python3
"""Hook PostToolUse: sinaliza falhas de Bash para reforçar o protocolo HCD-ERR."""

from __future__ import annotations

import json

from common import load_turn_signal, project_root, read_payload, save_turn_signal
from match_engine import has_failure_signal


def _normalize_response_text(tool_response: object) -> str:
    if isinstance(tool_response, str):
        return tool_response
    try:
        return json.dumps(tool_response, ensure_ascii=False)
    except TypeError:
        return str(tool_response)


def main() -> None:
    payload = read_payload()
    root = project_root(payload)

    command = str((payload.get("tool_input") or {}).get("command") or "")
    response_text = _normalize_response_text(payload.get("tool_response"))

    if has_failure_signal(response_text):
        signal = load_turn_signal(root, payload) or {}
        signal["failure_signal_detected"] = True
        signal["last_failing_command"] = command
        save_turn_signal(root, payload, signal)

        print(
            json.dumps(
                {
                    "systemMessage": (
                        "Sinal de falha detectado no Bash. "
                        "Se a falha for reportada ao utilizador, aplicar o formato "
                        "[HCD-ERR-SENIOR]/[HCD-ERR-FIX]/[HCD-ERR-OPS]."
                    )
                },
                ensure_ascii=False,
            )
        )
        return

    print("{}")


if __name__ == "__main__":
    main()
