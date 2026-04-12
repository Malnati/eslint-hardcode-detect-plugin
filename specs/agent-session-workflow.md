# Contrato: fluxo por execução de prompt (sessão do agente)

Este documento define o **ciclo completo** que agentes de IA (Cursor / Cursor CLI) **devem** seguir em **cada prompt** que altere ou dependa do repositório. O **checklist consolidado** (abertura, execução, fechamento) e o mapa de artefatos estão em [`agent-ia-governance.md`](agent-ia-governance.md). Este arquivo detalha as **fases A–D** e a classificação de escopo.

Objetivos do ciclo:

- [`reference/Clippings/`](../reference/Clippings/) seja consultado e mantido quando o escopo exigir;
- o **grafo** documentado em [`docs/repository-tree.md`](../docs/repository-tree.md) permaneça fiel à árvore real;
- **restrições** e **limitações** em [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md), [`AGENTS.md`](../AGENTS.md) e [`specs/plugin-contract.md`](plugin-contract.md) sejam respeitados;
- práticas alinhadas a repositórios públicos e documentação oficial sejam aplicadas (ver [`docs/documentation-policy.md`](../docs/documentation-policy.md) e [`specs/agent-reference-clippings.md`](agent-reference-clippings.md)).

## Hierarquia

Este contrato **orquestra** os demais; em caso de ambiguidade sobre “o que fazer neste prompt”, prevalece a ordem abaixo:

1. [`AGENTS.md`](../AGENTS.md) — prioridades e mapa do repositório.
2. [`agent-ia-governance.md`](agent-ia-governance.md) — checklists e mapa de rules/skills/comandos para agentes de IA.
2b. [`agent-reference-agents.md`](agent-reference-agents.md) — quando o pedido envolver [`reference/agents-ref/`](../reference/agents-ref/).
2c. [`agent-tooling-ecosystem-map.md`](agent-tooling-ecosystem-map.md) — quando houver ambiguidade entre Cursor, GitHub Copilot ou coleções estilo Awesome: equivalências e precedência.
2d. [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md) — quando o trabalho envolver integrações externas (registry, publicação, MCP, credenciais): sandboxes dos provedores; sem mocks no repositório.
3. Este arquivo — abertura e fechamento da sessão (fases A–D).
4. [`specs/plugin-contract.md`](plugin-contract.md) e [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) — produto e visão.
5. [`specs/agent-reference-clippings.md`](agent-reference-clippings.md) — Clippings e documentação oficial.
6. [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md) — documentação e grafo ao finalizar.
7. [`specs/agent-git-workflow.md`](agent-git-workflow.md) — versionamento ao finalizar.

## Fase A — Entender o pedido e classificar o escopo

1. Extrair do prompt o **objetivo**, **arquivos prováveis** e **restrições** explícitas do usuário.
2. Classificar o trabalho em uma ou mais categorias:

| Categoria | Exemplos | Ação obrigatória relacionada a Clippings |
|-----------|----------|-------------------------------------------|
| **Ecossistema ESLint / plugin / RuleTester / flat ou legacy config** | Nova regra, mudança de API do ESLint no código, ajuste de `eslint.config` do pacote | Consultar **primeiro** `reference/Clippings/` no tópico; ver [`specs/agent-reference-clippings.md`](agent-reference-clippings.md). |
| **Testes e2e / fixtures de consumidor** | `e2e/`, `e2e/fixtures/`, [`packages/e2e-fixture-nest`](../packages/e2e-fixture-nest/), runners com `ESLint` / `lintFiles` | Idem (Clippings: Node.js API, Extend ESLint); seguir [`specs/e2e-fixture-nest.md`](e2e-fixture-nest.md) para a massa Nest; atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) se a árvore sob `e2e/` ou o workspace auxiliar mudar. |
| **Empacotamento npm / metadados do pacote** | `package.json`, exports, build do plugin | Idem quando a decisão depender de documentação oficial (npm, Node). |
| **CI** que interpreta ESLint, Node ou npm | Workflows que rodam o linter ou publicam o pacote | Consultar Clippings ou doc oficial quando a semântica do toolchain não for óbvia no repo. |
| **Somente Markdown / specs / governança** sem tocar em API ESLint | README, `docs/`, rules do Cursor | Clippings **não** é obrigatório salvo o texto **altere** contratos que citam ESLint ou exija validar citação contra fonte oficial. |
| **Estrutura de pastas** | Novo diretório normativo, mover Clippings | Atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) no mesmo ciclo. |
| **Docker / Compose / imagem ops-eslint** | [`docker-compose.yml`](../docker-compose.yml), [`.docker/`](../.docker/), ajustes em [`.github/actions/ops-eslint`](../.github/actions/ops-eslint) | Ler [`specs/agent-docker-compose.md`](agent-docker-compose.md); skill [`.cursor/skills/docker-compose-workflow/SKILL.md`](../.cursor/skills/docker-compose-workflow/SKILL.md). Consultar Clippings só se a mudança depender de semântica oficial de ESLint/npm não óbvia no repo. |

