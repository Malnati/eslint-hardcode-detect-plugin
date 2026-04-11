---
name: eslint-plugin-workflow
description: Implementar ou alterar regras do eslint-plugin-hardcode-detect alinhadas ao spec, sem depender da pasta reference.
---

# Workflow do plugin ESLint (este repositório)

Use quando for criar regras, opções ou testes para [`packages/eslint-plugin-hardcode-detect`](../../../packages/eslint-plugin-hardcode-detect).

## Antes de codar

1. Leia [`specs/plugin-contract.md`](../../../specs/plugin-contract.md).
2. Confirme que a mudança está refletida no spec (edite o spec primeiro se o contrato mudar).

## Implementação

1. Coloque regras e helpers em `packages/eslint-plugin-hardcode-detect/src/` (estrutura interna do pacote; raiz do repositório).
2. Exporte o plugin no ponto de entrada do pacote (`src/index.ts`) com nomes de regras estáveis.
3. **Não** copie arquivos de `reference/legacy-snapshot/` como dependência; use apenas como leitura comparativa se necessário.

## Testes

1. Adicione casos em `packages/eslint-plugin-hardcode-detect/tests/` usando o runner configurado no `package.json` (ex.: `RuleTester` do ESLint quando a suíte estiver configurada).
2. Cubra mensagens de erro listadas no spec e limites (ex.: strings curtas ignoradas em `no-hardcoded-strings`).

## Checklist

- [ ] Comportamento documentado em `specs/plugin-contract.md` e visão atualizada se necessário em `specs/vision-hardcode-plugin.md`
- [ ] Nenhum import de `reference/`
- [ ] Testes passando (`npm test` no pacote)
- [ ] Ao finalizar: [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) e `docs/repository-tree.md` se a árvore mudou
- [ ] Ao finalizar: [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md) (commit e push se houver mudanças)
