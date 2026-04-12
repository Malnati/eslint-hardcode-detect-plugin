---
name: agent-error-messaging-triple
description: >-
  Formato obrigatório ao relatar falhas (testes, build, CI, comandos): três partes —
  diagnóstico técnico sênior, correção definitiva, contorno operacional. Keywords:
  erro, falha, CI, stack trace, sub-agente, agent-error-messaging-triple.
---

# Mensagens de falha em três partes

Use em **toda** resposta que comunique **erro ou falha** relevante para o utilizador (inclui relatórios devolvidos por sub-agentes que descrevam falhas).

## Fonte normativa

- [`specs/agent-error-messaging-triple.md`](../../../specs/agent-error-messaging-triple.md)

## Checklist rápido

1. **Diagnóstico técnico (sênior)** — trecho do erro/stack/log; ficheiros com **caminhos relativos à raiz**; hipótese de causa técnica ([`docs/documentation-policy.md`](../../../docs/documentation-policy.md)).
2. **Correção definitiva** — o que mudar para não recorrer (código, contrato, CI, automação, testes, proteções).
3. **Contorno operacional** — como desbloquear uso em paralelo; riscos do contorno.

Se alguma parte for vazia por natureza, usar *Não aplicável* ou frase mínima (ver casos limite no spec).

## Ligação ao plugin

A regra futura `standardize-error-messages` usa catálogo com `seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround` — ver [`specs/plugin-contract.md`](../../../specs/plugin-contract.md) e a skill [`eslint-plugin-workflow`](../eslint-plugin-workflow/SKILL.md) ao implementar.
