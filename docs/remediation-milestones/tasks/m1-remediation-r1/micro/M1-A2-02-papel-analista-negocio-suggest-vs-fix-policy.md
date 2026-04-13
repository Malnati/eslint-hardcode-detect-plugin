# M1-A2-02 — Analista de negócio — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-02 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | analista-negocio |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1800 |
| single_focus | Especifica critérios de aceitação e inputs/outputs alinhados a `specs/plugin-contract.md`; **não** implementa código. |
| depends_on | Sub-micro-tarefa `M1-A2-01` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Contribuição do papel **Analista de negócio** para os outputs agregados de A2: Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Analista de negócio**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-01` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Especificação normativa do analista de negócio: [`../A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](../A2-business-analyst-suggest-vs-fix-policy-acceptance.md) — matriz `suggest` vs `fix` (P-SVF-*), rastreabilidade ao contrato, reprodutibilidade RuleTester e fronteiras com A1/A3.

Estado: **concluído** (entregável acima).
