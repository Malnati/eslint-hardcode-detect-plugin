# A2: Política de artefatos e logs de CI

| Campo | Valor |
|-------|--------|
| milestone | M2 |
| github_milestone | channel-t3-ci |
| task_id | A2 |
| labels_sugeridas | `area/channel-T3`, `type/ci`, `type/docs` |
| token_budget_estimate | 12 000 |
| timelining_order | 2 |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) (secções 4 e 7).

## Inputs

- Resultados de A1 (gaps e tabela de paridade).
- [`AGENTS.md`](../../../../AGENTS.md) e [`specs/agent-session-workflow.md`](../../../../specs/agent-session-workflow.md) (quando relevante para documentação de falhas).

## Outputs

- Secção normativa sobre **o que anexar ou preservar** quando um job CI falha (legibilidade, ligação a issues/PR).
- Âncoras para secção «Logs» em doc alvo (CONTRIBUTING ou plano).

## Critério de conclusão

- Contribuidores e revisores sabem onde encontrar política de artefatos; critério formal de paridade prod ↔ CI documentado face aos gaps de A1.

## Dependências

- **Bloqueia:** A3 (CONTRIBUTING e handoff T4 assumem política A2).
- **Depende de:** A1.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M2-A2-01 | [`micro/M2-A2-01-criterio-paridade-prod-ci-formal.md`](micro/M2-A2-01-criterio-paridade-prod-ci-formal.md) |
| M2-A2-02 | [`micro/M2-A2-02-politica-artefatos-logs-falha.md`](micro/M2-A2-02-politica-artefatos-logs-falha.md) |
| M2-A2-03 | [`micro/M2-A2-03-onde-documentar-secao-logs.md`](micro/M2-A2-03-onde-documentar-secao-logs.md) |

## Paths principais

- `.github/workflows/ci.yml`
- `CONTRIBUTING.md`
- `docs/distribution-milestones/m2-channel-t3-ci.md`
