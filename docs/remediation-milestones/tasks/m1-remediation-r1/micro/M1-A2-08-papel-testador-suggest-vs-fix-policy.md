# M1-A2-08 — Testador — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-08 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | testador |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 1200 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M1-A2-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Execução formal do gate e registo de evidências (M1-A2-08):

- **Artefacto:** [`../A2-test-runner-suggest-vs-fix-policy-evidence.md`](../A2-test-runner-suggest-vs-fix-policy-evidence.md).
- **Verificações:** `npm test -w eslint-plugin-hardcode-detect` com código de saída **0**; Node >=22; cadeia build + RuleTester (`tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, prova P-SVF / S-R1-*) + e2e conforme script do pacote; alinhado ao parecer M1-A2-07 e à matriz do analista A2.
- **Limites de papel:** sem edição de `packages/eslint-plugin-hardcode-detect/src/` neste passo.
- **Validação:** critério global de A2 para o gate de testes cumprido após esta execução (comportamento `suggest` vs `fix` reproduzível na suite e na documentação normativa).

Estado: **concluído**.

