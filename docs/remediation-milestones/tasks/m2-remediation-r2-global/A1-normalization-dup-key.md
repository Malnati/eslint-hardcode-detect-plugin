# A1 — Normalização de valor e chave de duplicado (R2)

| Campo | Valor |
|-------|--------|
| `milestone` | M2 |
| `github_milestone` | remediation-m2-r2-global |
| `task_id` | A1 |
| `labels_sugeridas` | `type/feature`, `area/remediation-R2` |
| `token_budget_estimate` | 14 000 |
| `depends_on` | M1 |

## Plano do marco

- [`../../m2-remediation-r2-global.md`](../../m2-remediation-r2-global.md) — secção 7.

## Inputs

- [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) (verificação global).

## Outputs

- Especificação em `specs/` ou comentários normativos no código sobre normalização e chave.

## Critério de conclusão

- Comportamento único e testável para «mesmo valor» em R2.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/src/`
