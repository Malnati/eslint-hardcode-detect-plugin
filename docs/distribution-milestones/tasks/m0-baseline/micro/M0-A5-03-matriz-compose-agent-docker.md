# M0-A5-03: Matriz e2e×Compose vs specs

| Campo | Valor |
|-------|--------|
| parent_task | A5 |
| micro_id | M0-A5-03 |
| milestone | M0 |
| depends_on | M0-A5-02 |
| blocks | — |
| plan_requirements | `m0-sec4-order-3`, `m0-sec7-A5`, `m0-sec10-nest-e2e`, `m0-sec10-compose-matrix` |

## Objetivo

Verificar coerência entre a matriz e2e×Docker em [`docs/distribution-milestones/m0-baseline.md`](../../../m0-baseline.md) (secção 6), [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) e a documentação da massa Nest — **apenas documentação**; não alterar `docker-compose.yml` salvo gap normativo explícito.

## Definition of done

- Perfis `e2e` / `prod` e comandos citados no plano batem com o spec de Compose ou há nota de divergência na documentação.
- Handoff «baseline e2e» para T1 fica explícito para leitores.

## Paths principais

- `docs/distribution-milestones/m0-baseline.md`
- `specs/agent-docker-compose.md`
- `specs/e2e-fixture-nest.md`
