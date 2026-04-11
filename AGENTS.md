# Instruções para agentes (Cursor / CLI)

Este repositório é mantido por agentes de IA e humanos. Siga a ordem de autoridade abaixo.

## Hierarquia de fontes

1. [`specs/plugin-contract.md`](specs/plugin-contract.md) — contrato funcional das regras ESLint e opções públicas.
2. [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — **obrigações de Git** ao concluir trabalho com alterações locais.
3. [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) — **único** local de código-fonte do plugin publicável.
4. [`docs/`](docs/) e [`README.md`](README.md) — documentação de arquitetura e uso.
5. [`reference/`](reference/) — somente leitura; não é dependência de build nem de runtime.

## Regras obrigatórias

- **Não** importar, reexportar nem referenciar arquivos em `reference/` a partir de `packages/`, `eslint.config.*` de produção ou testes do pacote.
- **Não** alterar `reference/` exceto em PR explícito de “atualização de snapshot” (título/descrição claros).
- Novas regras ou mudanças de comportamento: atualizar **primeiro** `specs/plugin-contract.md`, depois implementar em `packages/`.
- Preferir imports relativos dentro de `packages/eslint-plugin-hardcode-detect` conforme convenção do projeto.
- Após edições que afetem estilo ou tipos, corrija lints conforme configuração do pacote (quando existir).

## Versionamento Git (obrigatório ao concluir o prompt)

Ao **finalizar** o trabalho solicitado, depois de implementar ou documentar:

1. Siga o contrato em [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) e a skill [`.cursor/skills/git-agent-workflow/SKILL.md`](.cursor/skills/git-agent-workflow/SKILL.md).
2. Se houver mudanças locais: `git status` → `git add` (seletivo) → `git commit` com mensagem clara → `git push` para o remoto na branch atual.
3. Se não houver nada a commitar, declare explicitamente.
4. Se o push falhar (rede, permissões, branch protegida), relate o erro e deixe o commit local disponível.

Neste repositório, esta política **prevalece** sobre instruções genéricas de não usar `git commit`/`git push` fora de container.

## Mapa de diretórios

| Caminho | Responsabilidade |
|---------|------------------|
| `packages/eslint-plugin-hardcode-detect/` | Código e testes do plugin npm. |
| `specs/` | Contrato e requisitos formais. |
| `docs/` | Arquitetura e documentação suplementar. |
| `reference/legacy-snapshot/` | Snapshot histórico; não usar como código vivo. |
| `.github/actions/ops-eslint/` | Composite Action para lint em Docker. |
| `.cursor/rules/` | Regras de contexto do Cursor para este repo. |
| `.cursor/skills/` | Skills reutilizáveis pelos agentes neste repo (inclui `git-agent-workflow`). |

## Fluxo sugerido de PR

1. Descrever mudança no spec (se aplicável).
2. Implementar e testar em `packages/`.
3. Atualizar `README.md` / `docs/` se o uso público mudar.

## Testes

- Comando alvo: `npm test` no pacote (ver [`packages/eslint-plugin-hardcode-detect/package.json`](packages/eslint-plugin-hardcode-detect/package.json)).
- Na raiz, workspaces npm: `npm test --workspace eslint-plugin-hardcode-detect` após instalação na raiz.
