# M2-A1-02: Tabela de paridade perfil `prod` (Compose) vs CI

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M2-A1-02 |
| milestone | M2 |
| depends_on | M2-A1-01 |
| blocks | M2-A1-03 |
| plan_requirements | `m2-sec4-order-1`, `m2-sec4-order-2`, `m2-sec7-A1` |

## Objetivo

Comparar linha a linha o comando do serviço **prod** em [`docker-compose.yml`](../../../../../docker-compose.yml) (`npm ci && npm run lint && npm test -w eslint-plugin-hardcode-detect`) com a sequência de steps do job CI, incluindo o passo `npm run test:docs-m0` que não existe no Compose `prod`.

## Definition of done

- Tabela: dimensão (instalação, lint, teste, validação docs) → CI → `prod` → gap / nota.
- Gaps explícitos (ex.: `npm install` vs `npm ci`; variável `CI=true` no Compose) reflectidos em [`../evidence/T3-ci-prod-parity-gap-matrix.md`](../evidence/T3-ci-prod-parity-gap-matrix.md).

## Paths principais

- `docker-compose.yml`
- `.github/workflows/ci.yml`
- `docs/distribution-milestones/tasks/m2-channel-t3-ci/evidence/T3-ci-prod-parity-gap-matrix.md`
