# M2-A3-03 — Revisor de negócio — Fixture e2e multi-ficheiro (R2)

| Campo | Valor |
|-------|--------|
| micro_id | M2-A3-03 |
| milestone | M2 |
| github_milestone | remediation-m2-r2-global |
| parent_task | A3 |
| role | revisor-negocio |
| labels_sugeridas | `type/feature`, `area/remediation-R2` |
| token_budget_estimate | 3200 |
| single_focus | Valida a especificação contra `specs/plugin-contract.md` e `docs/architecture.md`; **não** escreve testes nem produção. |
| depends_on | Sub-micro-tarefa `M2-A3-02` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m2-remediation-r2-global.md`](../../../m2-remediation-r2-global.md) — secção 7 (Camada A).

## Inputs

`specs/e2e-fixture-nest.md` como referência de massa; decisões de A1/A2.

## Outputs

Contribuição do papel **Revisor de negócio** para os outputs agregados de A3: Massa em `packages/e2e-fixture-*` ou extensão do e2e do plugin com dois ou mais ficheiros.

## Critério de conclusão

Papel **Revisor de negócio**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A3: Runner e2e associado com exit 0.

## Dependências

Sub-micro-tarefa `M2-A3-02` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, `packages/e2e-fixture-*/` (se criado)

