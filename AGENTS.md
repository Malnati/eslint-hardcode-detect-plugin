# Instruções para agentes (Cursor / CLI)

Este repositório é mantido por agentes de IA e humanos. Siga a ordem de autoridade abaixo.

## Hierarquia de fontes

0. [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md) — **orquestração por prompt**: classificar escopo, consultar Clippings e limites antes de implementar, atualizar grafo e fechar com documentação + Git.
1. [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras ESLint e opções públicas.
2. [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) — visão e roadmap (hardcode multi-nível: arquivo, dependências, classificação, ordenação, níveis).
3. [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md) — **consulta e manutenção** de trechos da documentação oficial em [`reference/Clippings/`](reference/Clippings/) (por prompt, quando o escopo for relevante).
4. [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) — **obrigações de documentação** Markdown (GitHub) ao concluir trabalho relevante.
5. [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — **obrigações de Git** ao concluir trabalho com alterações locais.
6. [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) — **único** local de código-fonte do plugin publicável.
7. [`docs/`](docs/) e [`README.md`](README.md) — documentação de arquitetura, políticas e índice.
8. [`reference/`](reference/) — somente leitura para código publicável; não é dependência de build nem de runtime. Subpastas: [`reference/Clippings/`](reference/Clippings/) (recortes oficiais), [`reference/legacy-snapshot/`](reference/legacy-snapshot/) (snapshot histórico).

## Regras obrigatórias

- **Não** importar, reexportar nem referenciar arquivos em `reference/` a partir de `packages/`, `eslint.config.*` de produção ou testes do pacote.
- **`reference/legacy-snapshot/`**: não alterar exceto em PR explícito de “atualização de snapshot” (título/descrição claros).
- **`reference/Clippings/`**: trechos da documentação oficial; adicionar ou atualizar em commits explícitos quando o trabalho depender dessa fonte (ver [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md)).
- Novas regras ou mudanças de comportamento: atualizar **primeiro** `specs/plugin-contract.md`, depois implementar em `packages/`.
- Preferir imports relativos dentro de `packages/eslint-plugin-hardcode-detect` conforme convenção do projeto.
- Após edições que afetem estilo ou tipos, corrija lints conforme configuração do pacote (quando existir).

## Versionamento Git (obrigatório ao concluir o prompt)

Ao **finalizar** o trabalho solicitado, depois de implementar ou documentar:

1. Siga o contrato em [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) e a skill [`.cursor/skills/git-agent-workflow/SKILL.md`](.cursor/skills/git-agent-workflow/SKILL.md).
2. Se houver mudanças locais: `git status` → `git add` (seletivo) → `git commit` com mensagem clara → `git push` para o remoto na branch atual.
3. Se não houver nada a commitar, declare explicitamente.
4. Se o push falhar (rede, permissões, branch protegida), relate o erro e deixe o commit local disponível.

Neste repositório, esta política **prevalece** sobre instruções genéricas de não usar `git commit`/`git push` fora de container.

## Documentação Markdown (obrigatória ao concluir o prompt)

Ao **finalizar** o trabalho (código, specs, CI ou governança):

1. Siga [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) e a skill [`.cursor/skills/github-markdown-docs/SKILL.md`](.cursor/skills/github-markdown-docs/SKILL.md).
2. Mantenha [`docs/repository-tree.md`](docs/repository-tree.md) alinhado à árvore real sempre que diretórios ou artefatos normativos mudarem.
3. Aplique [`docs/documentation-policy.md`](docs/documentation-policy.md) (links relativos, estrutura de títulos, cercas de código).
4. Atualize [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) ou [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) quando limites ou visão de produto mudarem.
5. Na resposta ao usuário, **liste** os arquivos de documentação alterados ou indique explicitamente que nenhuma atualização foi necessária.

## Mapa de diretórios

| Caminho | Responsabilidade |
|---------|------------------|
| `README.md`, `CONTRIBUTING.md` | Entrada GitHub e guia de contribuição. |
| `packages/eslint-plugin-hardcode-detect/` | Código e testes do plugin npm. |
| `specs/` | Contrato, visão e fluxos normativos (incl. `agent-session-workflow.md` e demais contratos de agente). |
| `docs/` | Políticas, grafo do repositório e arquitetura. |
| `reference/Clippings/` | Recortes da documentação oficial (ESLint, npm, etc.); consulta obrigatória em escopo relevante. |
| `reference/legacy-snapshot/` | Snapshot histórico; não usar como código vivo. |
| `.github/actions/ops-eslint/` | Composite Action para lint em Docker. |
| `.cursor/rules/` | Regras Cursor (`alwaysApply`): sessão do agente, Clippings, documentação, Git, layout do repo. |
| `.cursor/skills/` | Skills reutilizáveis pelos agentes neste repo (`git-agent-workflow`, `github-markdown-docs`, `eslint-plugin-workflow`, `reference-clippings-workflow`). |

## Fluxo sugerido de PR

1. Descrever mudança no spec (se aplicável).
2. Implementar e testar em `packages/`.
3. Atualizar documentação (`README.md`, `docs/`, `docs/repository-tree.md` se a árvore mudar) conforme [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
4. Versionar com Git conforme [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md).

## Testes

- Comando alvo: `npm test` no pacote (ver [`packages/eslint-plugin-hardcode-detect/package.json`](packages/eslint-plugin-hardcode-detect/package.json)).
- Na raiz, workspaces npm: `npm test --workspace eslint-plugin-hardcode-detect` após instalação na raiz.

## Automação no Cursor / CLI

Neste repositório, “agente” não depende de um único arquivo de produto: a governança está em **`AGENTS.md`**, em **`specs/`** (contratos por tema), em **`.cursor/rules/`** (regras com `alwaysApply` carregadas pelo Cursor) e em **`.cursor/skills/`** (procedimentos reutilizáveis). O fio condutor por prompt é [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md). Ao criar novas regras ou skills, mantenha links relativos e atualize [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore normativa mudar.
