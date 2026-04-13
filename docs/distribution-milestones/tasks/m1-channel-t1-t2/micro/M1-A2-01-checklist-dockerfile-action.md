# M1-A2-01: Checklist Dockerfile e Composite Action ops-eslint

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M1-A2-01 |
| milestone | M1 |
| depends_on | A1 (contexto matriz T1) |
| blocks | M1-A2-02 |
| plan_requirements | `m1-sec4-order-2`, `m1-sec7-A2` |

## Objetivo

Listar os pontos de contacto entre [`.docker/Dockerfile`](../../../../../.docker/Dockerfile), a imagem `malnati-ops-eslint:local` e a Composite Action [`ops-eslint`](../../../../../.github/actions/ops-eslint/action.yml) (`assets/run.sh`, inputs).

## Definition of done

- Checklist verificável (versão Node/eslint na imagem vs pacote; tag; entrada do container) com remissão a [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md).

## Paths principais

- `.docker/Dockerfile`
- `.github/actions/ops-eslint/action.yml`
- `.github/actions/ops-eslint/assets/run.sh`
