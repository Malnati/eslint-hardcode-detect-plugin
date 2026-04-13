# M1-A1-08 — Testador — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-08 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | testador |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 2800 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M1-A1-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

`npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Execução formal do gate e registo de evidências (M1-A1-08):

- **Artefacto:** [`../A1-test-runner-ruletester-r1-evidence.md`](../A1-test-runner-ruletester-r1-evidence.md).
- **Verificações:** `npm test -w eslint-plugin-hardcode-detect` com código de saída **0**; Node >=22; cadeia build + RuleTester (`tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`) + e2e conforme script do pacote.
- **Limites de papel:** sem edição de `packages/eslint-plugin-hardcode-detect/src/` neste passo.
- **Validação:** critério global de A1 para o gate de testes cumprido após esta execução.

Estado: **concluído**.

