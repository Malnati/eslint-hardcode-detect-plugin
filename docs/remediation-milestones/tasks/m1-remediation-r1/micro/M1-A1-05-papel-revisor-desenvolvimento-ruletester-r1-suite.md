# M1-A1-05 — Revisor de desenvolvimento — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-05 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | revisor-desenvolvimento |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 3500 |
| single_focus | Revisa diffs (estilo, segurança, escopo); **não** adiciona funcionalidade nova. |
| depends_on | Sub-micro-tarefa `M1-A1-04` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Contribuição do papel **Revisor de desenvolvimento** para os outputs agregados de A1: Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Revisor de desenvolvimento**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-04` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Revisão de desenvolvimento sobre a suite RuleTester R1 entregue em M1-A1-04:

- **Artefacto:** [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs).
- **Verificações:** matriz **S-R1-01** … **S-R1-08** e caso de segredo sintético alinhados a [`../A1-business-analyst-ruletester-r1-acceptance.md`](../A1-business-analyst-ruletester-r1-acceptance.md); estilo e padrões consistentes com `tests/index.test.mjs` (ESM, `RuleTester`, import do `dist`); literais de teste sem dados sensíveis; escopo limitado a revisão (sem novos cenários de produto nem alteração de regra).
- **Ajustes mínimos:** comentário de rastreabilidade M1-A1-05 e nota em `filePath` sobre `cwd` do pacote (coerente com [`../A1-architect-ruletester-r1-ci-environment.md`](../A1-architect-ruletester-r1-ci-environment.md)).
- **Validação:** `npm test -w eslint-plugin-hardcode-detect` com exit code 0.

Estado: **concluído**.

