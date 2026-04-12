# M0-A4-01: Checklist a partir de `plugin-contract`

| Campo | Valor |
|-------|--------|
| parent_task | A4 |
| micro_id | M0-A4-01 |
| milestone | M0 |
| depends_on | M0-A2-03 (contexto macro estável; opcional) |
| blocks | M0-A4-02 |
| plan_requirements | `m0-sec4-order-2`, `m0-sec7-A4`, `m0-sec10-contract-readme` |

## Objetivo

Extrair de [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) lista verificável: regras nomeadas, opções públicas, `messageId`s relevantes e requisitos de e2e descritos no contrato.

## Definition of done

- Checklist em bullet ou tabela reutilizável nas micro-tarefas A4-02 e A4-03.
- Nenhuma alteração obrigatória ao contrato neste passo salvo erro encontrado.

## Paths principais

- `specs/plugin-contract.md`

---

## Âncora de versão

Esta checklist reflete o contrato em [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) na versão **0.4.0** do documento (secção «Versão do documento» no spec).

## Regras nomeadas

| ID no plugin | Tipo ESLint | Schema | `recommended` | Notas (contrato) |
|--------------|---------------|--------|-----------------|------------------|
| `hello-world` | `suggestion` | `[]` (vazio) | **Não** incluída (demo; evita ruído) | Um relatório por ficheiro na visita a `Program`. |
| `no-hardcoded-strings` | `problem` | `[]` (vazio) | — | Literais `string` com `value.length >= 2`; strings de comprimento menor que 2 ignoradas. |
| `standardize-error-messages` | `problem` | objeto de opções (ver abaixo) | — | Erros/logs com código; catálogo opcional via opções. |

## Opções públicas

- **`hello-world`** e **`no-hardcoded-strings`**: schema vazio (`[]`); sem opções configuráveis no contrato.

- **`standardize-error-messages`**: opções como **objeto único**, todas opcionais:

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `messages` | objeto | `{}` | Mapa de código → `{ raw, user, dev }` (strings não vazias após trim). |
| `codePattern` | string (regex) | `[A-Z]{2,10}(?:[-_][A-Z0-9]+)*[-_]\d{3,5}` | Usada quando o catálogo está vazio para exigir código na mensagem. |
| `loggers` | string[] | `console.error`, `console.warn`, `logger.error`, `logger.warn` | Nomes completos `objeto.método` aceitos em `CallExpression`. |
| `errorConstructors` | string[] | `Error`, `TypeError`, `RangeError`, `ReferenceError` | Construtores considerados em `ThrowStatement` / `NewExpression`. |

## `messageId`s relevantes

| Regra | `messageId` | Uso / nota |
|-------|-------------|------------|
| `hello-world` | `hello` | Texto fixo confirmando que o plugin está ativo. |
| `no-hardcoded-strings` | `hardcoded` (pelo menos) | Orientar uso de constantes ou catálogo. |
| `standardize-error-messages` | `missingCode` | Mensagem sem código esperado ou sem entrada no catálogo quando aplicável. |
| `standardize-error-messages` | `unknownCode` | Código referenciado não existe no catálogo (quando a regra validar chaves do catálogo). |
| `standardize-error-messages` | `invalidCatalogEntry` | Entrada do catálogo sem `raw`, `user` e `dev` válidos. |
| `standardize-error-messages` | `dynamicMessage` | Mensagem não estática (não é literal string nem template sem expressões). |

## Requisitos de e2e descritos no contrato

- Implementação alinhada à API de regras do ESLint 9; testes automatizados cobrindo casos positivos e negativos **por regra** (RuleTester).
- **Fumaça e2e** em `e2e/`: API Node.js do ESLint (`ESLint`, `lintFiles`), fixtures com **flat config**, plugin carregado a partir de **`dist/`**.
- **Hello World mínimo** (`e2e/fixtures/hello-world/`): valida carregamento do plugin e a regra `hello-world`.
- **Massa NestJS**: workspace auxiliar [`packages/e2e-fixture-nest`](../../../../../packages/e2e-fixture-nest); teste `nest-workspace.e2e.mjs` linta `src/fixture-hardcodes/**/*.ts` e fixa contagens de `hello-world` e `no-hardcoded-strings`; alterar a massa exige atualizar o e2e e o spec (ver [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md)).
- Os fluxos e2e **não substituem** os testes por regra com RuleTester.

## Uso nas micro-tarefas seguintes

- **[M0-A4-02](M0-A4-02-paridade-readme-pacote.md)**: cruzar esta checklist com [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../../packages/eslint-plugin-hardcode-detect/README.md) (regras, comandos de teste, e2e).
- **[M0-A4-03](M0-A4-03-contrato-vs-docs-rules.md)**: cruzar com a documentação por regra em `packages/eslint-plugin-hardcode-detect/docs/rules/`, quando existir.
- **[M0-A4-04](M0-A4-04-artefacto-gap-matrix.md)**: consolidar achados na matriz em [`../evidence/A4-plugin-contract-gap-matrix.md`](../evidence/A4-plugin-contract-gap-matrix.md).
