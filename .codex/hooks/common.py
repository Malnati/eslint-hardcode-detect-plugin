#!/usr/bin/env python3
"""Utilitários comuns para hooks Codex deste repositório."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

CODEX_AUDIT_COMMIT_MSG = "chore(codex): append HCD-ERR audit log"


def read_payload() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def _safe_id(value: str) -> str:
    if not value:
        return "unknown"
    return re.sub(r"[^a-zA-Z0-9._-]+", "_", value)[:220]


def project_root(payload: dict[str, Any]) -> Path:
    cwd = payload.get("cwd")
    if cwd:
        p = Path(cwd).resolve()
        if p.exists():
            return p

    env = os.environ.get("CURSOR_PROJECT_DIR") or os.environ.get("CLAUDE_PROJECT_DIR")
    if env:
        p = Path(env).resolve()
        if p.exists():
            return p

    script = Path(__file__).resolve()
    return script.parents[2]


def state_dir(root: Path) -> Path:
    return root / ".log" / "hooks" / ".state"


def _turn_key(payload: dict[str, Any]) -> str:
    session = _safe_id(str(payload.get("session_id") or ""))
    turn = _safe_id(str(payload.get("turn_id") or ""))
    return f"{session}_{turn}"


def snapshot_path(root: Path, payload: dict[str, Any]) -> Path:
    return state_dir(root) / f"codex_{_turn_key(payload)}.snapshot.json"


def turn_signal_path(root: Path, payload: dict[str, Any]) -> Path:
    return state_dir(root) / f"codex_{_turn_key(payload)}.signal.json"


def append_daily_log(log_path: Path, title: str, body: str) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    sep = "\n---\n\n"
    block = f"## {title}\n\n{body}\n"
    if log_path.exists():
        log_path.write_text(log_path.read_text(encoding="utf-8") + sep + block, encoding="utf-8")
    else:
        log_path.write_text(block, encoding="utf-8")


def _env_truthy(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in ("1", "true", "yes", "on")


def _git_cmd(root: Path, args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(root), *args],
        capture_output=True,
        text=True,
    )


def git_status_paths(root: Path) -> set[str]:
    if not shutil.which("git"):
        return set()

    in_repo = _git_cmd(root, ["rev-parse", "--is-inside-work-tree"])
    if in_repo.returncode != 0 or in_repo.stdout.strip() != "true":
        return set()

    proc = _git_cmd(root, ["status", "--porcelain", "--untracked-files=all"])
    if proc.returncode != 0:
        return set()

    paths: set[str] = set()
    for line in proc.stdout.splitlines():
        if len(line) < 4:
            continue
        rel = line[3:]
        if " -> " in rel:
            rel = rel.split(" -> ", 1)[1]
        rel = rel.strip()
        if rel:
            paths.add(rel)
    return paths


def save_turn_snapshot(root: Path, payload: dict[str, Any], dirty_paths: set[str]) -> None:
    sdir = state_dir(root)
    sdir.mkdir(parents=True, exist_ok=True)
    data = {
        "session_id": payload.get("session_id"),
        "turn_id": payload.get("turn_id"),
        "saved_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "dirty_paths": sorted(dirty_paths),
    }
    snapshot_path(root, payload).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_turn_snapshot(root: Path, payload: dict[str, Any]) -> dict[str, Any] | None:
    spath = snapshot_path(root, payload)
    if not spath.is_file():
        return None
    try:
        return json.loads(spath.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def clear_turn_snapshot(root: Path, payload: dict[str, Any]) -> None:
    for path in (snapshot_path(root, payload), turn_signal_path(root, payload)):
        try:
            if path.exists():
                path.unlink()
        except OSError:
            pass


def save_turn_signal(root: Path, payload: dict[str, Any], signal: dict[str, Any]) -> None:
    sdir = state_dir(root)
    sdir.mkdir(parents=True, exist_ok=True)
    turn_signal_path(root, payload).write_text(json.dumps(signal, ensure_ascii=False, indent=2), encoding="utf-8")


def load_turn_signal(root: Path, payload: dict[str, Any]) -> dict[str, Any] | None:
    p = turn_signal_path(root, payload)
    if not p.is_file():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def maybe_git_commit_and_push_log(root: Path, rel_log: str) -> None:
    # Default seguro: desligado. Só habilita com HCD_ERR_CODEX_AUDIT_AUTO_GIT=1.
    if not _env_truthy("HCD_ERR_CODEX_AUDIT_AUTO_GIT"):
        return
    if _env_truthy("HCD_ERR_AUDIT_SKIP_GIT"):
        return
    if not shutil.which("git"):
        return

    in_repo = _git_cmd(root, ["rev-parse", "--is-inside-work-tree"])
    if in_repo.returncode != 0 or in_repo.stdout.strip() != "true":
        return

    staged = _git_cmd(root, ["diff", "--cached", "--name-only"])
    if staged.stdout.strip():
        print(
            "hcd-err-codex-audit: skip auto-commit (git index has other staged files)",
            file=sys.stderr,
        )
        return

    changed = _git_cmd(root, ["status", "--porcelain", "--untracked-files=all", "--", rel_log])
    if not changed.stdout.strip():
        return

    add_r = _git_cmd(root, ["add", "--", rel_log])
    if add_r.returncode != 0:
        print(f"hcd-err-codex-audit: git add failed: {add_r.stderr or add_r.stdout}", file=sys.stderr)
        return

    commit_r = _git_cmd(root, ["commit", "-m", CODEX_AUDIT_COMMIT_MSG, "--", rel_log])
    if commit_r.returncode != 0:
        print(
            f"hcd-err-codex-audit: git commit failed: {commit_r.stderr or commit_r.stdout}",
            file=sys.stderr,
        )
        return

    push_r = _git_cmd(root, ["push"])
    if push_r.returncode != 0:
        print(f"hcd-err-codex-audit: git push failed: {push_r.stderr or push_r.stdout}", file=sys.stderr)


def default_meta_lines(payload: dict[str, Any], root: Path) -> list[str]:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return [
        f"- `hook_event_name`: `{payload.get('hook_event_name', '')}`",
        f"- `utc_time`: `{now}`",
        f"- `session_id`: `{payload.get('session_id', '')}`",
        f"- `turn_id`: `{payload.get('turn_id', '')}`",
        f"- `model`: `{payload.get('model', '')}`",
        f"- `transcript_path`: `{payload.get('transcript_path')}`",
        f"- `cwd`: `{payload.get('cwd', '')}`",
        f"- `project_root`: `{root}`",
    ]
