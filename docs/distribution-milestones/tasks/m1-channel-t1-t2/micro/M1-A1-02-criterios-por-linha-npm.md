# M1-A1-02: Critérios por linha npm (matriz T1)

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M1-A1-02 |
| milestone | M1 |
| depends_on | M1-A1-01 |
| blocks | M1-A1-03 |
| plan_requirements | `m1-sec4-order-1`, `m1-sec7-A1`, `m1-sec10-done-t1` |

## Objetivo

Definir **critérios de sucesso reprodutíveis** por linha da matriz T1 (ex.: projeto único com `npm ci`; monorepo/workspace; invocação via `npx eslint` / `npm exec` com resolução do plugin).

## Definition of done

- Para cada linha priorizada: comando ou referência ao job CI / `npm test` do workspace do plugin; **código de saída** do processo e verificação mínima (ex.: sem regressão nas regras contratuais).
- Ligação à evidência de gaps em [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md) quando houver lacunas documentadas.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/package.json`
- `.github/workflows/ci.yml`
