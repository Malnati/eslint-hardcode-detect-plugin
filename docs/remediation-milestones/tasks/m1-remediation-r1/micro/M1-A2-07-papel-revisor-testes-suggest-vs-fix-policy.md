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

