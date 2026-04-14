# M1-A1-02: Critérios por linha npm (matriz T1)

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M1-A1-02 |
| milestone | M1 |
| depends_on | M1-A1-01 |
| blocks | M1-A1-03 |
| plan_requirements | `m1-sec4-order-1`, `m1-sec7-A1`, `m1-sec10-done-t1` |

## Objetivo

Definir **critérios de sucesso reprodutíveis** por linha da matriz T1 (ex.: projeto único com `npm ci`; monorepo/workspace; invocação via `npx eslint` / `npm exec` com resolução do plugin).

## Definition of done

- Para cada linha priorizada: comando ou referência ao job CI / `npm test` do workspace do plugin; **código de saída** do processo e verificação mínima (ex.: sem regressão nas regras contratuais).
- Ligação à evidência de gaps em [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md) quando houver lacunas documentadas.

## Paths principais

- `packages/eslint-plugin-hardcode-detect/package.json`
- `.github/workflows/ci.yml`

## Âncoras

- Inventário de linhas T1 e estados: [`M1-A1-01-inventario-matriz-t1-macro-plan.md`](M1-A1-01-inventario-matriz-t1-macro-plan.md).
- Tarefa agregada A1: [`../A1-npm-matrix-t1.md`](../A1-npm-matrix-t1.md).
- Tabelas mestre de canais: [`docs/distribution-channels-macro-plan.md`](../../../../distribution-channels-macro-plan.md), [`docs/solution-distribution-channels.md`](../../../../solution-distribution-channels.md).

## Baseline técnica (repositório atual)

- **Instalação:** na raiz do monorepo, após `git clone`, executar `npm install` (como no CI) ou `npm ci` quando existir [`package-lock.json`](../../../../../package-lock.json) na raiz e se pretender instalação estritamente reprodutível ao lockfile.
- **Teste do plugin (trilha T1):** `npm test -w eslint-plugin-hardcode-detect` ou, equivalentemente na raiz, `npm test` (ver [`package.json`](../../../../../package.json)).
- **Script `test` do pacote:** em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) — `build` (`tsc`) seguido de `node --test` sobre RuleTester e ficheiros e2e (`tests/index.test.mjs`, `e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs`).
- **CI:** job `test` em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) — `Install` → `Validate distribution milestone plan coverage` → `Lint workspace` → `Test workspace`.

## Critérios por linha T1

Cada linha corresponde ao inventário em M1-A1-01. **Sucesso** para linhas *Parcial*: fluxo completo abaixo termina com **código de saída 0** e as verificações mínimas satisfeitas. Para espelhar o **mesmo** pipeline que o CI, na raiz: `npm install` → `npm run lint` → `npm test -w eslint-plugin-hardcode-detect` (todos com exit `0`).

| Canal T1 | Comando(s) reprodutíveis | Evidência CI / job | Código de saída | Verificação mínima | Estado / lacuna |
|----------|---------------------------|--------------------|-----------------|-------------------|-----------------|
| **npm (projeto)** | Raiz: `npm install` (ou `npm ci`) → `npm test -w eslint-plugin-hardcode-detect`. A massa consumidora Nest vive em [`packages/e2e-fixture-nest/`](../../../../../packages/e2e-fixture-nest/); o e2e [`nest-workspace.e2e.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) usa API `ESLint` com `cwd` nesse workspace (ver [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md)). | [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml): job `test`, step **Test workspace** (`npm test -w eslint-plugin-hardcode-detect`). | `0` | `tsc` sem erro; RuleTester em [`packages/eslint-plugin-hardcode-detect/tests/`](../../../../../packages/eslint-plugin-hardcode-detect/tests/); e2e hello-world + Nest conforme `package.json` do plugin; comportamento alinhado a [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) (sem regressão de regras contratuais). | **Parcial** — coberto pelo workspace; projeto npm *isolado* fora deste monorepo não tem smoke dedicado no repo. |
| **npm workspaces / monorepo** | Igual à linha anterior: instalação na **raiz** (`workspaces: ["packages/*"]` em [`package.json`](../../../../../package.json)); depois `npm test -w eslint-plugin-hardcode-detect`. | Mesmo job `test`; **Install** usa `npm install` na raiz. | `0` | Idem; confirma que o plugin e a fixture Nest resolvem como workspaces irmãos após install na raiz. | **Parcial** — é o cenário atual do repositório. |
| **npm global + `bin`** | *Não aplicável* no repo até existir entrada `bin` no pacote publicável e smoke/CI dedicados (ver M1-A1-01). | — | — | Quando implementado: exit `0` após invocar o executável documentado contra uma fixture mínima; alinhamento a `specs/plugin-contract.md`. | **Planejado** — lacuna: [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md); detalhe de backlog em M1-A1-03. |
| **`npm exec` / `npx`** | *Não aplicável* no repo até existir job ou script que execute `npx eslint` / `npm exec` com resolução explícita do plugin (macro-plan). | — | — | Quando implementado: exit `0` e diagnósticos coerentes com a mesma config/regras que a baseline `npm test -w …`. | **Planejado** — lacuna: [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md). |
| **Registries privados / `publishConfig`** | *Não aplicável* como matriz reprodutível **neste** clone; política de integrações sem mocks: [`specs/agent-integration-testing-policy.md`](../../../../../specs/agent-integration-testing-policy.md). | — | — | Evidência futura via sandbox/registry de teste documentado (fora do escopo do critério de linha npm local). | **Planejado** — lacuna e backlog: evidência acima e M1-A1-03. |

### Notas

- **Flat config:** os e2e usam ficheiros `eslint.config.mjs` (ex.: [`packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/eslint.config.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/eslint.config.mjs), [`packages/e2e-fixture-nest/eslint.config.mjs`](../../../../../packages/e2e-fixture-nest/eslint.config.mjs)); ESLint 9 resolve flat config por omissão. A imagem T2 define `ESLINT_USE_FLAT_CONFIG=true` (ver [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md)).
- **Paridade T1×T2:** dimensões alinhadas ou em aberto estão consolidadas na matriz de evidência (link acima).

## Entregável

- Tabela **Critérios por linha T1** (secção anterior): critérios reprodutíveis para linhas *Parcial*; critérios explícitos de *backlog* para linhas *Planejado*, com remissão à evidência de gaps.
