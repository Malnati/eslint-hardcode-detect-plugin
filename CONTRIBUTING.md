# Contribuindo

Este projeto aceita contribuições humanas e fluxos automatizados por agentes de IA (Cursor / Cursor CLI). A autoridade normativa está em [`AGENTS.md`](AGENTS.md) e em [`specs/`](specs/).

## Antes de abrir uma mudança

1. Leia [`specs/plugin-contract.md`](specs/plugin-contract.md) e [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) quando a mudança afetar comportamento ou escopo.
2. Não use código em [`reference/`](reference/) como dependência; apenas como referência histórica.
3. Atualize a documentação afetada (em especial [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore de diretórios mudar). Ver [`docs/documentation-policy.md`](docs/documentation-policy.md).

## Fluxo recomendado

1. Implementar ou editar em [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect).
2. Rodar testes (`npm test` no pacote ou via workspace na raiz).
3. Atualizar specs e Markdown conforme [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
4. Commit e push seguindo [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md).

## Conduta

Mantenha mensagens de commit claras e evite incluir dados sensíveis. Dúvidas sobre limites: [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md).
