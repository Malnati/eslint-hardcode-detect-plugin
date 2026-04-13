# Instruções para agentes (Cursor / CLI)

Este repositório é mantido por agentes de IA e humanos. Siga a ordem de autoridade abaixo.

## Hierarquia de fontes

0. [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) — **governança consolidada para agentes de IA**: checklists de abertura e fechamento, mapa de rules/skills/comandos, boas práticas OSS; complementa o fluxo por prompt. Instruções do portfólio em [`reference/agents-ref/`](reference/agents-ref/) devem ser cruzadas com [`specs/agent-reference-agents.md`](specs/agent-reference-agents.md) (aplicabilidade e substituições para este repo).
1. [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md) — **orquestração por prompt**: classificar escopo, consultar Clippings e limites antes de implementar, atualizar grafo e fechar com documentação + Git.
1a. [`specs/agent-error-messaging-triple.md`](specs/agent-error-messaging-triple.md) — **mensagens de falha em três partes** com prefixos obrigatórios `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]` (primeira linha de conteúdo de cada parte) e **Níveis 1–3** de conformidade (presença, contagens, análise); obrigatório ao relatar erros de ferramentas, testes, CI ou bloqueios.
1b. [`specs/agent-tooling-ecosystem-map.md`](specs/agent-tooling-ecosystem-map.md) — **mapeamento de ecossistemas** (GitHub Copilot / Awesome Copilot vs Cursor): pontes em `.github/`, precedência de instruções e anti-padrões ao usar coleções externas.
2. [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras ESLint e opções públicas.
3. [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) — visão e roadmap (hardcode multi-nível: arquivo, dependências, classificação, ordenação, níveis).
4. [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md) — **consulta e manutenção** de trechos da documentação oficial em [`reference/Clippings/`](reference/Clippings/) (por prompt, quando o escopo for relevante).
5. [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) — **obrigações de documentação** Markdown (GitHub) ao concluir trabalho relevante.
6. [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — **obrigações de Git** ao concluir trabalho com alterações locais.
6b. [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md) — **Docker Compose** (perfis dev/e2e/prod), [`.docker/Dockerfile`](.docker/Dockerfile) e relação com a action `ops-eslint`.
6c. [`specs/agent-integration-testing-policy.md`](specs/agent-integration-testing-policy.md) — **integrações externas** (registry, publicação, MCP, etc.): sem mocks no repositório; usar **sandboxes** ou ambientes de teste oficiais dos provedores.
7. [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) — **único** local de código-fonte do plugin publicável.
8. [`specs/e2e-fixture-nest.md`](specs/e2e-fixture-nest.md) — massa de testes e2e NestJS (workspace auxiliar [`packages/e2e-fixture-nest`](packages/e2e-fixture-nest); não publicável como o plugin).
9. [`docs/`](docs/) e [`README.md`](README.md) — documentação de arquitetura, políticas e índice.
10. [`reference/`](reference/) — somente leitura para código publicável; não é dependência de build nem de runtime. Subpastas: [`reference/Clippings/`](reference/Clippings/) (recortes oficiais), [`reference/legacy-snapshot/`](reference/legacy-snapshot/) (snapshot histórico).

## Regras obrigatórias

- **Não** importar, reexportar nem referenciar arquivos em `reference/` a partir de `packages/`, `eslint.config.*` de produção ou testes do pacote.
- **`reference/legacy-snapshot/`**: não alterar exceto em PR explícito de “atualização de snapshot” (título/descrição claros).
- **`reference/Clippings/`**: trechos da documentação oficial; adicionar ou atualizar em commits explícitos quando o trabalho depender dessa fonte (ver [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md)).
- Novas regras ou mudanças de comportamento: atualizar **primeiro** `specs/plugin-contract.md`, depois implementar em `packages/`.
- Preferir imports relativos dentro de `packages/eslint-plugin-hardcode-detect` conforme convenção do projeto.
- Ao citar ficheiros ou pastas **deste** repositório (respostas, documentação, prompts de delegação), usar **caminhos relativos à raiz do clone**, conforme [`docs/documentation-policy.md`](docs/documentation-policy.md) (princípio 5b e exceções).
- Após edições que afetem estilo ou tipos, corrija lints conforme configuração do pacote (quando existir).
- **Integrações** (npm/registry, publicação, MCP, credenciais de terceiros): seguir [`specs/agent-integration-testing-policy.md`](specs/agent-integration-testing-policy.md) — **não** introduzir mocks ou stubs de serviços externos; validar com **sandbox** ou documentação oficial do provedor.

## Versionamento Git (obrigatório ao concluir o prompt)

Ao **finalizar** o trabalho solicitado, depois de implementar ou documentar:

1. Siga o contrato em [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) e a skill [`.cursor/skills/git-agent-workflow/SKILL.md`](.cursor/skills/git-agent-workflow/SKILL.md).
2. Se houver mudanças locais: `git status` → `git add` (seletivo) → `git commit` com mensagem no formato **Conventional Commits** (ver [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md)) → `git push` para o remoto na branch atual.
3. Se não houver nada a commitar, declare explicitamente.
4. Se o push falhar (rede, permissões, branch protegida), relate o erro e deixe o commit local disponível.

Neste repositório, esta política **prevalece** sobre instruções genéricas de não usar `git commit`/`git push` fora de container.

## Documentação Markdown (obrigatória ao concluir o prompt)

Ao **finalizar** o trabalho (código, specs, CI ou governança):

1. Siga [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) e a skill [`.cursor/skills/github-markdown-docs/SKILL.md`](.cursor/skills/github-markdown-docs/SKILL.md).
2. Mantenha [`docs/repository-tree.md`](docs/repository-tree.md) alinhado à árvore real sempre que diretórios ou artefatos normativos mudarem.
3. Aplique [`docs/documentation-policy.md`](docs/documentation-policy.md) (links relativos, caminhos internos relativos à raiz, estrutura de títulos, cercas de código).
4. Atualize [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) ou [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) quando limites ou visão de produto mudarem.
5. Na resposta ao usuário, **liste** os arquivos de documentação alterados ou indique explicitamente que nenhuma atualização foi necessária.

## Mapa de diretórios

| Caminho | Responsabilidade |
|---------|------------------|
| `README.md`, `CONTRIBUTING.md` | Entrada GitHub e guia de contribuição. |
| `packages/eslint-plugin-hardcode-detect/` | Código e testes do plugin npm. |
| `packages/e2e-fixture-nest/` | Workspace NestJS **somente** para massa e2e (ver [`specs/e2e-fixture-nest.md`](specs/e2e-fixture-nest.md)); não é o pacote publicável do plugin. |
| `specs/` | Contrato, visão e fluxos normativos (incl. `agent-session-workflow.md` e demais contratos de agente). |
| `docs/` | Políticas, grafo do repositório e arquitetura; [`docs/cursor-vps-cli-parity.md`](docs/cursor-vps-cli-parity.md) (IDE vs Cursor CLI/VPS e smoke do hook HCD-ERR). |
| `reference/Clippings/` | Recortes da documentação oficial (ESLint, npm, etc.); consulta obrigatória em escopo relevante. |
| `reference/legacy-snapshot/` | Snapshot histórico; não usar como código vivo. |
| `.github/actions/ops-eslint/` | Composite Action para lint em Docker. |
| `.cursor/rules/` | Regras Cursor (`alwaysApply`): governança IA, sessão do agente, Clippings, documentação, Git, layout do repo, integrações sem mocks (`agent-integration-testing-policy.mdc`), caminhos relativos ao citar o repo (`repo-relative-paths.mdc`), falhas com prefixos HCD-ERR-* (`agent-error-messaging-triple.mdc`). |
| `.cursor/hooks.json` + `.cursor/hooks/` | Hooks Cursor de projeto: gate por regex + auditoria HCD-ERR (Níveis 1–2) quando há sinal de falha; registo em `.log/hooks/` (gitignored); `followup_message` sem Task. Ver [`specs/agent-error-messaging-triple.md`](specs/agent-error-messaging-triple.md), [`.github/agents/hcd-err-messaging.agent.md`](.github/agents/hcd-err-messaging.agent.md) e smoke [`scripts/smoke-cursor-hcd-err-hook.sh`](scripts/smoke-cursor-hcd-err-hook.sh) / [`docs/cursor-vps-cli-parity.md`](docs/cursor-vps-cli-parity.md). |
| `.cursor/skills/` | Skills reutilizáveis pelos agentes neste repo (`git-agent-workflow`, `github-markdown-docs`, `eslint-plugin-workflow`, `reference-clippings-workflow`, `reference-agents-portfolio`, `docker-compose-workflow`, `agent-error-messaging-triple`). |
| `.cursor/commands/` | Comandos opcionais (`/abrir-prompt-agente`, `/fechar-prompt-agente`, `/fechar-e2e-nest-fixture`) para checklist de sessão. |
| `docker-compose.yml`, `.docker/` | Compose com perfis dev/e2e/prod; imagem ESLint para `ops-eslint` (ver [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md)). |
| `.github/agents/`, `.github/instructions/` | Pontes opcionais para GitHub Copilot (`eslint-hardcode-plugin`, `docker-tooling`, `hcd-err-messaging`; instruções por glob); normas completas em `AGENTS.md` e `specs/` (ver [`specs/agent-tooling-ecosystem-map.md`](specs/agent-tooling-ecosystem-map.md)). |

## Fluxo sugerido de PR

1. Descrever mudança no spec (se aplicável).
2. Implementar e testar em `packages/`.
3. Atualizar documentação (`README.md`, `docs/`, `docs/repository-tree.md` se a árvore mudar) conforme [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md).
4. Versionar com Git conforme [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md).

## Testes

- Comando alvo: `npm test` no pacote (ver [`packages/eslint-plugin-hardcode-detect/package.json`](packages/eslint-plugin-hardcode-detect/package.json)).
- O mesmo comando executa, em sequência: build (`tsc`), testes com **RuleTester** em `tests/` e fumaça **e2e** em `e2e/` (API `ESLint` + fixture com flat config).
- Na raiz, workspaces npm: `npm test --workspace eslint-plugin-hardcode-detect` após instalação na raiz.

## Automação no Cursor / CLI

Neste repositório, “agente” não depende de um único arquivo de produto: a governança está em **`AGENTS.md`**, em **`specs/`** (incluindo [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md), [`specs/agent-tooling-ecosystem-map.md`](specs/agent-tooling-ecosystem-map.md) e [`specs/agent-reference-agents.md`](specs/agent-reference-agents.md) quando houver remissão a [`reference/agents-ref/`](reference/agents-ref/)), em **`.cursor/rules/`** (regras com `alwaysApply` carregadas pelo Cursor), em **`.cursor/skills/`** (procedimentos reutilizáveis), em **`.cursor/commands/`** (atalhos de checklist) e, opcionalmente, em **`.github/agents/`** e **`.github/instructions/`** para GitHub Copilot. O fio condutor por prompt é [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md). Ao criar novas regras ou skills, mantenha links relativos, cite ficheiros do projeto com caminhos relativos à raiz e atualize [`docs/repository-tree.md`](docs/repository-tree.md) se a árvore normativa mudar. Relatórios de **falha** seguem [`specs/agent-error-messaging-triple.md`](specs/agent-error-messaging-triple.md) (prefixos `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; Níveis 1–3).
