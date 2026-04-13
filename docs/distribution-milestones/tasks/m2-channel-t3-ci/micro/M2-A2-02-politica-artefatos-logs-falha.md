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

## Modelo HCD-ERR ao documentar uma falha de CI (issues/PR)

Relatos estruturados devem seguir [`specs/agent-error-messaging-triple.md`](../../../../../specs/agent-error-messaging-triple.md) (Níveis 1–2: um trio completo por unidade de falha, com as três primeiras linhas de corpo a iniciar pelos prefixos canónicos). Exemplo mínimo (fictício):

### Diagnóstico técnico (sênior)

[HCD-ERR-SENIOR] Job `test` reprovado no step `Test workspace`; trecho do log do runner: `…`; hipótese: falha em `packages/eslint-plugin-hardcode-detect/tests/` ou divergência de ambiente Node em relação a `.github/workflows/ci.yml`.

### Correção definitiva

[HCD-ERR-FIX] Corrigir causa no código ou no workflow (`.github/workflows/ci.yml`); acrescentar regressão com RuleTester ou e2e conforme `specs/plugin-contract.md` quando aplicável.

### Contorno operacional

[HCD-ERR-OPS] Reproduzir localmente com a sequência indicada em `CONTRIBUTING.md`; não integrar enquanto o check obrigatório falhar, salvo excepção documentada pela equipa; risco: `npm install` local vs `npm ci` no Compose `prod` pode mascarar o mesmo sintoma com causas diferentes.

## Paths principais

- `docs/distribution-milestones/m2-channel-t3-ci.md`
- `.github/workflows/ci.yml`
