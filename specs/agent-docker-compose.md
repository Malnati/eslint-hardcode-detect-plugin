# Contrato: Docker Compose e perfis (dev / e2e / prod)

Este documento normatiza o uso de [`docker-compose.yml`](../docker-compose.yml), [`.docker/Dockerfile`](../.docker/Dockerfile) e a relação com [`.github/actions/ops-eslint`](../.github/actions/ops-eslint). **Não** substitui [`AGENTS.md`](../AGENTS.md) nem o fluxo por prompt em [`agent-session-workflow.md`](agent-session-workflow.md).

## Objetivo

- **Um único** `docker-compose.yml` na raiz com **perfis** (`profiles`) para desenvolvimento interativo, verificação focada em testes do pacote (incluindo fumaça e2e) e verificação estilo CI (lint + testes).
- Imagem **ops-eslint** (`.docker/Dockerfile`) dedicada ao ESLint em container, consumida pela Composite Action e identificada por tag padrão `malnati-ops-eslint:local` (ver `run.sh`).

## Serviços e perfis

| Perfil | Serviço | Comportamento |
|--------|---------|----------------|
| `dev` | `dev` | Shell interativo (`bash`) com o repositório montado em `/workspace`. O agente ou desenvolvedor executa `npm install` na raiz quando necessário e trabalha como no host. |
| `e2e` | `e2e` | `npm ci` seguido de `npm test -w eslint-plugin-hardcode-detect` (build, RuleTester e fumaça e2e, incluindo massa Nest conforme o pacote). |
| `prod` | `prod` | Verificação reprodutível tipo pipeline: `npm ci`, `npm run lint` (workspace) e `npm test -w eslint-plugin-hardcode-detect`. Variável `CI=true` para alinhar a ferramentas que mudam comportamento em CI. |

### Comandos esperados

Na raiz do repositório:

```bash
# Desenvolvimento interativo
docker compose --profile dev run --rm dev

# Testes do pacote (inclui e2e do plugin)
docker compose --profile e2e run --rm e2e

# Lint + testes (paridade com verificação “fechada”)
docker compose --profile prod run --rm prod
```

## Imagem ops-eslint (`.docker/Dockerfile`)

- **Propósito**: executar o binário `eslint` no container com workspace montado (relatório JSON, `--fix`, etc.), como em [`assets/run.sh`](../.github/actions/ops-eslint/assets/run.sh).
- **Build manual**: `docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .`
- **Não** substitui os serviços `dev` / `e2e` / `prod`, que usam `node:22-bookworm-slim` para instalar dependências do monorepo via `npm ci`.

## Obrigações para agentes de IA

1. **Alterar** [`docker-compose.yml`](../docker-compose.yml), [`.docker/Dockerfile`](../.docker/Dockerfile) ou [`.dockerignore`](../.dockerignore) apenas em alinhamento com este spec e com impacto documentado em [`docs/repository-tree.md`](../docs/repository-tree.md).
2. **Atualizar** este spec quando a semântica de um perfil mudar (comandos, variáveis de ambiente, imagens).
3. **Manter** a versão global de `eslint` na imagem ops-eslint coerente com a faixa usada no pacote (comentário no Dockerfile aponta para o bump conjunto).
4. Perfis **não** expõem portas: este repositório é biblioteca/plugin; não há servidor HTTP obrigatório no compose.

## Relação com outros artefatos

| Artefato | Função |
|----------|--------|
| [`.cursor/skills/docker-compose-workflow/SKILL.md`](../.cursor/skills/docker-compose-workflow/SKILL.md) | Procedimento resumido para agentes |
| [`.cursor/rules/docker-compose-tooling.mdc`](../.cursor/rules/docker-compose-tooling.mdc) | Escopo ao editar ficheiros Docker |
| [`.github/agents/docker-tooling.agent.md`](../.github/agents/docker-tooling.agent.md) | Ponte GitHub Copilot |
| [`docs/architecture.md`](../docs/architecture.md) | Visão de arquitetura incluindo Docker |

## Versão do documento

- **1.0.0** — contrato inicial: perfis dev/e2e/prod e imagem ops-eslint.
