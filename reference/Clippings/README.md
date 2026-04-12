---
title: "Clippings — visão geral"
description: "Organização de recortes da web no vault Claro"
tags:
  - clippings
  - index
---

# Clippings — recortes da web (vault Claro)

Esta pasta guarda **cópias em Markdown** de páginas ou documentação obtidas na internet, organizadas por **domínio temático** (não por data). O objetivo é pesquisa, referência offline e rastreabilidade da **fonte original**.

## Onde entra o quê

| Área | Caminho | Conteúdo típico |
|------|---------|-----------------|
| Desenvolvimento → JavaScript → ESLint | `dev/javascript/eslint/` → `reference/`, `guides/`, `packages/` | Documentação ESLint: referência, guias, páginas npm |
| Desenvolvimento → JavaScript → npm | `dev/javascript/npm/` | Documentação npm, registry |
| Desenvolvimento → Cursor (IDE / agente) | `dev/cursor/` → `docs/`, `cli/`, `cloud/`, `skills/`, `plugins/`, `rules/`, `mcp/`, `community/` | Documentação cursor.com |
| Desenvolvimento → MCP (protocolo) | `dev/mcp/` | modelcontextprotocol.io — especificação e guias neutros |
| Normas e convenções | `standards/` | Especificações (ex.: commits, semver relacionado) |

**Regra:** ao acrescentar um recorte, escolha a pasta mais específica que faça sentido. Se não existir, crie **uma subpasta nova** sob `dev/` ou `standards/` (ou outro domínio de topo acordado) e documente-a neste README na tabela acima.

## Convenções de ficheiro

- **Um ficheiro por URL canónica** (evitar duplicar a mesma página com nomes diferentes).
- **Nome do ficheiro:** descritivo, legível, derivado do título da página — caracteres seguros para ficheiros (evitar `:` `/` `\`).
- **Formato:** Markdown (`.md`) com **frontmatter YAML** obrigatório (ver skill `claro-clippings` e `casa-conectada-build/clippings-FRONTMATTER-SCHEMA.md`).
- **Imagens ou anexos** não vão ao lado solto do `.md`: usam `Obsidian/Claro/assets/clippings/<subpasta>/` e embeds com caminho **relativo à nota** (regra geral do vault Claro).

## Ligações com o repositório

- **Agente:** `agente-clippings-vault-claro` em `AGENTS.md`.
- **Validação:** `python3 casa-conectada-build/check-claro-clippings-frontmatter.py` (na raiz `Vaults/`).
- **Regra Cursor:** `.cursor/rules/claro-clippings.mdc`.
- **Skill:** `.cursor/skills/claro-clippings/SKILL.md`.

## Índice rápido (pastas)

- [[Clippings/dev/javascript/eslint/README|ESLint]]
- [[Clippings/dev/javascript/npm/README|npm]]
- [[Clippings/dev/cursor/README|Cursor]]
- [[Clippings/dev/mcp/README|MCP (protocolo)]]
- [[Clippings/standards/README|Normas e convenções]]