3. Se o escopo for **misturado** (ex.: código + doc), aplicar a coluna mais restritiva (ex.: código ESLint → consulta a Clippings).

## Fase B — Fontes antes de implementar (escopo relevante)

1. Se o prompt citar ou depender de agentes em [`reference/agents-ref/`](../reference/agents-ref/): aplicar [`agent-reference-agents.md`](agent-reference-agents.md) e a skill [`reference-agents-portfolio`](../.cursor/skills/reference-agents-portfolio/SKILL.md) **antes** de copiar caminhos (ex.: `docs/<repo-externo>/`, `shared/constants.*`) ou políticas de outro repositório.
2. Reler trechos aplicáveis de [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) se o pedido puder **expandir escopo** ou **trocar limites** do plugin.
3. Se a Fase A classificou como ecossistema ESLint/npm/CI relacionada:
   - Listar e abrir arquivos em [`reference/Clippings/`](../reference/Clippings/) (índice em [`reference/Clippings/README.md`](../reference/Clippings/README.md)).
   - Se não houver recorte adequado ou estiver desatualizado: consultar documentação **oficial** atual (MCP de documentação do projeto, quando existir; senão fonte canônica na Web) e **registrar** trecho em `reference/Clippings/` conforme [`specs/agent-reference-clippings.md`](agent-reference-clippings.md).
4. Para mudanças de **comportamento** do plugin: garantir alinhamento com [`specs/plugin-contract.md`](plugin-contract.md) **antes** ou **junto** com o código (o spec tem precedência sobre implementação legada em `reference/`, exceto `legacy-snapshot` que não é contrato).
5. Se o pedido envolver **integração externa** (publicação npm, registry privado, MCP, pipelines que exijam credenciais de terceiros): aplicar [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md) — validação com **sandbox** ou documentação oficial do provedor; **não** propor mocks ou stubs de serviço no código nem em roadmap/CI planejado deste repo.

## Fase C — Executar o trabalho

1. Manter **todo** código publicável do plugin somente em [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/); o workspace auxiliar [`packages/e2e-fixture-nest`](../packages/e2e-fixture-nest/) existe só como massa e2e (não é pacote publicável do plugin), conforme [`specs/e2e-fixture-nest.md`](e2e-fixture-nest.md). **Nunca** importar `reference/` desde `packages/` publicáveis.
2. Não alterar [`reference/legacy-snapshot/`](../reference/legacy-snapshot/) exceto em mudança **explícita** de snapshot (PR ou prompt dedicado).
3. Preferir imports **relativos** dentro do pacote, conforme [`AGENTS.md`](../AGENTS.md).
4. Após edições que afetem estilo ou tipos no pacote, corrigir lints conforme a configuração do pacote.
5. Ao **delegar** trabalho (sub-agente GitHub Copilot, agente Explore/Task ou outro assistente), passar o contexto com **caminhos relativos à raiz** ao referir ficheiros deste repositório (salvo exceções em [`docs/documentation-policy.md`](../docs/documentation-policy.md)); relatórios de sub-agentes devem seguir o mesmo critério.

## Fase D — Fechar o prompt (sempre que houver entrega relevante)

1. Cumprir [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md):
   - Atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) se qualquer diretório ou artefato normativo listado lá tiver mudado (inclui árvore sob `reference/Clippings/` e `.cursor/`).
   - Atualizar [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) ou [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) se limites ou visão mudarem.
   - Ajustar `README.md`, `CONTRIBUTING.md` ou `docs/` conforme impacto.
2. Garantir que o **índice** em [`reference/Clippings/README.md`](../reference/Clippings/README.md) liste arquivos recortados relevantes quando arquivos forem adicionados, renomeados ou removidos.
3. Na **resposta ao usuário**, listar documentação alterada ou declarar explicitamente que **nenhuma** atualização foi necessária (e por quê).
4. Se houver alterações locais rastreadas: seguir [`specs/agent-git-workflow.md`](agent-git-workflow.md) (commit com mensagem **Conventional Commits** e push na branch atual, salvo working tree vazia — então declarar “nada a commitar”).

