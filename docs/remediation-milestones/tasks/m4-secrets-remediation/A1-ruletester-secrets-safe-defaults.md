# A1 — RuleTester segredos (defaults seguros)

| Campo | Valor |
|-------|--------|
| `milestone` | M4 |
| `github_milestone` | remediation-m4-secrets |
| `task_id` | A1 |
| `labels_sugeridas` | `type/feature`, `area/remediation-secrets` |
| `token_budget_estimate` | 30 000 |
| `depends_on` | M3 |

## Plano do marco

- [`../../m4-secrets-remediation.md`](../../m4-secrets-remediation.md) — secção 7.

## Inputs

- [`docs/hardcoding-map.md`](../../../hardcoding-map.md) (nível L1).

## Outputs

- Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.

## Critério de conclusão

- Todos os casos passam; revisão manual de diffs.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/tests/`
