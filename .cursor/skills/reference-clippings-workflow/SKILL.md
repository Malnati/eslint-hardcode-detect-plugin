---
name: reference-clippings-workflow
description: >-
  Consulta e sincroniza trechos da documentação oficial em reference/Clippings (ESLint, npm, Node) com os specs.
  Use antes de implementar mudanças que dependam da API do ESLint, RuleTester, plugins, config flat/legacy ou empacotamento npm.
  Keywords: Clippings, documentação oficial, ESLint docs, agent-reference-clippings, índice README em Clippings.
---

# Skill: Clippings e documentação oficial

## Quando usar

No **início** ou durante trabalho que toque ESLint (regras, plugin API, config), publicação npm do pacote, ou interpretação de docs do ecossistema para este repositório.

## Início do prompt (escopo ESLint / npm / CI relacionada)

1. Ler [`specs/agent-ia-governance.md`](../../../specs/agent-ia-governance.md) e [`specs/agent-session-workflow.md`](../../../specs/agent-session-workflow.md) (Fases A–B) para classificar se este skill é obrigatório.
2. Se obrigatório: seguir a seção **Procedimento** abaixo **antes** de alterar código em `packages/`.

## Procedimento

1. Ler [`specs/agent-reference-clippings.md`](../../../specs/agent-reference-clippings.md).
2. Listar e abrir arquivos relevantes em [`reference/Clippings/`](../../../reference/Clippings/) (ver [`README`](../../../reference/Clippings/README.md) e índice).
3. Se faltar material ou estiver desatualizado: consultar fonte oficial (ferramenta MCP de documentação do projeto quando disponível) e **adicionar ou atualizar** um clipping com proveniência (URL, data, nota de licença/uso).
4. **Não** reescrever trechos literais só para trocar exemplos de paths absolutos vindos da documentação oficial (exceção à política de caminhos relativos — ver [`docs/documentation-policy.md`](../../../docs/documentation-policy.md)).
5. Garantir **zero imports** de `reference/` a partir de `packages/`.
6. Se criar/mover/remover arquivos normativos em `Clippings/`, atualizar [`docs/repository-tree.md`](../../../docs/repository-tree.md) e o índice em `reference/Clippings/README.md`.
7. Ao finalizar o prompt: [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) e, se aplicável, [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md).

## Integração

- Complementa [`eslint-plugin-workflow`](../eslint-plugin-workflow/SKILL.md) (implementação no pacote) e [`github-markdown-docs`](../github-markdown-docs/SKILL.md) (grafo e políticas Markdown).
