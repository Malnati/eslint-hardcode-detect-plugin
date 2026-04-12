---
description: 'docker-compose e .docker/ — perfis dev/e2e/prod e imagem ops-eslint alinhados ao spec.'
applyTo: 'docker-compose*.yml,.docker/**/*'
---

# Docker Compose e `.docker/` (instruções do repositório)

Ponte curta: a fonte normativa é [`specs/agent-docker-compose.md`](../../specs/agent-docker-compose.md).

1. Perfis `dev`, `e2e` e `prod` em [`docker-compose.yml`](../../docker-compose.yml) devem manter a semântica documentada no spec (comandos e variáveis).
2. [`.docker/Dockerfile`](../../.docker/Dockerfile) alimenta a Composite Action [`ops-eslint`](../actions/ops-eslint/action.yml); o entrypoint é `eslint`, tag padrão `malnati-ops-eslint:local`.
3. Alterações estruturais exigem atualização de [`docs/repository-tree.md`](../../docs/repository-tree.md) e fechamento conforme [`specs/agent-documentation-workflow.md`](../../specs/agent-documentation-workflow.md).
4. Ao citar ficheiros do repositório, use **caminhos relativos à raiz** — [`docs/documentation-policy.md`](../../docs/documentation-policy.md) (princípio 5b).
5. Publicação de imagens ou integração com registry: [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md) — sandboxes dos provedores; sem mocks no repositório.
6. Falhas (compose, build de imagem, CI): ao relatar, [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md).
