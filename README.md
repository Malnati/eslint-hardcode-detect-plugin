# eslint-hardcode-detect-plugin

Monorepo para o plugin ESLint **eslint-plugin-hardcode-detect**: detecção de strings hardcoded e padronização de mensagens de erro/log, com especificação explícita e material de referência arquivado separadamente.

## Documentação

- [`AGENTS.md`](AGENTS.md) — instruções para agentes de IA e colaboradores.
- [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras.
- [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — commit e push ao concluir trabalho (agentes).
- [`docs/architecture.md`](docs/architecture.md) — visão da arquitetura do repositório.
- [`docs/versioning-for-agents.md`](docs/versioning-for-agents.md) — resumo do fluxo de versionamento para agentes.

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) | Código-fonte npm do plugin. |
| [`reference/legacy-snapshot`](reference/legacy-snapshot) | Snapshot histórico (somente referência; não é dependência). |
| [`.github/actions/ops-eslint`](.github/actions/ops-eslint) | Composite GitHub Action para rodar ESLint em container. |
| [`.cursor/rules`](.cursor/rules) | Regras do Cursor para este projeto. |

## Licença

Veja [`LICENSE`](LICENSE).
