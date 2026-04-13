---
name: remediation-micro-roles-workflow
description: >-
  Aplica sub-micro-tarefas por papel (foco único) quando o trabalho envolve planos de dev,
  correcções, testes ou marcos remediation/distribution. Keywords: micro-tarefas, papel,
  arquiteto, testador, Camada A, remediation-milestones, single_focus.
---

# Skill: sub-micro-tarefas por papel

## Quando usar

- O utilizador ou o contexto citam **remediation-milestones**, **distribution-milestones**, **Camada A**, **`micro/`**, ou vão **alterar** `packages/eslint-plugin-hardcode-detect/` (código, testes, e2e).
- O pedido mistura **especificação**, **implementação** e **validação** sem ordem clara.

## Procedimento

1. Ler [`specs/agent-remediation-micro-roles.md`](../../../specs/agent-remediation-micro-roles.md).
2. Abrir a tabela de papéis e convenções em [`docs/remediation-milestones/tasks/README.md`](../../../docs/remediation-milestones/tasks/README.md) (e, se aplicável, `micro/README.md` do marco).
3. Identificar o **papel** deste turno; se for o primeiro de uma cadeia, preferir ordem: arquiteto → analista de negócio → … → testador.
4. Na resposta, **declarar** o papel na primeira linha útil (ex.: `**Papel:** desenvolvedor`).
5. Se for necessário outro papel, **parar** após cumprir o critério do actual e indicar qual seria o passo seguinte (ou pedir novo prompt focado).

## Relação com outras skills

- Código do plugin: [`eslint-plugin-workflow`](../eslint-plugin-workflow/SKILL.md) — combinar com **um** papel por sessão ou secção.
- Falhas: [`agent-error-messaging-triple`](../agent-error-messaging-triple/SKILL.md).

## Não fazer

- Empacotar revisão de contrato, implementação em `src/` e análise de logs de CI num único bloco sem separação, salvo pedido explícito do utilizador.
