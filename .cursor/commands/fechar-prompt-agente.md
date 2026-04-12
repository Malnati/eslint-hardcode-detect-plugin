# Fechar sessão de agente (hardcode-detect)

Antes de encerrar a resposta ao usuário:

0. Se a entrega incluir **falhas** (testes, build, CI, comandos) a reportar, estruture-as conforme [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md): primeira linha de cada parte com `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; confirmar Níveis 1–2 (presença dos prefixos e contagens alinhadas a **N** falhas).
1. Siga o checklist de fechamento em [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) e [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
2. Atualize [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore de diretórios ou artefatos normativos mudou; atualize [`reference/Clippings/README.md`](reference/Clippings/README.md) se Clippings foram adicionados, renomeados ou removidos.
3. Na mensagem final ao usuário, **liste** os arquivos de documentação alterados **ou** declare explicitamente que nenhuma atualização documental foi necessária; use **caminhos relativos à raiz** ao listar ficheiros (ver [`docs/documentation-policy.md`](../../docs/documentation-policy.md)).
4. Se existirem alterações locais rastreadas pelo Git, aplique [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) e a skill `git-agent-workflow`. Antes do `git push`, confira se a mensagem do `git commit` está no formato **Conventional Commits** descrito nesse spec.
