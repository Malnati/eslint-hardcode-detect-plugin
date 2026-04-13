# M2-A3-07 — Revisor de testes — Fixture e2e multi-ficheiro (R2)

| Campo | Valor |
|-------|--------|
| micro_id | M2-A3-07 |
| milestone | M2 |
| github_milestone | remediation-m2-r2-global |
| parent_task | A3 |
| role | revisor-testes |
| labels_sugeridas | `type/feature`, `area/remediation-R2` |
| token_budget_estimate | 3200 |
| single_focus | Revisa o plano de testes e os critérios de log/artefactos; **não** executa a suíte no lugar do testador. |
| depends_on | Sub-micro-tarefa `M2-A3-06` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m2-remediation-r2-global.md`](../../../m2-remediation-r2-global.md) — secção 7 (Camada A).

## Inputs

`specs/e2e-fixture-nest.md` como referência de massa; decisões de A1/A2.

## Outputs

Contribuição do papel **Revisor de testes** para os outputs agregados de A3: Massa em `packages/e2e-fixture-*` ou extensão do e2e do plugin com dois ou mais ficheiros.

## Critério de conclusão

Papel **Revisor de testes**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A3: Runner e2e associado com exit 0.

## Dependências

Sub-micro-tarefa `M2-A3-06` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, `packages/e2e-fixture-*/` (se criado)