## Skills e rules do repositório

| Artefato | Função |
|----------|--------|
| [`.cursor/skills/reference-clippings-workflow/SKILL.md`](../.cursor/skills/reference-clippings-workflow/SKILL.md) | Consulta e manutenção de Clippings |
| [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) | Implementação no pacote |
| [`.cursor/skills/github-markdown-docs/SKILL.md`](../.cursor/skills/github-markdown-docs/SKILL.md) | Documentação e grafo |
| [`.cursor/skills/git-agent-workflow/SKILL.md`](../.cursor/skills/git-agent-workflow/SKILL.md) | Fechamento Git |
| [`.cursor/skills/reference-agents-portfolio/SKILL.md`](../.cursor/skills/reference-agents-portfolio/SKILL.md) | Uso de `reference/agents-ref/` alinhado ao repo |
| [`.cursor/skills/docker-compose-workflow/SKILL.md`](../.cursor/skills/docker-compose-workflow/SKILL.md) | Docker Compose e imagem `.docker/` |
| [`.cursor/rules/agent-session.mdc`](../.cursor/rules/agent-session.mdc) | Lembrete Cursor: este fluxo |
| [`.cursor/rules/agent-ia-governance.mdc`](../.cursor/rules/agent-ia-governance.mdc) | Checklist resumido e ponte para [`agent-ia-governance.md`](agent-ia-governance.md) |
| [`.cursor/rules/agent-integration-testing-policy.mdc`](../.cursor/rules/agent-integration-testing-policy.mdc) | Integrações: [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md) |
| [`.cursor/rules/repo-relative-paths.mdc`](../.cursor/rules/repo-relative-paths.mdc) | Caminhos relativos à raiz ao citar ficheiros do repo |
| [`.cursor/commands/`](../.cursor/commands/) | Comandos `/abrir-prompt-agente` e `/fechar-prompt-agente` (opcional) |
| [`.github/agents/eslint-hardcode-plugin.agent.md`](../.github/agents/eslint-hardcode-plugin.agent.md) | Ponte GitHub Copilot (opcional) |
| [`.github/agents/docker-tooling.agent.md`](../.github/agents/docker-tooling.agent.md) | Ponte Copilot: Docker/compose (opcional) |
| [`.github/instructions/eslint-plugin-hardcode.instructions.md`](../.github/instructions/eslint-plugin-hardcode.instructions.md) | Instruções Copilot com `applyTo` no pacote (opcional) |
| [`.github/instructions/docker-compose.instructions.md`](../.github/instructions/docker-compose.instructions.md) | Instruções Copilot com `applyTo` em compose/Dockerfile (opcional) |

## Versão do documento

- **1.9.0** — Hierarquia 2d e Fase B item 5: [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md); tabela: rule [`agent-integration-testing-policy.mdc`](../.cursor/rules/agent-integration-testing-policy.mdc).
- **1.8.0** — Fase C: delegação e relatórios com caminhos relativos à raiz; remissão a [`docs/documentation-policy.md`](../docs/documentation-policy.md); tabela de artefatos: [`.cursor/rules/repo-relative-paths.mdc`](../.cursor/rules/repo-relative-paths.mdc).
- **1.7.0** — Escopo e tabela de skills: Docker Compose, [`specs/agent-docker-compose.md`](agent-docker-compose.md), pontes Copilot `docker-tooling` e `docker-compose.instructions`.
- **1.6.0** — Hierarquia: remissão a [`agent-tooling-ecosystem-map.md`](agent-tooling-ecosystem-map.md) para Copilot/Cursor e coleções externas.
- **1.5.0** — Fase B e hierarquia: remissão a [`agent-reference-agents.md`](agent-reference-agents.md) quando `reference/agents-ref/` for relevante; tabela de skills com `reference-agents-portfolio`.
- **1.4.0** — escopo e2e: workspace Nest auxiliar e remissão a `specs/e2e-fixture-nest.md`; Fase C: exceção explícita para `packages/e2e-fixture-nest`.
- **1.3.0** — tabela de escopo: linha para testes e2e e fixtures do plugin.
- **1.2.0** — Fase D: remissão explícita a mensagens Conventional Commits em [`agent-git-workflow.md`](agent-git-workflow.md).
- **1.1.0** — referência a [`agent-ia-governance.md`](agent-ia-governance.md), tabela de hierarquia ajustada, comandos Cursor.
- **1.0.0** — contrato de sessão por prompt: fases A–D, tabela de escopo e ligação a Clippings, grafo e Git.
