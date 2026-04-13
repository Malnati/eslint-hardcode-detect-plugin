# M1-A1-06 — Analista de testes — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-06 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | analista-testes |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 4200 |
| single_focus | Documenta matriz de casos RuleTester/e2e e critérios de evidência; **não** aprova o merge sozinho. |
| depends_on | Sub-micro-tarefa `M1-A1-05` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Contribuição do papel **Analista de testes** para os outputs agregados de A1: Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Analista de testes**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-05` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Contribuição do papel **Analista de testes** para A1 — matriz técnica RuleTester/e2e e critérios de evidência:

- **Artefacto:** [`../A1-test-analyst-ruletester-r1-matrix-evidence.md`](../A1-test-analyst-ruletester-r1-matrix-evidence.md).
- **Conteúdo:** tabela S-R1-01 … S-R1-08 → comentários e tipo de asserção em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs); caso extra de literal sintético tipo segredo; papel dos e2e (`hello-world`, `nest-workspace`) na cadeia `npm test`; requisito de `cwd` do pacote para `filePath`; critérios de evidência para M1-A1-08; limites de papel (sem aprovação de merge isolada).
- **Validação:** documentação apenas; o gate técnico continua a ser `npm test -w eslint-plugin-hardcode-detect` (M1-A1-08).

Estado: **concluído**.

