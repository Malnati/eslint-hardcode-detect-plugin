# M3-A3-01 — Arquiteto — Fixture e2e R3 (ficheiros de dados)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A3-01 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A3 |
| role | arquiteto |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 2800 |
| single_focus | Define impacto em CI, `npm test -w eslint-plugin-hardcode-detect` e limites de ambiente; **não** edita ficheiros em `packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas. |
| depends_on | Sub-micro-tarefas M3-A1 concluídas. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Writers A1; macro-plan (fixtures adicionais).

## Outputs

Contribuição do papel **Arquiteto** para os outputs agregados de A3: Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.

## Critério de conclusão

Papel **Arquiteto**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A3: e2e verde com geração de ficheiros de configuração.

## Dependências

Sub-micro-tarefas M3-A1 concluídas.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas

