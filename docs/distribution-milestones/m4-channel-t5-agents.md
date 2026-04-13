# Marco M4: T5 — ecossistema agente (`channel-t5-agents`)

Plano para **Cursor, Copilot, MCP** (T5): superfícies **indiretas** que **preservam** o fluxo normativo já verificado em T3/T4 — sem substituir o pacote npm. **Entrada:** handoff de **T4** (guia IDE + contrato claro do que o CI executa).

**Milestone GitHub sugerido:** `channel-t5-agents`  
**Labels:** `area/channel-T5`, `type/docs`, `type/ci` se houver job de verificação de ficheiros.

---

## 1. Objetivo e escopo (trilhas e canais)

- Verificação de árvore [`.cursor/rules/`](../../.cursor/rules/), [`.cursor/skills/`](../../.cursor/skills/), [`.cursor/commands/`](../../.cursor/commands/), [`.cursor/hooks.json`](../../.cursor/hooks.json) / [`.cursor/hooks/`](../../.cursor/hooks/), [`.github/agents/`](../../.github/agents/), [`.github/instructions/`](../../.github/instructions/); smoke MCP opcional; política em [`../../specs/agent-tooling-ecosystem-map.md`](../../specs/agent-tooling-ecosystem-map.md).
- **Canais:** linhas **Cursor** (regras, skills, hooks, CLI), **GitHub Copilot** (agents, instructions), **MCP** — tabela mestre em [`../solution-distribution-channels.md`](../solution-distribution-channels.md) (secção «Tabela mestre de canais»).

---

## 2. Dependências e handoff (cadeia T1→T6)

| | Conteúdo |
|---|-----------|
| **Entrada (consome)** | **T4:** guia IDE e mesmas regras; **T3:** expectativa de CI. |
| **Saída (entrega)** | **Para T6:** política de agente alinhada ao lint **real** do repo (comandos e paths normativos em `AGENTS.md` / specs). |
| **Risco se handoff falhar** | Hooks (T6) ou humanos seguem instruções de agente desalinhadas do `npm test` / CI. |

---

## 3. Diagrama de sequência (Mermaid)

```mermaid
sequenceDiagram
  participant Repo as repositorio
  participant Rules as cursor_rules
  participant AgentsGh as github_agents
  participant Human as maintainer
  Repo->>Rules: carregar_alwaysApply
  Repo->>AgentsGh: pontes_copilot
  Human->>Repo: npm_test_continua_fonte_verdade
  Rules-->>Human: orientacao_indireta
```

---

## 4. Ordem, dependências e durações

| Ordem | Subtarefa | Duração estimada | Depende de | “Pronto para PR” quando |
|-------|-----------|------------------|------------|-------------------------|
| 1 | Inventário `.cursor/` e `.github/agents/` | 8d | M3 (onda 1 / handoff T4) | Lista + gaps |
| 2 | Job opcional `verify-agent-files` | 10d | 1 | Workflow ou issue |
| 3 | Cruzamento com `agent-tooling-ecosystem-map` | *incl. em 2* | 2 | Tabela remissões |

**Duração total do marco (sequencial):** 18d.

---

## 5. Composição temporal (durações)

Eixo **`2000-01-01` = T0 fictício** (Mermaid); **só as durações são normativas.**

```mermaid
gantt
  title Marco M4 T5 agentes
  dateFormat YYYY-MM-DD
  section Inventario
  Arvore_cursor_github :m4a, 2000-01-01, 8d
  section Automacao
  Job_verify_opcional :m4b, after m4a, 10d
```

---

## 6. Matriz e2e × Docker Compose

| Massa / projeto | Trilha | Perfil Compose | Comando ou job CI |
|-----------------|--------|----------------|-------------------|
| N/A (ficheiros normativos) | T5 | N/A | Workflow que valida presença/schema opcional |
| Monorepo | T5 | `e2e` / `prod` | Garantir que agentes não quebram testes existentes |

---

## 7. Camada A — Tarefas e orçamento de tokens (pré-execução de agentes)

Índice dos ficheiros por tarefa: [`tasks/m4-channel-t5-agents/README.md`](tasks/m4-channel-t5-agents/README.md).

| ID | Tarefa | Inputs | Outputs | Teto (tokens) estimado | Critério de conclusão | Ficheiro de tarefa |
|----|--------|--------|---------|------------------------|----------------------|-------------------|
| A1 | Inventário `.cursor/` / pontes Copilot + checklist | Handoff T4 (M3), [`agent-tooling-ecosystem-map`](../../specs/agent-tooling-ecosystem-map.md) | Tabela de ficheiros + gaps | 22 000 | Lista verificável contra o disco e o mapa de equivalências | [`tasks/m4-channel-t5-agents/A1-inventario-cursor-github-agentes-checklist.md`](tasks/m4-channel-t5-agents/A1-inventario-cursor-github-agentes-checklist.md) |
| A2 | Propor job `verify-agent-files` | A1; [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | Step/job YAML **ou** backlog documentado | 25 000 | Automação ou decisão adiada com critérios; não regredir T3 | [`tasks/m4-channel-t5-agents/A2-propor-job-verify-agent-files.md`](tasks/m4-channel-t5-agents/A2-propor-job-verify-agent-files.md) |
| A3 | Docs limites MCP (+ Clippings se preciso) | `limitations-and-scope`, `solution-distribution-channels`; A1 recomendado | Parágrafos ancorados; Clippings só se decisão depender de doc oficial | 18 000 | Papel indireto do MCP explícito vs npm/CI | [`tasks/m4-channel-t5-agents/A3-docs-limites-mcp-clippings.md`](tasks/m4-channel-t5-agents/A3-docs-limites-mcp-clippings.md) |

---

## 8. Camada B — Execução de agentes por fase

| Fase | O que executar | Evidência | Handoff |
|------|----------------|-----------|---------|
| Desenvolvimento | Edits `.cursor/`, `.github/`, docs | PR | Política T5 |
| Testes | `npm test` obrigatório | Verde | Não regredir T3 |
| Análise | Diffs grandes em rules | Revisão | |
| Logs e documentos | Atualizar macro-plan | | |
| Correções | Commits | | |
| Deploy | N/A | | |
| Validações | Checklist Copilot/Cursor | | |
| Distribuições | Marketplace Cursor = checklist separado | Doc | Fora npm plugin |

---

## 9. Plano GitHub (PR, branch, semver)

- **PR:** `docs(channel): milestone M4 — agent ecosystem checks`
- **Branch:** `milestone/m4-channel-t5-agents`
- **Semver:** sem bump salvo mudança de empacotamento.

---

## 10. Riscos e critérios de “done”

- **Riscos:** duplicação normativa vs `AGENTS.md`; drift de globs em `instructions`.
- **Done:** inventário atualizado; testes passam; handoff explícito para **fecho T6** em M3/M5 conforme política de ondas.
