# M1-A1-03: Backlog CI e registry (política de integração)

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M1-A1-03 |
| milestone | M1 |
| depends_on | M1-A1-02 |
| blocks | — |
| plan_requirements | `m1-sec4-order-1`, `m1-sec10-done-t1` |

## Objetivo

Registar explicitamente o que **não** deve ser simulado no repositório (registry privado, publish) e como validar em **sandbox** ou ambiente oficial do fornecedor, alinhado a [`specs/agent-integration-testing-policy.md`](../../../../../specs/agent-integration-testing-policy.md).

## Definition of done

- Linhas «Registries privados / publishConfig» e similares na tabela macro: marcadas como **backlog** com critério de validação externa, sem mocks de registry no repo.

## Paths principais

- `specs/agent-integration-testing-policy.md`
- `docs/distribution-channels-macro-plan.md`
