# M0-A1-01: Inventário dos ficheiros de plano por marco

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M0-A1-01 |
| milestone | M0 |
| depends_on | — |
| blocks | M0-A1-02 |
| plan_requirements | `m0-sec4-order-1`, `m0-sec7-A1`, `m0-sec10-readme-index` |

## Objetivo

Confirmar que existem `m0-baseline.md` … `m5-release-candidate.md` em [`docs/distribution-milestones/`](../../../) e que caminhos relativos usados no índice serão válidos antes de editar [`README.md`](../../../README.md).

## Definition of done

- Lista explícita dos **seis** ficheiros de plano por marco (`m0-baseline.md` … `m5-release-candidate.md`) presentes no disco (ou nota se algum estiver em falta).
- Nenhuma edição obrigatória ao README neste passo; apenas pré-condição para M0-A1-02.

## Paths principais

- `docs/distribution-milestones/m0-baseline.md` … `m5-release-candidate.md`

## Evidência

Inventário em `docs/distribution-milestones/` (M0–M5 = **6** ficheiros de plano); todos presentes:

| Marco | Ficheiro |
|-------|----------|
| M0 | `docs/distribution-milestones/m0-baseline.md` |
| M1 | `docs/distribution-milestones/m1-channel-t1-t2.md` |
| M2 | `docs/distribution-milestones/m2-channel-t3-ci.md` |
| M3 | `docs/distribution-milestones/m3-channel-t4-t6.md` |
| M4 | `docs/distribution-milestones/m4-channel-t5-agents.md` |
| M5 | `docs/distribution-milestones/m5-release-candidate.md` |

O índice em [`docs/distribution-milestones/README.md`](../../../README.md) já aponta para estes ficheiros com links relativos no mesmo diretório; **nenhuma edição ao README** foi necessária neste passo.
