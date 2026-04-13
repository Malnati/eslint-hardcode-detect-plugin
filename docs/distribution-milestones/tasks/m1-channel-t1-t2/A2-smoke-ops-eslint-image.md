# A2: Plano de smoke imagem ops-eslint (trilha T2)

| Campo | Valor |
|-------|--------|
| milestone | M1 |
| github_milestone | channel-t1-t2 |
| task_id | A2 |
| labels_sugeridas | `area/channel-T2`, `type/build`, `type/docs` |
| token_budget_estimate | 22 000 |
| timelining_order | 2 |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m1-channel-t1-t2.md`](../../m1-channel-t1-t2.md) (secção 7).

## Inputs

- [`.docker/Dockerfile`](../../../../.docker/Dockerfile) (tag padrão `malnati-ops-eslint:local`).
- Composite Action [`.github/actions/ops-eslint/`](../../../../.github/actions/ops-eslint/) (ex.: [`assets/run.sh`](../../../../.github/actions/ops-eslint/assets/run.sh)).
- [`specs/agent-docker-compose.md`](../../../../specs/agent-docker-compose.md).

## Outputs

- Documentação ou script com **comando único reprodutível** para build da imagem e execução de smoke (lint sobre volume), alinhado à action quando aplicável.
- Nota de paridade com a trilha T1 (mesma versão do plugin / mesma flat config esperada).

## Critério de conclusão

- Qualquer mantenedor consegue repetir o smoke a partir do doc; paridade T1↔T2 explicitada (sem drift de regras entre npm e imagem).

## Dependências

- **Bloqueia:** A3 (rascunho `e2e-ops` assume T2 descrito).
- **Depende de:** A1.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M1-A2-01 | [`micro/M1-A2-01-checklist-dockerfile-action.md`](micro/M1-A2-01-checklist-dockerfile-action.md) |
| M1-A2-02 | [`micro/M1-A2-02-comando-build-run-documentado.md`](micro/M1-A2-02-comando-build-run-documentado.md) |
| M1-A2-03 | [`micro/M1-A2-03-paridade-t1-t2-versao-config.md`](micro/M1-A2-03-paridade-t1-t2-versao-config.md) |

## Paths principais

- `.docker/Dockerfile`
- `.github/actions/ops-eslint/`
- `specs/agent-docker-compose.md`
