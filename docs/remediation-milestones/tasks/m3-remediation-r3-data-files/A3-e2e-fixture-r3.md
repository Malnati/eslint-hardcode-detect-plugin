# A3 — Fixture e2e R3 (ficheiros de dados)

| Campo | Valor |
|-------|--------|
| `milestone` | M3 |
| `github_milestone` | remediation-m3-r3-data |
| `task_id` | A3 |
| `labels_sugeridas` | `type/feature`, `area/remediation-R3` |
| `token_budget_estimate` | 35 000 |
| `depends_on` | A1 |

## Plano do marco

- [`../../m3-remediation-r3-data-files.md`](../../m3-remediation-r3-data-files.md) — secção 7.

## Inputs

- Writers A1; macro-plan (fixtures adicionais).

## Outputs

- Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.

## Critério de conclusão

- e2e verde com geração de ficheiros de configuração.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/e2e/`
