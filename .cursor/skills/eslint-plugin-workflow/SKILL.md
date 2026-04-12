---
name: eslint-plugin-workflow
description: Implementar ou alterar regras do eslint-plugin-hardcode-detect alinhadas ao spec, sem depender da pasta reference.
---

# Workflow do plugin ESLint (este repositório)

Use quando for criar regras, opções ou testes para [`packages/eslint-plugin-hardcode-detect`](../../../packages/eslint-plugin-hardcode-detect).

## Antes de codar

0. Confirme escopo e fontes com [`specs/agent-session-workflow.md`](../../../specs/agent-session-workflow.md) (Fases A–B); para ESLint, a consulta a Clippings é obrigatória antes de implementar. Se o pedido invocar ideias de [`reference/agents-ref/`](../../../reference/agents-ref/) (ex.: “agente hardcoded” MBRA), cruze com [`specs/agent-mbra-reference-agents.md`](../../../specs/agent-mbra-reference-agents.md) e a skill [`mbra-reference-agents`](../mbra-reference-agents/SKILL.md).
1. Leia [`specs/plugin-contract.md`](../../../specs/plugin-contract.md).
2. Confirme que a mudança está refletida no spec (edite o spec primeiro se o contrato mudar).
3. Consulte [`reference/Clippings/`](../../../reference/Clippings/) e siga [`specs/agent-reference-clippings.md`](../../../specs/agent-reference-clippings.md); use a skill [`reference-clippings-workflow`](../reference-clippings-workflow/SKILL.md) quando precisar sincronizar recortes da documentação oficial.

## Implementação

1. Coloque regras e helpers em `packages/eslint-plugin-hardcode-detect/src/` (por exemplo `src/rules/<id>.ts`), com regras no formato **objeto** (`meta` + `create`), `messageId` em `meta.messages` e `meta.schema` quando aplicável — alinhado a [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) e a [`eslint-plugin-eslint-plugin`](../../../reference/Clippings/dev/javascript/eslint/eslint-plugin-eslint-plugin.md) (lint local via `npm run lint` no pacote).
2. No ponto de entrada (`src/index.ts`), exporte `meta` (nome/versão do `package.json` e `namespace` coerente com o prefixo do pacote), `rules`, e `configs` com `Object.assign` quando precisar referenciar o próprio plugin (padrão da documentação [Create Plugins](https://eslint.org/docs/latest/extend/plugins)).
3. **Não** copie arquivos de `reference/legacy-snapshot/` como dependência; use apenas como leitura comparativa se necessário.

## Testes

### RuleTester vs e2e (fumaça)

- **`tests/` + RuleTester**: valida o **comportamento da regra** isoladamente (casos válidos/inválidos). Fonte: documentação [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) e Clippings [Node.js API (RuleTester)](../../../reference/Clippings/dev/javascript/eslint/Node.js%20API%20Reference%20-%20ESLint%20-%20Pluggable%20JavaScript%20Linter.md).
- **`e2e/`**: fumaça de **integração** — motor ESLint 9, flat config e plugin carregado como em um projeto consumidor, via classe `ESLint` e `lintFiles` (Clippings [Node.js API](../../../reference/Clippings/dev/javascript/eslint/Node.js%20API%20Reference%20-%20ESLint%20-%20Pluggable%20JavaScript%20Linter.md); config em [Extend ESLint](https://eslint.org/docs/latest/extend/eslint)). O fixture mínimo fica em `e2e/fixtures/hello-world/`; o `eslint.config.mjs` do pacote ignora `e2e/fixtures/**` no lint do próprio plugin.
- **Fixture Nest (workspace)**: [`packages/e2e-fixture-nest`](../../../packages/e2e-fixture-nest) — aplicação Nest real; o e2e [`nest-workspace.e2e.mjs`](../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) usa `cwd` nesse pacote. Normas e contagens: [`specs/e2e-fixture-nest.md`](../../../specs/e2e-fixture-nest.md). Regra Cursor opcional: [`.cursor/rules/e2e-nest-fixture.mdc`](../../rules/e2e-nest-fixture.mdc).
- **`eslint-plugin-eslint-plugin`** e **`eslint-plugin-n`** no [`eslint.config.mjs`](../../../packages/eslint-plugin-hardcode-detect/eslint.config.mjs) aplicam-se ao **código-fonte do plugin** (`src/`, runners em `tests/` e `e2e/`), não aos arquivos de fixture tratados como projeto de terceiros.

### Procedimento

1. Adicione casos em `packages/eslint-plugin-hardcode-detect/tests/` com **`RuleTester`** e o runner `node --test` definido no `package.json`.
2. Para mudanças que afetem carregamento do plugin ou resolução de config, estenda ou ajuste os testes em `e2e/` quando fizer sentido (mantendo o Hello World como baseline).
3. Cubra mensagens de erro listadas no spec e limites (ex.: strings curtas ignoradas em `no-hardcoded-strings`).
4. Depois de editar regras ou o entrypoint, rode `npm run lint` e `npm test` no pacote (Node **≥ 22** conforme `engines` do pacote).

## Checklist

- [ ] Comportamento documentado em `specs/plugin-contract.md` e visão atualizada se necessário em `specs/vision-hardcode-plugin.md`
- [ ] Nenhum import de `reference/`
- [ ] Testes passando (`npm test` no pacote)
- [ ] Ao finalizar: [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) e `docs/repository-tree.md` se a árvore mudou
- [ ] Ao finalizar: [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md) (commit e push se houver mudanças)
