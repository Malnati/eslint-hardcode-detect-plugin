# M2-A1-03: Cross-check matriz §6 M2 × Docker Compose

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M2-A1-03 |
| milestone | M2 |
| depends_on | M2-A1-02 |
| blocks | — |
| plan_requirements | `m2-sec6-matrix`, `m2-sec7-A1` |

## Objetivo

Cruzar a tabela **e2e × Docker Compose** em [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md) (secção 6) com [`docker-compose.yml`](../../../../../docker-compose.yml): perfis `prod` e `e2e`, serviços, volumes, e comando ou job CI correspondente.

## Definition of done

- Linha «Raiz monorepo / T3 / prod»: confirmada ou corrigida com referência ao workflow.
- Linha «Plugin + fixtures / e2e»: nota sobre job paralelo opcional vs mesma sequência; coerência com [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md).

## Paths principais

- `docs/distribution-milestones/m2-channel-t3-ci.md`
- `docker-compose.yml`
- `.github/workflows/ci.yml`
