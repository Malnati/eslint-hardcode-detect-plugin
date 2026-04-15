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

Garantir que o nome dos steps em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) reflecte os comandos canónicos do pipeline (`npm run lint` e `npm test -w eslint-plugin-hardcode-detect`) e que a documentação aponta para os mesmos comandos na raiz.

## Definition of done

- Comentários ou `name:` dos steps alinhados à matriz e ao handoff do marco M2.
- Referência cruzada ao [`coverage-manifest.json`](../coverage-manifest.json) do M2 quando útil para revisores.

## Paths principais

- `.github/workflows/ci.yml`
- `docs/distribution-milestones/tasks/m2-channel-t3-ci/coverage-manifest.json`
