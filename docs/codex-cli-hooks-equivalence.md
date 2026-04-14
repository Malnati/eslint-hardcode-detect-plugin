# Equivalência Cursor -> Codex CLI (hooks + MCP local)

Este documento descreve a adaptação local da automação de agente para Codex CLI mantendo o comportamento essencial já existente em [`.cursor/hooks.json`](../.cursor/hooks.json) e [`.cursor/hooks/hcd-err-triple-audit.sh`](../.cursor/hooks/hcd-err-triple-audit.sh).

## Objetivo

Reproduzir no Codex CLI:

- auditoria HCD-ERR ao final do turno;
- gate por padrão de falha + validação de prefixos `[HCD-ERR-SENIOR]` / `[HCD-ERR-FIX]` / `[HCD-ERR-OPS]`;
- relatório diário em `.log/hooks/YYYYMMDD-hcd-err-audit.md`;
- bloqueio/continuação automática quando houver violação;
- camada reutilizável para ferramentas locais via MCP STDIO.

## Implementação no repositório

### Configuração Codex

- [`.codex/config.toml`](../.codex/config.toml): ativa `codex_hooks` e registra servidor MCP local `hcd_err_local`.
- [`.codex/hooks.json`](../.codex/hooks.json): eventos `UserPromptSubmit`, `PreToolUse` (matcher `Bash`), `PostToolUse` (matcher `Bash`) e `Stop`.

### Hooks locais

- [`.codex/hooks/user_prompt_submit_policy.py`](../.codex/hooks/user_prompt_submit_policy.py)
  - snapshot do estado Git no início do turno;
  - bloqueio de prompt com padrões de segredo (chave privada, token OpenAI/GitHub/AWS).
- [`.codex/hooks/pre_tool_use_policy.py`](../.codex/hooks/pre_tool_use_policy.py)
  - bloqueio de comandos Bash destrutivos (`git reset --hard`, `git checkout --`, `rm -rf /`, fork bomb).
- [`.codex/hooks/post_tool_use_review.py`](../.codex/hooks/post_tool_use_review.py)
  - detecção de sinal de falha em resposta de Bash;
  - marcação de estado para reforço no `Stop`.
- [`.codex/hooks/stop_hcd_err_audit.py`](../.codex/hooks/stop_hcd_err_audit.py)
  - calcula ficheiros tocados no turno (`dirty_after - dirty_before`);
  - aplica gate por regex de falha;
  - valida Níveis 1–2 de HCD-ERR;
  - escreve relatório diário em `.log/hooks/`;
  - retorna `decision:block` quando necessário.

### Módulos compartilhados

- [`.codex/hooks/match_engine.py`](../.codex/hooks/match_engine.py): padrões, regex, contagem de prefixos e regras de gate.
- [`.codex/hooks/common.py`](../.codex/hooks/common.py): payload, snapshot/estado de turno, log diário e utilitários Git.

### MCP STDIO local

- [`.codex/mcp/hcd_audit_server.py`](../.codex/mcp/hcd_audit_server.py)
  - `hcd_err_get_latest_report`
  - `hcd_err_list_state_files`
  - `hcd_err_run_stop_audit`

## Mapa de compatibilidade

| Cursor (atual no repo) | Codex CLI (equivalente) | Estado |
|---|---|---|
| `afterFileEdit` + matcher `Write` em [`.cursor/hooks.json`](../.cursor/hooks.json) | `UserPromptSubmit` + snapshot Git para delimitar turno em [`.codex/hooks/user_prompt_submit_policy.py`](../.codex/hooks/user_prompt_submit_policy.py) | Equivalência funcional por turno |
| `stop` em [`.cursor/hooks.json`](../.cursor/hooks.json) | `Stop` em [`.codex/hooks.json`](../.codex/hooks.json) + auditoria em [`.codex/hooks/stop_hcd_err_audit.py`](../.codex/hooks/stop_hcd_err_audit.py) | Equivalência direta |
| Gate por regex + validação HCD-ERR no script Cursor | Mesmo gate/validação em [`.codex/hooks/match_engine.py`](../.codex/hooks/match_engine.py) | Equivalência direta |
| `followup_message` no Cursor para correção | `decision:block` com razão orientando correção no `Stop` Codex | Adaptação ao protocolo Codex |
| Commit/push opcional do relatório (`HCD_ERR_AUDIT_SKIP_GIT`) | `HCD_ERR_CODEX_AUDIT_AUTO_GIT=1` (opt-in) + `HCD_ERR_AUDIT_SKIP_GIT=1` (opt-out) em [`.codex/hooks/common.py`](../.codex/hooks/common.py) | Equivalência com default mais seguro |
| Sem camada MCP dedicada no hook Cursor | MCP STDIO reutilizável em [`.codex/mcp/hcd_audit_server.py`](../.codex/mcp/hcd_audit_server.py) | Extensão adicional |

## Teste local rápido

```bash
python3 -m py_compile .codex/hooks/*.py .codex/mcp/hcd_audit_server.py
bash scripts/smoke-codex-hcd-err-hooks.sh
```

## Teste de uso no Codex CLI

1. Garantir feature de hooks no projeto:

```toml
# .codex/config.toml
[features]
codex_hooks = true
```

2. Iniciar sessão Codex na raiz do clone.
3. Enviar um prompt que edite arquivo e finalize turno.
4. Verificar relatório em `.log/hooks/YYYYMMDD-hcd-err-audit.md`.

## Limitações atuais

- `PreToolUse` e `PostToolUse` no Codex estão aplicados apenas para matcher `Bash` (limitação do modelo de evento atual).
- A delimitação de “ficheiros tocados no turno” usa estado Git; alterações fora de controle de versão podem aparecer como ruído.
- Auto commit/push do relatório está desligado por padrão (recomendado para evitar commits inesperados).

## Inferências adotadas

1. **Inferência:** o equivalente mais estável de `afterFileEdit` do Cursor no Codex, para este repositório, é capturar snapshot no `UserPromptSubmit` e fechar no `Stop`.
2. **Inferência:** `decision:block` no `Stop` é o mecanismo mais previsível para substituir `followup_message` no fluxo Codex.
3. **Inferência:** MCP local para leitura/execução de auditoria é mais reutilizável do que embutir toda inspeção no hook.
