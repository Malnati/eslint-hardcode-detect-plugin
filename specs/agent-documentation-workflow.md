# Contrato de documentação para agentes (Markdown / GitHub)

Este repositório é documentado para leitura em **GitHub** (README, guias em `docs/`, `CONTRIBUTING.md`, specs). Agentes de IA **devem** manter a documentação coerente com o código e com a árvore de diretórios ao **finalizar** cada prompt que produza ou exija mudanças relevantes. O encadeamento com abertura do prompt (escopo, Clippings, limites) está em [`agent-session-workflow.md`](agent-session-workflow.md) e nos checklists de [`agent-ia-governance.md`](agent-ia-governance.md).

## Quando aplicar

- Ao concluir trabalho que altere comportamento do plugin, estrutura de pastas, políticas de governança, CI ou contratos em `specs/`.
- Se apenas documentação for solicitada, este contrato ainda rege forma e local dos arquivos.

## Procedimento obrigatório (fim do prompt)

1. Identificar leitores: mantenedores, usuários do npm, contribuidores no GitHub.
2. Atualizar os documentos impactados, seguindo [`docs/documentation-policy.md`](../docs/documentation-policy.md):
   - [`README.md`](../README.md) — visão geral e links estáveis.
   - [`docs/repository-tree.md`](../docs/repository-tree.md) — **sempre que a árvore de diretórios mudar** (novo pacote, nova pasta, remoção).
   - [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) — se limites, escopo ou restrições mudarem.
   - [`specs/`](../specs/) — contrato e visão alinhados ao código.
   - [`CONTRIBUTING.md`](../CONTRIBUTING.md) — se o fluxo de contribuição ou checagens mudarem.
3. Garantir links relativos corretos entre arquivos do repositório (evitar URLs quebradas para paths internos).
4. Garantir que **menções textuais** a ficheiros e pastas internas (fora de links Markdown) usem **caminhos relativos à raiz** ao referir artefatos deste repo, conforme [`docs/documentation-policy.md`](../docs/documentation-policy.md) (princípio 5b e exceções).
5. Explicitar na resposta ao usuário **quais** documentos foram atualizados ou que nenhuma atualização foi necessária (e por quê).

## Grafo de repositório

A fonte normativa da árvore para humanos e agentes é [`docs/repository-tree.md`](../docs/repository-tree.md). Mudanças estruturais sem atualização desse arquivo são **incompletas**.

## Documentação oficial espelhada (`reference/Clippings`)

Quando o prompt tratar de API ESLint, regras, config ou empacotamento do plugin, os agentes devem seguir também [`agent-reference-clippings.md`](agent-reference-clippings.md): consultar `reference/Clippings/` no início e manter o índice/arquivos quando recortes novos forem necessários.

## Relação com versionamento Git

Alterações de documentação entram nos mesmos commits que o trabalho correspondente (preferencialmente) ou em commit subsequente na mesma sessão, seguindo [`specs/agent-git-workflow.md`](agent-git-workflow.md), incluindo o formato **Conventional Commits** para a mensagem.

## Versão do documento

- **1.5.0** — procedimento: menções a paths internos relativos à raiz; alinhamento ao princípio 5b de [`documentation-policy.md`](../docs/documentation-policy.md).
- **1.4.0** — remissão explícita a Conventional Commits na relação com versionamento Git.
- **1.3.0** — referência a [`agent-ia-governance.md`](agent-ia-governance.md) para checklists de abertura e fechamento.
- **1.2.0** — referência explícita a [`agent-session-workflow.md`](agent-session-workflow.md) como orquestração da sessão.
- **1.1.0** — referência ao contrato de `reference/Clippings` e consulta em escopo ESLint/npm.
- **1.0.0** — introdução do contrato de documentação para agentes.
