# M2-A3-03: Alinhamento workflow — comentários e manifest M2

| Campo | Valor |
|-------|--------|
| parent_task | A3 |
| micro_id | M2-A3-03 |
| milestone | M2 |
| depends_on | M2-A3-02 |
| blocks | — |
| plan_requirements | `m2-sec10-workflow-labels` |

## Objetivo

Garantir que o nome dos steps em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) (ex.: validação `test:docs-m0`) reflecte os manifestos M0–M2 e que a documentação aponta para `npm run test:docs-m0` na raiz.

## Definition of done

- Comentários ou `name:` dos steps alinhados aos marcos cobertos pelo script [`scripts/validate-milestone-plan-coverage.mjs`](../../../../../scripts/validate-milestone-plan-coverage.mjs).
- Referência cruzada ao [`coverage-manifest.json`](../coverage-manifest.json) do M2 quando útil para revisores.

## Paths principais

- `.github/workflows/ci.yml`
- `scripts/validate-milestone-plan-coverage.mjs`
- `docs/distribution-milestones/tasks/m2-channel-t3-ci/coverage-manifest.json`
