# A1 — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | remediation-m1-r1 |
| `task_id` | A1 |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |
| `token_budget_estimate` | 35 000 |
| `timelining_order` | — |
| `depends_on` | M0 concluído |

## Plano do marco

- [`../../m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

- Contrato pós-M0; [`reference/Clippings/`](../../../../reference/Clippings/) (ESLint fix / RuleTester).

## Outputs

- Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

- `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

- Marco M0 entregue.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/tests/`
