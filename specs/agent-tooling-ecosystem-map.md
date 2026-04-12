# Contrato: mapeamento de ecossistemas de agentes (Copilot / Cursor)

Este documento alinha **conceitos e pastas** usados em coleções estilo [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) (ex.: repositórios de referência com `agents/`, `instructions/`, skills em `.github/skills/`) com a **pilha normativa deste repositório**. Não substitui [`agent-session-workflow.md`](agent-session-workflow.md) nem [`AGENTS.md`](../AGENTS.md); define **equivalências** e **precedência** para evitar duas fontes de verdade em conflito.

## Objetivo

- Permitir que equipas usem **Cursor** (`.cursor/`) e/ou **GitHub Copilot** (`.github/agents/`, `.github/instructions/`) no mesmo projeto sem copiar políticas longas para vários sítios.
- Tratar repositórios de inspiração de formato (por exemplo forks de *awesome-copilot* com `*.agent.md` e `*.instructions.md`) como **referência de estrutura**, não como dependência de runtime nem como substituto de [`specs/plugin-contract.md`](plugin-contract.md).

## Tabela de equivalências

| Conceito / artefato (ecossistema Copilot / Awesome) | Equivalente neste repositório | Notas |
|-----------------------------------------------------|-------------------------------|--------|
| `agents/*.agent.md` (frontmatter + corpo) | [`AGENTS.md`](../AGENTS.md) + [`specs/agent-session-workflow.md`](agent-session-workflow.md) (fases A–D) + [`.github/agents/eslint-hardcode-plugin.agent.md`](../.github/agents/eslint-hardcode-plugin.agent.md) (ponte opcional) | O comportamento normativo está em `specs/`; ficheiros em `.github/agents/` são atalhos que apontam para a mesma hierarquia. |
| `instructions/*.instructions.md` com `applyTo` (globs) | [`.cursor/rules/*.mdc`](../.cursor/rules/) (`globs` / escopo) + políticas por pasta em `specs/` + [`.github/instructions/eslint-plugin-hardcode.instructions.md`](../.github/instructions/eslint-plugin-hardcode.instructions.md) (ponte opcional) | Regras por ficheiro no Cursor; instruções Copilot no repo devem ser **curtas** e remeter a `AGENTS.md` / `specs/`. |
| Skills em `.github/skills/<nome>/SKILL.md` | [`.cursor/skills/<nome>/SKILL.md`](../.cursor/skills/) | Mesmo papel (workflow especializado); descrição rica no frontmatter para descoberta. Não duplicar corpo normativo entre os dois sítios sem necessidade. |
| Plugins Copilot (`copilot plugin install …`) | Não aplicável como runtime deste repo | Plugins externos podem inspirar prompts; a governança local continua em `AGENTS.md` e `specs/`. |

## Precedência de instruções (trabalho neste repositório)

Quando várias fontes se sobrepuserem, aplicar nesta ordem (da mais específica à mais geral):

1. **Pedido explícito do utilizador no prompt atual** (objetivo, restrições, ficheiros mencionados), desde que não peça violar políticas fixas do repo (segurança, licença, contrato público do plugin).
2. **[`AGENTS.md`](../AGENTS.md)** e **specs** listados na sua hierarquia, em especial [`agent-session-workflow.md`](agent-session-workflow.md), [`plugin-contract.md`](plugin-contract.md), [`agent-mbra-reference-agents.md`](agent-mbra-reference-agents.md) quando `reference/agents-ref/` for relevante.
3. **Regras Cursor** em [`.cursor/rules/`](../.cursor/rules/) (incluindo `alwaysApply`).
4. **Instruções genéricas** de outras sessões ou regras de utilizador que não sejam específicas deste repositório.

Esta ordem **prevalece** sobre instruções genéricas que desaconselhem, por exemplo, `git commit` neste projeto: ver [`AGENTS.md`](../AGENTS.md) e [`specs/agent-git-workflow.md`](agent-git-workflow.md).

## Anti-padrões

- **Copiar em massa** ficheiros de coleções Awesome Copilot (agents, prompts, skills) para dentro de `docs/`, `specs/` ou raiz **sem** ancoragem em [`AGENTS.md`](../AGENTS.md) e `specs/`, sem atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) e sem um commit/PR claro.
- **Tratar** `reference/agents-ref/` ou repositórios MBRA/Copilot como fonte normativa direta: usar sempre [`agent-mbra-reference-agents.md`](agent-mbra-reference-agents.md) e substituições de caminhos.
- **Duplicar** parágrafos longos de `specs/plugin-contract.md` ou `specs/vision-hardcode-plugin.md` dentro de `.github/agents/` ou `.github/instructions/`: preferir links relativos e um checklist curto.

## Relação com a visão do produto

A visão multi-nível em [`vision-hardcode-plugin.md`](vision-hardcode-plugin.md) (por arquivo, dependências, classificados, ordenados, nivelados) orienta **evolução do plugin**; agentes devem alinhar implementação a [`plugin-contract.md`](plugin-contract.md) e à skill [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md), independentemente da IDE (Cursor ou Copilot).

## Versão do documento

- **1.0.0** — contrato inicial: mapeamento Copilot/Awesome ↔ Cursor/repo e precedência.
