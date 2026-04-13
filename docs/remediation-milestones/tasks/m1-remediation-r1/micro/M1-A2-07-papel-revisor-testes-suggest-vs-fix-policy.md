# M1-A2-07 — Revisor de testes — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-07 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | revisor-testes |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1200 |
| single_focus | Revisa o plano de testes e os critérios de log/artefactos; **não** executa a suíte no lugar do testador. |
| depends_on | Sub-micro-tarefa `M1-A2-06` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Contribuição do papel **Revisor de testes** para os outputs agregados de A2: Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Revisor de testes**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-06` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Revisão de testes sobre a matriz técnica P-SVF / suggest vs fix e critérios de evidência (M1-A2-06), alinhada à suite RuleTester R1 e ao ambiente A2:

- **Artefacto:** [`../A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](../A2-test-reviewer-suggest-vs-fix-policy-signoff.md).
- **Verificações:** matriz P-SVF-01 … P-SVF-08 e caso sintético de segredo confrontados com [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs); critérios de evidência para M1-A2-08 e modelo HCD-ERR considerados adequados; e2e como fumaça na cadeia `npm test`; condições de `cwd` / `filePath`; coerência com o parecer M1-A2-05; parecer **Aprovado** com condições documentadas.
- **Limites de papel:** não execução da suíte no lugar do testador (M1-A2-08); gate global `npm test` após o testador.
- **Validação:** documentação normativa; o gate técnico continua a ser `npm test -w eslint-plugin-hardcode-detect` (M1-A2-08).

Estado: **concluído**.

