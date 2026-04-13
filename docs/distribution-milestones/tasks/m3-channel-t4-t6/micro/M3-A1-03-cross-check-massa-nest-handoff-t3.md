# M3-A1-03: Cross-check massa Nest e consumo do handoff T3

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M3-A1-03 |
| milestone | M3 |
| depends_on | M3-A1-02 |
| blocks | M3-A2-01 |
| plan_requirements | `m3-sec4-order-1`, `m3-sec6-matrix`, `m3-sec7-A1`, `m3-sec2-handoff` |

## Objetivo

Validar que o guia IDE cobre, onde aplicável, a mesma massa **T1** usada em e2e (ex.: workspace Nest) e que os diagnostics esperados são coerentes com o que **T3** garante (lint/testes no CI).

## Definition of done

- Nota explícita: massa [`packages/e2e-fixture-nest/`](../../../../packages/e2e-fixture-nest/) e [`specs/e2e-fixture-nest.md`](../../../../specs/e2e-fixture-nest.md); bullets do handoff M2→T4 reutilizados ou referenciados.

## Paths principais

- [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs)
- [`docs/distribution-milestones/tasks/m2-channel-t3-ci/micro/M2-A3-02-handoff-t4-o-que-ci-garante.md`](../../m2-channel-t3-ci/micro/M2-A3-02-handoff-t4-o-que-ci-garante.md)
