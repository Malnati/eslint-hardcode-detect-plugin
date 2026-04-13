# M3-A1-01 — Arquiteto — Writers JSON/YAML (MVP R3)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A1-01 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A1 |
| role | arquiteto |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 3600 |
| single_focus | Define impacto em CI, `npm test -w eslint-plugin-hardcode-detect` e limites de ambiente; **não** edita ficheiros em `packages/eslint-plugin-hardcode-detect/src/`, `packages/eslint-plugin-hardcode-detect/tests/`. |
| depends_on | M2 concluído. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Requisitos do plano M3; testes de merge e encoding.

## Outputs

Contribuição do papel **Arquiteto** para os outputs agregados de A1: Módulo em `packages/eslint-plugin-hardcode-detect/src/` + testes unitários dos writers.

## Critério de conclusão

Papel **Arquiteto**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: Merge determinístico para casos MVP acordados.

## Dependências

M2 concluído.

## Paths principais

`packages/eslint-plugin-hardcode-detect/src/`, `packages/eslint-plugin-hardcode-detect/tests/`

