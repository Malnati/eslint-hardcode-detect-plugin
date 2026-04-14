# M1 — micro-tarefas (Camada A fragmentada)

Âncoras normativas: [`../A1-npm-matrix-t1.md`](../A1-npm-matrix-t1.md), [`../A2-smoke-ops-eslint-image.md`](../A2-smoke-ops-eslint-image.md), [`../A3-docker-compose-e2e-ops-draft.md`](../A3-docker-compose-e2e-ops-draft.md). Plano do marco: [`../../../m1-channel-t1-t2.md`](../../../m1-channel-t1-t2.md).

**Manifesto de cobertura:** [`../coverage-manifest.json`](../coverage-manifest.json) — mapeia requisitos do plano (timelining §4, Camada A §7, done §10) para estes ficheiros.

**Convenção de nomes:** `M1-A<n>-<nn>-<slug>.md` (`nn` zero-padded).

## Grafo de dependências (ordem sugerida)

```text
M1-A1-01 → M1-A1-02 → M1-A1-03

M1-A2-01 → M1-A2-02 → M1-A2-03   (após contexto A1; M1-A2-03 pode cruzar com evidência T1/T2)

M1-A3-01 → M1-A3-02 → M1-A3-03   (após A2; opcional até perfil e2e-ops existir)
```

Alinhamento ao grafo em [`../README.md`](../README.md): A1→A2→A3.

## Índice das micro-tarefas

| micro_id | Ficheiro | parent_task |
|----------|----------|-------------|
| M1-A1-01 | [`M1-A1-01-inventario-matriz-t1-macro-plan.md`](M1-A1-01-inventario-matriz-t1-macro-plan.md) | A1 |
| M1-A1-02 | [`M1-A1-02-criterios-por-linha-npm.md`](M1-A1-02-criterios-por-linha-npm.md) | A1 |
| M1-A1-03 | [`M1-A1-03-backlog-ci-registry-policy.md`](M1-A1-03-backlog-ci-registry-policy.md) | A1 |
| M1-A2-01 | [`M1-A2-01-checklist-dockerfile-action.md`](M1-A2-01-checklist-dockerfile-action.md) | A2 |
| M1-A2-02 | [`M1-A2-02-comando-build-run-documentado.md`](M1-A2-02-comando-build-run-documentado.md) | A2 |
| M1-A2-03 | [`M1-A2-03-paridade-t1-t2-versao-config.md`](M1-A2-03-paridade-t1-t2-versao-config.md) | A2 |
| M1-A3-01 | [`M1-A3-01-rascunho-e2e-ops-agent-docker-compose.md`](M1-A3-01-rascunho-e2e-ops-agent-docker-compose.md) | A3 |
| M1-A3-02 | [`M1-A3-02-repository-tree-quando-perfil.md`](M1-A3-02-repository-tree-quando-perfil.md) | A3 |
| M1-A3-03 | [`M1-A3-03-matriz-m1-sec6-cross-check.md`](M1-A3-03-matriz-m1-sec6-cross-check.md) | A3 |

## Validação automatizada

Na raiz do repositório:

```bash
npm run test:docs-m0
```

Ver [`package.json`](../../../../../package.json).
