# M3-A2-02: Alinhamento ao CLI / lint do CI (ponte M2)

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M3-A2-02 |
| milestone | M3 |
| depends_on | M3-A2-01 |
| blocks | — |
| plan_requirements | `m3-sec4-order-2`, `m3-sec7-A2`, `m3-sec2-handoff` |

## Objetivo

Documentar o **alvo normativo** para T6: o hook deve invocar o **mesmo** caminho de validação que o contribuidor e o CI usam (ex.: `npm run lint` na raiz ou comando equivalente descrito em [`CONTRIBUTING.md`](../../../../CONTRIBUTING.md) / M2).

## Definition of done

- Bullets com comando(s) de referência e referência explícita a [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md); aviso de que fecho completo de T6 depende de M4.

## Paths principais

- [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml)
- [`CONTRIBUTING.md`](../../../../CONTRIBUTING.md)
