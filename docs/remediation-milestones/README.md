# Planos por marco (M0–M5): remediação R1–R3

Índice dos planos detalhados por **marco macro** alinhados a [`../hardcode-remediation-macro-plan.md`](../hardcode-remediation-macro-plan.md), onde o **princípio de tempos** (durações e composição **sem** datas de calendário normativas) está descrito. Cada ficheiro inclui: objetivo e trilhas R1–R3; **dependências e handoff na cadeia M0→M5**; diagrama de sequência ou fluxo; **ordem, dependências e durações**; composição temporal (Gantt com eixo T0 fictício onde existir); matriz **massas e2e / RuleTester / Compose-CI**; **Camada A** (tarefas e orçamento de tokens pré-execução de agentes) e **Camada B** (execução por fase); plano GitHub (PR, branch, semver); riscos.

**Ficheiros de tarefa (Camada A, um Markdown por tarefa):** [`tasks/README.md`](tasks/README.md) — **M0** em [`tasks/m0-contract-baseline/`](tasks/m0-contract-baseline/README.md); **M1** em [`tasks/m1-remediation-r1/`](tasks/m1-remediation-r1/README.md); **M2** em [`tasks/m2-remediation-r2-global/`](tasks/m2-remediation-r2-global/README.md); **M3** em [`tasks/m3-remediation-r3-data-files/`](tasks/m3-remediation-r3-data-files/README.md); **M4** em [`tasks/m4-secrets-remediation/`](tasks/m4-secrets-remediation/README.md); **M5** em [`tasks/m5-remediation-release/`](tasks/m5-remediation-release/README.md).

**Template reutilizável:** [`milestone-template.md`](milestone-template.md)

| Marco | Milestone GitHub (sugerido) | Ficheiro |
|-------|-----------------------------|----------|
| M0 | `remediation-m0-contract` | [`m0-contract-baseline.md`](m0-contract-baseline.md) |
| M1 | `remediation-m1-r1` | [`m1-remediation-r1.md`](m1-remediation-r1.md) |
| M2 | `remediation-m2-r2-global` | [`m2-remediation-r2-global.md`](m2-remediation-r2-global.md) |
| M3 | `remediation-m3-r3-data` | [`m3-remediation-r3-data-files.md`](m3-remediation-r3-data-files.md) |
| M4 | `remediation-m4-secrets` | [`m4-secrets-remediation.md`](m4-secrets-remediation.md) |
| M5 | `remediation-m5-release` | [`m5-remediation-release.md`](m5-remediation-release.md) |

Os seis planos estão em ficheiros Markdown **neste diretório**; a coluna «Ficheiro» dá o nome exacto.

## Cadeia M0 → M5 (handoff)

Ordem normativa: **M0** (contrato e políticas públicas) → **M1** (R1, fix local) → **M2** (R2, índice global) → **M3** (R3, ficheiros de dados) → **M4** (segredos e política de fix) → **M5** (release, adoção, `bin` opcional). A sequência linear do macro-plan soma **74d** de esforço sequencial no caminho crítico; não representa calendário civil.

## Documentos mestre

- [`../hardcode-remediation-macro-plan.md`](../hardcode-remediation-macro-plan.md) — roadmap macro R1–R3, segredos, verificação global  
- [`../distribution-channels-macro-plan.md`](../distribution-channels-macro-plan.md) — T1–T6; validação npm/CI das entregas do plugin  
- [`../../specs/plugin-contract.md`](../../specs/plugin-contract.md) — contrato do plugin  
- [`../hardcoding-map.md`](../hardcoding-map.md) — taxonomia HC-* e L1–L4  
