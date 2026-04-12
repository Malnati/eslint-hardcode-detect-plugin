# A2: Atualizar `distribution-channels-macro-plan.md`

| Campo | Valor |
|-------|--------|
| milestone | M0 |
| github_milestone | macro-baseline |
| task_id | A2 |
| labels_sugeridas | `type/docs`, `area/channel-T1` |
| token_budget_estimate | 18 000 |
| timelining_order | 1 (com A1) |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m0-baseline.md`](../../m0-baseline.md) (secção 7).

## Inputs

- [`docs/distribution-milestones/README.md`](../../README.md) (após A1 — índice dos planos por marco).

## Outputs

- [`docs/distribution-channels-macro-plan.md`](../../../distribution-channels-macro-plan.md) com secção de índice alinhada, versão/nota de documento quando aplicável, e cadeia T1→T6 coerente com os ficheiros em `distribution-milestones/`.

## Critério de conclusão

- Secção índice e bump de versão do documento (quando a política do repo o exigir); macro-plan coerente com o README dos milestones.

## Dependências

- **Bloqueia:** fecho da linha 1 do timelining (junto com A1).
- **Depende de:** A1.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M0-A2-01 | [`micro/M0-A2-01-macro-plan-indice-readme.md`](micro/M0-A2-01-macro-plan-indice-readme.md) |
| M0-A2-02 | [`micro/M0-A2-02-cadeia-t1-t6-m3.md`](micro/M0-A2-02-cadeia-t1-t6-m3.md) |
| M0-A2-03 | [`micro/M0-A2-03-bump-versao-macro-plan.md`](micro/M0-A2-03-bump-versao-macro-plan.md) |

## Paths principais

- `docs/distribution-channels-macro-plan.md`
