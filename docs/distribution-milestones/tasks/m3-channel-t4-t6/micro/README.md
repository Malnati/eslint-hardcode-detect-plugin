# M3 — micro-tarefas (Camada A fragmentada)

Âncoras normativas: [`../A1-guia-ide-eslint-flat-config.md`](../A1-guia-ide-eslint-flat-config.md), [`../A2-esboco-politica-git-hooks.md`](../A2-esboco-politica-git-hooks.md), [`../A3-fixture-e2e-git-hooks-sample-pos-m4.md`](../A3-fixture-e2e-git-hooks-sample-pos-m4.md). Plano do marco: [`../../../m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md).

**Manifesto de cobertura:** [`../coverage-manifest.json`](../coverage-manifest.json) — mapeia requisitos do plano (timelining §4, matriz §6, Camada A §7, handoff §2, done §10) para estes ficheiros.

**Convenção de nomes:** `M3-A<n>-<nn>-<slug>.md` (`nn` zero-padded).

## Grafo de dependências (ordem sugerida)

```text
M3-A1-01 → M3-A1-02 → M3-A1-03

M3-A2-01 → M3-A2-02   (após contexto A1)

M3-A3-02 → M3-A3-01 → M3-A3-03   (gate M4 antes de critérios de fixture; matriz §6 por último)
```

Alinhamento ao grafo em [`../README.md`](../README.md): A1→A2; A3 depende de M4.

## Índice das micro-tarefas

| micro_id | Ficheiro | parent_task |
|----------|----------|-------------|
| M3-A1-01 | [`M3-A1-01-inventario-ide-extensao-requisitos-t1.md`](M3-A1-01-inventario-ide-extensao-requisitos-t1.md) | A1 |
| M3-A1-02 | [`M3-A1-02-passos-eslint-config-workspace-settings.md`](M3-A1-02-passos-eslint-config-workspace-settings.md) | A1 |
| M3-A1-03 | [`M3-A1-03-cross-check-massa-nest-handoff-t3.md`](M3-A1-03-cross-check-massa-nest-handoff-t3.md) | A1 |
| M3-A2-01 | [`M3-A2-01-husky-lefthook-hooks-nativos-riscos.md`](M3-A2-01-husky-lefthook-hooks-nativos-riscos.md) | A2 |
| M3-A2-02 | [`M3-A2-02-alinhamento-cli-lint-ci-m2.md`](M3-A2-02-alinhamento-cli-lint-ci-m2.md) | A2 |
| M3-A3-01 | [`M3-A3-01-criterios-readme-fixture-git-hooks.md`](M3-A3-01-criterios-readme-fixture-git-hooks.md) | A3 |
| M3-A3-02 | [`M3-A3-02-gate-nao-fechar-t6-sem-m4.md`](M3-A3-02-gate-nao-fechar-t6-sem-m4.md) | A3 |
| M3-A3-03 | [`M3-A3-03-matriz-sec6-e2e-compose-m3.md`](M3-A3-03-matriz-sec6-e2e-compose-m3.md) | A3 |

## Validação automatizada

Na raiz do repositório:

```bash
npm run lint && npm test -w eslint-plugin-hardcode-detect
```

Ver [`package.json`](../../../../../package.json) e [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml).
