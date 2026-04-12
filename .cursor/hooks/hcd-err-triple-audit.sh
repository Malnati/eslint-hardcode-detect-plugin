#!/usr/bin/env bash
# Cursor project hook: auditoria Nível 1–2 para prefixos HCD-ERR em ficheiros editados pelo Agent.
# Norma: specs/agent-error-messaging-triple.md
set -euo pipefail

INPUT="$(cat)"
export HCD_ERR_AUDIT_JSON="$INPUT"

exec python3 - "${0}" <<'PY'
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

PREFIX_SENIOR = "[HCD-ERR-SENIOR]"
PREFIX_FIX = "[HCD-ERR-FIX]"
PREFIX_OPS = "[HCD-ERR-OPS]"
PREFIXES = (PREFIX_SENIOR, PREFIX_FIX, PREFIX_OPS)

SPEC_REL = "specs/agent-error-messaging-triple.md"
AGENT_REMEDIATION = ".github/agents/hcd-err-messaging.agent.md"
MAX_FOLLOWUP = 3  # manter alinhado a loop_limit em .cursor/hooks.json (stop)

# Documentos que apenas definem/citam os literais; não aplicar gate mecânico (evita ruído).
AUDIT_EXCLUDE_PATHS = frozenset(
    {
        "specs/agent-error-messaging-triple.md",
    }
)

# Se nenhum padrão coincidir, não há “relato de falha” → não auditar contagens HCD-ERR neste ficheiro.
FAILURE_SIGNAL_PATTERNS = tuple(
    re.compile(p, re.MULTILINE | re.IGNORECASE)
    for p in (
        r"\[HCD-ERR-(?:SENIOR|FIX|OPS)\]",
        r"npm ERR!",
        r"AssertionError",
        r"^\s*Error:\s",
        r"exit\s+code",
        r"exit\s+[1-9]\d*",
        r"tests?\s+failed",
        r"test suite failed",
        r"\bFAILED\b",
    )
)


def has_failure_signal(text: str) -> bool:
    return any(p.search(text) for p in FAILURE_SIGNAL_PATTERNS)


ALLOWED_SUFFIXES = (
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".md",
    ".mdc",
)

EXCLUDE_SUBSTR = (
    "reference/legacy-snapshot/",
)


def safe_id(s: str) -> str:
    if not s:
        return "unknown"
    return re.sub(r"[^a-zA-Z0-9._-]+", "_", s)[:220]


def project_root(data: dict) -> Path:
    env = os.environ.get("CURSOR_PROJECT_DIR") or os.environ.get("CLAUDE_PROJECT_DIR")
    if env:
        return Path(env).resolve()
    roots = data.get("workspace_roots") or []
    if roots:
        return Path(roots[0]).resolve()
    script = Path(sys.argv[1]).resolve()
    return script.parents[2]


def to_rel(path: Path, root: Path) -> Optional[str]:
    try:
        rel = path.resolve().relative_to(root)
        return rel.as_posix()
    except ValueError:
        return None


def should_audit(rel: str) -> bool:
    if not rel:
        return False
    lower = rel.lower()
    if not any(lower.endswith(s) for s in ALLOWED_SUFFIXES):
        return False
    return not any(ex in rel for ex in EXCLUDE_SUBSTR)


def count_prefixes(text: str) -> tuple[int, int, int]:
    return text.count(PREFIX_SENIOR), text.count(PREFIX_FIX), text.count(PREFIX_OPS)


def prefix_lines(text: str) -> list[tuple[int, str]]:
    out: list[tuple[int, str]] = []
    for i, line in enumerate(text.splitlines(), 1):
        if any(p in line for p in PREFIXES):
            out.append((i, line.strip()[:200]))
    return out


def audit_text_after_gate(text: str) -> dict:
    """N1/N2 quando o gate indicou relato de falha. Se há sinal mas zero prefixos, falha N1."""
    c = count_prefixes(text)
    total = sum(c)
    if total == 0:
        return {
            "outcome": "fail",
            "level": 1,
            "counts": c,
            "reason": "Nível 1: sinal de falha sem qualquer prefixo HCD-ERR",
        }
    if 0 in c:
        return {"outcome": "fail", "level": 1, "counts": c, "reason": "Nível 1: falta pelo menos um prefixo"}
    if c[0] != c[1] or c[1] != c[2]:
        return {
            "outcome": "fail",
            "level": 2,
            "counts": c,
            "reason": "Nível 2: contagens devem ser iguais (SENIOR/FIX/OPS)",
        }
    return {"outcome": "ok", "counts": c}


def append_daily_log(
    log_path: Path,
    title: str,
    body: str,
) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    sep = "\n---\n\n"
    block = f"## {title}\n\n{body}\n"
    if log_path.exists():
        log_path.write_text(log_path.read_text(encoding="utf-8") + sep + block, encoding="utf-8")
    else:
        log_path.write_text(block, encoding="utf-8")


