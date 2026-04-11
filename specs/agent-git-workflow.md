# Contrato de versionamento para agentes (Git)

Este repositório é desenvolvido e mantido por agentes de IA (Cursor / Cursor CLI). O controle de versões **não é opcional** ao concluir um trabalho que altere o repositório.

## Escopo

- **Quando aplicar**: ao **finalizar** a resposta a um prompt do usuário, depois de implementar, testar ou documentar, se houver alterações locais em arquivos rastreados (ou novos arquivos a adicionar).
- **Objetivo**: manter o remoto alinhado ao estado entregue, com mensagens de commit legíveis e rastreáveis.

## Procedimento obrigatório

1. Cumprir [`agent-documentation-workflow.md`](agent-documentation-workflow.md) antes de commitar (README, `docs/`, `specs/`, [`docs/repository-tree.md`](../docs/repository-tree.md) se a árvore mudou).
2. `git status` — verificar o que mudou.
3. Se não houver mudanças relevantes para commitar (working tree limpa), informar explicitamente que não há nada a versionar.
4. Se houver mudanças:
   - `git add` dos caminhos pertinentes (evitar `git add .` cego se houver artefatos que não devam entrar; respeitar [`.gitignore`](../.gitignore)).
   - `git commit -m "<mensagem>"` — mensagem em português ou inglês consistente com o projeto; primeira linha imperativa e curta; corpo opcional com contexto.
   - `git push` para o remoto configurado (`origin`) na branch atual.

## Restrições

- **Não** fazer `git push --force` em `main`/`master` salvo instrução explícita do mantenedor.
- **Não** commitar segredos (tokens, chaves). Usar variáveis de ambiente e arquivos ignorados.
- Se `git push` falhar (autenticação, rede, branch protegida), **relatar o erro completo** e deixar o commit local pronto para o humano enviar.

## Precedência

Instruções neste repositório (`AGENTS.md`, esta spec, rules do Cursor) **prevalecem** sobre políticas genéricas de “não usar Git fora de container” quando em conflito: aqui o fluxo esperado inclui commit e push ao concluir o trabalho.

## Versão do documento

- **1.0.0** — introdução do contrato de Git para agentes.
- **1.1.0** — integração obrigatória com documentação (`agent-documentation-workflow`) antes do commit.
