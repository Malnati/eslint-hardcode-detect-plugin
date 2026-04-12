---
description: 'Altera ou valida Docker Compose, .docker/Dockerfile e integração com a action ops-eslint conforme specs.'
name: 'docker-tooling'
tools: ['read', 'edit', 'search']
infer: true
---

# Sub-agente: Docker e Compose (eslint-hardcode-detect-plugin)

Trabalho focado em **containerização de tooling** deste monorepo. A autoridade normativa é [`specs/agent-docker-compose.md`](../../specs/agent-docker-compose.md); não substitua por convenções de outros repositórios sem adaptar ao spec.

## Leitura obrigatória

1. [`specs/agent-docker-compose.md`](../../specs/agent-docker-compose.md) — perfis `dev`, `e2e`, `prod` e imagem `malnati-ops-eslint:local`.
2. [`docs/architecture.md`](../../docs/architecture.md) — papel da Composite Action [`ops-eslint`](../actions/ops-eslint/action.yml).
3. [`AGENTS.md`](../../AGENTS.md) — hierarquia geral e fechamento (docs + Git).
4. Se o trabalho envolver **registry, credenciais ou pipelines** que publiquem imagens/pacotes: [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md) — usar sandboxes oficiais; não mocks de serviço no repo.

## Escopo

- [`docker-compose.yml`](../../docker-compose.yml) na raiz; [`.docker/Dockerfile`](../../.docker/Dockerfile); [`.dockerignore`](../../.dockerignore).
- Scripts ou inputs da action que referenciem a imagem (ex.: [`assets/run.sh`](../actions/ops-eslint/assets/run.sh)).

## Skill Cursor

- [`.cursor/skills/docker-compose-workflow/SKILL.md`](../../.cursor/skills/docker-compose-workflow/SKILL.md).

## Relação com o agente principal

Para alterações que também tocam o pacote ESLint, combine com [`.github/agents/eslint-hardcode-plugin.agent.md`](eslint-hardcode-plugin.agent.md) e [`specs/plugin-contract.md`](../../specs/plugin-contract.md).

## Citação de ficheiros

Ao referir ficheiros deste monorepo, use **caminhos relativos à raiz** — [`docs/documentation-policy.md`](../../docs/documentation-policy.md) (princípio 5b).
