---
name: agent-error-messaging-triple
description: >-
  Formato obrigatório ao relatar falhas (testes, build, CI, comandos): três partes com
  prefixos [HCD-ERR-SENIOR], [HCD-ERR-FIX], [HCD-ERR-OPS]; Níveis 1–2 de conformidade.
  Keywords: erro, falha, CI, stack trace, sub-agente, agent-error-messaging-triple.
---

# Mensagens de falha em três partes

Use em **toda** resposta que comunique **erro ou falha** relevante para o utilizador (inclui relatórios devolvidos por sub-agentes que descrevam falhas).

## Fonte normativa

- [`specs/agent-error-messaging-triple.md`](../../../specs/agent-error-messaging-triple.md)

## Prefixos (primeira linha de conteúdo de cada parte)

| Parte | Prefixo obrigatório |
|-------|---------------------|
| Diagnóstico técnico (sênior) | `[HCD-ERR-SENIOR]` |
| Correção definitiva | `[HCD-ERR-FIX]` |
| Contorno operacional | `[HCD-ERR-OPS]` |

## Checklist rápido

1. **Nível 1 — Presença:** o texto contém os três prefixos acima (literais exatos).
2. **Nível 2 — Contagens:** `grep -c` de cada prefixo; totais iguais entre si e iguais a **N** (unidades de falha no relato — ver spec).
3. **Nível 3 — Análise:** conteúdo semântico correto por audiência; caminhos relativos à raiz no bloco sênior quando aplicável ([`docs/documentation-policy.md`](../../../docs/documentation-policy.md)).

Conteúdo por parte (após o prefixo na linha):

1. **SENIOR** — trecho do erro/stack/log; ficheiros com **caminhos relativos à raiz**; hipótese de causa técnica.
2. **FIX** — o que mudar para não recorrer (código, contrato, CI, automação, testes, proteções).
3. **OPS** — como desbloquear uso em paralelo; riscos do contorno.

Se alguma parte for vazia por natureza, usar *Não aplicável* ou frase mínima após o prefixo (ver casos limite no spec).

## Ligação ao plugin

A regra futura `standardize-error-messages` usa catálogo com `seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround` — recomenda-se prefixo no início de cada string alinhado ao spec; ver [`specs/plugin-contract.md`](../../../specs/plugin-contract.md) e a skill [`eslint-plugin-workflow`](../eslint-plugin-workflow/SKILL.md) ao implementar.
