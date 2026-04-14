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

Com `remediationMode: "r1"` em `no-hardcoded-strings`, a regra pode aplicar remediação **R1** (constantes no topo do mesmo ficheiro). A política de **autofix** (`eslint --fix` / `output` no RuleTester) face a **apenas sugestões** (`suggestions` sem `output`) e aos casos só com erro está documentada em [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md), com matriz P-SVF-* e cenários S-R1-* espelhados na suite [`tests/no-hardcoded-strings-r1.test.mjs`](tests/no-hardcoded-strings-r1.test.mjs). Critérios normativos de prova (P-SVF → tipo de asserção; papel dos e2e na cadeia `npm test`): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md). Parecer do revisor de testes (A2): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md). Evidências de execução do testador (gate `npm test`; M1-A2-08): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md).

Para validar o pacote a partir da raiz do monorepo: `npm test -w eslint-plugin-hardcode-detect`.

## Segredos, ambiente e cofres

Literais que parecem tokens ou segredos (heurística da regra, alinhada a L1 em [`docs/hardcoding-map.md`](../../docs/hardcoding-map.md)) devem ser tratados com cuidado: **não** commite valores sensíveis; prefira **variáveis de ambiente** e **cofres** ou gestão de segredos da sua plataforma (documentação oficial do fornecedor cloud / CI).

- **Política do repositório:** não simulamos fornecedores externos nem gravamos credenciais reais em testes — ver [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md).
- **Plugin:** a opção `secretRemediationMode` em `no-hardcoded-strings` controla se o autofix R1 pode copiar o valor em claro (`aggressive-autofix-opt-in`), usar um placeholder estável (`placeholder-default`) ou manter o modo seguro por defeito (`suggest-only`). Detalhes e sentinel: [`specs/plugin-contract.md`](../../specs/plugin-contract.md) e [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md).
- **Leitura recomendada (externa):** [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) e a documentação oficial do seu runtime (Node.js `process.env`, gestão de segredos em Kubernetes, etc.).

## Desenvolvimento

- `npm run build` — compila `src/` para `dist/`.
- `npm run lint` — ESLint no código do plugin (`eslint-plugin-eslint-plugin`, `eslint-plugin-n`, `typescript-eslint`).
- `npm test` — compila e executa testes com `RuleTester` + `node:test` + fumaça e2e ([`e2e/hello-world.e2e.mjs`](e2e/hello-world.e2e.mjs), [`e2e/nest-workspace.e2e.mjs`](e2e/nest-workspace.e2e.mjs); ver secção seguinte).

### Fumaça e2e (Nest)

Alinhado a [`specs/plugin-contract.md`](../../specs/plugin-contract.md) (Compatibilidade / fumaça e2e), a **massa NestJS** é o workspace auxiliar [`packages/e2e-fixture-nest`](../../packages/e2e-fixture-nest) (aplicação Nest real). O runner está em [`e2e/nest-workspace.e2e.mjs`](e2e/nest-workspace.e2e.mjs) — caminho à raiz do repositório: `packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`. Esse teste instancia a API `ESLint` com `cwd` no workspace Nest, chama `lintFiles` em `src/fixture-hardcodes/**/*.ts` com o plugin a partir de `dist/` e fixa contagens de `hardcode-detect/hello-world` e `hardcode-detect/no-hardcoded-strings`. Normas e tabela de contagens: [`specs/e2e-fixture-nest.md`](../../specs/e2e-fixture-nest.md).

Requer **Node.js ≥ 22** (alinhado ao CI e ao campo `engines` do pacote).

Instale dependências a partir da raiz do monorepo (`npm install`) ou apenas neste pacote, conforme sua política de ambiente.
