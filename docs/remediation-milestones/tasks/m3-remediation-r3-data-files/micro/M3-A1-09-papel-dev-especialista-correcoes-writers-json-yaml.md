# M3-A1-09 — Desenvolvedor especialista em correcções — Writers JSON/YAML (MVP R3)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A1-09 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A1 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 2700 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M3-A1-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Requisitos do plano M3; testes de merge e encoding.

## Outputs

Módulo em `packages/eslint-plugin-hardcode-detect/src/` + testes unitários dos writers.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Merge determinístico para casos MVP acordados.

## Dependências

Sub-micro-tarefa `M3-A1-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/src/`, `packages/eslint-plugin-hardcode-detect/tests/`

