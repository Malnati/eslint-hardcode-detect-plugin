# M2-A1-01: Inventário de jobs e steps em `ci.yml`

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M2-A1-01 |
| milestone | M2 |
| depends_on | — |
| blocks | M2-A1-02 |
| plan_requirements | `m2-sec4-order-1`, `m2-sec7-A1` |

## Objetivo

Registar o estado actual do workflow [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml): nome do workflow, eventos (`on`), jobs, `runs-on`, `timeout-minutes`, e cada step com o comando efectivo.

## Definition of done

- Tabela ou lista: job → steps ordenados → comando `run` (ou acção) por step.
- Referência ao Node version e ao uso de `npm install` vs `npm ci` quando aplicável.

## Paths principais

- `.github/workflows/ci.yml`
- `package.json` (raiz)
