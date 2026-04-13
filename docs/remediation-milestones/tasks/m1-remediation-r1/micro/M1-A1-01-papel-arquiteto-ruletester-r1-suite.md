# M1-A1-01 — Arquiteto — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-01 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | arquiteto |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 2800 |
| single_focus | Define impacto em CI, `npm test -w eslint-plugin-hardcode-detect` e limites de ambiente; **não** edita ficheiros em `packages/eslint-plugin-hardcode-detect/tests/`. |
| depends_on | M0 concluído. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Contribuição do papel **Arquiteto** para os outputs agregados de A1: Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Arquiteto**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

M0 concluído.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Documentação normativa do arquiteto: [`../A1-architect-ruletester-r1-ci-environment.md`](../A1-architect-ruletester-r1-ci-environment.md) — comando canónico, cadeia `npm test` do pacote, mapeamento CI, limites de ambiente e limites de papel (sem edição de `tests/` neste papel).

Estado: **concluído** (entregável acima).
