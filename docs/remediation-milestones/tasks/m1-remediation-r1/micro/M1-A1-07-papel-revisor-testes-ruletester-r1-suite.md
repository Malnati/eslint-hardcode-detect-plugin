# M1-A1-07 — Revisor de testes — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-07 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | revisor-testes |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 2800 |
| single_focus | Revisa o plano de testes e os critérios de log/artefactos; **não** executa a suíte no lugar do testador. |
| depends_on | Sub-micro-tarefa `M1-A1-06` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Contribuição do papel **Revisor de testes** para os outputs agregados de A1: Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Revisor de testes**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-06` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Revisão de testes sobre a matriz técnica e critérios de evidência (M1-A1-06), alinhada à suite RuleTester R1 e à aceitação negocial:

- **Artefacto:** [`../A1-test-reviewer-ruletester-r1-signoff.md`](../A1-test-reviewer-ruletester-r1-signoff.md).
- **Verificações:** matriz S-R1-01 … S-R1-08 e caso sintético de segredo confrontados com [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs); critérios de evidência para M1-A1-08 e modelo HCD-ERR considerados adequados; e2e como fumaça na cadeia `npm test`; condições de `cwd` / `filePath`; parecer **Aprovado** com condições documentadas.
- **Limites de papel:** não execução da suíte no lugar do testador (M1-A1-08); gate global `npm test` após o testador.
- **Validação:** documentação normativa; o gate técnico continua a ser `npm test -w eslint-plugin-hardcode-detect` (M1-A1-08).

Estado: **concluído**.

