# Contrato de versionamento para agentes (Git)

Este repositório é desenvolvido e mantido por agentes de IA (Cursor / Cursor CLI). O controle de versões **não é opcional** ao concluir um trabalho que altere o repositório.

## Escopo

- **Quando aplicar**: ao **finalizar** a resposta a um prompt do usuário, depois de implementar, testar ou documentar, se houver alterações locais em arquivos rastreados (ou novos arquivos a adicionar).
- **Objetivo**: manter o remoto alinhado ao estado entregue, com mensagens de commit legíveis e rastreáveis.

## Procedimento obrigatório

1. Cumprir a Fase D de [`agent-session-workflow.md`](agent-session-workflow.md) e, em seguida, [`agent-documentation-workflow.md`](agent-documentation-workflow.md) antes de commitar (README, `docs/`, `specs/`, [`docs/repository-tree.md`](../docs/repository-tree.md) se a árvore mudou).
2. `git status` — verificar o que mudou.
3. Se não houver mudanças relevantes para commitar (working tree limpa), informar explicitamente que não há nada a versionar.
4. Se houver mudanças:
   - `git add` dos caminhos pertinentes (evitar `git add .` cego se houver artefatos que não devam entrar; respeitar [`.gitignore`](../.gitignore)).
   - `git commit -m "<mensagem>"` — mensagem **obrigatoriamente** no formato **Conventional Commits** (ver secção abaixo).
   - `git push` para o remoto configurado (`origin`) na branch atual.

## Formato das mensagens (Conventional Commits)

**Obrigatório.** A especificação de referência está espelhada em [`reference/Clippings/standards/Conventional Commits.md`](../reference/Clippings/standards/Conventional%20Commits.md) (Conventional Commits 1.0.0). Resumo aplicável a este repositório:

**Primeira linha** (obrigatória):

```text
<type>[optional scope]: <description>
```

- **type**: substantivo em minúsculas (`feat`, `fix`, `docs`, etc.).
- **scope** (opcional): entre parênteses, descreve a área tocada no repositório.
- **description**: resumo curto no modo imperativo.
- **Breaking changes**: indicar com `!` imediatamente antes de `:` no prefixo `type/scope` e/ou rodapé `BREAKING CHANGE:` conforme a especificação.

**Tipos** admitidos (subset usual, alinhado ao ecossistema comum): `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `style`, e `revert` quando fizer sentido.

**Escopos** opcionais recomendados (lista não fechada — outros escopos são válidos quando descrevem bem a mudança):

| Escopo (exemplo) | Quando usar |
|------------------|-------------|
| `plugin` | Alterações em [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/) |
| `docs` | `docs/`, `README.md`, `CONTRIBUTING.md` e documentação Markdown em geral |
| `specs` | Contratos e fluxos em `specs/` como foco principal do commit |
| `cursor` | `.cursor/` (rules, skills, commands) |
| `ci` | `.github/` e automação de CI |

**Idioma:** os *types* permanecem em inglês. A **descrição** na primeira linha em inglês imperativo é **recomendada** (CHANGELOG e ferramentas). Português imperativo na descrição é **aceitável** se o histórico do repositório for consistente nesse idioma.

**Corpo e rodapés** são opcionais: linha em branco após a primeira linha, parágrafos adicionais, rodapés estilo trailer (por exemplo `Refs: #123`).

**Exemplos:**

```text
feat(plugin): add rule option for ignored patterns

docs(specs): align agent-git-workflow with Conventional Commits

ci: pin Node version in release workflow

fix(plugin)!: change default severity for hardcode rule
```

## Restrições

- **Não** fazer `git push --force` em `main`/`master` salvo instrução explícita do mantenedor.
- **Não** commitar segredos (tokens, chaves). Usar variáveis de ambiente e arquivos ignorados.
- Se `git push` falhar (autenticação, rede, branch protegida), **relatar o erro completo** e deixar o commit local pronto para o humano enviar.

## Precedência

Instruções neste repositório (`AGENTS.md`, esta spec, rules do Cursor) **prevalecem** sobre políticas genéricas de “não usar Git fora de container” quando em conflito: aqui o fluxo esperado inclui commit e push ao concluir o trabalho.

## Versão do documento

- **1.3.0** — formato obrigatório Conventional Commits; referência ao clipping em `reference/Clippings/standards/`; tipos e escopos recomendados.
- **1.2.0** — passo 1 do procedimento alinhado à Fase D de `agent-session-workflow.md`.
- **1.1.0** — integração obrigatória com documentação (`agent-documentation-workflow`) antes do commit.
- **1.0.0** — introdução do contrato de Git para agentes.
