# M1-A2-09 — Desenvolvedor especialista em correcções — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-09 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 900 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M1-A2-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

