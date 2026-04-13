# M1-A1-01: Inventário matriz T1 vs macro-plan

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M1-A1-01 |
| milestone | M1 |
| depends_on | — |
| blocks | M1-A1-02 |
| plan_requirements | `m1-sec4-order-1`, `m1-sec7-A1` |

## Objetivo

Cruzar as linhas **T1** (consumidor npm) em [`docs/distribution-channels-macro-plan.md`](../../../../distribution-channels-macro-plan.md) e [`docs/solution-distribution-channels.md`](../../../../solution-distribution-channels.md) com o estado atual do repositório (workspaces na raiz, `packages/e2e-fixture-nest`, e2e do plugin).

## Definition of done

- Tabela ou lista: cada canal T1 relevante → **estado** (Parcial / Planejado / coberto por doc) → **artefato** no repo (caminho ou «em backlog»).
- Referência explícita a [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md) para a massa Nest em uso.

## Paths principais

- `docs/distribution-channels-macro-plan.md`
- `docs/solution-distribution-channels.md`
- `packages/eslint-plugin-hardcode-detect/e2e/`

## Inventário T1 (entregável)

Âncoras: tabela «Rastreabilidade: canal → trilha → …» em [`docs/distribution-channels-macro-plan.md`](../../../../distribution-channels-macro-plan.md) (linhas T1) e tabela mestre em [`docs/solution-distribution-channels.md`](../../../../solution-distribution-channels.md). Estados alinhados ao macro-plan; a coluna **Artefato** descreve o que existe **neste** clone (caminhos relativos à raiz do repositório).

| Canal T1 | Estado | Artefato no repositório |
|----------|--------|-------------------------|
| npm (projeto) | Parcial | Massa consumidora [`packages/e2e-fixture-nest/`](../../../../../packages/e2e-fixture-nest/); fumaça com API ESLint em [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) e fixture mínima em [`packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs). |
| npm workspaces / monorepo | Parcial | [`package.json`](../../../../../package.json) na raiz com `workspaces: ["packages/*"]`; plugin e fixture Nest como workspaces irmãos; e2e corre após `npm install` na raiz (ver [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md)). |
| npm global + `bin` | Planejado | «em backlog» — [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) não define `bin`; sem smoke dedicado para instalação global. |
| `npm exec` / `npx` | Planejado | «em backlog» — sem workflow ou script no repo que exerça `npx eslint` / `npm exec` contra o pacote como matriz reprodutível (macro-plan: job ou step CI dedicado). |
| Registries privados / `publishConfig` | Planejado (coberto por doc para integração) | Automação de matriz `.npmrc` / registry: «em backlog»; política sem mocks e sandboxes em [`specs/agent-integration-testing-policy.md`](../../../../../specs/agent-integration-testing-policy.md). |

**Massa Nest em uso:** o pacote auxiliar e o fluxo e2e (cwd no workspace Nest, flat config, contagens na fumaça) estão normativos em [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md); o teste que referencia essa massa é [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs).
