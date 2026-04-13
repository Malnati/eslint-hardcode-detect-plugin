# A3 — Decisão `bin` / CLI de agregação

| Campo | Valor |
|-------|--------|
| `milestone` | M5 |
| `github_milestone` | remediation-m5-release |
| `task_id` | A3 |
| `labels_sugeridas` | `type/docs`, `type/feature` |
| `token_budget_estimate` | 18 000 |
| `depends_on` | — |

## Plano do marco

- [`../../m5-remediation-release.md`](../../m5-remediation-release.md) — secção 7.

## Inputs

- [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) (R2 duas fases / `bin`).

## Outputs

- ADR ou nota: entrada `bin` no `package.json` **ou** justificativa «fora de escopo».

## Critério de conclusão

- Caminho suportado documentado; sem dependências de mock de integração.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/package.json`
