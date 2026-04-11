# Contrato de documentação para agentes (Markdown / GitHub)

Este repositório é documentado para leitura em **GitHub** (README, guias em `docs/`, `CONTRIBUTING.md`, specs). Agentes de IA **devem** manter a documentação coerente com o código e com a árvore de diretórios ao **finalizar** cada prompt que produza ou exija mudanças relevantes. O encadeamento com abertura do prompt (escopo, Clippings, limites) está em [`agent-session-workflow.md`](agent-session-workflow.md).

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
4. Explicitar na resposta ao usuário **quais** documentos foram atualizados ou que nenhuma atualização foi necessária (e por quê).

## Grafo de repositório

A fonte normativa da árvore para humanos e agentes é [`docs/repository-tree.md`](../docs/repository-tree.md). Mudanças estruturais sem atualização desse arquivo são **incompletas**.

## Documentação oficial espelhada (`reference/Clippings`)

Quando o prompt tratar de API ESLint, regras, config ou empacotamento do plugin, os agentes devem seguir também [`agent-reference-clippings.md`](agent-reference-clippings.md): consultar `reference/Clippings/` no início e manter o índice/arquivos quando recortes novos forem necessários.

## Relação com versionamento Git

Alterações de documentação entram nos mesmos commits que o trabalho correspondente (preferencialmente) ou em commit subsequente na mesma sessão, seguindo [`specs/agent-git-workflow.md`](agent-git-workflow.md).

## Versão do documento

- **1.2.0** — referência explícita a [`agent-session-workflow.md`](agent-session-workflow.md) como orquestração da sessão.
- **1.1.0** — referência ao contrato de `reference/Clippings` e consulta em escopo ESLint/npm.
- **1.0.0** — introdução do contrato de documentação para agentes.
