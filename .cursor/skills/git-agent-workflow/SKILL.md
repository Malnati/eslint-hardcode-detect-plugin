---
name: git-agent-workflow
description: Finalizar sessão com commit e push conforme specs/agent-git-workflow.md
---

# Skill: fluxo Git para agentes

## Quando usar

Ao terminar tarefas que modificam este repositório (código, testes, documentação, configs de Cursor).

## Passos

0. Garanta que o fechamento do prompt segue a Fase D de [`specs/agent-session-workflow.md`](../../../specs/agent-session-workflow.md) e o checklist de [`specs/agent-ia-governance.md`](../../../specs/agent-ia-governance.md); em seguida documentação atualizada conforme [`specs/agent-documentation-workflow.md`](../../../specs/agent-documentation-workflow.md) (em especial `docs/repository-tree.md` se a árvore mudou).
1. Rode `git status` e inspecione diffs se necessário.
2. Se não houver alterações: informe "Nada a commitar" e encerre.
3. Se houver alterações:
   - `git add` com caminhos específicos (respeitar `.gitignore`).
   - `git commit -m "..."` com mensagem imperativa e escopo claro.
   - `git push origin "$(git branch --show-current)"` ou equivalente na branch atual.
4. Se `git push` falhar, copie a mensagem de erro para o usuário e sugira verificar credenciais ou branch protegida.

## Autoridade

Normas completas: [`specs/agent-git-workflow.md`](../../../specs/agent-git-workflow.md) e [`docs/versioning-for-agents.md`](../../../docs/versioning-for-agents.md).
