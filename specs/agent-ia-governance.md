# Governança de agentes de IA (Cursor / Cursor CLI)

Este documento consolida o que **todo agente de IA** que atue neste repositório deve cumprir **a cada execução de prompt** (sessão), alinhado a [`specs/agent-session-workflow.md`](agent-session-workflow.md), mas com **checklist explícito** e mapa de artefatos. Não substitui os contratos temáticos; em caso de conflito, prevalece a ordem em [`AGENTS.md`](../AGENTS.md).

## Objetivo

Garantir que:

1. **Documentação oficial espelhada** em [`reference/Clippings/`](../reference/Clippings/) seja **consultada** (e **atualizada** quando necessário) sempre que o escopo for ecossistema ESLint, plugin, RuleTester, config flat/legacy, empacotamento npm do pacote ou CI que interprete essas ferramentas.
2. O **grafo de arquivos e diretórios** documentado em [`docs/repository-tree.md`](../docs/repository-tree.md) permaneça **fiel à árvore real** após mudanças estruturais.
3. **Restrições e limitações** em [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md), [`AGENTS.md`](../AGENTS.md) e [`specs/plugin-contract.md`](plugin-contract.md) sejam **respeitadas**.
4. **Políticas de documentação** ([`docs/documentation-policy.md`](../docs/documentation-policy.md)) e **boas práticas** de projetos OSS (transparência, contrato antes do código, proveniência de citações) sejam aplicadas.

## Hierarquia normativa (leitura obrigatória por tema)

| Ordem | Fonte | Uso |
|-------|--------|-----|
| 1 | [`AGENTS.md`](../AGENTS.md) | Prioridades e mapa do repositório |
| 2 | [`specs/agent-session-workflow.md`](agent-session-workflow.md) | Fases A–D por prompt |
| 3 | [`specs/plugin-contract.md`](plugin-contract.md) | Comportamento público do plugin |
| 4 | [`specs/e2e-fixture-nest.md`](e2e-fixture-nest.md) | Massa e2e NestJS (workspace auxiliar; contagens da fumaça) |
| 5 | [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) | Visão multi-nível (arquivo, dependências, classificação, etc.) |
| 6 | [`specs/agent-reference-clippings.md`](agent-reference-clippings.md) | Clippings e documentação oficial |
| 7 | [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md) | Documentação e grafo ao finalizar |
| 8 | [`specs/agent-git-workflow.md`](agent-git-workflow.md) | Versionamento ao finalizar |

## Checklist — abertura do prompt (antes de implementar)

- [ ] **Objetivo e escopo** extraídos do pedido; classificação conforme tabela em [`agent-session-workflow.md`](agent-session-workflow.md) (ESLint/plugin/npm/CI vs só docs vs estrutura).
- [ ] Se o escopo for **ESLint / npm do pacote / CI relacionada** (inclui **e2e** do plugin, fixtures e API `ESLint`): **listar e abrir** recortes relevantes em [`reference/Clippings/`](../reference/Clippings/) (índice: [`reference/Clippings/README.md`](../reference/Clippings/README.md)); se faltar ou estiver desatualizado, consultar fonte **oficial** e **registrar** clipping conforme [`agent-reference-clippings.md`](agent-reference-clippings.md).
- [ ] Se o pedido puder **alterar limites ou escopo do produto**: reler [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md).
- [ ] Se houver mudança de **comportamento público**: [`specs/plugin-contract.md`](plugin-contract.md) atualizado **antes** ou **junto** do código.

## Checklist — execução

- [ ] Código publicável **somente** em [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/); **nenhum** import de `reference/` desde o pacote.
- [ ] Não alterar [`reference/legacy-snapshot/`](../reference/legacy-snapshot/) exceto em prompt/PR **dedicado** a snapshot.
- [ ] Imports **relativos** no pacote, conforme convenção; corrigir lints após edições relevantes.

## Checklist — fechamento do prompt (antes de encerrar a resposta)

