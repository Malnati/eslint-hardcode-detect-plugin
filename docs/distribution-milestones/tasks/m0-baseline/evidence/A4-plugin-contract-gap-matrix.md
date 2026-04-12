# Evidência A4 — matriz contrato × documentação do pacote

Marco M0 · âncora [`../A4-plugin-contract-vs-readme.md`](../A4-plugin-contract-vs-readme.md)

Preencher após execução das micro-tarefas M0-A4-01 … M0-A4-04.

| Área | `specs/plugin-contract.md` | README do pacote | `packages/.../docs/rules/` | Estado |
|------|----------------------------|------------------|-----------------------------|--------|
| Regra `hello-world` | Secção dedicada; `suggestion`; não em `recommended`; um relatório por ficheiro. | Tabela de regras com link para `docs/rules/hello-world.md`; `recommended` só inclui `no-hardcoded-strings`. | `hello-world.md` (alinhado ao contrato; visita `Program`, `messageId` `hello`). | OK |
| Regra `no-hardcoded-strings` | `problem`; literais `string` com `length >= 2`; `messageId` `hardcoded`. | Descrição + link para `docs/rules/no-hardcoded-strings.md`. | `no-hardcoded-strings.md`. | OK |
| Regra `standardize-error-messages` | Especificada (opções, `messageId`s). | README distingue contrato (3 regras) vs exportação actual (2); link para `docs/rules/standardize-error-messages.md` (não exportada). | `standardize-error-messages.md` (contrato; não exportada no artefacto). | OK (paridade documental); **gap** de produto (implementação / exportação em `src/index.ts`). |
| e2e / Nest / `nest-workspace.e2e.mjs` | Fumaça e2e, `dist/`, fixtures hello-world e Nest. | Comandos e ficheiros e2e coincidem com `package.json`; Nest e spec referenciados. | — | OK |

## Notas M0-A4-02

- Cruzamento com a checklist [M0-A4-01](../micro/M0-A4-01-checklist-plugin-contract.md) (âncora contrato **0.4.0**).
- **Comandos / e2e:** paridade entre contrato, `package.json` e README (`npm test` → `tests/index.test.mjs`, `e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs`).
- **`standardize-error-messages`:** presente no contrato e na checklist; **não** exportada em `packages/eslint-plugin-hardcode-detect/src/index.ts`; README deve distinguir contrato completo vs regras efectivamente publicadas (actualizado em M0-A4-02).
- **Consolidação final** da matriz e data/rev.: M0-A4-04.

## Notas M0-A4-03

- Cruzamento [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) × [`packages/eslint-plugin-hardcode-detect/docs/rules/`](../../../../../packages/eslint-plugin-hardcode-detect/docs/rules/): cada regra do contrato tem página em `docs/rules/` (`hello-world.md`, `no-hardcoded-strings.md`, `standardize-error-messages.md`). A última documenta explicitamente que a regra **não** está ainda no artefacto publicável; o **gap** restante é de **implementação**, não de documentação em `docs/rules/`.
- Micro-tarefa: [`../micro/M0-A4-03-contrato-vs-docs-rules.md`](../micro/M0-A4-03-contrato-vs-docs-rules.md).

## Notas e follow-ups

- Data da revisão: 2026-04-12 (M0-A4-02, M0-A4-03).
- Referência PR ou issue:

## Legenda

- **OK**: paridade documental suficiente para baseline T1.
- **gap**: divergência a corrigir ou registada como issue.
