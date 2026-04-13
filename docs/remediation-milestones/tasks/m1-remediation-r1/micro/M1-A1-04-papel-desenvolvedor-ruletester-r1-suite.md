# M1-A1-04 — Desenvolvedor — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-04 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | desenvolvedor |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 9800 |
| single_focus | Implementa ou altera artefactos em `packages/eslint-plugin-hardcode-detect/tests/`; **não** redefine o contrato sem passar pelo analista de negócio. |
| depends_on | Sub-micro-tarefa `M1-A1-03` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Desenvolvedor**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-03` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Suite RuleTester em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) — cenários **S-R1-01** … **S-R1-08** (mais caso de segredo provável) alinhados a [`../A1-business-analyst-ruletester-r1-acceptance.md`](../A1-business-analyst-ruletester-r1-acceptance.md); `npm test` do pacote inclui este ficheiro.

Estado: **concluído**.

