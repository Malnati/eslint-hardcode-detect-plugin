# A2 — ADR paralelismo ESLint vs estado (R2)

| Campo | Valor |
|-------|--------|
| `milestone` | M2 |
| `github_milestone` | remediation-m2-r2-global |
| `task_id` | A2 |
| `labels_sugeridas` | `type/docs`, `area/remediation-R2` |
| `token_budget_estimate` | 20 000 |
| `depends_on` | A1 |

## Plano do marco

- [`../../m2-remediation-r2-global.md`](../../m2-remediation-r2-global.md) — secção 7.

## Inputs

- [`reference/Clippings/`](../../../../reference/Clippings/) (Node API ESLint, `concurrency`).

## Outputs

- ADR ou secção em `docs/` / `specs/` com decisão: desactivar paralelismo, segunda passagem, ou índice em ficheiro.

## Critério de conclusão

- Decisão registada e referenciada nos testes ou documentação da regra.

## Paths principais

- `docs/` ou `specs/`
