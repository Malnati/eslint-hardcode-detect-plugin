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
