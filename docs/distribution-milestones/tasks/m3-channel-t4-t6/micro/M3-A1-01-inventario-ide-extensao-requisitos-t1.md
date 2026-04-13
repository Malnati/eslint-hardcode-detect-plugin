# M3-A1-01: Inventário IDE / extensão vs requisitos T1

| Campo | Valor |
|-------|--------|
| parent_task | A1 |
| micro_id | M3-A1-01 |
| milestone | M3 |
| depends_on | — |
| blocks | M3-A1-02 |
| plan_requirements | `m3-sec4-order-1`, `m3-sec7-A1` |

## Objetivo

Listar requisitos mínimos da trilha **T4** (extensão ESLint oficial ou equivalente no IDE) e cruzar com o que **T1** já exige (workspaces npm, `eslint.config`, plugin em `packages/eslint-plugin-hardcode-detect`).

## Definition of done

- Tabela ou bullets: IDE alvo → extensão → pré-requisitos (Node, workspace na raiz) → ligação aos artefatos T1 existentes (caminhos relativos à raiz).

## Paths principais

- [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md)
- [`docs/solution-distribution-channels.md`](../../../../solution-distribution-channels.md)
- [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json)

---

## Inventário T4 × T1 (entregável)

Âncoras: trilha **T4** (IDE / LSP) no marco [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) e linha «Editores com ESLint / LSP» em [`docs/solution-distribution-channels.md`](../../../../solution-distribution-channels.md). A trilha **T1** (npm / monorepo) exige, neste clone, workspaces na raiz, o pacote do plugin em `packages/eslint-plugin-hardcode-detect` e ficheiros `eslint.config.*` nos pacotes relevantes — **não** na raiz do repositório.

| IDE alvo | Extensão ou integração | Pré-requisitos (Node, workspace na raiz) | Ligação aos artefatos T1 existentes (caminhos relativos à raiz) |
|----------|------------------------|------------------------------------------|----------------------------------------------------------------|
| **Visual Studio Code** | Extensão **ESLint** (Microsoft; id usual `dbaeumer.vscode-eslint`). | **Node** compatível com [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) (`engines.node`: `>=22`). Abrir a **pasta raiz** do clone (workspace do monorepo). **`npm install` na raiz** para materializar workspaces (`workspaces` em [`package.json`](../../../../../package.json)). | Workspaces: [`package.json`](../../../../../package.json). Plugin publicável e lint local: [`packages/eslint-plugin-hardcode-detect/`](../../../../../packages/eslint-plugin-hardcode-detect/), [`packages/eslint-plugin-hardcode-detect/eslint.config.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/eslint.config.mjs). Massa Nest / e2e auxiliar: [`packages/e2e-fixture-nest/`](../../../../../packages/e2e-fixture-nest/), norma em [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md). |
| **Cursor** | Mesma extensão **ESLint** (ecossistema de extensões compatível com VS Code). | Igual a VS Code: Node `>=22`, workspace na **raiz** do repositório, `npm install` na raiz. | Os mesmos artefatos T1 da linha VS Code. |
| **JetBrains (WebStorm, IntelliJ IDEA)** | Integração **ESLint** nas definições do IDE (sem marketplace VS Code). | Igual: Node `>=22`, abrir o projeto na **raiz** do monorepo, `npm install` na raiz. | Os mesmos artefatos T1 da linha VS Code. |

**Nota (flat config neste monorepo):** o ficheiro principal usado pelo desenvolvimento do plugin é [`packages/eslint-plugin-hardcode-detect/eslint.config.mjs`](../../../../../packages/eslint-plugin-hardcode-detect/eslint.config.mjs) (diretório do pacote), não um `eslint.config` na raiz. A massa Nest mantém o seu próprio [`packages/e2e-fixture-nest/eslint.config.mjs`](../../../../../packages/e2e-fixture-nest/eslint.config.mjs). Passos de IDE e pastas de trabalho ficam para **M3-A1-02**.
