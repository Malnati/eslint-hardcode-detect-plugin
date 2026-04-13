# M4-A1-09 — Desenvolvedor especialista em correcções — RuleTester segredos (defaults seguros)

| Campo | Valor |
|-------|--------|
| micro_id | M4-A1-09 |
| milestone | M4 |
| github_milestone | remediation-m4-secrets |
| parent_task | A1 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/feature`, `area/remediation-secrets` |
| token_budget_estimate | 1800 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M4-A1-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m4-secrets-remediation.md`](../../../m4-secrets-remediation.md) — secção 7 (Camada A).

## Inputs

`docs/hardcoding-map.md` (nível L1).

## Outputs

Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Todos os casos passam; revisão manual de diffs.

## Dependências

Sub-micro-tarefa `M4-A1-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

