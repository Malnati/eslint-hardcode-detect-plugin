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

### Smoke reprodutível (T2) — build + run

Trilha **T2** (container/OCI): o repositório montado no container como em [`assets/run.sh`](../.github/actions/ops-eslint/assets/run.sh) (`-v <raiz>:/workspace`, `ESLINT_USE_FLAT_CONFIG=true`). Para alinhar ao `npm run lint` na raiz (lint do workspace `eslint-plugin-hardcode-detect`), use `--path packages/eslint-plugin-hardcode-detect`.

Na raiz do clone:

```bash
npm ci
```

```bash
docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .
```

Execução equivalente à Composite Action (recomendado; `--build-image false` evita rebuild após o passo anterior):

```bash
bash .github/actions/ops-eslint/assets/run.sh \
  --path packages/eslint-plugin-hardcode-detect \
  --build-image false
```

Por defeito o script grava o relatório JSON em `report_dir` / `report_file` relativos ao path analisado (valores padrão do script: `.eslint`, `eslint-report.json`), ou seja `packages/eslint-plugin-hardcode-detect/.eslint/eslint-report.json` no host após a execução.

**CI e T2:** o workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) **não** inclui hoje um step que invoque a action `ops-eslint`; o lint em CI corre no runner com `npm run lint`. O smoke T2 documentado acima é reprodutível localmente. Evolução da trilha **T3** (CI explícito) está planeada em [`docs/distribution-milestones/m2-channel-t3-ci.md`](../docs/distribution-milestones/m2-channel-t3-ci.md).

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
| [`docs/distribution-milestones/m0-baseline.md`](../docs/distribution-milestones/m0-baseline.md) secção 6 | Matriz e2e×Compose (planeamento M0) e handoff baseline e2e → T1 |

## Versão do documento

- **1.0.2** — secção smoke T2 (build + `run.sh`), relatório padrão e nota sobre CI vs trilha T3.
- **1.0.1** — remissão à matriz M0 (secção 6) para contexto de marcos e T1.
- **1.0.0** — contrato inicial: perfis dev/e2e/prod e imagem ops-eslint.
