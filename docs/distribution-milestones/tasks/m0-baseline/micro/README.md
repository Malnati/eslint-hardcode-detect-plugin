# M0 — micro-tarefas (Camada A fragmentada)

Âncoras normativas: [`../A1-index-milestones-readme.md`](../A1-index-milestones-readme.md) … [`../A5-nest-massa-e2e-documentada.md`](../A5-nest-massa-e2e-documentada.md). Plano do marco: [`../../../m0-baseline.md`](../../../m0-baseline.md).

**Manifesto de cobertura:** [`../coverage-manifest.json`](../coverage-manifest.json) — mapeia requisitos do plano (timelining §4, Camada A §7, done §10) para estes ficheiros.

**Convenção de nomes:** `M0-A<1-5>-<nn>-<slug>.md` (`nn` zero-padded).

## Grafo de dependências (ordem sugerida)

```text
M0-A1-01 → M0-A1-02 → M0-A1-03
M0-A2-01 → M0-A2-02 → M0-A2-03   (M0-A2-01 depende de A1/README estável)

M0-A3-01 → M0-A3-02   (após alterações estruturais em docs/)

M0-A4-01 → M0-A4-02 → M0-A4-03 → M0-A4-04   (idealmente após M0-A1/M0-A2)

M0-A5-01 → M0-A5-02 → M0-A5-03   (após A4 / evidência de contrato)
```

Alinhamento ao grafo de âncoras em [`../README.md`](../README.md): A1→A2; A3 em paralelo ou após mudanças de árvore; A4 após contexto macro; A5 após A4.

## Índice das micro-tarefas

| micro_id | Ficheiro | parent_task |
|----------|----------|-------------|
| M0-A1-01 | [`M0-A1-01-inventario-milestone-files.md`](M0-A1-01-inventario-milestone-files.md) | A1 |
| M0-A1-02 | [`M0-A1-02-readme-tabela-m0-m5.md`](M0-A1-02-readme-tabela-m0-m5.md) | A1 |
| M0-A1-03 | [`M0-A1-03-cross-docs-readme.md`](M0-A1-03-cross-docs-readme.md) | A1 |
| M0-A2-01 | [`M0-A2-01-macro-plan-indice-readme.md`](M0-A2-01-macro-plan-indice-readme.md) | A2 |
| M0-A2-02 | [`M0-A2-02-cadeia-t1-t6-m3.md`](M0-A2-02-cadeia-t1-t6-m3.md) | A2 |
| M0-A2-03 | [`M0-A2-03-bump-versao-macro-plan.md`](M0-A2-03-bump-versao-macro-plan.md) | A2 |
| M0-A3-01 | [`M0-A3-01-diff-arvore-distribution-milestones.md`](M0-A3-01-diff-arvore-distribution-milestones.md) | A3 |
| M0-A3-02 | [`M0-A3-02-atualizar-repository-tree.md`](M0-A3-02-atualizar-repository-tree.md) | A3 |
| M0-A4-01 | [`M0-A4-01-checklist-plugin-contract.md`](M0-A4-01-checklist-plugin-contract.md) | A4 |
| M0-A4-02 | [`M0-A4-02-paridade-readme-pacote.md`](M0-A4-02-paridade-readme-pacote.md) | A4 |
| M0-A4-03 | [`M0-A4-03-contrato-vs-docs-rules.md`](M0-A4-03-contrato-vs-docs-rules.md) | A4 |
| M0-A4-04 | [`M0-A4-04-artefacto-gap-matrix.md`](M0-A4-04-artefacto-gap-matrix.md) | A4 |
| M0-A5-01 | [`M0-A5-01-spec-e2e-fixture-nest.md`](M0-A5-01-spec-e2e-fixture-nest.md) | A5 |
| M0-A5-02 | [`M0-A5-02-readme-plugin-e2e-nest.md`](M0-A5-02-readme-plugin-e2e-nest.md) | A5 |
| M0-A5-03 | [`M0-A5-03-matriz-compose-agent-docker.md`](M0-A5-03-matriz-compose-agent-docker.md) | A5 |

## Validação automatizada

Na raiz do repositório:

```bash
node scripts/validate-milestone-plan-coverage.mjs
```

Ou `npm run test:docs-m0` / `npm run test:docs-milestones` (ver [`package.json`](../../../../../package.json) na raiz).
