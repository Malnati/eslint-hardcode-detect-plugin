# M4-A1-08 — Testador — RuleTester segredos (defaults seguros)

| Campo | Valor |
|-------|--------|
| micro_id | M4-A1-08 |
| milestone | M4 |
| github_milestone | remediation-m4-secrets |
| parent_task | A1 |
| role | testador |
| labels_sugeridas | `type/feature`, `area/remediation-secrets` |
| token_budget_estimate | 2400 |
| single_focus | Executa `npm test -w eslint-plugin-hardcode-detect` e regista evidências; **não** edita `src/` salvo instrução explícita. |
| depends_on | Sub-micro-tarefa `M4-A1-07` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m4-secrets-remediation.md`](../../../m4-secrets-remediation.md) — secção 7 (Camada A).

## Inputs

`docs/hardcoding-map.md` (nível L1).

## Outputs

Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.

## Critério de conclusão

Todos os casos passam; revisão manual de diffs.

## Dependências

Sub-micro-tarefa `M4-A1-07` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

