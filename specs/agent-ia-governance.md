# Governança de agentes de IA (Cursor / Cursor CLI)

Este documento consolida o que **todo agente de IA** que atue neste repositório deve cumprir **a cada execução de prompt** (sessão), alinhado a [`specs/agent-session-workflow.md`](agent-session-workflow.md), mas com **checklist explícito** e mapa de artefatos. Não substitui os contratos temáticos; em caso de conflito, prevalece a ordem em [`AGENTS.md`](../AGENTS.md).

## Objetivo

Garantir que:

1. **Documentação oficial espelhada** em [`reference/Clippings/`](../reference/Clippings/) seja **consultada** (e **atualizada** quando necessário) sempre que o escopo for ecossistema ESLint, plugin, RuleTester, config flat/legacy, empacotamento npm do pacote ou CI que interprete essas ferramentas.
2. O **grafo de arquivos e diretórios** documentado em [`docs/repository-tree.md`](../docs/repository-tree.md) permaneça **fiel à árvore real** após mudanças estruturais.
3. **Restrições e limitações** em [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md), [`AGENTS.md`](../AGENTS.md) e [`specs/plugin-contract.md`](plugin-contract.md) sejam **respeitadas**.
4. **Políticas de documentação** ([`docs/documentation-policy.md`](../docs/documentation-policy.md)) e **boas práticas** de projetos OSS (transparência, contrato antes do código, proveniência de citações) sejam aplicadas.
5. **Citação de caminhos** — ao listar ou referir ficheiros deste repositório em respostas, documentação nova ou prompts de delegação, usar **caminhos relativos à raiz do clone** (princípio 5b e exceções na política).

## Hierarquia normativa (leitura obrigatória por tema)

| Ordem | Fonte | Uso |
|-------|--------|-----|
| 1 | [`AGENTS.md`](../AGENTS.md) | Prioridades e mapa do repositório |
| 1b | [`specs/agent-reference-agents.md`](agent-reference-agents.md) | Quando houver remissão a [`reference/agents-ref/`](../reference/agents-ref/): aplicabilidade do portfólio e substituições de caminhos |
| 1c | [`specs/agent-tooling-ecosystem-map.md`](agent-tooling-ecosystem-map.md) | Copilot / Awesome vs Cursor; pontes `.github/`; precedência de instruções |
| 1d | [`specs/agent-docker-compose.md`](agent-docker-compose.md) | Docker Compose (perfis dev/e2e/prod/e2e-ops), `.docker/Dockerfile` e relação com `ops-eslint` |
| 1e | [`specs/agent-integration-testing-policy.md`](agent-integration-testing-policy.md) | Integrações externas: sem mocks no repo; sandboxes ou ambientes de teste dos provedores |
| 2 | [`specs/agent-session-workflow.md`](agent-session-workflow.md) | Fases A–D por prompt |
| 2a | [`specs/agent-error-messaging-triple.md`](agent-error-messaging-triple.md) | Falhas: três partes com prefixos `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; Níveis 1–3 de conformidade |
| 3 | [`specs/plugin-contract.md`](plugin-contract.md) | Comportamento público do plugin |
| 4 | [`specs/e2e-fixture-nest.md`](e2e-fixture-nest.md) | Massa e2e NestJS (workspace auxiliar; contagens da fumaça) |
| 5 | [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) | Visão multi-nível (arquivo, dependências, classificação, etc.) |
| 6 | [`specs/agent-reference-clippings.md`](agent-reference-clippings.md) | Clippings e documentação oficial |
| 7 | [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md) | Documentação e grafo ao finalizar |
| 8 | [`specs/agent-git-workflow.md`](agent-git-workflow.md) | Versionamento ao finalizar |

## Checklist — abertura do prompt (antes de implementar)

- [ ] **Objetivo e escopo** extraídos do pedido; classificação conforme tabela em [`agent-session-workflow.md`](agent-session-workflow.md) (ESLint/plugin/npm/CI vs só docs vs estrutura).
- [ ] Se o pedido citar ou depender de arquivos em [`reference/agents-ref/`](../reference/agents-ref/): seguir [`agent-reference-agents.md`](agent-reference-agents.md) (não aplicar árvores documentais ou pastas de outro projeto — ex.: `docs/<repo-externo>/`, `shared/`, `docs/review/` — como obrigatórios sem adaptação).
- [ ] Se o escopo for **ESLint / npm do pacote / CI relacionada** (inclui **e2e** do plugin, fixtures e API `ESLint`): **listar e abrir** recortes relevantes em [`reference/Clippings/`](../reference/Clippings/) (índice: [`reference/Clippings/README.md`](../reference/Clippings/README.md)); se faltar ou estiver desatualizado, consultar fonte **oficial** e **registrar** clipping conforme [`agent-reference-clippings.md`](agent-reference-clippings.md).
- [ ] Se o pedido puder **alterar limites ou escopo do produto**: reler [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md).
- [ ] Se houver mudança de **comportamento público**: [`specs/plugin-contract.md`](plugin-contract.md) atualizado **antes** ou **junto** do código.
- [ ] Se o escopo envolver **integração externa** (registry npm, publicação de pacote, MCP, OAuth, webhooks, credenciais de CI): seguir [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md) (sandboxes dos provedores; sem mocks de serviço no repositório).

## Checklist — execução

- [ ] Código publicável **somente** em [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/); **nenhum** import de `reference/` desde o pacote.
- [ ] Não alterar [`reference/legacy-snapshot/`](../reference/legacy-snapshot/) exceto em prompt/PR **dedicado** a snapshot.
- [ ] Imports **relativos** no pacote, conforme convenção; corrigir lints após edições relevantes.
- [ ] Ao citar ficheiros ou pastas **deste** repo (mensagens, relatórios, sub-agentes): **caminhos relativos à raiz**, conforme [`docs/documentation-policy.md`](../docs/documentation-policy.md) (exceções: Clippings literais, semântica de API).
- [ ] Sem **mocks, stubs ou fakes** de serviços externos para “integração”; quando necessário, documentar ou usar **sandbox** conforme [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md).
- [ ] Ao **comunicar falhas** (testes, build, CI, comandos, bloqueios): estruturar a resposta conforme [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) — primeira linha de conteúdo de cada parte com `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; verificar **Nível 1** (três prefixos presentes) e **Nível 2** (contagens alinhadas a **N** unidades de falha); relatórios de sub-agentes que descrevam falhas devem seguir o mesmo formato.

