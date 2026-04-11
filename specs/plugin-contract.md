# Contrato do plugin `eslint-plugin-hardcode-detect`

Este documento define o comportamento público esperado do pacote em [`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect). A implementação deve seguir este contrato; o material em [`reference/legacy-snapshot`](../reference/legacy-snapshot) é apenas inspiração histórica. A visão de produto de longo prazo (hardcode em múltiplos níveis) está em [`vision-hardcode-plugin.md`](vision-hardcode-plugin.md).

## Escopo

- **ESLint**: flat config (`eslint.config.js` / `eslint.config.mjs`), ESLint 9+.
- **Exportação**: o pacote expõe um plugin ESLint com regras nomeadas abaixo, publicáveis via npm.

## Regras

### `hello-world`

- **ID no plugin**: `hello-world` (ex.: `hardcode-detect/hello-world`).
- **Tipo**: `suggestion`.
- **Descrição**: regra de **demonstração** (“Hello World”): emite um único relatório por arquivo na visita ao nó `Program`, com `messageId` `hello`, para validar que o plugin foi carregado. **Não** faz parte do conjunto `recommended` (evita ruído em projetos reais).
- **Comportamento**: sempre que a regra estiver habilitada, reporta uma vez por arquivo.
- **Schema**: vazio (`[]`).
- **Mensagens**: `hello` — texto fixo confirmando que o plugin está ativo.

### `no-hardcoded-strings`

- **ID sugerido no plugin**: `no-hardcoded-strings` (namespace do plugin conforme nome publicado, ex.: `hardcode-detect/no-hardcoded-strings`).
- **Tipo**: `problem`.
- **Descrição**: desencorajar literais de string hardcoded no código (exceto strings triviais muito curtas).
- **Comportamento**:
  - Em nós `Literal` cujo valor é `string`, se `value.length >= 2`, reportar com a mensagem configurada (equivalente a: evitar string literal; mover para constantes ou catálogo).
  - Strings de comprimento menor que 2 são ignoradas.
- **Schema**: vazio (`[]`).
- **Mensagens**: pelo menos `hardcoded` com texto orientando uso de constantes ou catálogo.

### `standardize-error-messages`

- **ID sugerido**: `standardize-error-messages`.
- **Tipo**: `problem`.
- **Descrição**: padronizar mensagens de erro e de log com código identificável e, quando houver catálogo, validar contra o catálogo no flat config.
- **Opções** (objeto único, todas opcionais):

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `messages` | objeto | `{}` | Mapa de código → `{ raw, user, dev }` (strings não vazias após trim). |
| `codePattern` | string (regex) | `[A-Z]{2,10}(?:[-_][A-Z0-9]+)*[-_]\d{3,5}` | Usada quando o catálogo está vazio para exigir código na mensagem. |
| `loggers` | string[] | `console.error`, `console.warn`, `logger.error`, `logger.warn` | Nomes completos `objeto.método` aceitos em `CallExpression`. |
| `errorConstructors` | string[] | `Error`, `TypeError`, `RangeError`, `ReferenceError` | Construtores considerados em `ThrowStatement` / `NewExpression`. |

- **Mensagens de relatório** (IDs estáveis):

| ID | Uso |
|----|-----|
| `missingCode` | Mensagem sem código esperado ou sem entrada no catálogo quando aplicável. |
| `unknownCode` | Código referenciado não existe no catálogo (quando a regra validar chaves do catálogo). |
| `invalidCatalogEntry` | Entrada do catálogo sem `raw`, `user` e `dev` válidos. |
| `dynamicMessage` | Mensagem não estática (não é literal string nem template sem expressões). |

- **Comportamento**:
  - **Catálogo não vazio** (`messages` com chaves): extrair da mensagem estática um código que seja **substring igual a uma chave** do catálogo; se nenhuma bater, `missingCode`. Se bater, validar entrada com `invalidCatalogEntry` se incompleta.
  - **Catálogo vazio**: exigir que a mensagem estática satisfaça `codePattern`.
  - **Onde inspecionar**:
    - `ThrowStatement`: primeiro argumento de `new ErrorLike(...)` ou string/template jogada diretamente.
    - `CallExpression` para loggers listados: primeiro argumento.
  - **Strings estáticas**: literais string ou `TemplateLiteral` sem expressões (`${}`).

## Compatibilidade

- Implementação em TypeScript ou JavaScript ES modules, alinhada à API de regras do ESLint 9.
- Testes automatizados devem cobrir casos positivos e negativos por regra (ver skill em `.cursor/skills/eslint-plugin-workflow`).

## Versão do documento

- **0.2.0** — regras `hello-world` (demo) e `no-hardcoded-strings` (primeira regra de produto) descritas e implementáveis no pacote.
- **0.1.0** — alinhado ao snapshot legado em `reference/legacy-snapshot/*.mjs`.
