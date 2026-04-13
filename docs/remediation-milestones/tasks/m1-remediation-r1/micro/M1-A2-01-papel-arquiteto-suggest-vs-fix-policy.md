# M1-A2-01 — Arquiteto — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-01 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | arquiteto |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1200 |
| single_focus | Define impacto em CI, `npm test -w eslint-plugin-hardcode-detect` e limites de ambiente; **não** edita ficheiros em `packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`. |
| depends_on | Última sub-micro-tarefa de A1 (testador ou pipeline verde). |

## Entregável normativo

- [`../A2-architect-suggest-vs-fix-policy-ci-environment.md`](../A2-architect-suggest-vs-fix-policy-ci-environment.md) — CI, comando canónico, ambiente e reprodutibilidade técnica (gate RuleTester).

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Contribuição do papel **Arquiteto** para os outputs agregados de A2: Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Arquiteto**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Última sub-micro-tarefa de A1 (testador ou pipeline verde).

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Documentação normativa do arquiteto: [`../A2-architect-suggest-vs-fix-policy-ci-environment.md`](../A2-architect-suggest-vs-fix-policy-ci-environment.md) — comando canónico, semântica `output` / `suggestions` / só `errors` no RuleTester, cadeia `npm test` do pacote, mapeamento CI, limites de ambiente e limites de papel (sem edição de `tests/`, `docs/rules/` nem `README.md` do pacote neste papel).

Estado: **concluído** (entregável acima).
