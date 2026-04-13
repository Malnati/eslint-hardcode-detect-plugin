# A1: Inventário Cursor / GitHub + checklist de coerência (T5)

| Campo | Valor |
|-------|--------|
| milestone | M4 |
| github_milestone | channel-t5-agents |
| task_id | A1 |
| labels_sugeridas | `area/channel-T5`, `type/docs` |
| token_budget_estimate | 22 000 |
| timelining_order | 1 |
| depends_on | — (consome handoff T4 via M3) |

## Plano do marco

Camada A em [`../../m4-channel-t5-agents.md`](../../m4-channel-t5-agents.md) (secções 1, 2, 4, 7 e 10).

## Inputs

- Handoff **T4:** guia IDE e mesmas regras que o CI valida — ver [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) e [`../m3-channel-t4-t6/A1-guia-ide-eslint-flat-config.md`](../m3-channel-t4-t6/A1-guia-ide-eslint-flat-config.md).
- Expectativa **T3:** [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) e [`../m2-channel-t3-ci/micro/M2-A3-02-handoff-t4-o-que-ci-garante.md`](../m2-channel-t3-ci/micro/M2-A3-02-handoff-t4-o-que-ci-garante.md).
- Mapa de equivalências e precedência: [`specs/agent-tooling-ecosystem-map.md`](../../../../specs/agent-tooling-ecosystem-map.md).

## Outputs

- Tabela de **ficheiros normativos T5** no repositório (caminhos relativos à raiz), agrupada por superfície, com coluna de notas (ex.: ponte Copilot, `alwaysApply`, smoke HCD-ERR).
- **Checklist curto** de coerência: sem duplicar `specs/plugin-contract.md` em pontes; caminhos relativos à raiz em `.github/agents/` e `.github/instructions/`; remissões a `AGENTS.md` onde aplicável.
- Lista de **gaps** (ficheiros em falta, globs desalinhados, divergência vs tabela de equivalências).

### Artefacto entregue

Inventário verificável, checklist e gaps: [`evidence/T5-normative-files-inventory.md`](evidence/T5-normative-files-inventory.md).

### Inventário de referência (estado do clone — atualizar na execução)

| Superfície | Paths |
|------------|--------|
| Regras Cursor | `.cursor/rules/*.mdc` |
| Skills Cursor | `.cursor/skills/*/SKILL.md` |
| Comandos Cursor | `.cursor/commands/*.md` |
| Hooks Cursor | `.cursor/hooks.json`, `.cursor/hooks/*` |
| Agentes Copilot | `.github/agents/*.agent.md` |
| Instruções Copilot | `.github/instructions/*.instructions.md` |

## Critério de conclusão

- Tabela + checklist existem como artefato rastreável (doc ou secção em PR) e um revisor consegue verificar cada linha contra o disco e contra [`specs/agent-tooling-ecosystem-map.md`](../../../../specs/agent-tooling-ecosystem-map.md).
- Gaps nomeados ou explicitamente «nenhum» com justificativa.

## Dependências

- **Bloqueia:** A2 (inventário mínimo para definir o que um job `verify` validaria).
- **Depende de:** handoff T4 documentado no fluxo do projeto (M3 onda 1).

## Paths principais

- `.cursor/`
- `.github/agents/`
- `.github/instructions/`
- [`AGENTS.md`](../../../../AGENTS.md)
- [`specs/agent-tooling-ecosystem-map.md`](../../../../specs/agent-tooling-ecosystem-map.md)
- [`docs/cursor-vps-cli-parity.md`](../../../../docs/cursor-vps-cli-parity.md) (paridade IDE vs CLI/VPS)
