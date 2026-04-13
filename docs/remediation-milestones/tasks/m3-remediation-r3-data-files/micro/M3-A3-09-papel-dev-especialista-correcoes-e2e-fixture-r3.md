# M3-A3-09 — Desenvolvedor especialista em correcções — Fixture e2e R3 (ficheiros de dados)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A3-09 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A3 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 2100 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M3-A3-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Writers A1; macro-plan (fixtures adicionais).

## Outputs

Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A3: e2e verde com geração de ficheiros de configuração.

## Dependências

Sub-micro-tarefa `M3-A3-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas

