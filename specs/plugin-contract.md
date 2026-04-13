# Contrato do plugin `eslint-plugin-hardcode-detect`

Este documento define o comportamento público esperado do pacote em [`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect). A implementação deve seguir este contrato; o material em [`reference/legacy-snapshot`](../reference/legacy-snapshot) é apenas inspiração histórica. A visão de produto de longo prazo (hardcode em múltiplos níveis) está em [`vision-hardcode-plugin.md`](vision-hardcode-plugin.md). O **planejamento macro** de remediação (constantes por arquivo, módulo compartilhado, arquivos de propriedades, segredos) está em [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md); novas opções públicas decorrentes desse roadmap devem ser normativas **neste** documento antes do merge de código correspondente (marco M0 desse plano).

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
- **Meta ESLint**: `fixable: "code"`; `hasSuggestions: true` (há cenários só com *suggestions*, sem `fix`, conforme política de risco; ver [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md)).

#### Detecção

- Na saída do programa (`Program:exit`), consideram-se ocorrências em nós `Literal` cujo valor é `string` e `value.length >= 2`. Strings mais curtas são ignoradas.
- Literais que são o operando **direito** de `??` ou `||` quando o ramo esquerdo referencia `process.env` são tratados como **fallback de ambiente**. O relatório e o agrupamento para R1 respeitam `envDefaultLiteralPolicy`:
  - **`include`**: participam do mesmo fluxo que outros literais (mensagem `hardcoded` por defeito).
  - **`report-separate`**: usa `messageId` `hardcodedEnvDefault` para esses literais.
  - **`ignore`**: não são reportados.

#### Modo de remediação efectivo

- Valores de opção `remediationMode`: `"off"` \| `"r1"` \| `"r2"` \| `"r3"` \| `"auto"`.
- **Remediação R1 por autofix** só está activa quando o modo efectivo é **R1**: `"r1"` ou `"auto"` (este último mapeia para R1 na implementação actual). Com `"off"`, ou com `"r2"` / `"r3"` (reservados: **sem** autofix R1 nesta versão), mantém-se detecção e relatórios; não há reescrita R1 automática.

#### Remediação R1 (constantes no mesmo ficheiro)

- Com R1 activo e contexto seguro para autofix: injectam-se declarações `const` **após** o último `import`, ou no topo do ficheiro se não houver imports; nomes em `constantNamingConvention` (hoje só `UPPER_SNAKE_CASE`); declarações ordenadas lexicograficamente por identificador; substituição das ocorrências elegíveis pelo identificador escolhido.
- **`dedupeWithinFile`**: se `true`, um identificador por par valor + flag de fallback de ambiente no mesmo `SourceCode`; se `false`, permite múltiplas constantes para o mesmo valor (ver suite RuleTester).
- **`remediationIncludeGlobs`** / **`remediationExcludeGlobs`**: padrões glob sobre o caminho **relativo** ao `cwd` do ESLint (`context.cwd`). Lista de inclusão vazia = sem filtro extra; exclusão impede autofix R1 nos ficheiros que casam (detecção mantém-se; podem aplicar-se *suggestions* onde a implementação o permitir).
- **Heurísticas de segurança**: caminhos de ficheiro considerados arriscados (ex. testes, i18n) e literais que coincidem com heurística de **segredo provável** não recebem autofix R1 nem *suggestion* quando não existem alvos seguros para construir o fix; detalhe em código e na documentação da regra.

#### Schema (implementação actual, M1)

- Um único objecto opcional em `options[0]`; propriedades não listadas são rejeitadas (`additionalProperties: false` no JSON Schema da regra).

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `remediationMode` | `"off"` \| `"r1"` \| `"r2"` \| `"r3"` \| `"auto"` | `"off"` | Trilha de remediação; ver modo efectivo acima. |
| `constantNamingConvention` | `"UPPER_SNAKE_CASE"` | `"UPPER_SNAKE_CASE"` | Convenção dos identificadores injectados (extensível no contrato; hoje só este valor no schema). |
| `dedupeWithinFile` | boolean | `true` | Uma constante por grupo de equivalência no mesmo ficheiro. |
| `remediationIncludeGlobs` | string[] | `[]` | Se não vazio, só ficheiros cujo caminho relativo casa recebem autofix R1 quando o restante contexto o permitir. |
| `remediationExcludeGlobs` | string[] | `[]` | Caminhos que casam não recebem autofix R1. |
| `envDefaultLiteralPolicy` | `"include"` \| `"report-separate"` \| `"ignore"` | `"include"` | Política para literais de fallback de `process.env` (`??` / `||`). |

- Opções adicionais da tabela global (R2, R3, segredos, etc.) na secção seguinte **ainda não** fazem parte do schema desta regra até aos marcos indicados.

#### Mensagens (IDs estáveis)

| ID | Uso |
|----|-----|
| `hardcoded` | Literal reportável genérico (inclui fallback de ambiente quando `envDefaultLiteralPolicy` não é `report-separate`). |
| `hardcodedEnvDefault` | Literal de fallback de `process.env` quando `envDefaultLiteralPolicy === "report-separate"`. |

### `standardize-error-messages`

- **ID sugerido**: `standardize-error-messages`.
- **Tipo**: `problem`.
- **Descrição**: padronizar mensagens de erro e de log com código identificável e, quando houver catálogo, validar contra o catálogo no flat config.
- **Opções** (objeto único, todas opcionais):

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `messages` | objeto | `{}` | Mapa de código → `{ seniorDiagnostic, systemicRemediation, operationalWorkaround }` (strings não vazias após trim); semântica alinhada a [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md). **Recomenda-se** que cada string comece pelo **prefixo canónico** da parte correspondente (`[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`), para a mesma auditoria mecânica (Níveis 1–2) que nos relatórios de agentes. |
| `codePattern` | string (regex) | `[A-Z]{2,10}(?:[-_][A-Z0-9]+)*[-_]\d{3,5}` | Usada quando o catálogo está vazio para exigir código na mensagem. |
| `loggers` | string[] | `console.error`, `console.warn`, `logger.error`, `logger.warn` | Nomes completos `objeto.método` aceitos em `CallExpression`. |
| `errorConstructors` | string[] | `Error`, `TypeError`, `RangeError`, `ReferenceError` | Construtores considerados em `ThrowStatement` / `NewExpression`. |

- **Mensagens de relatório** (IDs estáveis):

| ID | Uso |
|----|-----|
| `missingCode` | Mensagem sem código esperado ou sem entrada no catálogo quando aplicável. |
| `unknownCode` | Código referenciado não existe no catálogo (quando a regra validar chaves do catálogo). |
| `invalidCatalogEntry` | Entrada do catálogo sem `seniorDiagnostic`, `systemicRemediation` e `operationalWorkaround` válidos. |
| `dynamicMessage` | Mensagem não estática (não é literal string nem template sem expressões). |

- **Comportamento**:
  - **Catálogo não vazio** (`messages` com chaves): extrair da mensagem estática um código que seja **substring igual a uma chave** do catálogo; se nenhuma bater, `missingCode`. Se bater, validar entrada com `invalidCatalogEntry` se incompleta.
  - **Catálogo vazio**: exigir que a mensagem estática satisfaça `codePattern`.
  - **Onde inspecionar**:
    - `ThrowStatement`: primeiro argumento de `new ErrorLike(...)` ou string/template jogada diretamente.
    - `CallExpression` para loggers listados: primeiro argumento.
  - **Strings estáticas**: literais string ou `TemplateLiteral` sem expressões (`${}`).

## Remediação assistida — opções públicas planeadas (R1–R3)

Esta secção fixa **vocabulário e semântica** das opções públicas para remediação assistida alinhadas a [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md) e à visão em [`vision-hardcode-plugin.md`](vision-hardcode-plugin.md). As trilhas **R1** (por ficheiro), **R2** (multi-ficheiro / módulo partilhado) e **R3** (ficheiros de dados e ambiente) podem corresponder a **regras distintas** ou a **modos / sub-opções** da mesma família (`no-hardcoded-strings` ou nomes estáveis futuros); o contrato previne ambiguidade de schema **antes** do merge de implementação correspondente.

**Estado:** **misto** — o subconjunto **R1** listado na subsecção `no-hardcoded-strings` acima está **implementado** no schema da regra (marco M1). As restantes linhas da tabela abaixo permanecem **vocabulário normativo** e marcos alvo (M2–M4) até integração no pacote; `r2` / `r3` como valores de `remediationMode` estão reservados (sem remediação por autofix além de R1 na implementação actual). A taxonomia HC-* e níveis L1–L4 permanecem em [`docs/hardcoding-map.md`](../docs/hardcoding-map.md) (sem duplicar aqui a tabela mestra).

### Tabela de opções (nomes estáveis)

| Opção | Tipo | Padrão planeável | Trilha | Marco alvo | Na regra `no-hardcoded-strings` (M1) | Descrição |
|-------|------|------------------|--------|------------|----------------------------------------|-----------|
| `remediationMode` | `"off"` \| `"r1"` \| `"r2"` \| `"r3"` \| `"auto"` | `"off"` | Transversal | M1+ | **Sim** (schema) | Selecciona trilha de remediação ou heurística. `"off"` mantém apenas detecção; `r2`/`r3` sem autofix R1 na versão actual. |
| `constantNamingConvention` | string (enum documentado) | `"UPPER_SNAKE_CASE"` | R1 | M1 | **Sim** (só `UPPER_SNAKE_CASE`) | Convenção para identificadores de constantes injectadas no topo do ficheiro. |
| `dedupeWithinFile` | boolean | `true` | R1 | M1 | **Sim** | Uma constante por valor normalizado dentro do mesmo `SourceCode` (com desdobramento para literais de fallback de ambiente). |
| `remediationIncludeGlobs` | string[] | `[]` | R1 | M1 | **Sim** | Limita remediação a caminhos relativos que casam com estes globs (lista vazia = sem filtro extra além do `files` do ESLint). |
| `remediationExcludeGlobs` | string[] | `[]` | R1–R3 | M1+ | **Sim** | Exclui testes, i18n, exemplos (ex.: `**/*.i18n.ts`, `**/.env.example`). |
| `sharedConstantsModule` | string (path ou padrão resolvível) | — | R2 | M2 | **Não** | Destino do módulo partilhado para constantes reutilizadas entre ficheiros (por pacote ou política de repositório). |
| `sharedModuleImportStyle` | `"esm"` \| `"cjs"` \| `"project"` | `"project"` | R2 | M2 | **Não** | Estilo de import a gerar ao referenciar `sharedConstantsModule`. |
| `literalIndexRebuildPolicy` | `"every-run"` | `"every-run"` | R2 | M2 | **Não** | O índice de valores para duplicados no âmbito do lint **reconstrói-se** (ou invalida-se correctamente) em cada invocação `lintFiles` sobre o conjunto definido pelo `eslint.config`; não há cache stale entre execuções sem política explícita. |
| `parallelLintingCompatibility` | `"require-serial"` \| `"documented-limitations"` | `"documented-limitations"` | R2 | M2 | **Não** | Quando a API ESLint usar `concurrency` / workers, o desenho deve documentar: desactivar paralelismo para regras com estado global, segunda passagem determinística, ou índice em ficheiro idempotente (ver macro-plan). |
| `dataFileFormats` | `("json" \| "yaml" \| "yml" \| "toml" \| "properties")[]` | `["json","yaml"]` | R3 | M3 | **Não** | Formatos de ficheiros de dados onde chaves podem ser escritas ou fundidas. |
| `dataFileTargets` | string[] | `[]` | R3 | M3 | **Não** | Caminhos ou globs dos ficheiros de dados (vazio = derivação por convenção documentada na implementação). |
| `dataFileMergeStrategy` | `"merge-keys"` \| `"fail-on-conflict"` | `"merge-keys"` | R3 | M3 | **Não** | Comportamento ante chaves existentes e conflitos; preservar comentários YAML quando possível é objectivo de qualidade, não garantido em todas as versões. |
| `secretRemediationMode` | `"suggest-only"` \| `"placeholder-default"` \| `"aggressive-autofix-opt-in"` | `"suggest-only"` | Transversal | M4 | **Não** | Modo seguro por defeito: sem copiar valores sensíveis em claro; fix agressivo exige opt-in explícito. Alinhado a L1 em [`docs/hardcoding-map.md`](../docs/hardcoding-map.md). |
| `envDefaultLiteralPolicy` | `"include"` \| `"report-separate"` \| `"ignore"` | `"include"` | Transversal | M1–M3 | **Sim** | Tratamento de literais que são fallbacks de `process.env` (operadores `??` ou `||`) ou espelhos em constantes; mesma classe de hardcode que o literal de default (ver macro-plan). |

### R1 — constantes no mesmo ficheiro

- **Objectivo:** `fix` / `suggest` com âmbito ao ficheiro actual, compatível com o modelo clássico de `fixer` ESLint no AST corrente.
- **Comportamento esperado (M1):** declarações injectadas após imports (ou no topo), substituição de ocorrências no mesmo `SourceCode` quando `dedupeWithinFile` for verdadeiro; pormenores e matriz *suggest* vs *fix* na documentação da regra e na suite RuleTester do pacote.

### R2 — módulo partilhado e índice global no âmbito do lint

- **Objectivo:** quando o **mesmo valor normalizado** aparece em **mais do que um** ficheiro do conjunto lintado, gerar ou actualizar um **módulo partilhado** (`sharedConstantsModule`) e reescrever imports e referências.
- **Índice:** `literalIndexRebuildPolicy` obriga coerência com a execução actual do ESLint sobre `files` / `ignores` — “global” significa o âmbito do projecto segundo o flat config, não o universo da organização (ver macro-plan).
- **Paralelismo:** `parallelLintingCompatibility` obriga a documentar a interacção com `concurrency` / workers (estado em memória partilhado pode ser inválido se vários workers processarem ficheiros em paralelo).

### R3 — ficheiros de dados e ambiente

- **Objectivo:** externalizar valores para `.json`, `.yaml`/`.yml`, `.toml`, `.properties` (ou subset em `dataFileFormats`) e código de leitura adequado à stack.
- **Segredos:** valores classificados como sensíveis **não** são escritos em claro em ficheiros de dados; segue `secretRemediationMode` e a política de segredos do macro-plan.
- **Merge:** `dataFileMergeStrategy` define expectativa mínima ante chaves duplicadas ou conflitos de escrita.

### Segredos e literais de default de ambiente

- **Segredos:** heurísticas e gravidade alinhadas ao mapa; sugestões devem orientar env / cofres / gestão de segredos da plataforma **sem** simular fornecedores externos no repositório ([`specs/agent-integration-testing-policy.md`](agent-integration-testing-policy.md)).
- **Literais de default:** expressões com `process.env`, operadores `??` ou `||` e um literal de string como fallback tratam esse literal como candidato a remediação segundo `envDefaultLiteralPolicy` e a trilha efectiva após classificação.

## Compatibilidade

- Implementação em TypeScript ou JavaScript ES modules, alinhada à API de regras do ESLint 9.
- Testes automatizados devem cobrir casos positivos e negativos por regra (ver skill em `.cursor/skills/eslint-plugin-workflow`).
- **Fumaça e2e**: além do RuleTester, o pacote mantém testes de integração em `e2e/` que usam a API Node.js do ESLint (`ESLint`, `lintFiles`) contra fixtures com flat config e o plugin carregado a partir de `dist/`:
  - **Hello World mínimo** (`e2e/fixtures/hello-world/`): valida carregamento do plugin e a regra `hello-world`.
  - **Massa NestJS** (workspace auxiliar [`packages/e2e-fixture-nest`](../packages/e2e-fixture-nest/), ver [`specs/e2e-fixture-nest.md`](e2e-fixture-nest.md)): aplicação Nest real; o e2e `nest-workspace.e2e.mjs` linta `src/fixture-hardcodes/**/*.ts` e fixa contagens de `hello-world` e `no-hardcoded-strings` como fumaça adicional. Alterar essa massa exige atualizar o e2e e o spec.
- Esses fluxos **não substituem** os testes por regra com RuleTester.

## Versão do documento

- **0.9.0** — M1 / tarefa A3: `no-hardcoded-strings` com schema object (opções R1 M1), `messageId`s `hardcoded` e `hardcodedEnvDefault`, modo efectivo de remediação e secção de remediação com estado **misto** (implementado vs vocabulário futuro); alinhado à implementação em [`packages/eslint-plugin-hardcode-detect/src/rules/no-hardcoded-strings.ts`](../packages/eslint-plugin-hardcode-detect/src/rules/no-hardcoded-strings.ts).
- **0.8.0** — M0: secção *Remediação assistida — opções públicas planeadas (R1–R3)* com tabela de opções estáveis (caminhos partilhados R2, formatos R3, `secretRemediationMode`, `envDefaultLiteralPolicy`, índice e paralelismo); ligação do schema planeado à regra `no-hardcoded-strings`.
- **0.7.0** — remissão ao plano macro de remediação em [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md); obrigação de alinhar opções públicas no marco M0 desse plano.
- **0.6.0** — `messages`: recomendação de prefixos HCD-ERR-* por campo, alinhados a [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) v2.0.0.
- **0.5.0** — catálogo `standardize-error-messages`: campos `seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround` (alinhados a [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md)); substituem `raw` / `user` / `dev`.
- **0.4.0** — e2e com massa Nest (`e2e-fixture-nest` + contagens fixas); detalhes em [`e2e-fixture-nest.md`](e2e-fixture-nest.md).
- **0.3.0** — fumaça e2e (motor + flat config + plugin) descrita; RuleTester permanece o contrato principal por regra.
- **0.2.0** — regras `hello-world` (demo) e `no-hardcoded-strings` (primeira regra de produto) descritas e implementáveis no pacote.
- **0.1.0** — alinhado ao snapshot legado em `reference/legacy-snapshot/*.mjs`.