## Checklist — fechamento do prompt (antes de encerrar a resposta)

- [ ] Se a entrega **incluir falhas** ainda visíveis para o utilizador: confirmar **Nível 1** e **Nível 2** conforme [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) (prefixos obrigatórios e contagens); **Nível 3** quando houver revisão de qualidade; ou justificar sucintamente se não aplicável — ver casos limite nesse spec.
- [ ] [`docs/repository-tree.md`](../docs/repository-tree.md) atualizado se **qualquer** diretório ou artefato normativo listado lá mudou (inclui `reference/Clippings/`, `.cursor/`, `specs/`).
- [ ] [`reference/Clippings/README.md`](../reference/Clippings/README.md) coerente se arquivos de Clippings foram adicionados, renomeados ou removidos.
- [ ] Demais documentos impactados conforme [`agent-documentation-workflow.md`](agent-documentation-workflow.md); [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) ou visão se limites mudaram.
- [ ] Na **resposta ao usuário**: listar arquivos de documentação alterados **ou** declarar explicitamente que **nenhuma** atualização foi necessária; ao listar caminhos de ficheiros do repo, usar **relativos à raiz** (ver política).
- [ ] Se houver alterações locais rastreadas: [`specs/agent-git-workflow.md`](agent-git-workflow.md) (commit e push na branch atual, salvo working tree vazia), com **mensagem no formato Conventional Commits** definido nesse spec.

## Mapa de artefatos para agentes

