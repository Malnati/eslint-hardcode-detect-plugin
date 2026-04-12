# Planos por marco (M0–M5): distribuição, e2e, Compose e agentes

Índice dos planos detalhados por **marco macro** alinhados a [`../distribution-channels-macro-plan.md`](../distribution-channels-macro-plan.md). Cada ficheiro inclui: objetivo e trilhas; **dependências e handoff na cadeia T1→T6**; diagrama de sequência; timelining; Gantt; matriz **e2e × Docker Compose**; **Camada A** (tarefas e orçamento de tokens pré-execução de agentes) e **Camada B** (execução por fase); plano GitHub (PR, branch, semver); riscos.

**Template reutilizável:** [`milestone-template.md`](milestone-template.md)

| Marco | Milestone GitHub (sugerido) | Ficheiro |
|-------|-----------------------------|----------|
| M0 | `macro-baseline` | [`m0-baseline.md`](m0-baseline.md) |
| M1 | `channel-t1-t2` | [`m1-channel-t1-t2.md`](m1-channel-t1-t2.md) |
| M2 | `channel-t3-ci` | [`m2-channel-t3-ci.md`](m2-channel-t3-ci.md) |
| M3 | `channel-t4-t6` | [`m3-channel-t4-t6.md`](m3-channel-t4-t6.md) |
| M4 | `channel-t5-agents` | [`m4-channel-t5-agents.md`](m4-channel-t5-agents.md) |
| M5 | `release-candidate` | [`m5-release-candidate.md`](m5-release-candidate.md) |

## Cadeia T1 → T6 (handoff)

Ordem normativa de **artefatos** (ver ficheiros por marco): **T1** (npm + config) → **T2** (container/imagem) → **T3** (CI reprodutível) → **T4** (IDE/LSP) → **T5** (agentes/Copilot/Cursor/MCP) → **T6** (Git hooks). O macro-plan agrupa trabalho em **M0–M5**; quando o calendário de milestones diferir da ordem T5→T6, seguir a **política** descrita em [`m3-channel-t4-t6.md`](m3-channel-t4-t6.md).

## Documentos mestre

- [`../solution-distribution-channels.md`](../solution-distribution-channels.md) — tabela mestre de canais  
- [`../distribution-channels-macro-plan.md`](../distribution-channels-macro-plan.md) — roadmap macro  
- [`../../specs/plugin-contract.md`](../../specs/plugin-contract.md) — contrato do plugin  
