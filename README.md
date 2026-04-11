# eslint-hardcode-detect-plugin

Monorepo para o plugin ESLint **eslint-plugin-hardcode-detect**: detecção de hardcodes em vários níveis (evoluindo de análise por arquivo para classificação, ordenação, severidade e visão sobre dependências), padronização de mensagens de erro/log e documentação normativa para agentes de IA.

## Documentação

- [`AGENTS.md`](AGENTS.md) — instruções para agentes de IA e colaboradores (prioridades e fluxos obrigatórios).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — como contribuir (inclui agentes).
- [`docs/README.md`](docs/README.md) — índice dos guias em `docs/`.
- [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras.
- [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) — visão e roadmap (multi-nível).
- [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) — atualização de documentação ao concluir trabalho.
- [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — commit e push ao concluir trabalho.
- [`docs/repository-tree.md`](docs/repository-tree.md) — grafo de arquivos e diretórios.
- [`docs/documentation-policy.md`](docs/documentation-policy.md) — boas práticas Markdown no GitHub.
- [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) — limitações e restrições.
- [`docs/architecture.md`](docs/architecture.md) — arquitetura do repositório.
- [`docs/versioning-for-agents.md`](docs/versioning-for-agents.md) — versionamento Git para agentes.

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) | Código-fonte npm do plugin. |
| [`reference/legacy-snapshot`](reference/legacy-snapshot) | Snapshot histórico (somente referência; não é dependência). |
| [`.github/actions/ops-eslint`](.github/actions/ops-eslint) | Composite GitHub Action para rodar ESLint em container. |
| [`.cursor/rules`](.cursor/rules) | Regras do Cursor para este projeto. |

## Licença

Veja [`LICENSE`](LICENSE).
