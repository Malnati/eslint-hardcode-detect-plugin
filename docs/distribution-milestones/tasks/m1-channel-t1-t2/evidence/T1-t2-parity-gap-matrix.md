# Evidência M1 — matriz paridade T1 × T2

Marco M1 · âncoras [`../A1-npm-matrix-t1.md`](../A1-npm-matrix-t1.md), [`../A2-smoke-ops-eslint-image.md`](../A2-smoke-ops-eslint-image.md)

**Propósito:** registar o que deve permanecer **alinhado** entre a trilha **T1** (consumidor npm / `npm test` / e2e no workspace do plugin) e a trilha **T2** (imagem ops-eslint, Composite Action, eventual perfil `e2e-ops`). Preencher durante as micro-tarefas M1-A1-02, M1-A2-02 e M1-A2-03.

**Critérios por linha T1 (baseline):** [`../micro/M1-A1-02-criterios-por-linha-npm.md`](../micro/M1-A1-02-criterios-por-linha-npm.md).

| Dimensão | T1 (npm / CI atual) | T2 (Docker / ops-eslint) | Estado |
|----------|---------------------|---------------------------|--------|
| Versão do ESLint global vs workspace | `eslint` ^9.18.0 em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json); versões concretas em [`package-lock.json`](../../../../../package-lock.json) na raiz. CI: Node 22, `npm install` (`.github/workflows/ci.yml`). | `eslint@9.18.0` instalado globalmente na imagem (comentário de alinhamento em [`.docker/Dockerfile`](../../../../../.docker/Dockerfile)). | Alinhado na baseline M1 — rever ao bump de ESLint nos dois lados. |
| Resolução do plugin | Workspaces npm na raiz (`packages/*`); plugin em [`packages/eslint-plugin-hardcode-detect`](../../../../../packages/eslint-plugin-hardcode-detect); resolução via `node_modules` do monorepo após `npm install` na raiz. | Mesmo código montado em `/workspace` (checkout); `eslint` na imagem invoca o CLI; configs e plugins conforme paths do repositório montado. | Alinhado (mesmo repositório); T2 ainda sem matriz `npx`/`npm exec` dedicada no CI (ver linhas *Planejado* em M1-A1-02). |
| Flat config | Ficheiros `eslint.config.mjs` nas fixtures e2e ([`packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/), [`packages/e2e-fixture-nest/`](../../../../../packages/e2e-fixture-nest/)); API `ESLint` nos testes e2e. | `ENV ESLINT_USE_FLAT_CONFIG=true` no [`.docker/Dockerfile`](../../../../../.docker/Dockerfile); [`assets/run.sh`](../../../../../.github/actions/ops-eslint/assets/run.sh) da Composite Action [`ops-eslint`](../../../../../.github/actions/ops-eslint/). | Alinhado; smoke T2 reprodutível (M1-A2-02); critérios de paridade T1↔T2 normativos em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) (M1-A2-03). |
| Comando de fumo reprodutível | `npm test -w eslint-plugin-hardcode-detect` (e pipeline completo do job `test` em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml)). | `docker build` + execução documentada em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) e action `ops-eslint` (M1-A2-*). | Parcial — T1 coberto no CI; T2 documentado localmente; CI ainda sem step `ops-eslint` (trilha T3). |

## Conclusão M1-A2-03 (checklist DoD)

Nota explícita do que deve **coincidir** entre T1 e T2 ao comparar resultados (mesmo commit do plugin e mesma flat config esperada):

- **Versão do ESLint** — alinhamento entre `eslint` no workspace / lockfile e `eslint` global na imagem ops-eslint (ver linha da tabela e [`.docker/Dockerfile`](../../../../../.docker/Dockerfile)).
- **Resolução do plugin** — mesmo monorepo e `node_modules` coerentes após `npm ci` no host; T2 monta esse checkout em `/workspace`.
- **Ficheiros de config** — flat config ativa (`ESLINT_USE_FLAT_CONFIG=true`) e os mesmos paths/`eslint.config.*` que o lint npm usa para `packages/eslint-plugin-hardcode-detect` quando se segue o smoke com `--path` documentado.

Fonte normativa do smoke e da paridade: secção **Smoke reprodutível (T2)** e subsecção **Paridade T1↔T2 (versão e config)** em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md). Handoff do marco: [`docs/distribution-milestones/m1-channel-t1-t2.md`](../../../m1-channel-t1-t2.md) §2.

## Notas

- **Drift:** qualquer divergência não intencional entre linhas da tabela deve gerar correção de doc ou de infra na mesma onda do marco M1.
- **Perfil `e2e-ops`:** enquanto não existir em [`docker-compose.yml`](../../../../../docker-compose.yml), a coluna T2 pode referir apenas imagem manual + action, sem serviço Compose dedicado.
