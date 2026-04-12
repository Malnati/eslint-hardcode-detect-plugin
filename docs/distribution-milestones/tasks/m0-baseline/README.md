# M0 — ficheiros de tarefa (baseline)

Marco: [`../../m0-baseline.md`](../../m0-baseline.md) · **GitHub:** `macro-baseline`

## Grafo de dependências (Camada A)

```text
A1 ──► A2
A1, A2, estado do repo ──► A3
A4 depende de índice/macro coerentes (idealmente após A1–A2)
A5 depende de A4 (alinhado ao timelining: ordem 3 depois de 2)
```

| ID | Ficheiro | Timelining (secção 4) |
|----|----------|------------------------|
| A1 | [`A1-index-milestones-readme.md`](A1-index-milestones-readme.md) | Ordem 1 (índice + macro-plan) |
| A2 | [`A2-macro-plan-index.md`](A2-macro-plan-index.md) | Ordem 1 (índice + macro-plan) |
| A3 | [`A3-repository-tree.md`](A3-repository-tree.md) | Suporte contínuo à árvore `docs/` |
| A4 | [`A4-plugin-contract-vs-readme.md`](A4-plugin-contract-vs-readme.md) | Ordem 2 |
| A5 | [`A5-nest-massa-e2e-documentada.md`](A5-nest-massa-e2e-documentada.md) | Ordem 3 |

**Nota:** A1 e A2 cobrem em conjunto a primeira linha do timelining («Índice + links no macro-plan»).
