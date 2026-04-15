# Contrato: Docker Compose e perfis (dev / e2e / prod / e2e-ops)

Este documento normatiza o uso de [`docker-compose.yml`](../docker-compose.yml), [`.docker/Dockerfile`](../.docker/Dockerfile) e a relação com [`.github/actions/ops-eslint`](../.github/actions/ops-eslint). **Não** substitui [`AGENTS.md`](../AGENTS.md) nem o fluxo por prompt em [`agent-session-workflow.md`](agent-session-workflow.md).

## Objetivo

- **Um único** `docker-compose.yml` na raiz com **perfis** (`profiles`) para desenvolvimento interativo, verificação focada em testes do pacote (incluindo fumaça e2e), verificação estilo CI (lint + testes) e lint via imagem **ops-eslint** (perfil `e2e-ops`).
- Imagem **ops-eslint** (`.docker/Dockerfile`) dedicada ao ESLint em container, consumida pela Composite Action e identificada por tag padrão `malnati-ops-eslint:local` (ver `run.sh`).

## Serviços e perfis

| Perfil | Serviço | Comportamento |
|--------|---------|----------------|
| `dev` | `dev` | Shell interativo (`bash`) com o repositório montado em `/workspace`. O agente ou desenvolvedor executa `npm install` na raiz quando necessário e trabalha como no host. |
| `e2e` | `e2e` | `npm ci` seguido de `npm test -w eslint-plugin-hardcode-detect` (build, RuleTester e fumaça e2e, incluindo massa Nest conforme o pacote). A fase e2e do pacote corre `npm install` no consumidor [`e2e-registry-consumer/`](../e2e-registry-consumer/) para obter `eslint-plugin-hardcode-detect@latest` do registry — o contentor precisa de **rede** para o npm. |
| `prod` | `prod` | Verificação reprodutível tipo pipeline: `npm ci`, `npm run lint` (workspace) e `npm test -w eslint-plugin-hardcode-detect`. Variável `CI=true` para alinhar a ferramentas que mudam comportamento em CI. |
| `e2e-ops` | `e2e-ops` | ESLint na imagem `malnati-ops-eslint:local` com o repositório montado em `/workspace`; `working_dir` em `packages/eslint-plugin-hardcode-detect`, relatório JSON em `.eslint/eslint-report.json` (paridade com **Smoke reprodutível (T2)**). Requer `npm ci` no host e imagem pré-construída (ver secção **`e2e-ops`** abaixo). |

### Comandos esperados

Na raiz do repositório:

```bash
# Desenvolvimento interativo
docker compose --profile dev run --rm dev

# Testes do pacote (inclui e2e do plugin)
docker compose --profile e2e run --rm e2e

# Lint + testes (paridade com verificação “fechada”)
docker compose --profile prod run --rm prod

# ESLint na imagem ops-eslint (trilha T2; após npm ci no host e build da imagem)
docker compose --profile e2e-ops run --rm e2e-ops
```

### Perfil `e2e-ops` (volume + imagem ops-eslint)

**Estado:** o perfil **`e2e-ops`** e o serviço homónimo estão definidos em [`docker-compose.yml`](../docker-compose.yml). Alinham o Compose à matriz M1 ([`docs/distribution-milestones/m1-channel-t1-t2.md`](../docs/distribution-milestones/m1-channel-t1-t2.md) §6): trilha **T2** com montagem do repositório e execução de ESLint na imagem **ops-eslint**, por oposição aos perfis `dev` / `e2e` / `prod` que usam `node:22-bookworm-slim` com `npm ci`.

**Função:** montar o clone em `/workspace` e correr `eslint` com a imagem construída a partir de [`.docker/Dockerfile`](../.docker/Dockerfile) (tag padrão `malnati-ops-eslint:local`), com o mesmo resultado de relatório que [`assets/run.sh`](../.github/actions/ops-eslint/assets/run.sh) para `--path packages/eslint-plugin-hardcode-detect`. O serviço Compose **não** invoca `run.sh` dentro do container (esse script chama `docker run` e exigiria Docker-in-Docker); em vez disso, corre `eslint` diretamente no container com `working_dir` em `packages/eslint-plugin-hardcode-detect`.

**Pré-requisitos** (iguais em intenção ao smoke T2 na secção seguinte):

- Na raiz do clone: `npm ci` no host para que `node_modules` e fontes sob o mount coincidam com a trilha T1.
- Imagem local: `docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .` (ou imagem já presente com a mesma tag).
- `ESLINT_USE_FLAT_CONFIG=true` e path de análise alinhado a `npm run lint` para o pacote (`packages/eslint-plugin-hardcode-detect`; ver **Smoke reprodutível (T2)** abaixo).

