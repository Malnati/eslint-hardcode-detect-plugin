# M2-A2-02: Política de artefatos e logs em falha de CI

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M2-A2-02 |
| milestone | M2 |
| depends_on | M2-A2-01 |
| blocks | M2-A2-03 |
| plan_requirements | `m2-sec4-order-3`, `m2-sec7-A2` |

## Objetivo

Especificar o que mantenedores e contribuidores devem **anexar ou citar** quando um check falha (log do job, trecho do step, reprodução local com comando documentado), sem introduzir secrets no repositório.

## Definition of done

- Lista do que é útil colar num issue/PR (nome do job, step, últimas linhas relevantes, exit code).
- Referência a riscos do plano M2 §10 (rede em `npm ci`) quando aplicável.

## Paths principais

- `docs/distribution-milestones/m2-channel-t3-ci.md`
- `.github/workflows/ci.yml`