- [ ] [`docs/repository-tree.md`](../docs/repository-tree.md) atualizado se **qualquer** diretório ou artefato normativo listado lá mudou (inclui `reference/Clippings/`, `.cursor/`, `specs/`).
- [ ] [`reference/Clippings/README.md`](../reference/Clippings/README.md) coerente se arquivos de Clippings foram adicionados, renomeados ou removidos.
- [ ] Demais documentos impactados conforme [`agent-documentation-workflow.md`](agent-documentation-workflow.md); [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) ou visão se limites mudaram.
- [ ] Na **resposta ao usuário**: listar arquivos de documentação alterados **ou** declarar explicitamente que **nenhuma** atualização foi necessária.
- [ ] Se houver alterações locais rastreadas: [`specs/agent-git-workflow.md`](agent-git-workflow.md) (commit e push na branch atual, salvo working tree vazia), com **mensagem no formato Conventional Commits** definido nesse spec.

## Mapa de artefatos para agentes

| Tipo | Caminho | Função |
|------|---------|--------|
| Regra Cursor | [`.cursor/rules/agent-session.mdc`](../.cursor/rules/agent-session.mdc) | Lembrete: fluxo por prompt |
| Regra Cursor | [`.cursor/rules/agent-ia-governance.mdc`](../.cursor/rules/agent-ia-governance.mdc) | Ponte para este spec e checklist resumido |
| Regra Cursor | [`.cursor/rules/clippings-official-docs.mdc`](../.cursor/rules/clippings-official-docs.mdc) | Documentação oficial e Clippings |
| Regra Cursor | [`.cursor/rules/documentation.mdc`](../.cursor/rules/documentation.mdc) | Política Markdown |
| Regra Cursor | [`.cursor/rules/git-versioning.mdc`](../.cursor/rules/git-versioning.mdc) | Git ao concluir |
| Regra Cursor | [`.cursor/rules/repo-layout.mdc`](../.cursor/rules/repo-layout.mdc) | Layout do repositório |
| Regra Cursor | [`.cursor/rules/e2e-nest-fixture.mdc`](../.cursor/rules/e2e-nest-fixture.mdc) | Massa e2e Nest (globs do fixture e e2e) |
| Skill | [`.cursor/skills/reference-clippings-workflow/SKILL.md`](../.cursor/skills/reference-clippings-workflow/SKILL.md) | Manutenção de Clippings |
| Skill | [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) | Implementação no pacote |
| Skill | [`.cursor/skills/github-markdown-docs/SKILL.md`](../.cursor/skills/github-markdown-docs/SKILL.md) | Docs e grafo |
| Skill | [`.cursor/skills/git-agent-workflow/SKILL.md`](../.cursor/skills/git-agent-workflow/SKILL.md) | Fechamento Git |
| Comando (opcional) | [`.cursor/commands/`](../.cursor/commands/) | Atalhos `/…` para checklist (ex.: `/fechar-e2e-nest-fixture`) |

## Boas práticas de mercado (OSS e plugins ESLint)

- **Contrato explícito**: mudanças de comportamento refletidas em `specs/plugin-contract.md` e testes (ex.: RuleTester) quando aplicável.
- **Proveniência**: Clippings com URL oficial, data e contexto; trechos mínimos necessários (ver [`agent-reference-clippings.md`](agent-reference-clippings.md)).
- **Separação de concerns**: código publicável isolado em `packages/`; referência histórica não misturada com release.
- **Rastreabilidade**: commits com mensagens **Conventional Commits** (ver [`agent-git-workflow.md`](agent-git-workflow.md)); documentação e grafo atualizados no mesmo ciclo que a mudança estrutural.
- **Segurança**: não commitar segredos; respeitar `.gitignore` e políticas do repositório.

## Versão do documento

- **1.3.0** — hierarquia: `specs/e2e-fixture-nest.md` para massa Nest e fumaça e2e.
- **1.2.0** — checklist de abertura: escopo explícito para testes e2e e fixtures do plugin.
- **1.1.0** — fechamento e boas práticas: mensagens de commit Conventional Commits conforme [`agent-git-workflow.md`](agent-git-workflow.md).
- **1.0.0** — governança consolidada para agentes de IA: checklists, mapa de artefatos e boas práticas OSS.
