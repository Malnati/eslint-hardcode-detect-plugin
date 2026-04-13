# M3-A3-03 — Revisor de negócio — Fixture e2e R3 (ficheiros de dados)

| Campo | Valor |
|-------|--------|
| micro_id | M3-A3-03 |
| milestone | M3 |
| github_milestone | remediation-m3-r3-data |
| parent_task | A3 |
| role | revisor-negocio |
| labels_sugeridas | `type/feature`, `area/remediation-R3` |
| token_budget_estimate | 2800 |
| single_focus | Valida a especificação contra `specs/plugin-contract.md` e `docs/architecture.md`; **não** escreve testes nem produção. |
| depends_on | Sub-micro-tarefa `M3-A3-02` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m3-remediation-r3-data-files.md`](../../../m3-remediation-r3-data-files.md) — secção 7 (Camada A).

## Inputs

Writers A1; macro-plan (fixtures adicionais).

## Outputs

Contribuição do papel **Revisor de negócio** para os outputs agregados de A3: Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.

## Critério de conclusão

Papel **Revisor de negócio**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A3: e2e verde com geração de ficheiros de configuração.

## Dependências

Sub-micro-tarefa `M3-A3-02` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas

