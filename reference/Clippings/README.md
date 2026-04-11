---
title: "Clippings — visão geral"
description: "Trechos da documentação oficial para o plugin eslint-plugin-hardcode-detect"
tags:
  - clippings
  - index
---

# Clippings (documentação oficial espelhada)

Esta pasta guarda **trechos estáveis** extraídos de documentação **oficial** (ESLint, Node.js, npm, etc.), organizados por **domínio temático** (não por data), para que agentes de IA e humanos alinhem decisões de implementação **sem depender só de memória ou buscas ad hoc**.

## Propósito

- **Fonte de verdade local** para APIs, opções e comportamentos citados no trabalho no plugin.
- **Rastreabilidade**: cada arquivo deve indicar origem, data da extração e, quando aplicável, versão da documentação.
- **Não é código executável**: nada aqui é importado por `packages/` nem entra em build.

## Onde entra o quê

| Área | Caminho | Conteúdo típico |
|------|---------|-----------------|
| Desenvolvimento → JavaScript → ESLint | `dev/javascript/eslint/` | Documentação ESLint, plugins, API Node |
| Desenvolvimento → JavaScript → npm | `dev/javascript/npm/` | Documentação npm, registry |
| Normas e convenções | `standards/` | Especificações (ex.: commits, semver relacionado) |

**Regra:** ao acrescentar um recorte, escolha a pasta mais específica que faça sentido. Se não existir, crie **uma subpasta nova** sob `dev/` ou `standards/` (ou outro domínio de topo acordado), documente-a **neste README** na tabela acima e atualize [`docs/repository-tree.md`](../../docs/repository-tree.md) no mesmo ciclo, conforme [`specs/agent-reference-clippings.md`](../../specs/agent-reference-clippings.md).

## Convenções de nome e conteúdo

1. **Um tópico por arquivo** quando possível; **um ficheiro por URL canónica** (evitar duplicar a mesma página com nomes diferentes).
2. **Nome do ficheiro:** descritivo, legível, derivado do título da página — caracteres seguros para ficheiros (evitar `:` `/` `\`).
3. **Formato:** Markdown (`.md`) com **frontmatter YAML** recomendado nos recortes (metadados mínimos alinhados ao restante desta pasta).
4. **Cabeçalho YAML ou bloco inicial** em cada arquivo com:
   - `source:` URL canônica da página oficial.
   - `retrieved:` data (ISO 8601, ex. `2026-04-11`).
   - `license / terms:` nota breve (ex.: “conteúdo © ESLint; trecho para fins de referência técnica”).
5. **Corpo**: citação ou resumo fiel; marque claramente o que é **citação literal** vs **resumo**.
6. **Atualização**: quando a documentação oficial mudar de forma relevante para o plugin, atualize o clipping em commit **explícito** (mensagem clara: ex. `docs(clippings): atualizar ESLint Custom Rules`).

## Índice de arquivos

Mantenha a lista abaixo alinhada aos arquivos presentes (edite ao adicionar/remover clippings):

| Caminho (relativo a esta pasta) | Tópico |
|---------------------------------|--------|
| `dev/javascript/eslint/Create Plugins - ESLint - Pluggable JavaScript Linter.md` | Criar plugins ESLint |
| `dev/javascript/eslint/Custom Rules - ESLint - Pluggable JavaScript Linter.md` | Regras customizadas |
| `dev/javascript/eslint/Debug Your Configuration - ESLint - Pluggable JavaScript Linter.md` | Depurar configuração ESLint |
| `dev/javascript/eslint/Extend ESLint - ESLint - Pluggable JavaScript Linter.md` | Estender ESLint |
| `dev/javascript/eslint/eslint-plugin-eslint-plugin.md` | eslint-plugin-eslint-plugin |
| `dev/javascript/eslint/eslint-plugin-n.md` | eslint-plugin-n |
| `dev/javascript/eslint/eslint.md` | Visão geral ESLint |
| `dev/javascript/eslint/Node.js API Reference - ESLint - Pluggable JavaScript Linter.md` | API Node.js do ESLint |
| `dev/javascript/eslint/Node.js API Reference - ESLint - Pluggable JavaScript Linter 1.md` | API Node.js (variante/arquivo duplicado de trabalho) |
| `dev/javascript/eslint/Propose a New Rule - ESLint - Pluggable JavaScript Linter.md` | Propor nova regra ESLint |
| `dev/javascript/eslint/Rules Reference - ESLint - Pluggable JavaScript Linter.md` | Referência de regras ESLint |
| `dev/javascript/npm/npm Docs.md` | Documentação npm |
| `dev/javascript/npm/README.md` | Índice npm em Clippings |
| `dev/javascript/eslint/README.md` | Índice ESLint em Clippings |
| `standards/Conventional Commits.md` | Conventional Commits |
| `standards/README.md` | Índice de padrões em Clippings |

## Relação com outras pastas e normas

- [`../README.md`](../README.md) — visão geral de `reference/`.
- [`../../specs/agent-reference-clippings.md`](../../specs/agent-reference-clippings.md) — contrato normativo para agentes (consulta obrigatória e manutenção).
- **Skill:** [`.cursor/skills/reference-clippings-workflow/SKILL.md`](../../.cursor/skills/reference-clippings-workflow/SKILL.md).
- **Não confundir** com [`../legacy-snapshot/`](../legacy-snapshot/): lá está material histórico de snapshot; aqui está documentação **oficial** recortada para consulta.

## Índice rápido (subpastas)

- [ESLint](dev/javascript/eslint/README.md)
- [npm](dev/javascript/npm/README.md)
- [Normas e convenções](standards/README.md)
