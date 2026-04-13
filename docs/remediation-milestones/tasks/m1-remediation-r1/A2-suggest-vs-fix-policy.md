# A2 — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | remediation-m1-r1 |
| `task_id` | A2 |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 15 000 |
| `timelining_order` | — |
| `depends_on` | A1 |

## Plano do marco

- [`../../m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

- A1; [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) (secção dados sigilosos como contexto).

## Outputs

- Tabela ou secção na documentação da regra / README do pacote com critérios reproducíveis.

## Critério de conclusão

- Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

- A1

## Paths principais

- `packages/eslint-plugin-hardcode-detect/docs/rules/`
- `packages/eslint-plugin-hardcode-detect/README.md`
