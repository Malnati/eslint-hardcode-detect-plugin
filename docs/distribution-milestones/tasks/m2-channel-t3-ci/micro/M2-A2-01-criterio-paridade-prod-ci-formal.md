# M2-A2-01: Critério formal de paridade prod ↔ CI

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M2-A2-01 |
| milestone | M2 |
| depends_on | M2-A1-03 |
| blocks | M2-A2-02 |
| plan_requirements | `m2-sec4-order-2`, `m2-sec7-A2` |

## Objetivo

Definir o que significa «pronto para PR» no plano M2: lista de propriedades que devem coincidir entre o runner GitHub Actions e o ambiente reprodutível do perfil `prod`, e quais divergências são **aceites** (documentadas) versus **a fechar** numa PR.

## Definition of done

- Critérios numerados ou checklist; ligação aos gaps em [`../evidence/T3-ci-prod-parity-gap-matrix.md`](../evidence/T3-ci-prod-parity-gap-matrix.md).
- Alinhamento à secção «Ordem, dependências e durações» do plano M2 (ordem 2).

## Paths principais

- `docs/distribution-milestones/m2-channel-t3-ci.md`
- `docs/distribution-milestones/tasks/m2-channel-t3-ci/evidence/T3-ci-prod-parity-gap-matrix.md`
