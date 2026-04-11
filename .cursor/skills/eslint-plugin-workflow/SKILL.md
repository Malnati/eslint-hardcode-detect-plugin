---
name: eslint-plugin-workflow
description: Implementar ou alterar regras do eslint-plugin-hardcode-detect alinhadas ao spec, sem depender da pasta reference.
---

# Workflow do plugin ESLint (este repositório)

Use quando for criar regras, opções ou testes para [`packages/eslint-plugin-hardcode-detect`](../../../packages/eslint-plugin-hardcode-detect).

## Antes de codar

0. Confirme escopo e fontes com [`specs/agent-session-workflow.md`](../../../specs/agent-session-workflow.md) (Fases A–B); para ESLint, a consulta a Clippings é obrigatória antes de implementar.
1. Leia [`specs/plugin-contract.md`](../../../specs/plugin-contract.md).
2. Confirme que a mudança está refletida no spec (edite o spec primeiro se o contrato mudar).
3. Consulte [`reference/Clippings/`](../../../reference/Clippings/) e siga [`specs/agent-reference-clippings.md`](../../../specs/agent-reference-clippings.md); use a skill [`reference-clippings-workflow`](../reference-clippings-workflow/SKILL.md) quando precisar sincronizar recortes da documentação oficial.

## Implementação

1. Coloque regras e helpers em `packages/eslint-plugin-hardcode-detect/src/` (por exemplo `src/rules/<id>.ts`), com regras no formato **objeto** (`meta` + `create`), `messageId` em `meta.messages` e `meta.schema` quando aplicável — alinhado a [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) e a [`eslint-plugin-eslint-plugin`](../../../reference/Clippings/dev/javascript/eslint/eslint-plugin-eslint-plugin.md) (lint local via `npm run lint` no pacote).
2. No ponto de entrada (`src/index.ts`), exporte `meta` (nome/versão do `package.json` e `namespace` coerente com o prefixo do pacote), `rules`, e `configs` com `Object.assign` quando precisar referenciar o próprio plugin (padrão da documentação [Create Plugins](https://eslint.org/docs/latest/extend/plugins)).
3. **Não** copie arquivos de `reference/legacy-snapshot/` como dependência; use apenas como leitura comparativa se necessário.

## Testes

1. Adicione casos em `packages/eslint-plugin-hardcode-detect/tests/` com **`RuleTester`** do ESLint (API estável; ver Clippings [Node.js API](../../../reference/Clippings/dev/javascript/eslint/Node.js%20API%20Reference%20-%20ESLint%20-%20Pluggable%20JavaScript%20Linter.md)) e o runner `node --test` definido no `package.json`.
2. Cubra mensagens de erro listadas no spec e limites (ex.: strings curtas ignoradas em `no-hardcoded-strings`).
3. Depois de editar regras ou o entrypoint, rode `npm run lint` e `npm test` no pacote (Node **≥ 22** conforme `engines` do pacote).

## Checklist

- [ ] Comportamento documentado em `specs/plugin-contract.md` e visão atualizada se necessário em `specs/vision-hardcode-plugin.md`
- [ ] Nenhum import de `reference/`
- [ ] Testes passando (`npm test` no pacote)
- [ ] Ao finalizar: [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) e `docs/repository-tree.md` se a árvore mudou
- [ ] Ao finalizar: [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md) (commit e push se houver mudanças)
