# A3: Atualizar `docs/repository-tree.md`

| Campo | Valor |
|-------|--------|
| milestone | M0 |
| github_milestone | macro-baseline |
| task_id | A3 |
| labels_sugeridas | `type/docs`, `area/channel-T1` |
| token_budget_estimate | 10 000 |
| timelining_order | — |
| depends_on | — (executar quando a árvore `docs/` mudar) |

## Plano do marco

Camada A em [`../../m0-baseline.md`](../../m0-baseline.md) (secção 7).

## Inputs

- Estrutura real de `docs/` no repositório (incl. `docs/distribution-milestones/` e subpastas novas como `tasks/`).

## Outputs

- [`docs/repository-tree.md`](../../../repository-tree.md) refletindo pastas e ficheiros normativos relevantes.

## Critério de conclusão

- Grafo em `repository-tree.md` corresponde à árvore sob `docs/` (sem omissão de diretórios documentados no marco).

## Dependências

- **Bloqueia:** rastreabilidade do layout para agentes e humanos.
- **Depende de:** conclusão das alterações estruturais em `docs/` que o marco introduzir (reexecutar ou ajustar após novas pastas).

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M0-A3-01 | [`micro/M0-A3-01-diff-arvore-distribution-milestones.md`](micro/M0-A3-01-diff-arvore-distribution-milestones.md) |
| M0-A3-02 | [`micro/M0-A3-02-atualizar-repository-tree.md`](micro/M0-A3-02-atualizar-repository-tree.md) |

## Paths principais

- `docs/repository-tree.md`
