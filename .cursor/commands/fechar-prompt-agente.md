# Fechar sessão de agente (hardcode-detect)

Antes de encerrar a resposta ao usuário:

1. Siga o checklist de fechamento em [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) e [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
2. Atualize [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore de diretórios ou artefatos normativos mudou; atualize [`reference/Clippings/README.md`](reference/Clippings/README.md) se Clippings foram adicionados, renomeados ou removidos.
3. Na mensagem final ao usuário, **liste** os arquivos de documentação alterados **ou** declare explicitamente que nenhuma atualização documental foi necessária.
4. Se existirem alterações locais rastreadas pelo Git, aplique [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) e a skill `git-agent-workflow`. Antes do `git push`, confira se a mensagem do `git commit` está no formato **Conventional Commits** descrito nesse spec.
