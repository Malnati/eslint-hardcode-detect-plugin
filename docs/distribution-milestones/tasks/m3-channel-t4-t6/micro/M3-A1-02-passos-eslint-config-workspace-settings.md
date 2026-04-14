# M3-A1-02: Passos — `eslint.config` e workspace settings

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M3-A1-02 |
| milestone | M3 |
| depends_on | M3-A1-01 |
| blocks | M3-A1-03 |
| plan_requirements | `m3-sec4-order-1`, `m3-sec7-A1` |

## Objetivo

Redigir passos reprodutíveis: abrir o repositório como workspace, garantir que o IDE resolve o **flat config** (`eslint.config.mjs` / `eslint.config.js`) na raiz ou nos pacotes relevantes, e settings típicos (ex.: ESLint: working directories) sem divergir dos comandos documentados em CI.

## Definition of done

- Lista numerada verificável; todos os paths citados relativos à raiz do repositório; referência ao handoff T3 (o que o CI já valida).

## Paths principais

- [`packages/eslint-plugin-hardcode-detect/eslint.config.mjs`](../../../../packages/eslint-plugin-hardcode-detect/eslint.config.mjs)
- [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md)

---

## Passos reprodutíveis — workspace, flat config e settings (entregável)

Inventário de pré-requisitos (IDE, extensão, T1): ver [`M3-A1-01-inventario-ide-extensao-requisitos-t1.md`](M3-A1-01-inventario-ide-extensao-requisitos-t1.md).

1. **Abrir o clone como workspace na raiz do monorepo** — em VS Code / Cursor: *File → Open Folder…* e escolher a pasta que contém [`package.json`](../../../../../package.json) na raiz (não abrir apenas `packages/eslint-plugin-hardcode-detect/` como única pasta raiz do workspace), para respeitar `workspaces` e o mesmo arranjo que `npm install` na raiz.
2. **Instalar dependências na raiz:** na raiz do repositório, executar `npm install` (materializa `node_modules` e liga os workspaces definidos em [`package.json`](../../../../../package.json)).
3. **Usar Node `>=22`**, alinhado a [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) (`engines.node`) e ao runner em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) (`node-version: "22"`).
4. **Ativar integração ESLint no IDE:** extensão **ESLint** (Microsoft, id usual `dbaeumer.vscode-eslint`) em VS Code/Cursor; em JetBrains, ativar ESLint nas definições do projeto para este diretório raiz.
5. **Saber onde o flat config resolve (não há `eslint.config.*` na raiz):**
   - Para ficheiros sob `packages/eslint-plugin-hardcode-detect/`, o ESLint 9 procura `eslint.config.*` a partir do ficheiro analisado e usa [`packages/eslint-plugin-hardcode-detect/eslint.config.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/eslint.config.mjs) para o desenvolvimento do plugin (é o mesmo escopo que `eslint .` com cwd nesse pacote).
   - Para trabalhar na massa Nest auxiliar, existe config separado em [`packages/e2e-fixture-nest/eslint.config.mjs`](../../../../../packages/e2e-fixture-nest/eslint.config.mjs); ficheiros noutros caminhos podem não ter config dedicado neste clone.
6. **Ajustar *working directories* (monorepo):** nas settings do workspace ou do utilizador, definir `eslint.workingDirectories` para que o servidor de linguagem não assuma cwd incorreto — por exemplo modo `"auto"` **ou** lista explícita `["packages/eslint-plugin-hardcode-detect", "packages/e2e-fixture-nest"]` (caminhos relativos à raiz do repositório). O objetivo é alinhar diagnostics aos mesmos ficheiros e regras que `npm run lint` aplica ao pacote do plugin, sem comandos paralelos inventados.
7. **Verificar como no CI:** na raiz, após alterações, confirmar com os mesmos comandos documentados em [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) e na pipeline T3: `npm run lint` e `npm test -w eslint-plugin-hardcode-detect`; opcionalmente `npm run test:docs-m0` (validação de manifestos de milestones, também executada no CI). Não documentar fluxos de lint que não passem por estes comandos.

### O que o T3 (CI) já valida (handoff)

Espelha [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) e o quadro de handoff / matriz em [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md) (§2 «Dependências e handoff», §6 «Matriz e2e × Docker Compose» com `npm run lint` e teste do workspace do plugin):

- **`npm install`** na raiz do repositório.
- **`npm run test:docs-m0`** — cobertura dos ficheiros micro dos marcos (inclui manifestos sob `docs/distribution-milestones/tasks/`).
- **`npm run lint`** — na raiz equivale a `npm run lint -w eslint-plugin-hardcode-detect`, ou seja `eslint .` no diretório `packages/eslint-plugin-hardcode-detect/`.
- **`npm test -w eslint-plugin-hardcode-detect`** — build, RuleTester e e2e do pacote publicável.

Assim, o IDE deve refletir a mesma config flat e o mesmo pacote que o pipeline T3 já comprovou; divergências «passa no IDE / falha no CI» devem ser investigadas com estes comandos e com o cwd/`eslint.workingDirectories` acima.
