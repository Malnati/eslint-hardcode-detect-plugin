#!/usr/bin/env bash
# Smoke test para .cursor/hooks/hcd-err-triple-audit.sh
#
# Valida stdin/stdout e a lógica do script (Python embutido) com CURSOR_PROJECT_DIR.
# Isto NÃO substitui a verificação de que o Cursor CLI invoca hooks no Agent; use
# docs/cursor-vps-cli-parity.md (Nível 2) para integração manual na VPS/CLI.
#
# Uso: na raiz do repositório — bash scripts/smoke-cursor-hcd-err-hook.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if command -v git >/dev/null 2>&1 && git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO_ROOT="$(git -C "$REPO_ROOT" rev-parse --show-toplevel)"
fi

export CURSOR_PROJECT_DIR="$REPO_ROOT"
HOOK="$REPO_ROOT/.cursor/hooks/hcd-err-triple-audit.sh"
STATE_DIR="$REPO_ROOT/.log/hooks/.state"

if [[ ! -x "$HOOK" ]]; then
  echo "FAIL: hook não executável ou em falta: $HOOK" >&2
  exit 1
fi

run_hook_json() {
  local payload="$1"
  timeout 60s bash -c "printf '%s' $(printf '%q' "$payload") | \"$HOOK\""
}

json_after_edit() {
  python3 -c "
import json, os
root = os.environ['CURSOR_PROJECT_DIR']
print(json.dumps({
    'hook_event_name': 'afterFileEdit',
    'conversation_id': '$1',
    'generation_id': '$2',
    'file_path': os.path.join(root, 'packages/eslint-plugin-hardcode-detect/src/index.ts'),
    'workspace_roots': [root],
    'model': 'smoke',
}))
"
}

json_stop() {
  python3 -c "
import json, os
root = os.environ['CURSOR_PROJECT_DIR']
print(json.dumps({
    'hook_event_name': 'stop',
    'conversation_id': '$1',
    'generation_id': '$2',
    'loop_count': 0,
    'workspace_roots': [root],
    'transcript_path': None,
}))
"
}

echo "== Case 1: afterFileEdit (acumula .ts) =="
OUT1="$(json_after_edit smoke1c smoke1g | timeout 60s "$HOOK")"
if [[ "$OUT1" != "{}" ]]; then
  echo "FAIL: esperado stdout '{}', obtido: $OUT1" >&2
  exit 1
fi
echo "OK afterFileEdit"

echo "== Case 2: stop sem ficheiros acumulados (outro generation) =="
OUT2="$(json_stop smoke2c smoke2g | timeout 60s "$HOOK")"
if [[ "$OUT2" != "{}" ]]; then
  echo "FAIL: esperado stdout '{}', obtido: $OUT2" >&2
  exit 1
fi
echo "OK stop vazio"

echo "== Case 3: stop com violação (gate + prefixos desbalanceados) =="
mkdir -p "$STATE_DIR"
VIOL_REL=".log/hooks/_smoke-hcd-err-violation.md"
VIOL_FILE="$REPO_ROOT/$VIOL_REL"
cat >"$VIOL_FILE" <<'EOF'
Something failed.

Error: broken

[HCD-ERR-SENIOR] apenas uma parte
EOF

printf '%s\n' "$VIOL_REL" >"$STATE_DIR/smoke3c_smoke3g.files"
OUT3="$(json_stop smoke3c smoke3g | timeout 60s "$HOOK")"
if ! printf '%s' "$OUT3" | grep -q 'followup_message'; then
  echo "FAIL: esperado JSON com followup_message, obtido: $OUT3" >&2
  rm -f "$VIOL_FILE" "$STATE_DIR/smoke3c_smoke3g.files"
  exit 1
fi
echo "OK stop com violação (followup_message presente)"

rm -f "$VIOL_FILE" "$STATE_DIR/smoke3c_smoke3g.files"
# Estado smoke1: ficheiro .files ainda pode existir — remover para não poluir
rm -f "$STATE_DIR/smoke1c_smoke1g.files"

echo "Todos os smoke tests passaram."
