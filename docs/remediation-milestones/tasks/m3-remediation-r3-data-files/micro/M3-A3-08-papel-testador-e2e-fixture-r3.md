# M3-A3-08 — Testador — Fixture e2e R3 (ficheiros de dados)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A3-08 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A3 |
| role | testador |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 2800 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M3-A3-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Writers A1; macro-plan (fixtures adicionais).

## Outputs

Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.

## Critério de conclusão

e2e verde com geração de ficheiros de configuração.

## Dependências

Sub-micro-tarefa `M3-A3-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas

