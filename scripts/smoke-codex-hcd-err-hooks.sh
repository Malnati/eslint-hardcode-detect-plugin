#!/usr/bin/env bash
# Smoke tests para hooks Codex locais em .codex/.
# Uso: bash scripts/smoke-codex-hcd-err-hooks.sh
set -euo pipefail

_SMOKE_XC=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if command -v git >/dev/null 2>&1 && git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO_ROOT="$(git -C "$REPO_ROOT" rev-parse --show-toplevel)"
fi

export HCD_ERR_AUDIT_SKIP_GIT=1
export HCD_ERR_CODEX_AUDIT_AUTO_GIT=0

USER_PROMPT="$REPO_ROOT/.codex/hooks/user_prompt_submit_policy.py"
PRE_TOOL="$REPO_ROOT/.codex/hooks/pre_tool_use_policy.py"
POST_TOOL="$REPO_ROOT/.codex/hooks/post_tool_use_review.py"
STOP_HOOK="$REPO_ROOT/.codex/hooks/stop_hcd_err_audit.py"
MCP_SERVER="$REPO_ROOT/.codex/mcp/hcd_audit_server.py"

for f in "$USER_PROMPT" "$PRE_TOOL" "$POST_TOOL" "$STOP_HOOK" "$MCP_SERVER"; do
  if [[ ! -f "$f" ]]; then
    echo "FAIL: ficheiro em falta: $f" >&2
    exit "$_SMOKE_XC"
  fi
done

echo "== Case 1: UserPromptSubmit salva snapshot e não bloqueia prompt comum =="
OUT1="$(python3 "$USER_PROMPT" <<JSON
{"hook_event_name":"UserPromptSubmit","session_id":"smoke-codex","turn_id":"turn-1","cwd":"$REPO_ROOT","prompt":"Executar validação local","model":"smoke"}
JSON
)"
if [[ "$OUT1" != "{}" ]]; then
  echo "FAIL: esperado {}, obtido: $OUT1" >&2
  exit "$_SMOKE_XC"
fi

SNAPSHOT="$REPO_ROOT/.log/hooks/.state/codex_smoke-codex_turn-1.snapshot.json"
if [[ ! -f "$SNAPSHOT" ]]; then
  echo "FAIL: snapshot de turno não foi criado" >&2
  exit "$_SMOKE_XC"
fi

echo "== Case 2: PreToolUse bloqueia comando destrutivo =="
OUT2="$(python3 "$PRE_TOOL" <<'JSON'
{"hook_event_name":"PreToolUse","tool_input":{"command":"git reset --hard"}}
JSON
)"
if ! printf '%s' "$OUT2" | grep -q '"permissionDecision": "deny"'; then
  echo "FAIL: esperado deny no PreToolUse, obtido: $OUT2" >&2
  exit "$_SMOKE_XC"
fi

echo "== Case 3: PostToolUse sinaliza falha de Bash =="
OUT3="$(python3 "$POST_TOOL" <<JSON
{"hook_event_name":"PostToolUse","session_id":"smoke-codex","turn_id":"turn-1","cwd":"$REPO_ROOT","tool_input":{"command":"npm test"},"tool_response":"npm ERR! code 1"}
JSON
)"
if ! printf '%s' "$OUT3" | grep -q 'systemMessage'; then
  echo "FAIL: esperado systemMessage no PostToolUse, obtido: $OUT3" >&2
  exit "$_SMOKE_XC"
fi

echo "== Case 4: Stop detecta violação e retorna decision:block =="
mkdir -p "$REPO_ROOT/.log/hooks"
VIOL_REL=".log/hooks/_smoke-codex-hcd-err-violation.md"
cp "$REPO_ROOT/scripts/fixtures/smoke-hcd-err-violation-body.md" "$REPO_ROOT/$VIOL_REL"

OUT4="$(python3 "$STOP_HOOK" <<JSON
{"hook_event_name":"Stop","session_id":"smoke-codex","turn_id":"turn-1","cwd":"$REPO_ROOT","model":"smoke","transcript_path":null,"stop_hook_active":false,"last_assistant_message":"teste"}
JSON
)"

if ! printf '%s' "$OUT4" | grep -q '"decision": "block"'; then
  echo "FAIL: esperado decision:block no Stop, obtido: $OUT4" >&2
  rm -f "$REPO_ROOT/$VIOL_REL"
  exit "$_SMOKE_XC"
fi

if [[ ! -f "$REPO_ROOT/.log/hooks/$(date -u +%Y%m%d)-hcd-err-audit.md" ]]; then
  echo "FAIL: relatório diário não foi criado" >&2
  rm -f "$REPO_ROOT/$VIOL_REL"
  exit "$_SMOKE_XC"
fi

echo "== Case 5: MCP server self-test =="
OUT5="$(python3 "$MCP_SERVER" --self-test)"
if ! printf '%s' "$OUT5" | grep -q 'hcd_err_get_latest_report'; then
  echo "FAIL: self-test MCP não listou ferramentas esperadas: $OUT5" >&2
  rm -f "$REPO_ROOT/$VIOL_REL"
  exit "$_SMOKE_XC"
fi

rm -f "$REPO_ROOT/$VIOL_REL"
rm -f "$SNAPSHOT"
rm -f "$REPO_ROOT/.log/hooks/.state/codex_smoke-codex_turn-1.signal.json"

echo "Todos os smoke tests Codex passaram."
