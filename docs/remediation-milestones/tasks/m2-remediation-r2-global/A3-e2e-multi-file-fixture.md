# A3 — Fixture e2e multi-ficheiro (R2)

| Campo | Valor |
|-------|--------|
| `milestone` | M2 |
| `github_milestone` | remediation-m2-r2-global |
| `task_id` | A3 |
| `labels_sugeridas` | `type/feature`, `area/remediation-R2` |
| `token_budget_estimate` | 40 000 |
| `depends_on` | A1, A2 |

## Plano do marco

- [`../../m2-remediation-r2-global.md`](../../m2-remediation-r2-global.md) — secção 7.

## Inputs

- A1, A2; [`specs/e2e-fixture-nest.md`](../../../../specs/e2e-fixture-nest.md) como referência de massa.

## Outputs

- Nova massa em `packages/e2e-fixture-*` ou extensão do e2e do plugin com dois ou mais ficheiros.

## Critério de conclusão

- Runner e2e associado com exit 0.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/e2e/`
- `packages/e2e-fixture-*/` (se criado)
