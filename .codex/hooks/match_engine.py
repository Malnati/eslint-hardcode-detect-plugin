#!/usr/bin/env python3
"""Engine compartilhado de matching/gates para hooks Codex."""

from __future__ import annotations

import re
from pathlib import Path

PREFIX_SENIOR = "[HCD-ERR-SENIOR]"
PREFIX_FIX = "[HCD-ERR-FIX]"
PREFIX_OPS = "[HCD-ERR-OPS]"
PREFIXES = (PREFIX_SENIOR, PREFIX_FIX, PREFIX_OPS)

SPEC_REL = "specs/agent-error-messaging-triple.md"
AGENT_REMEDIATION = ".github/agents/hcd-err-messaging.agent.md"

# Mesmo comportamento do hook Cursor: documentos de definição/massa negativa ficam fora do gate mecânico.
AUDIT_EXCLUDE_PATHS = frozenset(
    {
        "specs/agent-error-messaging-triple.md",
        "scripts/fixtures/smoke-hcd-err-violation-body.md",
    }
)

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

PROMPT_SENSITIVE_PATTERNS = (
    (
        re.compile(r"-----BEGIN\s+[A-Z0-9 ]*PRIVATE KEY-----", re.IGNORECASE),
        "Prompt contém bloco de chave privada.",
    ),
    (
        re.compile(r"\bsk-(?:live|proj|test)-[A-Za-z0-9_-]{20,}\b"),
        "Prompt contém token no padrão de chave OpenAI.",
    ),
    (
        re.compile(r"\bghp_[A-Za-z0-9]{36}\b"),
        "Prompt contém token no padrão GitHub PAT.",
    ),
    (
        re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
        "Prompt contém chave AWS Access Key ID.",
    ),
)

ALLOWED_SUFFIXES = (
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".md",
    ".mdc",
    ".py",
    ".pyi",
    ".pyw",
    ".html",
    ".vue",
    ".java",
    ".php",
    ".phtml",
    ".sql",
    ".ddl",
    ".sh",
    ".bash",
)

EXCLUDE_SUBSTR = (
    "reference/legacy-snapshot/",
)


def basename_allowed(name: str) -> bool:
    if name in ("Makefile", "makefile"):
        return True
    if name == "Dockerfile" or name.startswith("Dockerfile."):
        return True
    return False


def should_audit_path(rel: str) -> bool:
    if not rel:
        return False
    if any(ex in rel for ex in EXCLUDE_SUBSTR):
        return False
    lower = rel.lower()
    if any(lower.endswith(s) for s in ALLOWED_SUFFIXES):
        return True
    return basename_allowed(Path(rel).name)


def has_failure_signal(text: str) -> bool:
    return any(p.search(text) for p in FAILURE_SIGNAL_PATTERNS)


def count_prefixes(text: str) -> tuple[int, int, int]:
    return text.count(PREFIX_SENIOR), text.count(PREFIX_FIX), text.count(PREFIX_OPS)


def prefix_lines(text: str) -> list[tuple[int, str]]:
    out: list[tuple[int, str]] = []
    for i, line in enumerate(text.splitlines(), 1):
        if any(p in line for p in PREFIXES):
            out.append((i, line.strip()[:200]))
    return out


def audit_text_after_gate(text: str) -> dict:
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
        return {
            "outcome": "fail",
            "level": 1,
            "counts": c,
            "reason": "Nível 1: falta pelo menos um prefixo",
        }
    if c[0] != c[1] or c[1] != c[2]:
        return {
            "outcome": "fail",
            "level": 2,
            "counts": c,
            "reason": "Nível 2: contagens devem ser iguais (SENIOR/FIX/OPS)",
        }
    return {"outcome": "ok", "counts": c}


def detect_sensitive_prompt(prompt: str) -> str | None:
    for pattern, reason in PROMPT_SENSITIVE_PATTERNS:
        if pattern.search(prompt or ""):
            return reason
    return None


def should_block_bash_command(command: str) -> tuple[bool, str | None]:
    command = command or ""

    allowed = (
        re.compile(r"\brm\s+-rf\s+(?:\$CODEX_HOME|\"\$CODEX_HOME\"|'\$CODEX_HOME')\b"),
    )
    if any(p.search(command) for p in allowed):
        return False, None

    blocked_patterns = (
        (
            re.compile(r"\bgit\s+reset\s+--hard\b", re.IGNORECASE),
            "Comando destrutivo bloqueado: git reset --hard",
        ),
        (
            re.compile(r"\bgit\s+checkout\s+--\s", re.IGNORECASE),
            "Comando destrutivo bloqueado: git checkout -- <path>",
        ),
        (
            re.compile(r"\brm\s+-rf\s+(/|--\s*/)(\s|$)", re.IGNORECASE),
            "Comando destrutivo bloqueado: rm -rf /",
        ),
        (
            re.compile(r":\s*\(\s*\)\s*\{\s*:\|:&\s*\};:", re.IGNORECASE),
            "Comando bloqueado: fork bomb",
        ),
    )

    for pattern, reason in blocked_patterns:
        if pattern.search(command):
            return True, reason
    return False, None
