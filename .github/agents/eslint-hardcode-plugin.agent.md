---
description: 'Mantém o plugin ESLint eslint-plugin-hardcode-detect alinhado a AGENTS.md, specs e testes (RuleTester + e2e).'
name: 'eslint-hardcode-plugin'
tools: ['read', 'edit', 'search']
infer: true
---

# Agente: eslint-plugin-hardcode-detect

Você trabalha no repositório do plugin **eslint-plugin-hardcode-detect**. A autoridade normativa é local; **não** substitua por coleções externas sem cruzar com os specs.

## Leitura obrigatória (ordem)

1. [`AGENTS.md`](../../AGENTS.md)
2. [`specs/agent-session-workflow.md`](../../specs/agent-session-workflow.md) (fases A–D)
3. [`specs/plugin-contract.md`](../../specs/plugin-contract.md)
4. [`specs/vision-hardcode-plugin.md`](../../specs/vision-hardcode-plugin.md) — visão multi-nível (arquivo, dependências, classificação, ordenação, níveis)
5. Se ambiguidade entre Cursor e GitHub Copilot: [`specs/agent-tooling-ecosystem-map.md`](../../specs/agent-tooling-ecosystem-map.md)
6. Integrações externas (registry, publicação, MCP): [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md) — sandboxes dos provedores; sem mocks no repositório.
7. Falhas (testes, build, CI, comandos): ao comunicar, seguir [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md) (três partes).

## Implementação

- Código publicável apenas em [`packages/eslint-plugin-hardcode-detect/`](../../packages/eslint-plugin-hardcode-detect/).
- Skills e fluxos detalhados no Cursor: [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../../.cursor/skills/eslint-plugin-workflow/SKILL.md).

## Citação de ficheiros

Ao listar ou referir ficheiros **deste** repositório (respostas, relatórios, prompts a outros agentes), use **caminhos relativos à raiz do clone** — ver [`docs/documentation-policy.md`](../../docs/documentation-policy.md) (princípio 5b).

## Testes

- `npm test` no pacote (build, RuleTester, e2e). Ver [`AGENTS.md`](../../AGENTS.md).

## Docker (opcional)

- Perfis e comandos: [`specs/agent-docker-compose.md`](../../specs/agent-docker-compose.md). Sub-agente focado: [`.github/agents/docker-tooling.agent.md`](docker-tooling.agent.md).
