# M1-A2-04 — Desenvolvedor — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-04 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | desenvolvedor |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 4200 |
| single_focus | Implementa ou altera artefactos em `packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`; **não** redefine o contrato sem passar pelo analista de negócio. |
| depends_on | Sub-micro-tarefa `M1-A2-03` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Desenvolvedor**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-03` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

- [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) — semântica RuleTester (`output` / `suggestions` / só `errors`), matriz P-SVF-* → outcome com ligação a S-R1-*, `envDefaultLiteralPolicy`, caminhos arriscados, segredos, prova em `tests/no-hardcoded-strings-r1.test.mjs`, comando `npm test -w eslint-plugin-hardcode-detect`, links aos entregáveis A2 e A3.
- [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../../packages/eslint-plugin-hardcode-detect/README.md) — excerto sobre R1 e remissão ao doc da regra.

Estado: **concluído**.
