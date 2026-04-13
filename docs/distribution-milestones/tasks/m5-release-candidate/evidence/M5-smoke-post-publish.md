# Evidência A3 — smoke pós-publish (M5)

Executado conforme a tarefa [`A3-plano-smoke-pos-publish.md`](../A3-plano-smoke-pos-publish.md). A versão alvo do release está em [`M5-semver-decision.md`](M5-semver-decision.md) (A1) e nas notas [`M5-release-notes-draft.md`](M5-release-notes-draft.md) (A2). Nos comandos abaixo, substitua `X.Y.Z` pela versão publicada (ou pela tag RC, se aplicável).

## Pré-condições

- **Node.js** e **npm** compatíveis com [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) (`engines.node`, peer `eslint`).
- Artefato a validar: pacote **instalável a partir do registry** *ou* **tarball `.tgz` equivalente** ao publicado (ver fluxos A e B).
- **Flat config** (`eslint.config.*`) e ESLint 9+ — alinhado ao contrato em [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md).

## Variáveis úteis (copiar)

Defina uma pasta temporária e a versão alvo:

```bash
export HCD_SMOKE_DIR="$(mktemp -d)"
export HCD_VERSION="X.Y.Z"   # ex.: 0.1.0 — alinhar a A1/A2
cd "$HCD_SMOKE_DIR"
```

## Passos (reprodutíveis)

### A — Pós-`npm publish` (instalação a partir do registry)

1. Inicializar um consumidor mínimo e instalar dependências:

   ```bash
   npm init -y
   npm install eslint@^9 eslint-plugin-hardcode-detect@"$HCD_VERSION"
   ```

2. Criar `eslint.config.mjs` no diretório atual (import pelo **nome do pacote**, como um projeto real; compare com a ideia do fixture em [`packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/eslint.config.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/fixtures/hello-world/eslint.config.mjs)):

   ```javascript
   import hardcodeDetect from "eslint-plugin-hardcode-detect";

   export default [
     {
       files: ["**/*.mjs"],
       plugins: {
         "hardcode-detect": hardcodeDetect,
       },
       rules: {
         "hardcode-detect/hello-world": "error",
       },
     },
   ];
   ```

3. Criar `sample.mjs` (a regra demo deve reportar; mesmo conteúdo que o fixture e2e):

   ```javascript
   export const x = 1;
   ```

4. Ir a **Verificação mínima** (secção seguinte).

### B — Tarball local `npm pack` (equivalente ao publicado, sem registry)

Útil **antes** da publicação ou quando se quer reproduzir o conteúdo exato do tarball.

1. Noutro terminal, a partir da **raiz do repositório**, compilar e empacotar o plugin:

   ```bash
   npm run build --workspace eslint-plugin-hardcode-detect
   npm pack --workspace eslint-plugin-hardcode-detect
   ```

   Anote o caminho absoluto do ficheiro `eslint-plugin-hardcode-detect-X.Y.Z.tgz` gerado na raiz (ou no cwd onde correu o `npm pack`).

2. No consumidor temporário (`$HCD_SMOKE_DIR`):

   ```bash
   npm init -y
   npm install eslint@^9 "/caminho/absoluto/para/eslint-plugin-hardcode-detect-${HCD_VERSION}.tgz"
   ```

3. Criar os mesmos `eslint.config.mjs` e `sample.mjs` do fluxo A e seguir para **Verificação mínima**.

### C — Tag RC / dist-tag (opcional)

Se a equipa publicar com **dist-tag** (ex.: `next`, `rc`), instale explicitamente essa tag ou a versão exata:

```bash
npm install eslint@^9 eslint-plugin-hardcode-detect@X.Y.Z
# ou, quando existir dist-tag documentado no release:
# npm install eslint@^9 eslint-plugin-hardcode-detect@next
```

O critério de sucesso é o mesmo: versão resolvida = alvo e lint mínimo conforme abaixo.

## Verificação mínima

1. **Versão do pacote instalada** (deve coincidir com `HCD_VERSION`):

   ```bash
   npm ls eslint-plugin-hardcode-detect
   ```

   Opcional — meta do plugin (export default em [`packages/eslint-plugin-hardcode-detect/src/index.ts`](../../../../../packages/eslint-plugin-hardcode-detect/src/index.ts)):

   ```bash
   node --input-type=module -e 'import p from "eslint-plugin-hardcode-detect"; console.log(p.default?.meta?.version ?? p.meta?.version);'
   ```

2. **Lint com a regra demo** (esperado: pelo menos um problema com `ruleId` `hardcode-detect/hello-world`):

   ```bash
   npx eslint sample.mjs
   ```

   Saída JSON (confirmar `"ruleId":"hardcode-detect/hello-world"` no primeiro relatório):

   ```bash
   npx eslint sample.mjs --format json
   ```

## Resultado esperado

### Pass

- `npm ls` mostra `eslint-plugin-hardcode-detect@X.Y.Z` (sem `UNMET` ou versão inesperada).
- O snippet `node` imprime `X.Y.Z` no `meta.version` do plugin.
- `npx eslint sample.mjs` termina com **código de saída 1** (há erro da regra `hardcode-detect/hello-world`) **ou** a saída JSON inclui `hardcode-detect/hello-world` nas mensagens.
- Isto confirma que o consumidor **carrega o plugin publicado** e executa ESLint com a regra registada.

### Fail

- Erro ao resolver `eslint-plugin-hardcode-detect` ou falha ao carregar `eslint.config.mjs` (módulo não encontrado, ESM inválido).
- Versão instalada diferente de `X.Y.Z` quando o alvo é uma versão fixa.
- `npx eslint sample.mjs` com código 0 **e** nenhuma mensagem para `hardcode-detect/hello-world` (regra não aplicada ou pacote errado).
- `eslint` ou Node fora dos requisitos em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json).

## Paridade opcional (plano M5 §6)

| Cenário | Comando / perfil | Resultado esperado | Notas |
|--------|------------------|--------------------|--------|
| Consumidor limpo (T1) | Fluxo A (registry) ou B (`npm pack` + install em `$HCD_SMOKE_DIR`) | Pass da secção **Resultado esperado** | Valida o **artefato npm** como um projeto limpo o faria; canal direto em [`docs/solution-distribution-channels.md`](../../../../../docs/solution-distribution-channels.md). |
| Paridade local (T3) | Na **raiz do clone**: `docker compose --profile prod run --rm prod` | Código de saída **0** | Valida **lint + testes** do monorepo no commit atual (ver [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md)). **Não** substitui o smoke T1 com pacote do registry/tarball isolado. |

## Referências

| Documento | Função |
|-----------|--------|
| [`docs/solution-distribution-channels.md`](../../../../../docs/solution-distribution-channels.md) | Tabela de canais (npm projeto). |
| [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) | Perfis Compose, incluindo `prod`. |
| [`packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs) | Fumaça automatizada equivalente (API ESLint no repositório). |
