# T5 — inventário de ficheiros normativos (Cursor + pontes GitHub Copilot)

| Campo | Valor |
|-------|--------|
| milestone | M4 (`channel-t5-agents`) |
| task | A1 |
| handoff T4 | [`docs/distribution-milestones/tasks/m3-channel-t4-t6/A1-guia-ide-eslint-flat-config.md`](../../m3-channel-t4-t6/A1-guia-ide-eslint-flat-config.md) |
| mapa de equivalências | [`specs/agent-tooling-ecosystem-map.md`](../../../../../specs/agent-tooling-ecosystem-map.md) |
| paridade IDE / CLI / VPS (hooks) | [`docs/cursor-vps-cli-parity.md`](../../../../../docs/cursor-vps-cli-parity.md) |

Este documento é o **artefacto rastreável** pedido em [`../A1-inventario-cursor-github-agentes-checklist.md`](../A1-inventario-cursor-github-agentes-checklist.md). Um revisor pode verificar cada linha no disco e cruzar com a tabela de equivalências em `specs/agent-tooling-ecosystem-map.md`.

---

## 1. Tabelas por superfície

### 1.1 Regras Cursor (`.cursor/rules/*.mdc`)

| Path | `alwaysApply` | Notas |
|------|----------------|--------|
| `.cursor/rules/agent-error-messaging-triple.mdc` | sim | Formato HCD-ERR em falhas; alinha com hook e ponte `hcd-err-messaging` |
| `.cursor/rules/agent-ia-governance.mdc` | sim | Governança; hierarquia com `AGENTS.md` |
| `.cursor/rules/agent-integration-testing-policy.mdc` | sim | Integrações sem mocks |
| `.cursor/rules/agent-reference-agents.mdc` | sim | `reference/agents-ref/` vs normas do repo |
| `.cursor/rules/agent-remediation-micro-roles.mdc` | sim | Sub-micro-tarefas por papel (planos de dev, testes, marcos `*-milestones/`) |
| `.cursor/rules/agent-session.mdc` | sim | Orquestração por prompt |
| `.cursor/rules/clippings-official-docs.mdc` | sim | Consulta `reference/Clippings/` em escopo ESLint/npm |
| `.cursor/rules/documentation.mdc` | sim | Markdown / fechamento de documentação |
| `.cursor/rules/docker-compose-tooling.mdc` | não | Compose / imagem ops-eslint; ver skill `docker-compose-workflow` |
| `.cursor/rules/e2e-nest-fixture.mdc` | não | Massa `packages/e2e-fixture-nest` |
| `.cursor/rules/git-versioning.mdc` | sim | Git ao fechar prompt (prevalece sobre regras genéricas anti-commit) |
| `.cursor/rules/repo-layout.mdc` | sim | Layout do monorepo e `packages/` |
| `.cursor/rules/repo-relative-paths.mdc` | sim | Citação de paths relativos à raiz |

**Resumo:** 13 ficheiros; 11 com `alwaysApply: true`, 2 com `false` (`docker-compose-tooling`, `e2e-nest-fixture` — escopo por contexto).

---

### 1.2 Skills Cursor (`.cursor/skills/*/SKILL.md`)

| Path | Notas |
|------|--------|
| `.cursor/skills/agent-error-messaging-triple/SKILL.md` | Falhas com prefixos HCD-ERR |
| `.cursor/skills/docker-compose-workflow/SKILL.md` | Compose, `.docker/`, action `ops-eslint` |
| `.cursor/skills/eslint-plugin-workflow/SKILL.md` | Regras ESLint, RuleTester, e2e do pacote |
| `.cursor/skills/git-agent-workflow/SKILL.md` | Fecho com commit/push (Conventional Commits) |
| `.cursor/skills/github-markdown-docs/SKILL.md` | README, `docs/`, `repository-tree` |
| `.cursor/skills/reference-agents-portfolio/SKILL.md` | Cruzamento com `reference/agents-ref/` |
| `.cursor/skills/reference-clippings-workflow/SKILL.md` | Sincronização de `reference/Clippings/` |
| `.cursor/skills/remediation-micro-roles-workflow/SKILL.md` | Foco único por papel em planos de dev, testes e marcos |

Equivalência no mapa: skills em `.github/skills/` → neste repo usam **apenas** `.cursor/skills/` (não há pasta `.github/skills/`).

---

### 1.3 Comandos Cursor (`.cursor/commands/*.md`)

