#!/usr/bin/env python3
"""Hook Stop: auditoria HCD-ERR Níveis 1–2 com continuação automática controlada."""

from __future__ import annotations

import json
from datetime import datetime, timezone

from common import (
    append_daily_log,
    clear_turn_snapshot,
    default_meta_lines,
    git_status_paths,
    load_turn_signal,
    load_turn_snapshot,
    maybe_git_commit_and_push_log,
    project_root,
    read_payload,
)
from match_engine import (
    AGENT_REMEDIATION,
    AUDIT_EXCLUDE_PATHS,
    SPEC_REL,
    audit_text_after_gate,
    has_failure_signal,
    prefix_lines,
    should_audit_path,
)


def _build_continuation_reason(violations: list[str]) -> str:
    listed = ", ".join(f"`{p}`" for p in violations)
    return (
        "Correção obrigatória do hook Stop: ajustar "
        f"{listed} "
        f"para conformidade com `{SPEC_REL}` (Níveis 1–2). "
        f"Siga o protocolo em `{AGENT_REMEDIATION}`."
    )


def main() -> None:
    payload = read_payload()
    root = project_root(payload)

    before = set()
    snapshot = load_turn_snapshot(root, payload)
    if snapshot:
        before = set(snapshot.get("dirty_paths") or [])

    after = git_status_paths(root)
    touched = sorted(after - before) if snapshot else sorted(after)
    candidates = [p for p in touched if should_audit_path(p)]

    results: list[str] = []
    violations: list[str] = []

    for rel in candidates:
        p = root / rel
        if not p.is_file():
            results.append(f"- `{rel}`: ficheiro em falta no disco (ignorado)")
            continue

        if rel in AUDIT_EXCLUDE_PATHS:
            results.append(
                f"- `{rel}`: **skip** — exclusão normativa (lista `AUDIT_EXCLUDE_PATHS` do matcher)"
            )
            continue

        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            results.append(f"- `{rel}`: erro ao ler ({exc})")
            continue

        if not has_failure_signal(text):
            results.append(f"- `{rel}`: **skip (gate)** — sem sinal de relato de falha/mensagem de erro")
            continue

        res = audit_text_after_gate(text)
        counts = res["counts"]
        refs = prefix_lines(text)
        refs_txt = ", ".join(f"L{ln}" for ln, _ in refs[:12])
        if len(refs) > 12:
            refs_txt += ", …"

        if res["outcome"] == "ok":
            results.append(
                f"- `{rel}`: **OK** — contagens SENIOR/FIX/OPS = {counts[0]}/{counts[1]}/{counts[2]}; linhas: {refs_txt or '—'}"
            )
            continue

        results.append(
            f"- `{rel}`: **VIOLAÇÃO** ({res['reason']}) — contagens {counts[0]}/{counts[1]}/{counts[2]}; linhas: {refs_txt or '—'}"
        )
        violations.append(rel)

    signal = load_turn_signal(root, payload) or {}

    meta = default_meta_lines(payload, root)
    meta.extend(
        [
            f"- `stop_hook_active`: `{payload.get('stop_hook_active')}`",
            f"- `last_assistant_message_present`: `{bool(payload.get('last_assistant_message'))}`",
            f"- `snapshot_loaded`: `{snapshot is not None}`",
            f"- `dirty_before`: `{len(before)}`",
            f"- `dirty_after`: `{len(after)}`",
            f"- `touched_in_turn`: `{len(touched)}`",
            f"- `failure_signal_from_post_tool`: `{bool(signal.get('failure_signal_detected'))}`",
        ]
    )

    audited_block = "\n".join(results) if results else "_Nenhum ficheiro elegível acumulado neste turno._"
    body = "\n".join(meta) + "\n\n### Ficheiros auditados\n\n" + audited_block

    day = datetime.now(timezone.utc).strftime("%Y%m%d")
    rel_log = f".log/hooks/{day}-hcd-err-audit.md"
    append_daily_log(root / rel_log, "codex stop (auditoria HCD-ERR)", body)
    maybe_git_commit_and_push_log(root, rel_log)

    stop_hook_active = bool(payload.get("stop_hook_active"))
    clear_turn_snapshot(root, payload)

    if violations and not stop_hook_active:
        print(
            json.dumps(
                {
                    "decision": "block",
                    "reason": _build_continuation_reason(violations),
                },
                ensure_ascii=False,
            )
        )
        return

    if violations and stop_hook_active:
        print(
            json.dumps(
                {
                    "systemMessage": (
                        "Hook Stop detectou violações HCD-ERR persistentes, "
                        "mas não abriu nova continuação para evitar loop. "
                        "Faça a correção manual antes de encerrar."
                    )
                },
                ensure_ascii=False,
            )
        )
        return

    print("{}")


if __name__ == "__main__":
    main()
