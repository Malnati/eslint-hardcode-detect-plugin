# Contrato: agentes de referência (`reference/agents-ref`)

Este documento define como os arquivos em [`reference/agents-ref/`](../reference/agents-ref/) — portfólio genérico de instruções para agentes — se relacionam com **este** repositório. Em caso de conflito entre um agente de referência e [`AGENTS.md`](../AGENTS.md), os **specs deste repo** ou [`docs/documentation-policy.md`](../docs/documentation-policy.md), **prevalecem** as fontes normativas locais.

## Objetivo

- Evitar que caminhos e políticas de **outros** projetos (ex.: `docs/<repo-externo>/`, `shared/constants.*`, relatórios em `docs/review/`) sejam aplicados aqui sem adaptação.
- Reaproveitar **princípios** dos agentes de referência (foco funcional, DRY, rastreabilidade, ética) onde fizer sentido para um plugin ESLint em monorepo npm.
- Manter uma tabela única de **aplicabilidade** para orientar agentes de IA em cada prompt.

## Hierarquia (leitura obrigatória)

| Ordem | Fonte | Nota |
|-------|--------|------|
| 1 | [`AGENTS.md`](../AGENTS.md) | Prioridades e mapa do repositório |
| 2 | [`specs/agent-session-workflow.md`](agent-session-workflow.md) | Fases A–D |
| 2a | [`specs/agent-error-messaging-triple.md`](agent-error-messaging-triple.md) | Falhas: prefixos `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; Níveis 1–3 |
| 3 | [`specs/plugin-contract.md`](plugin-contract.md) | Comportamento público do plugin |
| 4 | **Este documento** | Ponte com `reference/agents-ref/` |
| 5 | Arquivos individuais em `reference/agents-ref/` | Inspiração; aplicar apenas conforme mapeamento abaixo |

## Substituições normativas (portfólio de referência → este repositório)

| Conceito nos agentes de referência | Neste repositório usar |
|-----------------------------------|-------------------------|
| Documentação técnica só numa árvore por fases noutro repositório (ex.: `docs/<repo-externo>/` com pares `.md`/`-spec.md`) | [`docs/`](../docs/) (política em [`docs/documentation-policy.md`](../docs/documentation-policy.md)), [`specs/`](./), [`README.md`](../README.md), [`CONTRIBUTING.md`](../CONTRIBUTING.md); **não** existe essa árvore numerada aqui |
| `AGENTS.md` + exigência explícita de fases documentais `00`–`07` noutro projeto | [`AGENTS.md`](../AGENTS.md) e [`specs/`](./) apenas |
| Constantes compartilhadas em `shared/constants.*` | Módulos dentro de [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/) (ex.: `src/`), com imports **relativos** conforme [`AGENTS.md`](../AGENTS.md); nomes de pastas seguem o pacote, não um `shared/` obrigatório |
| Relatórios de hardcoded em `docs/review/NNNN-report-hard-coded.md` | **Não** é padrão aqui. Para auditorias: descrever achados na **PR**, em **issue** ou em doc em [`docs/`](../docs/)/`specs/` se o mantenedor pedir; evitar criar árvores novas sem atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) |
| Detecção genérica de hardcoded “no produto” | Para **código do plugin**: seguir [`specs/plugin-contract.md`](plugin-contract.md), [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) e a skill [`eslint-plugin-workflow`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) |
| CHANGELOG obrigatório por mudança (formato externo rígido) | Alinhar a [`specs/agent-git-workflow.md`](agent-git-workflow.md) e convenções do projeto; [`CHANGELOG.md`](../CHANGELOG.md) existe na raiz — atualizar quando releases/entradas forem esperadas pelo fluxo do repo |
| Mocks, stubs ou servidores falsos para integrações (registry, MCP, publicação) | [`specs/agent-integration-testing-policy.md`](agent-integration-testing-policy.md): **sandboxes** ou ambientes de teste oficiais dos provedores; sem mocks de serviço no repositório |

## Tabela de aplicabilidade por arquivo em `reference/agents-ref/`

Legenda: **Sim** = adotar o espírito e procedimentos adaptados; **Parcial** = só trechos ou com substituições da tabela acima; **Não** = não aplicar como regra deste repo (salvo tarefa explícita nesse tema).

| Arquivo | Aplicabilidade | Notas |
|---------|----------------|-------|
| `agent-compliance-etica-seguranca.md` | Parcial | Não expor segredos; respeitar LGPD em exemplos; não commitar credenciais. Sem obrigação de fluxos de marketplace além do que o repo já define |
| `agent-engineering-automacao-scripts.md` | Parcial | Scripts em CI (`.github/`) e `package.json`; não exigir abertura automática de issues genéricas |
| `agent-engineering-cabecalho-caminho.md` | Não | Este repo **não** exige cabeçalho de caminho em todo arquivo; seguir estilo existente em `packages/` |
| `agent-engineering-codigo-convencoes.md` | Parcial | Convenções do pacote + ESLint; literais: ver contrato do plugin, não só “extrair constante” |
| `agent-engineering-codigo-higiene.md` | Parcial | Remover código morto com cuidado; não expandir escopo além do pedido |
| `agent-engineering-ddl-seeds-compliance.md` | Não | Sem DDL/seeds neste repositório |
| `agent-engineering-docker-operacional.md` | Parcial | Só se o prompt tocar em Docker/CI (ex.: [`../.github/actions/ops-eslint/`](../.github/actions/ops-eslint/)); não inventar stack Docker além do existente |
| `agent-engineering-docker-stack.md` | Não | Sem `docker-stack` como artefato padrão do projeto |
| `agent-engineering-hardcoded.md` | Parcial | Alinhar visão multi-nível a [`vision-hardcode-plugin.md`](vision-hardcode-plugin.md); implementação via regras ESLint e testes no pacote; ignorar caminhos `shared/` e `docs/review/` como obrigatórios |
| `agent-engineering-makefile-boas-praticas.md` | Não | Não há Makefile na raiz como padrão |
| `agent-engineering-no-aesthetic-changes.md` | Sim | Mudanças só funcionais; sem reformatação ou comentários não solicitados; usar ferramentas de lint/format do pacote |
| `agent-engineering-reuso-dry.md` | Parcial | DRY no código do plugin; não duplicar regras/helpers sem necessidade |
| `agent-governanca-change-changelog-obrigatorio.md` | Parcial | Seguir expectativas de changelog/release do repo, não template externo rígido |
| `agent-governanca-documentacao-politica-documentacao.md` | Não (substituído) | Política local: [`docs/documentation-policy.md`](../docs/documentation-policy.md), [`agent-documentation-workflow.md`](agent-documentation-workflow.md) |
| `agent-governanca-estrutura-diretorios.md` | Parcial | Preservar [`repo-layout`](../.cursor/rules/repo-layout.mdc) e [`AGENTS.md`](../AGENTS.md); não impor árvore de outro projeto |
| `agent-governanca-planos-mudanca-padrao.md` | Parcial | Planos grandes: preferir issues/PR; specs em `specs/` quando for contrato |
| `agent-governanca-rastreabilidade-conformidade.md` | Parcial | Commits Conventional Commits; ligar mudanças a `plugin-contract` quando comportamento mudar |
| `agent-governanca-requisitos-gerais.md` | Parcial | Requisitos gerais = contratos em `specs/` + limites em [`limitations-and-scope.md`](../docs/limitations-and-scope.md) |
| `agent-governanca-requisitos-registro-novos.md` | Parcial | “Novos requisitos” → atualizar specs e contrato antes do código quando aplicável |
| `agent-release-branches-governanca.md` | Parcial | Seguir branch atual e políticas Git do repo; sem impor fluxo externo de aprovações |
| `my-agent.md` | Não (substituído) | O “my agent” deste repo é a pilha [`AGENTS.md`](../AGENTS.md) + `specs/`, não a árvore documental de outro projeto |

## Checklist para o agente de IA

Ao usar ideias de `reference/agents-ref/`:

- [ ] Confirmar na tabela de aplicabilidade se o arquivo se aplica ou é **Não** / **Parcial**.
- [ ] Aplicar **substituições normativas** (documentação de referência → `docs/`/`specs/`, constantes → pacote npm, etc.).
- [ ] Para trabalho no plugin: [`eslint-plugin-workflow`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) + [`plugin-contract.md`](plugin-contract.md).
- [ ] Relatórios de **falha** neste repositório: [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) com prefixos obrigatórios e Níveis 1–2 verificáveis (não substituído pelo portfólio genérico).
- [ ] Não criar `docs/<repo-externo>/` (nem imitar árvores alheias), `shared/constants.*` ou `docs/review/` como obrigação herdada do portfólio de referência sem decisão do mantenedor e atualização do grafo.

## Versão do documento

- **1.5.0** — 2a e checklist: prefixos e conformidade em [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) v2.0.0.
- **1.4.0** — hierarquia 2a e checklist: [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md).
- **1.3.0** — exemplos de caminhos alheios com placeholder `docs/<repo-externo>/`; substituições normativas descritas em linguagem neutra.
- **1.2.0** — substituição normativa: integrações sem mocks; [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md).
- **1.1.0** — nomenclatura neutra; remoção de menções a entidade externa no texto normativo.
- **1.0.0** — contrato inicial: mapeamento portfólio de referência ↔ repositório eslint-plugin-hardcode-detect.
