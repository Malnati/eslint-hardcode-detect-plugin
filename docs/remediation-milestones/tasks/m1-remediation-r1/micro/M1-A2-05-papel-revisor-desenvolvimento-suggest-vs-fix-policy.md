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