def main() -> None:
    try:
        data = json.loads(os.environ["HCD_ERR_AUDIT_JSON"])
    except json.JSONDecodeError:
        print("{}", flush=True)
        sys.exit(0)

    event = data.get("hook_event_name") or data.get("hookEventName") or ""
    root = project_root(data)
    state_dir = root / ".log" / "hooks" / ".state"
    log_dir = root / ".log" / "hooks"

    conv = data.get("conversation_id") or ""
    gen = data.get("generation_id") or ""
    state_key = f"{safe_id(conv)}_{safe_id(gen)}"
    state_file = state_dir / f"{state_key}.files"

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    meta_lines = [
        f"- `hook_event_name`: `{event}`",
        f"- `utc_time`: `{now}`",
        f"- `conversation_id`: `{conv}`",
        f"- `generation_id`: `{gen}`",
        f"- `model`: `{data.get('model', '')}`",
        f"- `cursor_version`: `{data.get('cursor_version', os.environ.get('CURSOR_VERSION', ''))}`",
        f"- `transcript_path`: `{data.get('transcript_path') or os.environ.get('CURSOR_TRANSCRIPT_PATH', '')}`",
        f"- `workspace_roots`: `{data.get('workspace_roots', [])}`",
        f"- `project_root`: `{root}`",
    ]

    if event == "afterFileEdit":
        fp = data.get("file_path") or ""
        path = Path(fp) if fp else None
        rel = to_rel(path, root) if path and path.is_file() else None
        if rel and should_audit(rel):
            state_dir.mkdir(parents=True, exist_ok=True)
            with state_file.open("a", encoding="utf-8") as f:
                f.write(rel + "\n")
        print("{}", flush=True)
        return

    if event == "stop":
        loop_count = int(data.get("loop_count") or 0)
        lines: list[str] = []
        if state_file.is_file():
            raw = state_file.read_text(encoding="utf-8").splitlines()
            lines = sorted(set(x.strip() for x in raw if x.strip()))
        results: list[str] = []
        violations: list[str] = []
        for rel in lines:
            p = root / rel
            if not p.is_file():
                results.append(f"- `{rel}`: ficheiro em falta no disco (ignorado)")
                continue
            try:
                text = p.read_text(encoding="utf-8", errors="replace")
            except OSError as e:
                results.append(f"- `{rel}`: erro ao ler ({e})")
                continue
            if rel in AUDIT_EXCLUDE_PATHS:
                results.append(
                    f"- `{rel}`: **skip** — exclusão normativa (lista `AUDIT_EXCLUDE_PATHS` no hook)"
                )
                continue
            if not has_failure_signal(text):
                results.append(
                    f"- `{rel}`: **skip (gate)** — sem sinal de relato de falha/mensagem de erro (regex)"
                )
                continue
            res = audit_text_after_gate(text)
            c = res["counts"]
            pl = prefix_lines(text)
            refs = ", ".join(f"L{ln}" for ln, _ in pl[:12])
            if len(pl) > 12:
                refs += ", …"
            if res["outcome"] == "ok":
                results.append(
                    f"- `{rel}`: **OK** — contagens SENIOR/FIX/OPS = {c[0]}/{c[1]}/{c[2]}; linhas com prefixo: {refs or '—'}"
                )
            else:
                results.append(
                    f"- `{rel}`: **VIOLAÇÃO** ({res['reason']}) — contagens {c[0]}/{c[1]}/{c[2]}; linhas: {refs or '—'}"
                )
                violations.append(rel)

        body = "\n".join(meta_lines) + "\n\n### Ficheiros auditados\n\n" + ("\n".join(results) if results else "_Nenhum ficheiro acumulado neste turno._")

        day = datetime.now(timezone.utc).strftime("%Y%m%d")
        append_daily_log(log_dir / f"{day}-hcd-err-audit.md", "stop (auditoria HCD-ERR)", body)

        try:
            if state_file.is_file():
                state_file.unlink()
        except OSError:
            pass

        if violations and loop_count < MAX_FOLLOWUP:
            msg = (
                "Correção obrigatória (hook `.cursor/hooks/hcd-err-triple-audit.sh`): ajustar os ficheiros "
                + ", ".join(f"`{v}`" for v in violations)
                + " para conformidade com `"
                + SPEC_REL
                + "` (Níveis 1–2). Siga o protocolo estreito em `"
                + AGENT_REMEDIATION
                + "`. **Não** use a ferramenta Task nem sub-agentes genéricos para isto — edite diretamente nesta conversa."
            )
            print(json.dumps({"followup_message": msg}, ensure_ascii=False), flush=True)
        else:
            print("{}", flush=True)
        return

    print("{}", flush=True)


if __name__ == "__main__":
    main()
PY
