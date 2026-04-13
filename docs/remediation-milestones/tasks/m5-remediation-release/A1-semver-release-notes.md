# A1 — Semver e notas de release (remediação)

| Campo | Valor |
|-------|--------|
| `milestone` | M5 |
| `github_milestone` | remediation-m5-release |
| `task_id` | A1 |
| `labels_sugeridas` | `type/docs` |
| `token_budget_estimate` | 15 000 |
| `depends_on` | M4 |

## Plano do marco

- [`../../m5-remediation-release.md`](../../m5-remediation-release.md) — secção 7.

## Inputs

- Entregáveis M0–M4; [`docs/distribution-milestones/m5-release-candidate.md`](../../../distribution-milestones/m5-release-candidate.md) (paridade de processo).

## Outputs

- Decisão semver (major/minor/patch) e texto de release.

## Critério de conclusão

- Notas prontas para publicação; breaking changes listados.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/package.json`
- `CHANGELOG` ou release GitHub
