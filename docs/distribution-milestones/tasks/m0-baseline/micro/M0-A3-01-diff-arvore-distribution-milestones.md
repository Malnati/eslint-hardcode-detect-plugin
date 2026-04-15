# M0-A3-01: Diff `docs/distribution-milestones/` vs grafo

| Campo | Valor |
|-------|--------|
| parent_task | A3 |
| micro_id | M0-A3-01 |
| milestone | M0 |
| depends_on | — (executar após criar `micro/` e `evidence/`) |
| blocks | M0-A3-02 |
| plan_requirements | `m0-sec7-A3`, `m0-sec10-repository-tree` |

## Objetivo

Comparar a árvore real sob `docs/distribution-milestones/` (incl. `tasks/m0-baseline/micro/`, `evidence/`, `coverage-manifest.json`) com o bloco correspondente em [`docs/repository-tree.md`](../../../../repository-tree.md).

## Definition of done

- Lista de pastas/ficheiros normativos novos ou renomeados desde a última versão do grafo.
- Entrada para patch em M0-A3-02 (sem obrigatoriamente aplicar o patch neste ficheiro).

## Paths principais

- `docs/distribution-milestones/`
- `docs/repository-tree.md`

## Evidência

Referência do grafo: bloco `docs/distribution-milestones/` em [`docs/repository-tree.md`](../../../../repository-tree.md) (fenced `text`, c. linhas 51–63). Inventário no disco obtido com `find docs/distribution-milestones -type f` (35 ficheiros).

### Inventário normativo no disco

**Raiz `docs/distribution-milestones/`**

| Ficheiro |
|----------|
| `docs/distribution-milestones/README.md` |
| `docs/distribution-milestones/milestone-template.md` |
| `docs/distribution-milestones/m0-baseline.md` |
| `docs/distribution-milestones/m1-channel-t1-t2.md` |
| `docs/distribution-milestones/m2-channel-t3-ci.md` |
| `docs/distribution-milestones/m3-channel-t4-t6.md` |
| `docs/distribution-milestones/m4-channel-t5-agents.md` |
| `docs/distribution-milestones/m5-release-candidate.md` |

**`docs/distribution-milestones/tasks/`**

| Ficheiro |
|----------|
| `docs/distribution-milestones/tasks/README.md` |
| `docs/distribution-milestones/tasks/TASK_FILE_TEMPLATE.md` |

**`docs/distribution-milestones/tasks/m0-baseline/` (âncoras Camada A + manifesto)**

| Ficheiro |
|----------|
| `docs/distribution-milestones/tasks/m0-baseline/README.md` |
| `docs/distribution-milestones/tasks/m0-baseline/A1-index-milestones-readme.md` |
| `docs/distribution-milestones/tasks/m0-baseline/A2-macro-plan-index.md` |
| `docs/distribution-milestones/tasks/m0-baseline/A3-repository-tree.md` |
| `docs/distribution-milestones/tasks/m0-baseline/A4-plugin-contract-vs-readme.md` |
| `docs/distribution-milestones/tasks/m0-baseline/A5-nest-massa-e2e-documentada.md` |
| `docs/distribution-milestones/tasks/m0-baseline/coverage-manifest.json` |

**`docs/distribution-milestones/tasks/m0-baseline/evidence/`**

| Ficheiro |
|----------|
| `docs/distribution-milestones/tasks/m0-baseline/evidence/A4-plugin-contract-gap-matrix.md` |

**`docs/distribution-milestones/tasks/m0-baseline/micro/`**

| Ficheiro |
|----------|
| `docs/distribution-milestones/tasks/m0-baseline/micro/README.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A1-01-inventario-milestone-files.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A1-02-readme-tabela-m0-m5.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A1-03-cross-docs-readme.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A2-01-macro-plan-indice-readme.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A2-02-cadeia-t1-t6-m3.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A2-03-bump-versao-macro-plan.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A3-01-diff-arvore-distribution-milestones.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A3-02-atualizar-repository-tree.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A4-01-checklist-plugin-contract.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A4-02-paridade-readme-pacote.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A4-03-contrato-vs-docs-rules.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A4-04-artefacto-gap-matrix.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A5-01-spec-e2e-fixture-nest.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A5-02-readme-plugin-e2e-nest.md` |
| `docs/distribution-milestones/tasks/m0-baseline/micro/M0-A5-03-matriz-compose-agent-docker.md` |

### Gaps vs `docs/repository-tree.md`

O grafo lista explicitamente a raiz de `distribution-milestones/` (README, template, M0–M5), `tasks/README.md`, `TASK_FILE_TEMPLATE.md` e uma linha `m0-baseline/` com comentário que menciona tarefas A1–A5, `micro/`, `evidence/` e `coverage-manifest.json`.

| Aspeto | No grafo | No disco |
|--------|----------|----------|
| Ficheiros raiz M0–M5 + README + template | Explícitos | Correspondem |
| `tasks/README.md`, `TASK_FILE_TEMPLATE.md` | Explícitos | Correspondem |
| `m0-baseline/README.md` | Não listado | Presente |
| Âncoras `A1-*.md` … `A5-*.md` | Só referidas no comentário (“A1–A5”) | Cinco ficheiros com nomes estáveis |
| `coverage-manifest.json` | Mencionado no comentário | Presente |
| `evidence/` e respetivo `.md` | Pasta mencionada no comentário; ficheiro não nomeado | `A4-plugin-contract-gap-matrix.md` |
| `micro/` | Pasta mencionada no comentário; ficheiros não listados | 16 ficheiros (README + 15 micro-tarefas) |

**Renomes:** não há renomes conhecidos entre o estado atual do disco e o que o bloco do grafo descreve; apenas **omissão de detalhe** sob `tasks/m0-baseline/` (comentário agregador vs árvore completa).

### Entrada para M0-A3-02

Aplicar em [`docs/repository-tree.md`](../../../../repository-tree.md) (e rever [`docs/README.md`](../../../../README.md) apenas se a listagem de subpastas de `docs/` precisar de mais granularidade):

- Expandir o nó `m0-baseline/` no fenced tree: após `README.md` da pasta `tasks/`, desdobrar `m0-baseline/` com linhas para `README.md`, `A1-index-milestones-readme.md` … `A5-nest-massa-e2e-documentada.md`, `coverage-manifest.json`, subárvore `evidence/` (pelo menos `A4-plugin-contract-gap-matrix.md`), subárvore `micro/` (`README.md` + referência explícita às micro-tarefas `M0-A*-*.md` ou bloco resumido com comentário “15 micro-tarefas” se o ficheiro ficar longo demais).
- Manter coerência com a nota já existente sobre `scripts/` na raiz do grafo (validador M0).
- Não é obrigatório duplicar neste ficheiro o patch textual; a edição concreta fica em [`M0-A3-02-atualizar-repository-tree.md`](M0-A3-02-atualizar-repository-tree.md).
