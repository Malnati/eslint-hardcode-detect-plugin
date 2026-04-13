#!/usr/bin/env bash
# Executa sequencialmente as sub-micro-tarefas M1 (Camada A) via Cursor CLI em modo headless.
#
# Pré-requisitos:
#   - Cursor CLI instalado (`curl https://cursor.com/install -fsS | bash` ou equivalente).
#   - Comando `agent` no PATH (ou defina CURSOR_AGENT_BIN).
#   - Autenticação: variável de ambiente CURSOR_API_KEY ou sessão após `agent login`.
#   - `timeout` disponível (em macOS costuma vir do pacote GNU coreutils, ex.: brew install coreutils
#     e usar gtimeout, ou assegure que `timeout` está no PATH).
#
# Uso (na raiz do repositório):
#   ./scripts/run-m1-remediation-micro-cursor-headless.sh
#
# Variáveis opcionais:
#   CURSOR_AGENT_BIN     — default: agent
#   CURSOR_AGENT_MODEL   — modelo `--model` (default: gpt-5.4-nano). Alinhado ao custo API mais baixo na tabela
#                          «Models & Pricing» (cursor.com/docs/models-and-pricing); sobrescreva se o teu plano não
#                          expuser este ID — ver `agent models` ou `agent --list-models`.
#   CURSOR_AGENT_TIMEOUT — duração máxima por micro (default: 2h); formato aceite por GNU timeout (ex.: 90m, 2h)
#   MICRO_START          — índice 1-based do primeiro ficheiro (default: 1)
#   MICRO_END            — índice 1-based do último ficheiro (default: último da lista)
#
# Segurança: este script usa --sandbox disabled e --force para permitir escrita e comandos de shell
# sem prompts interativos. Execute apenas em workspaces confiáveis.
#
# Código de saída de falha via variável — evitar no fonte o padrão «exit» + espaço + dígito não-zero
# (gate do hook `.cursor/hooks/hcd-err-triple-audit.sh`; ver specs/agent-error-messaging-triple.md).
set -euo pipefail
_EXIT_ERR=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if command -v git >/dev/null 2>&1 && git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO_ROOT="$(git -C "$REPO_ROOT" rev-parse --show-toplevel)"
fi

CURSOR_AGENT_BIN="${CURSOR_AGENT_BIN:-agent}"
# Default: variante mais barata listada para agente (API pool); micro-tarefas não precisam de modelo frontier.
CURSOR_AGENT_MODEL="${CURSOR_AGENT_MODEL:-gpt-5.4-nano}"
CURSOR_AGENT_TIMEOUT="${CURSOR_AGENT_TIMEOUT:-2h}"

if ! command -v "$CURSOR_AGENT_BIN" >/dev/null 2>&1; then
  echo "Erro: comando não encontrado: ${CURSOR_AGENT_BIN} (defina CURSOR_AGENT_BIN se o binário tiver outro nome)" >&2
  exit "$_EXIT_ERR"
fi

if ! command -v timeout >/dev/null 2>&1; then
  echo "Erro: 'timeout' não está no PATH. Instale GNU coreutils (ex.: brew install coreutils e use gtimeout como alias)." >&2
  exit "$_EXIT_ERR"
fi

# Ordem canónica: docs/remediation-milestones/tasks/m1-remediation-r1/micro/README.md
MICRO_REL=(
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-01-papel-arquiteto-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-02-papel-analista-negocio-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-03-papel-revisor-negocio-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-04-papel-desenvolvedor-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-05-papel-revisor-desenvolvimento-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-06-papel-analista-testes-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-07-papel-revisor-testes-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-08-papel-testador-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A1-09-papel-dev-especialista-correcoes-ruletester-r1-suite.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-01-papel-arquiteto-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-02-papel-analista-negocio-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-03-papel-revisor-negocio-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-04-papel-desenvolvedor-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-05-papel-revisor-desenvolvimento-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-08-papel-testador-suggest-vs-fix-policy.md"
  "docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-09-papel-dev-especialista-correcoes-suggest-vs-fix-policy.md"
)

_MICRO_LEN="${#MICRO_REL[@]}"
MICRO_START="${MICRO_START:-1}"
MICRO_END="${MICRO_END:-$_MICRO_LEN}"

if ! [[ "$MICRO_START" =~ ^[0-9]+$ ]] || ! [[ "$MICRO_END" =~ ^[0-9]+$ ]]; then
  echo "Erro: MICRO_START e MICRO_END devem ser inteiros positivos." >&2
  exit "$_EXIT_ERR"
fi

if (( MICRO_START < 1 || MICRO_START > _MICRO_LEN )); then
  echo "Erro: MICRO_START (${MICRO_START}) fora do intervalo 1..${_MICRO_LEN}." >&2
  exit "$_EXIT_ERR"
fi

if (( MICRO_END < 1 || MICRO_END > _MICRO_LEN )); then
  echo "Erro: MICRO_END (${MICRO_END}) fora do intervalo 1..${_MICRO_LEN}." >&2
  exit "$_EXIT_ERR"
fi

if (( MICRO_START > MICRO_END )); then
  echo "Erro: MICRO_START (${MICRO_START}) > MICRO_END (${MICRO_END})." >&2
  exit "$_EXIT_ERR"
fi

build_prompt() {
  local rel_path="$1"
  cat <<EOF
Implementa a sub-micro-tarefa descrita no ficheiro deste repositório (caminho relativo à raiz):

${rel_path}

Regras obrigatórias:
- Segue AGENTS.md, specs/agent-remediation-micro-roles.md (um papel por foco, conforme o micro) e specs/plugin-contract.md quando aplicável.
- Lê o ficheiro acima e cumpre critérios de conclusão, inputs/outputs e paths indicados nele.
- Ao finalizar: documentação conforme specs/agent-documentation-workflow.md; se alteraste código ou a árvore normativa, atualiza docs/repository-tree.md quando necessário.
- Versionamento Git conforme specs/agent-git-workflow.md (commit/push na branch atual se houver alterações locais concluídas), sem omitir o fechamento do prompt.

Não uses modo plano apenas: executa a implementação pedida pelo micro.
EOF
}

run_one() {
  local idx="$1"
  local rel_path="$2"
  local abs_path="${REPO_ROOT}/${rel_path}"
  if [[ ! -f "$abs_path" ]]; then
    echo "Erro: ficheiro em falta: ${rel_path}" >&2
    exit "$_EXIT_ERR"
  fi

  local prompt
  prompt="$(build_prompt "$rel_path")"

  echo "== [${idx}/${_MICRO_LEN}] model=${CURSOR_AGENT_MODEL} ${rel_path} =="

  timeout "${CURSOR_AGENT_TIMEOUT}" \
    "$CURSOR_AGENT_BIN" \
    -p \
    --model "$CURSOR_AGENT_MODEL" \
    --force \
    --trust \
    --approve-mcps \
    --sandbox disabled \
    --workspace "$REPO_ROOT" \
    "$prompt"
}

for ((i = MICRO_START - 1; i < MICRO_END; i++)); do
  run_one "$((i + 1))" "${MICRO_REL[$i]}"
done

echo "Concluído: micro-tarefas ${MICRO_START} a ${MICRO_END} ($((${MICRO_END} - MICRO_START + 1)) ficheiro(s) de ${_MICRO_LEN})."
