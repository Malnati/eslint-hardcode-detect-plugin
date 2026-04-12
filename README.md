# eslint-hardcode-detect-plugin

Monorepo para o plugin ESLint **eslint-plugin-hardcode-detect**: detecção de hardcodes em vários níveis (evoluindo de análise por arquivo para classificação, ordenação, severidade e visão sobre dependências), padronização de mensagens de erro/log e documentação normativa para agentes de IA.

## Documentação

- [`AGENTS.md`](AGENTS.md) — instruções para agentes de IA e colaboradores (prioridades e fluxos obrigatórios).
- [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) — governança consolidada para agentes de IA (checklists, grafo, Clippings, fechamento).
- [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md) — fluxo por prompt (escopo, Clippings, grafo, fechamento).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — como contribuir (inclui agentes).
- [`docs/README.md`](docs/README.md) — índice dos guias em `docs/`.
- [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras.
- [`specs/e2e-fixture-nest.md`](specs/e2e-fixture-nest.md) — massa e2e NestJS (workspace auxiliar).
- [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) — visão e roadmap (multi-nível).
- [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) — atualização de documentação ao concluir trabalho.
- [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md) — consulta e manutenção de trechos da documentação oficial em [`reference/Clippings/`](reference/Clippings/).
- [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — commit e push ao concluir trabalho.
- [`docs/repository-tree.md`](docs/repository-tree.md) — grafo de arquivos e diretórios.
- [`docs/hardcoding-map.md`](docs/hardcoding-map.md) — taxonomia e níveis de hardcoding (mapa conceitual).
- [`docs/documentation-policy.md`](docs/documentation-policy.md) — boas práticas Markdown no GitHub.
- [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) — limitações e restrições.
- [`docs/distribution-channels-macro-plan.md`](docs/distribution-channels-macro-plan.md) — plano macro por canal/trilha (e2e, Compose, marcos GitHub).
- [`docs/architecture.md`](docs/architecture.md) — arquitetura do repositório.
- [`docs/versioning-for-agents.md`](docs/versioning-for-agents.md) — versionamento Git para agentes.

## Comandos úteis (raiz do monorepo)

- `npm run lint` — ESLint do código do plugin (`eslint-plugin-eslint-plugin`, `eslint-plugin-n`).
- `npm test` — build + RuleTester (`tests/`) + fumaça e2e (`e2e/`) do workspace `eslint-plugin-hardcode-detect`.

### Docker Compose (perfis)

Normas e tabela de comandos: [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md).

- `docker compose --profile dev run --rm dev` — shell interativo com o repo em `/workspace`.
- `docker compose --profile e2e run --rm e2e` — `npm ci` e `npm test -w eslint-plugin-hardcode-detect`.
- `docker compose --profile prod run --rm prod` — `npm ci`, `npm run lint` e testes do plugin (verificação estilo CI).

Imagem só ESLint (Composite Action / `docker build -f .docker/Dockerfile`): tag padrão `malnati-ops-eslint:local`.

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) | Código-fonte npm do plugin (`tests/`, `e2e/`). |
| [`packages/e2e-fixture-nest`](packages/e2e-fixture-nest) | Workspace NestJS para fumaça e2e (massa controlada; ver spec). |
| [`reference/Clippings`](reference/Clippings) | Recortes da documentação oficial (consulta obrigatória em escopo ESLint/npm). |
| [`reference/legacy-snapshot`](reference/legacy-snapshot) | Snapshot histórico (somente referência; não é dependência). |
| [`.github/actions/ops-eslint`](.github/actions/ops-eslint) | Composite GitHub Action para rodar ESLint em container. |
| [`.cursor/rules`](.cursor/rules) | Regras do Cursor para este projeto (`alwaysApply`). |
| [`.cursor/commands`](.cursor/commands) | Comandos opcionais (`/abrir-prompt-agente`, `/fechar-prompt-agente`). |
| [`.cursor/skills`](.cursor/skills) | Skills reutilizáveis (workflow do plugin, docs, Git, Clippings, Docker Compose). |
| [`docker-compose.yml`](docker-compose.yml), [`.docker/`](.docker/) | Perfis dev/e2e/prod e imagem ops-eslint (ver [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md)). |

## Licença

Veja [`LICENSE`](LICENSE).