| Path | Notas |
|------|--------|
| `.cursor/commands/abrir-prompt-agente.md` | Checklist de abertura de sessão |
| `.cursor/commands/fechar-prompt-agente.md` | Checklist de fechamento |
| `.cursor/commands/fechar-e2e-nest-fixture.md` | Fecho específico fixture Nest e2e |

---

### 1.4 Hooks Cursor

| Path | Notas |
|------|--------|
| `.cursor/hooks.json` | `afterFileEdit` (matcher `Write`) e `stop` → `hcd-err-triple-audit.sh`; timeouts 30s; `loop_limit` 3 em `stop` |
| `.cursor/hooks/hcd-err-triple-audit.sh` | Auditoria Níveis 1–2 HCD-ERR; ver [`docs/cursor-vps-cli-parity.md`](../../../../../docs/cursor-vps-cli-parity.md) para paridade IDE vs CLI/VPS |

---

### 1.5 Agentes GitHub Copilot (`.github/agents/*.agent.md`)

| Path | Notas |
|------|--------|
| `.github/agents/docker-tooling.agent.md` | Ponte Docker/Compose; remete a `specs/agent-docker-compose.md` |
| `.github/agents/eslint-hardcode-plugin.agent.md` | Ponte principal do plugin; hierarquia `AGENTS.md` + `specs/` |
| `.github/agents/hcd-err-messaging.agent.md` | Ponte estreita HCD-ERR; alinha com hook `.cursor/hooks/` |

---

### 1.6 Instruções GitHub Copilot (`.github/instructions/*.instructions.md`)

| Path | `applyTo` (frontmatter) | Notas |
|------|-------------------------|--------|
| `.github/instructions/docker-compose.instructions.md` | `docker-compose*.yml,.docker/**/*` | Ponte curta para `specs/agent-docker-compose.md` |
| `.github/instructions/eslint-plugin-hardcode.instructions.md` | `packages/eslint-plugin-hardcode-detect/**/*.{ts,mjs,cjs,js}` | Ponte para pacote publicável + `AGENTS.md` / `specs/` |
| `.github/instructions/milestones-planning.instructions.md` | `docs/remediation-milestones/**/*.md,docs/distribution-milestones/**/*.md` | Marcos; remete a `agent-remediation-micro-roles` |

---

## 2. Checklist curto de coerência

Use esta lista ao alterar ficheiros T5 ou ao rever um PR:

- [ ] **Sem duplicação normativa pesada:** pontes em `.github/agents/` e `.github/instructions/` não copiam parágrafos longos de [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md); preferem links para `AGENTS.md` e `specs/`.
- [ ] **Caminhos relativos à raiz** em texto e exemplos nas pontes `.github/`, conforme [`docs/documentation-policy.md`](../../../../../docs/documentation-policy.md) (princípio 5b).
- [ ] **Remissões explícitas** a [`AGENTS.md`](../../../../../AGENTS.md) e à hierarquia em `specs/` onde o mapa indica equivalência com coleções estilo Awesome Copilot.
- [ ] **Precedência:** em conflito, seguir a ordem em [`specs/agent-tooling-ecosystem-map.md`](../../../../../specs/agent-tooling-ecosystem-map.md) (pedido do utilizador → `AGENTS.md`/specs → `.cursor/rules` → regras genéricas externas).
- [ ] **Hooks:** alterações a `.cursor/hooks.json` ou ao script de auditoria devem manter-se alinhadas a [`specs/agent-error-messaging-triple.md`](../../../../../specs/agent-error-messaging-triple.md) e ao smoke / notas em [`docs/cursor-vps-cli-parity.md`](../../../../../docs/cursor-vps-cli-parity.md).

---

## 3. Gaps vs `agent-tooling-ecosystem-map.md`

**Nenhum gap material** face à tabela de equivalências e anti-padrões do mapa, à data deste inventário:

- As equivalências listadas (agentes, instruções com `applyTo`, ponte HCD-ERR + hook, Docker, skills em `.cursor/skills/`) têm ficheiros correspondentes ou a ausência é **intencional** (ex.: não existe `.github/skills/` — o mapa aponta skills para `.cursor/skills/` apenas).
- **Plugins Copilot** externos: o mapa indica «não aplicável como runtime deste repo»; não é lacuna de inventário local.

Se no futuro forem adicionados agentes, instruções ou regras `.mdc`, atualizar este ficheiro ou substituí-lo por uma revisão datada.
