# M4-A1-02 — Analista de negócio — RuleTester segredos (defaults seguros)

| Campo | Valor |
|-------|--------|
| micro_id | M4-A1-02 |
| milestone | M4 |
| github_milestone | remediation-m4-secrets |
| parent_task | A1 |
| role | analista-negocio |
| labels_sugeridas | `type/feature`, `area/remediation-secrets` |
| token_budget_estimate | 3600 |
| single_focus | Especifica critérios de aceitação e inputs/outputs alinhados a `specs/plugin-contract.md` e política de segredos no macro-plan; **não** implementa código. |
| depends_on | Sub-micro-tarefa `M4-A1-01` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m4-secrets-remediation.md`](../../../m4-secrets-remediation.md) — secção 7 (Camada A).

## Inputs

`docs/hardcoding-map.md` (nível L1).

## Outputs

Contribuição do papel **Analista de negócio** para os outputs agregados de A1: Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.

## Critério de conclusão

Papel **Analista de negócio**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Todos os casos passam; revisão manual de diffs.

## Dependências

Sub-micro-tarefa `M4-A1-01` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

