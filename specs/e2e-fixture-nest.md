# Massa de testes e2e NestJS (`e2e-fixture-nest`)

## Objetivo

O pacote [`packages/e2e-fixture-nest`](../packages/e2e-fixture-nest/) é um **workspace npm auxiliar** com aplicação NestJS real (`@nestjs/*`) e dependências instaladas pelo monorepo. Ele serve de **massa realista** para a fumaça e2e do [`eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect/): motor ESLint 9, flat config, `typescript-eslint` e o plugin carregado a partir de `dist/` do pacote irmão.

Não é pacote publicável no npm; o código publicável do plugin continua **somente** em [`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect/).

## Pré-requisitos

- **Node.js:** o pacote [`eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect/) declara `engines.node` `>=22`; use uma versão compatível ao reproduzir testes localmente.

## Relação entre o plugin e o fixture (e2e)

O teste de fumaça **não** é executado a partir do diretório do Nest nem via `npm test` do workspace `e2e-fixture-nest`. O ficheiro [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) corre no pacote do plugin (Node.js `node --test`), instancia a API `ESLint` com `cwd` resolvido para [`packages/e2e-fixture-nest`](../packages/e2e-fixture-nest/) e chama `lintFiles` com o glob `src/fixture-hardcodes/**/*.ts`. Assim o ESLint carrega o [`eslint.config.mjs`](../packages/e2e-fixture-nest/eslint.config.mjs) do fixture e o plugin em `dist/` do pacote irmão.

## Hierarquia de referências (conflitos)

Em caso de conflito entre documentação genérica e este repositório:

1. [`AGENTS.md`](../AGENTS.md)
2. [`specs/plugin-contract.md`](plugin-contract.md)
3. Recortes em [`reference/Clippings/`](../reference/Clippings/) (Create Plugins, Custom Rules, Extend ESLint, Node.js API, Rules Reference, eslint-plugin-eslint-plugin, eslint-plugin-n, Debug Your Configuration)

Os Clippings orientam **configuração e integração ESLint**; o contrato do plugin define o comportamento das regras.

## Layout

| Caminho | Função |
|---------|--------|
| `packages/e2e-fixture-nest/src/fixture-hardcodes/` | Arquivos **controlados** com literais fixos (contagens esperadas no teste e2e). |
| `packages/e2e-fixture-nest/eslint.config.mjs` | Flat config: `typescript-eslint` + plugin `hardcode-detect` via import relativo a `../eslint-plugin-hardcode-detect/dist/index.js`. |
| `packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs` | Teste que usa `ESLint` / `lintFiles` com `cwd` no workspace Nest e glob `src/fixture-hardcodes/**/*.ts`. |

## Contagens esperadas (fumaça)

Para o glob `src/fixture-hardcodes/**/*.ts`, o teste e2e fixa:

| Métrica | Valor |
|---------|------:|
| Arquivos lintados | 5 |
| `hardcode-detect/hello-world` | 5 (um por arquivo) |
| `hardcode-detect/no-hardcoded-strings` | 31 |

Qualquer alteração em `src/fixture-hardcodes/**` deve atualizar estes números em [`nest-workspace.e2e.mjs`](../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) e nesta tabela.

## Reprodução a partir da raiz do repositório

Na raiz do clone, [`package.json`](../package.json) define `workspaces: ["packages/*"]` e um script `test` que delega ao pacote do plugin. Fluxo mínimo:

```bash
npm install
npm test
```

Equivalente explícito ao workspace do plugin (nome do pacote em `package.json`: `eslint-plugin-hardcode-detect`):

```bash
npm install
npm test --workspace eslint-plugin-hardcode-detect
```

O primeiro comando instala dependências de **todos** os workspaces sob `packages/`, incluindo `e2e-fixture-nest`. O segundo corre o `test` desse pacote, que executa `npm run build` e depois RuleTester e e2e (entre eles [`nest-workspace.e2e.mjs`](../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs)).

## Ordem de execução (detalhe)

1. `npm install` na raiz do monorepo (instala o workspace Nest e o resto de `packages/*`).
2. Build do plugin: `npm run build` no pacote `eslint-plugin-hardcode-detect` — **redundante** se for logo a correr `npm test` nesse pacote ou `npm test` na raiz, porque o script `test` do plugin já faz `npm run build` antes dos testes.
3. Testes: `npm test` na raiz **ou** no pacote `eslint-plugin-hardcode-detect` (inclui e2e Nest).

## Regras para agentes

- **Não** importar `reference/` no código do plugin nem em configs de produção do fixture.
- **Não** commitar segredos; variáveis sensíveis via ambiente em runtime, não literais no fixture de propósito.
- Ao mudar literais ou imports em `fixture-hardcodes`, recalcular contagens (por exemplo com `eslint -f json` no diretório do fixture) e alinhar o e2e + esta tabela.
- Para depurar a config no fixture, seguir o fluxo oficial descrito em *Debug Your Configuration* (ESLint), por exemplo `--print-config` sobre um arquivo alvo.

## Versão do documento

- **1.1.0** — Comandos explícitos da raiz (`npm install` / `npm test` e variante `--workspace`), relação API `ESLint` + `cwd` do fixture, nota sobre build incluído no `npm test`, pré-requisito Node `>=22`.
- **1.0.0** — Introdução do workspace Nest e massa `fixture-hardcodes` com contagens fixas no e2e.
