# M1-A2-06 — Analista de testes — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-06 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | analista-testes |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1800 |
| single_focus | Documenta matriz de casos RuleTester/e2e e critérios de evidência; **não** aprova o merge sozinho. |
| depends_on | Sub-micro-tarefa `M1-A2-05` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Contribuição do papel **Analista de testes** para os outputs agregados de A2: Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Analista de testes**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-05` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Papel **Analista de testes** — matriz técnica RuleTester/e2e e critérios de evidência para a política suggest vs fix (A2):

- **Artefacto:** [`../A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](../A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md).
- **Verificações:** tabela P-SVF-* → S-R1-* → asserção dominante (`output` / `suggestions` / só `errors`); caso segredo (`SECRET_LIKE_LITERAL`) e papel dos e2e como fumaça (não matriz linha a linha); critérios de evidência para M1-A2-08 e modelo HCD-ERR-*; alinhamento ao signoff [`../A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](../A2-development-reviewer-suggest-vs-fix-policy-signoff.md) e a [`../A2-architect-suggest-vs-fix-policy-ci-environment.md`](../A2-architect-suggest-vs-fix-policy-ci-environment.md); remissão à matriz S-R1 em [`../A1-test-analyst-ruletester-r1-matrix-evidence.md`](../A1-test-analyst-ruletester-r1-matrix-evidence.md).
- **Rastreabilidade no doc da regra:** secção *Rastreabilidade de negócio* em [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) com remissão ao artefacto acima.
- **Handoff:** [`micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md`](M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md).

Estado: **concluído**.

