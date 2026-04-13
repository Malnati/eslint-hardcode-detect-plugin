---
name: docker-compose-workflow
description: >-
  Docker Compose na raiz (perfis dev, e2e, prod, e2e-ops), imagem .docker/Dockerfile para ops-eslint e alinhamento
  com specs/agent-docker-compose.md. Use quando o pedido envolver docker-compose, Dockerfile do repo ou
  Composite Action ops-eslint. Keywords: Docker, compose, perfil dev e2e prod e2e-ops, malnati-ops-eslint.
---

# Workflow Docker (este repositório)

## Quando usar

- Editar ou validar [`docker-compose.yml`](../../../docker-compose.yml), [`.docker/Dockerfile`](../../../.docker/Dockerfile) ou [`.dockerignore`](../../../.dockerignore).
- Explicar como rodar desenvolvimento ou testes em container alinhados ao monorepo.

## Fonte normativa

1. [`specs/agent-docker-compose.md`](../../../specs/agent-docker-compose.md) — perfis, comandos e obrigações.
2. [`docs/architecture.md`](../../../docs/architecture.md) — papel da imagem ops-eslint e da action.

## Checklist rápido

- [ ] Perfis `dev`, `e2e`, `prod` e `e2e-ops` permanecem com a semântica documentada no spec (ajuste o spec se mudar).
- [ ] Bump de `eslint` global no `.docker/Dockerfile` acompanhado de comentário e, se aplicável, coerência com `packages/eslint-plugin-hardcode-detect/package.json`.
- [ ] Após mudança estrutural: [`docs/repository-tree.md`](../../../docs/repository-tree.md) e resposta ao utilizador listando docs tocados (caminhos relativos à raiz ao citar ficheiros — [`docs/documentation-policy.md`](../../../docs/documentation-policy.md)).

## Comandos de referência

Ver tabela e exemplos em [`specs/agent-docker-compose.md`](../../../specs/agent-docker-compose.md#comandos-esperados).
