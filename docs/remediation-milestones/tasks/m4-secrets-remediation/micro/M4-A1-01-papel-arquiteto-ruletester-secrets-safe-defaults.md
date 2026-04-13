# M4-A1-01 — Arquiteto — RuleTester segredos (defaults seguros)

| Campo | Valor |
|-------|--------|
| micro_id | M4-A1-01 |
| milestone | M4 |
| github_milestone | remediation-m4-secrets |
| parent_task | A1 |
| role | arquiteto |
| labels_sugeridas | `type/feature`, `area/remediation-secrets` |
| token_budget_estimate | 2400 |
| single_focus | Define impacto em CI, `npm test -w eslint-plugin-hardcode-detect` e limites de ambiente; **não** edita ficheiros em `packages/eslint-plugin-hardcode-detect/tests/`. |
| depends_on | M3 concluído. |

## Plano do marco

- [`docs/remediation-milestones/m4-secrets-remediation.md`](../../../m4-secrets-remediation.md) — secção 7 (Camada A).

## Inputs

`docs/hardcoding-map.md` (nível L1).

## Outputs

Contribuição do papel **Arquiteto** para os outputs agregados de A1: Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.

## Critério de conclusão

Papel **Arquiteto**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Todos os casos passam; revisão manual de diffs.

## Dependências

M3 concluído.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

