# Ficheiros de tarefa por marco (Camada A)

Cada marco em [`..`](..) (`m0-baseline.md`, `m1-channel-t1-t2.md`, …) pode ter uma pasta homónima sob `tasks/` com **um ficheiro Markdown por tarefa** da **Camada A** (pré-execução de agentes: inputs, outputs, teto de tokens, critérios).

## Convenções

| Item | Regra |
|------|--------|
| Pasta do marco | Nome alinhado ao plano e à branch sugerida, ex.: `m0-baseline/`, `m1-channel-t1-t2/`. |
| Nome do ficheiro | `A{N}-<slug-descritivo>.md` (ex.: `A1-index-milestones-readme.md`). |
| IDs | `A1`, `A2`, … por marco; renumerar se inserir tarefas. |
| Ligação ao GitHub | Usar o **milestone GitHub sugerido** no cabeçalho do plano do marco (ex.: `macro-baseline` para M0). |
| Timelining | Quando uma subtarefa da secção «Ordem, dependências e durações» não tiver linha na tabela Camada A, acrescentar uma linha **A{N}** no plano do marco e um ficheiro correspondente (ex.: M0 — A5 para massa Nest/e2e). |
| Micro-tarefas | Opcional: pasta `micro/` com ficheiros `M{N}-A<1-5>-<nn>-<slug>.md`, índice em `micro/README.md`, secção **Micro-tarefas** em cada `A{N}-*.md`; **cobertura** do plano (timelining, Camada A, critérios de done) declarada em `coverage-manifest.json` e validada na raiz com `npm run test:docs-milestones` (alias: `npm run test:docs-m0`). |

## Modelo

- [`TASK_FILE_TEMPLATE.md`](TASK_FILE_TEMPLATE.md)

## Índices por marco

| Marco | Pasta |
|-------|--------|
| M0 | [`m0-baseline/`](m0-baseline/README.md) |
| M1 | [`m1-channel-t1-t2/`](m1-channel-t1-t2/README.md) |
| M2 | [`m2-channel-t3-ci/`](m2-channel-t3-ci/README.md) |
| M3 | [`m3-channel-t4-t6/`](m3-channel-t4-t6/README.md) |

Replicação para **M4–M5:** ao fechar a Camada A de cada `mN-*.md`, criar `tasks/mN-<slug>/`, copiar o template e um ficheiro por linha da tabela.
