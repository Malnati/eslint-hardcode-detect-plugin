---
name: mbra-reference-agents
description: Aplicar instruções de reference/agents-ref alinhadas ao repositório (mapeamento MBRA, sem RUP/shared obrigatórios)
---

# Skill: alinhamento com `reference/agents-ref` (MBRA)

## Quando usar

- Quando o pedido citar um agente em [`reference/agents-ref/`](../../../reference/agents-ref/) ou quando você consultar esses arquivos por inspiração (hardcoded, governança, estética, DRY, etc.).

## Procedimento

1. Abrir e seguir **[`specs/agent-mbra-reference-agents.md`](../../../specs/agent-mbra-reference-agents.md)** antes de implementar caminhos ou políticas copiados dos agentes MBRA.
2. Usar a **tabela de aplicabilidade** do spec: arquivos marcados como **Não** não devem impor estrutura neste repo (ex.: DDL, Makefile, `docs/rup/`).
3. Aplicar **substituições normativas**:
   - documentação: [`docs/documentation-policy.md`](../../../docs/documentation-policy.md), [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md);
   - código do plugin: [`specs/plugin-contract.md`](../../../specs/plugin-contract.md) + skill [`eslint-plugin-workflow`](../eslint-plugin-workflow/SKILL.md);
   - constantes compartilhadas: dentro de [`packages/eslint-plugin-hardcode-detect/`](../../../packages/eslint-plugin-hardcode-detect/), não um `shared/` obrigatório definido pelos agentes MBRA.
4. Para o tema **hardcode** neste produto: priorizar a **visão multi-nível** em [`specs/vision-hardcode-plugin.md`](../../../specs/vision-hardcode-plugin.md) e regras ESLint testáveis, em vez de relatórios em `docs/review/` como padrão.
5. Fechamento: [`specs/agent-ia-governance.md`](../../../specs/agent-ia-governance.md), grafo em [`docs/repository-tree.md`](../../../docs/repository-tree.md) e Git em [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md) quando houver entrega.

## Anti-padrões

- Criar `docs/rup/`, exigir pares `.md`/`-spec.md` RUP ou seguir `my-agent.md` da referência como se fosse este repositório.
- Tratar `agent-engineering-hardcoded.md` como ordem para criar `shared/constants.*` ou `docs/review/NNNN-report-hard-coded.md` aqui sem adaptação ao spec.
