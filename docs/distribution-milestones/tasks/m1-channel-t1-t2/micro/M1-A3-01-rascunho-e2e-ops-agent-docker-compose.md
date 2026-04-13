# M1-A3-01: Rascunho perfil `e2e-ops` em agent-docker-compose

| Campo | Valor |
|-------|--------|
| parent_task | A3 |
| micro_id | M1-A3-01 |
| milestone | M1 |
| depends_on | A2 |
| blocks | M1-A3-02 |
| plan_requirements | `m1-sec4-order-3`, `m1-sec7-A3` |

## Objetivo

Documentar o desenho pretendido do perfil **`e2e-ops`** (quando existir): serviço que monta o repositório e executa ESLint via imagem ops-eslint, alinhado a [`../../../m1-channel-t1-t2.md`](../../../m1-channel-t1-t2.md) §6 e ao macro-plan.

## Definition of done

- Secção ou subsecção em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) **ou** issue referenciada: pré-requisitos, comando alvo `docker compose --profile e2e-ops run --rm e2e-ops`, e estado **planejado** se `docker-compose.yml` ainda não define o perfil.

## Paths principais

- `specs/agent-docker-compose.md`
- `docker-compose.yml`
