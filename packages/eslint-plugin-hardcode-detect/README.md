# eslint-plugin-hardcode-detect

Implementação oficial do plugin. O contrato das regras está em [`specs/plugin-contract.md`](../../specs/plugin-contract.md); a visão multi-nível em [`specs/vision-hardcode-plugin.md`](../../specs/vision-hardcode-plugin.md).

O contrato descreve **três** regras (`hello-world`, `no-hardcoded-strings`, `standardize-error-messages`). **Neste pacote**, a build publicável exporta hoje apenas `hello-world` e `no-hardcoded-strings`. A regra `standardize-error-messages` consta do contrato (opções e `messageId`s) mas **ainda não** está incluída no artefacto publicável — implementação futura alinhada ao spec.

## Uso rápido (ESLint 9 flat config)

```javascript
import { defineConfig } from "eslint/config";
import hardcodeDetect from "eslint-plugin-hardcode-detect";

export default defineConfig([
  {
    plugins: {
      "hardcode-detect": hardcodeDetect,
    },
    extends: ["hardcode-detect/recommended"],
  },
]);
```

Ou habilite regras manualmente (ex.: regra de demonstração `hello-world`):

```javascript
rules: {
  "hardcode-detect/hello-world": "warn",
  "hardcode-detect/no-hardcoded-strings": "warn",
},
```

O plugin expõe `meta.name`, `meta.version` e `meta.namespace` (`hardcode-detect`), conforme a documentação oficial de [plugins](https://eslint.org/docs/latest/extend/plugins).

## Regras

O preset `hardcode-detect/recommended` aplica apenas `no-hardcoded-strings`. A regra `hello-world` é **demonstração** e **não** faz parte de `recommended` (evita ruído em projetos reais).

| ID | Descrição |
|----|-----------|
| `hello-world` | Demonstração mínima (um aviso por arquivo); ver [`docs/rules/hello-world.md`](docs/rules/hello-world.md). |
| `no-hardcoded-strings` | Desencoraja literais de string com comprimento ≥ 2; ver [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md). |
| `standardize-error-messages` | Contrato e página de referência; ainda não exportada no pacote; ver [`docs/rules/standardize-error-messages.md`](docs/rules/standardize-error-messages.md). |

## Desenvolvimento

- `npm run build` — compila `src/` para `dist/`.
- `npm run lint` — ESLint no código do plugin (`eslint-plugin-eslint-plugin`, `eslint-plugin-n`, `typescript-eslint`).
- `npm test` — compila e executa testes com `RuleTester` + `node:test` + fumaça e2e (`e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs`).

### Fumaça e2e (Nest)

O teste `nest-workspace.e2e.mjs` usa `cwd` no workspace [`packages/e2e-fixture-nest`](../../packages/e2e-fixture-nest) e linta `src/fixture-hardcodes/**/*.ts` com o plugin carregado a partir de `dist/`. Contagens fixas e normas: [`specs/e2e-fixture-nest.md`](../../specs/e2e-fixture-nest.md).

Requer **Node.js ≥ 22** (alinhado ao CI e ao campo `engines` do pacote).

Instale dependências a partir da raiz do monorepo (`npm install`) ou apenas neste pacote, conforme sua política de ambiente.