**Comando:**

```bash
docker compose --profile e2e-ops run --rm e2e-ops
```

**Implementação no Compose:**

- `volumes`: `.:/workspace` (paridade de árvore com o host).
- `working_dir`: `/workspace/packages/eslint-plugin-hardcode-detect` (equivalente ao `--path` do `run.sh`).
- `image`: `malnati-ops-eslint:local` (não a imagem Node dos perfis `dev` / `e2e` / `prod`).
- `entrypoint` / `command`: shell que cria `.eslint` e executa `eslint --format json --output-file .eslint/eslint-report.json .` (mesmos defaults de relatório que o smoke com `run.sh`).

## Imagem ops-eslint (`.docker/Dockerfile`)

- **Propósito**: executar o binário `eslint` no container com workspace montado (relatório JSON, `--fix`, etc.), como em [`assets/run.sh`](../.github/actions/ops-eslint/assets/run.sh).
- **Build manual**: `docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .`
- **Não** substitui os serviços `dev` / `e2e` / `prod`, que usam `node:22-bookworm-slim` para instalar dependências do monorepo via `npm ci`. O perfil `e2e-ops` usa esta imagem apenas para ESLint, com dependências resolvidas via mount após `npm ci` no host.

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

#### Paridade T1↔T2 (versão e config)

Handoff do marco M1 ([`docs/distribution-milestones/m1-channel-t1-t2.md`](../docs/distribution-milestones/m1-channel-t1-t2.md) §2): T1 (consumidor npm no monorepo) e T2 (imagem ops-eslint com o mesmo repositório montado) devem ser **rastreáveis ao mesmo commit** e à **mesma superfície de config** esperada. O que deve coincidir:

- **Mesmo checkout / mesma árvore:** a trilha T1 usa o monorepo após `npm ci` na raiz; a T2 monta esse **mesmo** clone em `/workspace`. Não há paridade se o host analisar um commit e o volume montado for outro (ou um tarball desalinhado).
- **Versão do ESLint:** o `eslint` instalado globalmente na imagem ([`.docker/Dockerfile`](../.docker/Dockerfile), alinhado ao comentário de bump conjunto) deve manter-se coerente com a faixa e as versões concretas do workspace em [`packages/eslint-plugin-hardcode-detect/package.json`](../packages/eslint-plugin-hardcode-detect/package.json) e [`package-lock.json`](../package-lock.json) na raiz (ver também o item 3 em **Obrigações para agentes de IA** abaixo).
- **Resolução do plugin:** em T1 o pacote resolve via `node_modules` do monorepo; em T2 o container lê o **mesmo** `node_modules` e fontes através do mount — o fluxo de smoke documentado inclui `npm ci` no host antes do `run.sh` para garantir essa resolução.
- **Flat config:** a imagem define `ESLINT_USE_FLAT_CONFIG=true`; os ficheiros `eslint.config.*` e o `--path` passado ao [`assets/run.sh`](../.github/actions/ops-eslint/assets/run.sh) devem corresponder ao que `npm run lint` usa para `packages/eslint-plugin-hardcode-detect`.

Matriz de evidência (estado por dimensão): [`docs/distribution-milestones/tasks/m1-channel-t1-t2/evidence/T1-t2-parity-gap-matrix.md`](../docs/distribution-milestones/tasks/m1-channel-t1-t2/evidence/T1-t2-parity-gap-matrix.md).

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

- **1.0.5** — perfil **`e2e-ops`** implementado em [`docker-compose.yml`](../docker-compose.yml); tabela de serviços; secção renomeada e estado atualizado; nota sobre não usar `run.sh` dentro do Compose (evitar Docker-in-Docker).
- **1.0.4** — subsecção **Perfil planeado: `e2e-ops`** (pré-requisitos, comando-alvo `docker compose --profile e2e-ops run --rm e2e-ops`, estado não implementado no Compose; remissão M1 §6).
- **1.0.3** — subsecção **Paridade T1↔T2 (versão e config)** e remissão à matriz de evidência M1.
- **1.0.2** — secção smoke T2 (build + `run.sh`), relatório padrão e nota sobre CI vs trilha T3.
- **1.0.1** — remissão à matriz M0 (secção 6) para contexto de marcos e T1.
- **1.0.0** — contrato inicial: perfis dev/e2e/prod e imagem ops-eslint.