| Tipo | Caminho | Função |
|------|---------|--------|
| Regra Cursor | [`.cursor/rules/agent-session.mdc`](../.cursor/rules/agent-session.mdc) | Lembrete: fluxo por prompt |
| Regra Cursor | [`.cursor/rules/agent-ia-governance.mdc`](../.cursor/rules/agent-ia-governance.mdc) | Ponte para este spec e checklist resumido |
| Regra Cursor | [`.cursor/rules/clippings-official-docs.mdc`](../.cursor/rules/clippings-official-docs.mdc) | Documentação oficial e Clippings |
| Regra Cursor | [`.cursor/rules/documentation.mdc`](../.cursor/rules/documentation.mdc) | Política Markdown |
| Regra Cursor | [`.cursor/rules/repo-relative-paths.mdc`](../.cursor/rules/repo-relative-paths.mdc) | Caminhos relativos à raiz ao citar o repo |
| Regra Cursor | [`.cursor/rules/git-versioning.mdc`](../.cursor/rules/git-versioning.mdc) | Git ao concluir |
| Regra Cursor | [`.cursor/rules/repo-layout.mdc`](../.cursor/rules/repo-layout.mdc) | Layout do repositório |
| Regra Cursor | [`.cursor/rules/agent-reference-agents.mdc`](../.cursor/rules/agent-reference-agents.mdc) | Ponte para [`agent-reference-agents.md`](agent-reference-agents.md) |
| Regra Cursor | [`.cursor/rules/e2e-nest-fixture.mdc`](../.cursor/rules/e2e-nest-fixture.mdc) | Massa e2e Nest (globs do fixture e e2e) |
| Regra Cursor | [`.cursor/rules/docker-compose-tooling.mdc`](../.cursor/rules/docker-compose-tooling.mdc) | Docker Compose e `.docker/` (globs) |
| Regra Cursor | [`.cursor/rules/agent-integration-testing-policy.mdc`](../.cursor/rules/agent-integration-testing-policy.mdc) | Integrações: [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md) |
| Regra Cursor | [`.cursor/rules/agent-error-messaging-triple.mdc`](../.cursor/rules/agent-error-messaging-triple.mdc) | Falhas: [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) |
| Skill | [`.cursor/skills/reference-clippings-workflow/SKILL.md`](../.cursor/skills/reference-clippings-workflow/SKILL.md) | Manutenção de Clippings |
| Skill | [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) | Implementação no pacote |
| Skill | [`.cursor/skills/github-markdown-docs/SKILL.md`](../.cursor/skills/github-markdown-docs/SKILL.md) | Docs e grafo |
| Skill | [`.cursor/skills/git-agent-workflow/SKILL.md`](../.cursor/skills/git-agent-workflow/SKILL.md) | Fechamento Git |
| Skill | [`.cursor/skills/reference-agents-portfolio/SKILL.md`](../.cursor/skills/reference-agents-portfolio/SKILL.md) | Uso de `reference/agents-ref/` alinhado ao repo |
| Skill | [`.cursor/skills/docker-compose-workflow/SKILL.md`](../.cursor/skills/docker-compose-workflow/SKILL.md) | Docker Compose, `.docker/Dockerfile` e perfis dev/e2e/prod/e2e-ops |
| Skill | [`.cursor/skills/agent-error-messaging-triple/SKILL.md`](../.cursor/skills/agent-error-messaging-triple/SKILL.md) | Formato triplo para relatórios de falha |
| Comando (opcional) | [`.cursor/commands/`](../.cursor/commands/) | Atalhos `/…` para checklist (ex.: `/fechar-e2e-nest-fixture`) |
| Ponte Copilot (opcional) | [`.github/agents/eslint-hardcode-plugin.agent.md`](../.github/agents/eslint-hardcode-plugin.agent.md) | Agente GitHub Copilot: remete a `AGENTS.md` e `specs/` |
| Ponte Copilot (opcional) | [`.github/agents/docker-tooling.agent.md`](../.github/agents/docker-tooling.agent.md) | Docker/compose/imagem ops-eslint: remete a [`agent-docker-compose.md`](agent-docker-compose.md) |
| Ponte Copilot (opcional) | [`.github/instructions/eslint-plugin-hardcode.instructions.md`](../.github/instructions/eslint-plugin-hardcode.instructions.md) | Instruções com `applyTo` no pacote do plugin |
| Ponte Copilot (opcional) | [`.github/instructions/docker-compose.instructions.md`](../.github/instructions/docker-compose.instructions.md) | Instruções com `applyTo` em `docker-compose*.yml` e `.docker/**` |

## Boas práticas de mercado (OSS e plugins ESLint)

- **Contrato explícito**: mudanças de comportamento refletidas em `specs/plugin-contract.md` e testes (ex.: RuleTester) quando aplicável.
- **Proveniência**: Clippings com URL oficial, data e contexto; trechos mínimos necessários (ver [`agent-reference-clippings.md`](agent-reference-clippings.md)).
- **Separação de concerns**: código publicável isolado em `packages/`; referência histórica não misturada com release.
- **Rastreabilidade**: commits com mensagens **Conventional Commits** (ver [`agent-git-workflow.md`](agent-git-workflow.md)); documentação e grafo atualizados no mesmo ciclo que a mudança estrutural.
- **Segurança**: não commitar segredos; respeitar `.gitignore` e políticas do repositório.

## Versão do documento

- **2.0.0** — 2a e checklists: prefixos canónicos e Níveis 1–2 ao comunicar falhas; alinhado a [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) v2.0.0.
- **1.9.0** — hierarquia 2a, checklists execução/fechamento e mapa: [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md), rule e skill `agent-error-messaging-triple`.
- **1.8.0** — hierarquia e checklists: [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md); mapa: rule [`agent-integration-testing-policy.mdc`](../.cursor/rules/agent-integration-testing-policy.mdc).
- **1.7.0** — objetivo e checklists: citação de ficheiros com caminhos relativos à raiz; mapa: rule [`repo-relative-paths.mdc`](../.cursor/rules/repo-relative-paths.mdc).
- **1.6.0** — mapa de artefatos: [`agent-docker-compose.md`](agent-docker-compose.md), rule [`docker-compose-tooling.mdc`](../.cursor/rules/docker-compose-tooling.mdc), skill `docker-compose-workflow`, pontes Copilot `docker-tooling` e instruções `docker-compose`.
- **1.5.0** — remissão a [`agent-tooling-ecosystem-map.md`](agent-tooling-ecosystem-map.md); mapa de artefatos: pontes `.github/agents/` e `.github/instructions/`.
- **1.4.0** — remissão a [`agent-reference-agents.md`](agent-reference-agents.md), rule e skill associados; checklist de abertura para `reference/agents-ref/`.
- **1.3.0** — hierarquia: `specs/e2e-fixture-nest.md` para massa Nest e fumaça e2e.
- **1.2.0** — checklist de abertura: escopo explícito para testes e2e e fixtures do plugin.
- **1.1.0** — fechamento e boas práticas: mensagens de commit Conventional Commits conforme [`agent-git-workflow.md`](agent-git-workflow.md).
- **1.0.0** — governança consolidada para agentes de IA: checklists, mapa de artefatos e boas práticas OSS.
