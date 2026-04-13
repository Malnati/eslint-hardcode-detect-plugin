# M2-A1-08 — Testador — Normalização e chave de duplicado (R2)

| Campo | Valor |
|-------|--------|
| micro_id | M2-A1-08 |
| milestone | M2 |
| github_milestone | remediation-m2-r2-global |
| parent_task | A1 |
| role | testador |
| labels_sugeridas | `type/feature`, `area/remediation-R2` |
| token_budget_estimate | 1120 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M2-A1-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m2-remediation-r2-global.md`](../../../m2-remediation-r2-global.md) — secção 7 (Camada A).

## Inputs

`docs/hardcode-remediation-macro-plan.md` (verificação global).

## Outputs

Especificação e implementação coerentes: normalização e chave para «mesmo valor» em R2.

## Critério de conclusão

Comportamento único e testável para «mesmo valor» em R2.

## Dependências

Sub-micro-tarefa `M2-A1-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/src/` e comentários normativos em `specs/` se aplicável

