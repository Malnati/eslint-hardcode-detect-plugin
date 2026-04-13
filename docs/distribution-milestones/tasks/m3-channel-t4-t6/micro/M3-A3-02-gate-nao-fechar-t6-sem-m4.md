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

---

## Antes de merge T6 — checklist normativo (entregável)

Não declarar o canal **T6** (hooks operacionais + fixture `e2e-fixture-git-hooks-sample`) como **«done»** nem mergear PR que **feche** T6 até o gate abaixo estar satisfeito. Isto materializa a **Opção A** do plano M3 (T6 forte **após** M4) e mantém a **Opção B** (duas ondas no Gantt: T4; depois M4; depois T6) explícita em [`m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §1, §4 e §10.

- [ ] O marco **M4 (T5)** — ecossistema agente — está **concluído** no sentido do plano: handoff e superfícies normativas descritas em [`m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md) (milestone GitHub sugerido `channel-t5-agents`; validar estado na branch/PR antes de fechar T6).
- [ ] A **cadeia T5→T6** está respeitada: os hooks devem invocar o **mesmo** caminho de lint/CLI que o CI e os contribuidores (alvo normativo em [`M3-A2-02-alinhamento-cli-lint-ci-m2.md`](M3-A2-02-alinhamento-cli-lint-ci-m2.md)).
- [ ] **Riscos §10** do plano M3 continuam endereçados: não antecipar T6 a T5; evitar hooks que **alterem o estado git** em runners de CI sem política explícita (ver também [`../../../../distribution-channels-macro-plan.md`](../../../../distribution-channels-macro-plan.md)).

Referência de produto para o handoff T5→T6: [`m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md) §2 (*Saída / Para T6*).
