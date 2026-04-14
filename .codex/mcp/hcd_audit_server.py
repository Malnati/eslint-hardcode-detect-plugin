#!/usr/bin/env python3
"""Servidor MCP STDIO local para inspeção de auditoria HCD-ERR."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

SERVER_NAME = "hcd-err-local"
SERVER_VERSION = "0.1.0"


def _project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _read_message() -> dict[str, Any] | None:
    headers: dict[str, str] = {}
    while True:
        line = sys.stdin.buffer.readline()
        if not line:
            return None
        if line in (b"\r\n", b"\n"):
            break
        if b":" not in line:
            continue
        key, value = line.decode("utf-8", errors="replace").split(":", 1)
        headers[key.strip().lower()] = value.strip()

    length = int(headers.get("content-length", "0"))
    if length <= 0:
        return None

    body = sys.stdin.buffer.read(length)
    if not body:
        return None
    return json.loads(body.decode("utf-8", errors="replace"))


def _write_message(payload: dict[str, Any]) -> None:
    raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(f"Content-Length: {len(raw)}\r\n\r\n".encode("utf-8"))
    sys.stdout.buffer.write(raw)
    sys.stdout.buffer.flush()


def _text_result(text: str) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": text}]}


def _tool_defs() -> list[dict[str, Any]]:
    return [
        {
            "name": "hcd_err_get_latest_report",
            "description": "Retorna o relatório diário mais recente de auditoria HCD-ERR em .log/hooks/.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "date_utc": {
                        "type": "string",
                        "description": "Data UTC no formato YYYYMMDD para abrir um relatório específico.",
                    },
                    "tail_lines": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 400,
                        "default": 80,
                        "description": "Quantidade de linhas finais retornadas.",
                    },
                },
            },
        },
        {
            "name": "hcd_err_list_state_files",
            "description": "Lista arquivos de estado em .log/hooks/.state usados pelos hooks Codex.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "session_id_contains": {
                        "type": "string",
                        "description": "Filtro opcional por trecho do session_id no nome do arquivo.",
                    }
                },
            },
        },
        {
            "name": "hcd_err_run_stop_audit",
            "description": "Executa o hook Stop local com payload fornecido e retorna stdout/stderr/exit_code.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "payload": {
                        "type": "object",
                        "description": "Payload JSON compatível com evento Stop.",
                    }
                },
            },
        },
    ]


def _handle_tool_call(name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    root = _project_root()

    if name == "hcd_err_get_latest_report":
        hooks_dir = root / ".log" / "hooks"
        date_utc = (arguments or {}).get("date_utc")
        tail_lines = int((arguments or {}).get("tail_lines", 80))
        tail_lines = max(1, min(400, tail_lines))

        if date_utc:
            report = hooks_dir / f"{date_utc}-hcd-err-audit.md"
        else:
            reports = sorted(hooks_dir.glob("*-hcd-err-audit.md"))
            report = reports[-1] if reports else None

        if not report or not report.exists():
            return _text_result("Nenhum relatório de auditoria HCD-ERR encontrado.")

        lines = report.read_text(encoding="utf-8", errors="replace").splitlines()
        tail = "\n".join(lines[-tail_lines:])
        return _text_result(f"report_path={report.relative_to(root)}\n\n{tail}")

    if name == "hcd_err_list_state_files":
        state = root / ".log" / "hooks" / ".state"
        needle = str((arguments or {}).get("session_id_contains") or "")
        files = []
        if state.exists():
            for path in sorted(state.glob("*")):
                rel = path.relative_to(root).as_posix()
                if needle and needle not in rel:
                    continue
                files.append(rel)
        if not files:
            return _text_result("Nenhum arquivo de estado encontrado.")
        return _text_result("\n".join(files))

    if name == "hcd_err_run_stop_audit":
        payload = (arguments or {}).get("payload") or {
            "hook_event_name": "Stop",
            "session_id": "mcp-manual",
            "turn_id": "mcp-manual-turn",
            "cwd": str(root),
            "model": "manual",
            "transcript_path": None,
            "stop_hook_active": False,
            "last_assistant_message": None,
        }

        script = root / ".codex" / "hooks" / "stop_hcd_err_audit.py"
        proc = subprocess.run(
            ["python3", str(script)],
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            cwd=root,
        )
        text = (
            f"exit_code={proc.returncode}\n"
            f"stdout={proc.stdout.strip()}\n"
            f"stderr={proc.stderr.strip()}"
        )
        return _text_result(text)

    return _text_result(f"Tool desconhecida: {name}")


def _serve_stdio() -> None:
    while True:
        req = _read_message()
        if req is None:
            break

        method = req.get("method")
        req_id = req.get("id")

        if method == "initialize":
            _write_message(
                {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                    },
                }
            )
            continue

        if method == "notifications/initialized":
            continue

        if method == "tools/list":
            _write_message(
                {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {"tools": _tool_defs()},
                }
            )
            continue

        if method == "tools/call":
            params = req.get("params") or {}
            tool_name = params.get("name")
            arguments = params.get("arguments") or {}
            result = _handle_tool_call(str(tool_name), arguments)
            _write_message(
                {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": result,
                }
            )
            continue

        if req_id is not None:
            _write_message(
                {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {
                        "code": -32601,
                        "message": f"Method not found: {method}",
                    },
                }
            )


def _self_test() -> int:
    tools = [tool["name"] for tool in _tool_defs()]
    print(json.dumps({"server": SERVER_NAME, "version": SERVER_VERSION, "tools": tools}, ensure_ascii=False))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    _serve_stdio()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
