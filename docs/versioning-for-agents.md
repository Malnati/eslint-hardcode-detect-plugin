# Versionamento orientado a agentes

## Objetivo

Garantir que cada sessão de trabalho concluída por um agente deixe o histórico Git atualizado no remoto, facilitando revisão, CI e rastreabilidade.

## Fluxo resumido

1. Trabalho concluído (código, testes, docs, configs).
2. Revisar `git status`.
3. `git add` seletivo → `git commit` com mensagem clara → `git push`.

Detalhes normativos: [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md). Antes do commit, atualize a documentação conforme [`specs/agent-documentation-workflow.md`](../specs/agent-documentation-workflow.md).

## Mensagens de commit

- Primeira linha: até ~72 caracteres; modo imperativo (“Adiciona…”, “Corrige…”).
- Opcional: linha em branco e parágrafo com motivação ou referência a issue/spec.

## Ferramentas

- **Cursor / CLI**: seguir [`AGENTS.md`](../AGENTS.md) e a skill [`.cursor/skills/git-agent-workflow`](../.cursor/skills/git-agent-workflow/SKILL.md).
- Hooks opcionais no cliente podem complementar, mas **não substituem** a obrigação descrita no spec.

## Falhas de push

Se o ambiente não tiver credenciais, informar o usuário e listar os comandos pendentes (`git push`).
