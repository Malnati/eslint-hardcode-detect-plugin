# Clippings (documentação oficial espelhada)

Esta pasta guarda **trechos estáveis** extraídos de documentação **oficial** (ESLint, Node.js, npm, etc.) para que agentes de IA e humanos alinhem decisões de implementação **sem depender só de memória ou buscas ad hoc**.

## Propósito

- **Fonte de verdade local** para APIs, opções e comportamentos citados no trabalho no plugin.
- **Rastreabilidade**: cada arquivo deve indicar origem, data da extração e, quando aplicável, versão da documentação.
- **Não é código executável**: nada aqui é importado por `packages/` nem entra em build.

## Convenções de nome e conteúdo

1. **Um tópico por arquivo** quando possível (ex.: `eslint-custom-rules.md`, `eslint-flat-config.md`).
2. **Cabeçalho YAML ou bloco inicial** em cada arquivo com:
   - `source:` URL canônica da página oficial.
   - `retrieved:` data (ISO 8601, ex. `2026-04-11`).
   - `license / terms:` nota breve (ex.: “conteúdo © ESLint; trecho para fins de referência técnica”).
3. **Corpo**: citação ou resumo fiel; marque claramente o que é **citação literal** vs **resumo**.
4. **Atualização**: quando a documentação oficial mudar de forma relevante para o plugin, atualize o clipping em commit **explícito** (mensagem clara: ex. `docs(clippings): atualizar ESLint Custom Rules`).

## Índice sugerido

Mantenha a lista abaixo alinhada aos arquivos presentes (edite ao adicionar/remover clippings):

| Caminho (relativo a esta pasta) | Tópico |
|---------------------------------|--------|
| `dev/javascript/eslint/Create Plugins - ESLint - Pluggable JavaScript Linter.md` | Criar plugins ESLint |
| `dev/javascript/eslint/Custom Rules - ESLint - Pluggable JavaScript Linter.md` | Regras customizadas |
| `dev/javascript/eslint/Extend ESLint - ESLint - Pluggable JavaScript Linter.md` | Estender ESLint |
| `dev/javascript/eslint/eslint-plugin-eslint-plugin.md` | eslint-plugin-eslint-plugin |
| `dev/javascript/eslint/eslint-plugin-n.md` | eslint-plugin-n |
| `dev/javascript/eslint/eslint.md` | Visão geral ESLint |
| `dev/javascript/eslint/Node.js API Reference - ESLint - Pluggable JavaScript Linter.md` | API Node.js do ESLint |
| `dev/javascript/eslint/Node.js API Reference - ESLint - Pluggable JavaScript Linter 1.md` | API Node.js (variante/arquivo duplicado de trabalho) |
| `dev/javascript/npm/npm Docs.md` | Documentação npm |
| `dev/javascript/npm/README.md` | Índice npm em Clippings |
| `dev/javascript/eslint/README.md` | Índice ESLint em Clippings |
| `standards/Conventional Commits.md` | Conventional Commits |
| `standards/README.md` | Índice de padrões em Clippings |

## Relação com outras pastas

- [`../README.md`](../README.md) — visão geral de `reference/`.
- [`../../specs/agent-reference-clippings.md`](../../specs/agent-reference-clippings.md) — contrato normativo para agentes (consulta obrigatória e manutenção).
- **Não confundir** com [`../legacy-snapshot/`](../legacy-snapshot/): lá está material histórico de snapshot; aqui está documentação **oficial** recortada para consulta.
