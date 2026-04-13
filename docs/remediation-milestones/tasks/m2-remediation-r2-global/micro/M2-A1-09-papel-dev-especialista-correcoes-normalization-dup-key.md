# M2-A1-09 — Desenvolvedor especialista em correcções — Normalização e chave de duplicado (R2)

| Campo | Valor |
|-------|--------|
| micro_id | M2-A1-09 |
| milestone | M2 |
| github_milestone | remediation-m2-r2-global |
| parent_task | A1 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/feature`, `area/remediation-R2` |
| token_budget_estimate | 840 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M2-A1-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m2-remediation-r2-global.md`](../../../m2-remediation-r2-global.md) — secção 7 (Camada A).

## Inputs

`docs/hardcode-remediation-macro-plan.md` (verificação global).

## Outputs

Especificação e implementação coerentes: normalização e chave para «mesmo valor» em R2.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Comportamento único e testável para «mesmo valor» em R2.

## Dependências

Sub-micro-tarefa `M2-A1-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/src/` e comentários normativos em `specs/` se aplicável

