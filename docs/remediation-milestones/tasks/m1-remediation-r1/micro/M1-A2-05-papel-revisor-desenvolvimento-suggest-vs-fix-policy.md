# M1-A2-05 — Revisor de desenvolvimento — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-05 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | revisor-desenvolvimento |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1500 |
| single_focus | Revisa diffs (estilo, segurança, escopo); **não** adiciona funcionalidade nova. |
| depends_on | Sub-micro-tarefa `M1-A2-04` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Contribuição do papel **Revisor de desenvolvimento** para os outputs agregados de A2: Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Revisor de desenvolvimento**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-04` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Parecer do revisor de desenvolvimento sobre a política suggest vs fix (documentação do pacote ↔ suite RuleTester R1):

- **Artefacto:** [`../A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](../A2-development-reviewer-suggest-vs-fix-policy-signoff.md).
- **Verificações:** matriz P-SVF-* ↔ cenários S-R1-* e caso de segredo em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs); semântica `output` / `suggestions` / só `errors` alinhada a [`../A2-architect-suggest-vs-fix-policy-ci-environment.md`](../A2-architect-suggest-vs-fix-policy-ci-environment.md); links relativos e redacção sobre segredos revistos; escopo limitado a revisão documental (sem alteração de regra nem novos cenários de produto).
- **Rastreabilidade no doc da regra:** secção *Rastreabilidade de negócio* em [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) com remissão ao parecer acima.
- **Handoff:** [`micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md`](M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md).

Estado: **concluído**.

