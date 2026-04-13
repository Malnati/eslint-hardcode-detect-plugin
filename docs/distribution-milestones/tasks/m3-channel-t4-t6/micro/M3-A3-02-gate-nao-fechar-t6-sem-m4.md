# M3-A3-02: Gate — não declarar T6 «done» sem M4

| Campo | Valor |
|-------|--------|
| parent_task | A3 |
| micro_id | M3-A3-02 |
| milestone | M3 |
| depends_on | M3-A2-02 |
| blocks | M3-A3-01 |
| plan_requirements | `m3-sec4-order-2`, `m3-sec4-order-3`, `m3-sec10-done` |

## Objetivo

Congelar a regra normativa: PRs que **fechem** T6 (fixture + hooks operacionais) só após **M4 (T5)** e handoff de agentes; Opção B do plano (duas ondas no Gantt) mantida explícita.

## Definition of done

- Checklist curto «antes de merge T6» com referência a [`docs/distribution-milestones/m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md) e ao estado do marco M4.

## Paths principais

- [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §1 e §4
