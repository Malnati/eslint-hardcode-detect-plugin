# Arquitetura do repositório

## Visão geral

Este repositório separa três preocupações:

1. **Pacote npm** ([`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect)) — implementação oficial do plugin ESLint, versionada e testável.
2. **Referência congelada** ([`reference/`](../reference/)) — snapshots históricos; não entram na cadeia de dependências do pacote.
3. **Automação GitHub** ([`.github/actions/ops-eslint`](../.github/actions/ops-eslint)) — composite action que executa ESLint em container; exige imagem Docker e `.docker/Dockerfile` na raiz do checkout quando `build_image` estiver ativo.

## Fluxo de decisão

- Comportamento novo ou alterado de regras: atualizar primeiro [`specs/plugin-contract.md`](../specs/plugin-contract.md), depois o código em `packages/`.
- Mudanças apenas documentais podem ir em `docs/` e no README.

## Distribuição

- **npm**: o artefato publicável é o pacote sob `packages/`.
- **GitHub Actions**: consumidores podem referenciar `uses: ./.github/actions/ops-eslint` neste repositório ou o caminho publicado após release.

## Versionamento (agentes)

Fluxo normativo: [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md) e [`docs/versioning-for-agents.md`](versioning-for-agents.md). Agentes devem fazer commit e push ao concluir trabalho com alterações locais, salvo ausência de mudanças ou falha de push documentada.

## Documentação (agentes)

Fluxo normativo: [`specs/agent-documentation-workflow.md`](../specs/agent-documentation-workflow.md), política em [`documentation-policy.md`](documentation-policy.md) e grafo em [`repository-tree.md`](repository-tree.md). Qualquer mudança estrutural exige atualização do grafo e coerência com [`limitations-and-scope.md`](limitations-and-scope.md) e [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md) quando o escopo evoluir.
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Shell
