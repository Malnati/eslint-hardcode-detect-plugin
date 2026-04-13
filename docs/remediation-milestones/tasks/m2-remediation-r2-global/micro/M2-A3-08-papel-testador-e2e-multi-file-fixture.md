# M2-A3-08 — Testador — Fixture e2e multi-ficheiro (R2)

| Campo | Valor |
|-------|--------|
| micro_id | M2-A3-08 |
| milestone | M2 |
| github_milestone | remediation-m2-r2-global |
| parent_task | A3 |
| role | testador |
| labels_sugeridas | `type/feature`, `area/remediation-R2` |
| token_budget_estimate | 3200 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M2-A3-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m2-remediation-r2-global.md`](../../../m2-remediation-r2-global.md) — secção 7 (Camada A).

## Inputs

`specs/e2e-fixture-nest.md` como referência de massa; decisões de A1/A2.

## Outputs

Massa em `packages/e2e-fixture-*` ou extensão do e2e do plugin com dois ou mais ficheiros.

## Critério de conclusão

Runner e2e associado com exit 0.

## Dependências

Sub-micro-tarefa `M2-A3-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, `packages/e2e-fixture-*/` (se criado)

