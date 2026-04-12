---
name: github-markdown-docs
description: >-
  Atualiza README, docs/, specs/ e docs/repository-tree.md ao final de tarefas que mudem comportamento, estrutura ou políticas.
  Use ao fechar um prompt com entregas em Markdown ou quando o grafo de diretórios normativos mudar.
  Keywords: documentation-policy, repository-tree, agent-documentation-workflow, CONTRIBUTING.
---

# Skill: documentação Markdown para este repositório

## Quando usar

Ao concluir qualquer tarefa que modifique comportamento, estrutura, contratos ou políticas; ou quando o usuário pedir documentação.

## Checklist

1. Garantir que a abertura do prompt seguiu [`specs/agent-session-workflow.md`](../../../specs/agent-session-workflow.md) quando o escopo foi relevante; em seguida ler [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) e, se o trabalho envolveu ESLint/npm no ecossistema, [`specs/agent-reference-clippings.md`](../../../specs/agent-reference-clippings.md).
2. Atualizar [`docs/repository-tree.md`](../../../docs/repository-tree.md) se pastas ou arquivos normativos mudarem (incluindo `reference/Clippings/`).
3. Ajustar [`README.md`](../../../README.md) se a entrada principal deixar de refletir o projeto.
4. Revisar [`docs/limitations-and-scope.md`](../../../docs/limitations-and-scope.md) e [`specs/vision-hardcode-plugin.md`](../../../specs/vision-hardcode-plugin.md) se escopo ou roadmap mudarem.
5. Aplicar [`docs/documentation-policy.md`](../../../docs/documentation-policy.md) (links relativos, menções a paths internos relativos à raiz do repo — princípio 5b, hierarquia de títulos, cercas de código).
6. Incluir alterações de doc no mesmo fluxo de commit que [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md).

## Grafo

A fonte do “grafo” de diretórios para leitores é `docs/repository-tree.md`; mantenha-o sincronizado com a realidade.
