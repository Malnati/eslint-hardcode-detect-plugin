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

- Checklist curto «antes de merge T6» com referência a [`docs/distribution-milestones/m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md) e ao estado do marco M4 — **texto canónico** em [`m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §1, §4 e §10 ([Gate antes de merge T6](../../../m3-channel-t4-t6.md#gate-antes-de-merge-t6)). Este micro fica **satisfeito** quando essa secção do plano M3 existir e estiver alinhada a este objetivo.

## Paths principais

- [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §1, §4 e §10

---

## Resumo (rastreio da micro-tarefa)

A regra **Opção A** (T6 forte **após** M4) e a **Opção B** (Gantt: T4 → M4 → T6) estão materializadas no plano do marco; o checklist operacional e as remissões a M4, CLI/CI e riscos estão em **[§10 — Gate antes de merge T6](../../../m3-channel-t4-t6.md#gate-antes-de-merge-t6)**. Não duplicar o checklist aqui — editar apenas [`m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) para alterações normativas.

Referência de produto para o handoff T5→T6: [`m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md) §2 (*Saída / Para T6*).
