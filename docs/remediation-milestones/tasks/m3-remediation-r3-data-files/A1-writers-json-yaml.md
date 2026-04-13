# A1 — Writers JSON/YAML (MVP R3)

| Campo | Valor |
|-------|--------|
| `milestone` | M3 |
| `github_milestone` | remediation-m3-r3-data |
| `task_id` | A1 |
| `labels_sugeridas` | `type/feature`, `area/remediation-R3` |
| `token_budget_estimate` | 45 000 |
| `depends_on` | M2 |

## Plano do marco

- [`../../m3-remediation-r3-data-files.md`](../../m3-remediation-r3-data-files.md) — secção 7.

## Inputs

- Requisitos do plano M3; testes de merge e encoding.

## Outputs

- Módulo em `packages/eslint-plugin-hardcode-detect/src/` + testes unitários dos writers.

## Critério de conclusão

- Merge determinístico para casos MVP acordados.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/src/`
- `packages/eslint-plugin-hardcode-detect/tests/`
