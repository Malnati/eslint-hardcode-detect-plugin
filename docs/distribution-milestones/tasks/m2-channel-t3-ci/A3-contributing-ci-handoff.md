# A3: CONTRIBUTING e handoff T4 (o que o CI garante)

| Campo | Valor |
|-------|--------|
| milestone | M2 |
| github_milestone | channel-t3-ci |
| task_id | A3 |
| labels_sugeridas | `area/channel-T3`, `type/docs` |
| token_budget_estimate | 15 000 |
| timelining_order | — |
| depends_on | A2 |

## Plano do marco

Camada A em [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) (secções 2, 7 e 10).

## Inputs

- A1 e A2 (paridade e política de artefatos).
- [`CONTRIBUTING.md`](../../../../CONTRIBUTING.md).

## Outputs

- Atualização de [`CONTRIBUTING.md`](../../../../CONTRIBUTING.md) quando o fluxo de instalação ou comandos de verificação mudarem em relação ao baseline.
- Texto de **handoff para T4**: regras e config já comprovadas em CI, sem ambiguidade para consumo IDE/LSP.

## Critério de conclusão

- Contribuidores informados; handoff M2 → T4 explícito no doc (bullet list do que o pipeline garante).

## Dependências

- **Bloqueia:** —
- **Depende de:** A2.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M2-A3-01 | [`micro/M2-A3-01-checklist-contributing-fluxo-ci.md`](micro/M2-A3-01-checklist-contributing-fluxo-ci.md) |
| M2-A3-02 | [`micro/M2-A3-02-handoff-t4-o-que-ci-garante.md`](micro/M2-A3-02-handoff-t4-o-que-ci-garante.md) |
| M2-A3-03 | [`micro/M2-A3-03-alinhamento-workflow-comentarios-manifest.md`](micro/M2-A3-03-alinhamento-workflow-comentarios-manifest.md) |

## Paths principais

- `CONTRIBUTING.md`
- `.github/workflows/ci.yml`
- `docs/distribution-milestones/tasks/m2-channel-t3-ci/coverage-manifest.json`
