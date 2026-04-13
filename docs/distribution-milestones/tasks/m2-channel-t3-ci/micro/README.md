# M2 — micro-tarefas (Camada A fragmentada)

Âncoras normativas: [`../A1-audit-ci-yml-vs-compose-prod.md`](../A1-audit-ci-yml-vs-compose-prod.md), [`../A2-ci-artifacts-logs-policy.md`](../A2-ci-artifacts-logs-policy.md), [`../A3-contributing-ci-handoff.md`](../A3-contributing-ci-handoff.md). Plano do marco: [`../../../m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md).

**Manifesto de cobertura:** [`../coverage-manifest.json`](../coverage-manifest.json) — mapeia requisitos do plano (timelining §4, Camada A §7, done §10) para estes ficheiros.

**Convenção de nomes:** `M2-A<n>-<nn>-<slug>.md` (`nn` zero-padded).

## Grafo de dependências (ordem sugerida)

```text
M2-A1-01 → M2-A1-02 → M2-A1-03

M2-A2-01 → M2-A2-02 → M2-A2-03   (após contexto A1)

M2-A3-01 → M2-A3-02 → M2-A3-03   (após A2)
```

Alinhamento ao grafo em [`../README.md`](../README.md): A1→A2→A3.

## Índice das micro-tarefas

| micro_id | Ficheiro | parent_task |
|----------|----------|-------------|
| M2-A1-01 | [`M2-A1-01-inventario-ci-yml-jobs-steps.md`](M2-A1-01-inventario-ci-yml-jobs-steps.md) | A1 |
| M2-A1-02 | [`M2-A1-02-tabela-paridade-prod-vs-ci.md`](M2-A1-02-tabela-paridade-prod-vs-ci.md) | A1 |
| M2-A1-03 | [`M2-A1-03-matriz-sec6-cross-check-compose.md`](M2-A1-03-matriz-sec6-cross-check-compose.md) | A1 |
| M2-A2-01 | [`M2-A2-01-criterio-paridade-prod-ci-formal.md`](M2-A2-01-criterio-paridade-prod-ci-formal.md) | A2 |
| M2-A2-02 | [`M2-A2-02-politica-artefatos-logs-falha.md`](M2-A2-02-politica-artefatos-logs-falha.md) | A2 |
| M2-A2-03 | [`M2-A2-03-onde-documentar-secao-logs.md`](M2-A2-03-onde-documentar-secao-logs.md) | A2 |
| M2-A3-01 | [`M2-A3-01-checklist-contributing-fluxo-ci.md`](M2-A3-01-checklist-contributing-fluxo-ci.md) | A3 |
| M2-A3-02 | [`M2-A3-02-handoff-t4-o-que-ci-garante.md`](M2-A3-02-handoff-t4-o-que-ci-garante.md) | A3 |
| M2-A3-03 | [`M2-A3-03-alinhamento-workflow-comentarios-manifest.md`](M2-A3-03-alinhamento-workflow-comentarios-manifest.md) | A3 |

## Validação automatizada

Na raiz do repositório:

```bash
npm run test:docs-milestones
```

Ver [`package.json`](../../../../../package.json).
