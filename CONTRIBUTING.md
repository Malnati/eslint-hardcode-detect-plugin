# Contribuindo

Este projeto aceita contribuições humanas e fluxos automatizados por agentes de IA (Cursor / Cursor CLI). A autoridade normativa está em [`AGENTS.md`](AGENTS.md) e em [`specs/`](specs/).

## Antes de abrir uma mudança

1. Agentes de IA: siga [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) e [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md) em cada prompt (escopo, Clippings quando aplicável, grafo e fechamento). Se usar instruções de [`reference/agents-ref/`](reference/agents-ref/), adapte-as com [`specs/agent-reference-agents.md`](specs/agent-reference-agents.md). Comandos opcionais no Cursor: `/abrir-prompt-agente`, `/fechar-prompt-agente`.
2. Leia [`specs/plugin-contract.md`](specs/plugin-contract.md) e [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) quando a mudança afetar comportamento ou escopo.
3. Para trabalho em ESLint/regras/npm do plugin, siga [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md) e consulte [`reference/Clippings/`](reference/Clippings/).
4. Não use arquivos em [`reference/`](reference/) como dependência de código; `Clippings/` e `legacy-snapshot/` são apenas referência.
5. Atualize a documentação afetada (em especial [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore de diretórios mudar). Ver [`docs/documentation-policy.md`](docs/documentation-policy.md).

## Fluxo recomendado

1. Implementar ou editar em [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect).
2. Rodar lint e testes (`npm run lint` e `npm test` na raiz do monorepo, ou os equivalentes no diretório do pacote). Alternativa em container: perfis em [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md) (`docker compose --profile e2e run --rm e2e`, etc.).
3. Atualizar specs e Markdown conforme [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
4. Commit e push seguindo [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md), incluindo mensagens no formato **Conventional Commits** descrito nesse spec.

## Conduta

Mantenha mensagens de commit no formato **Conventional Commits** (ver [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md)) e evite incluir dados sensíveis. Dúvidas sobre limites: [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md).
