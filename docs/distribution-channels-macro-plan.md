# Plano macro: canais de distribuição, e2e e marcos

Este documento é o **roadmap macro** para validar e operacionalizar a solução descrita em [`solution-distribution-channels.md`](solution-distribution-channels.md), com **trilhas de teste** (agrupamento DRY de canais com a mesma superfície mecânica), proposta de massas `packages/e2e-fixture-*`, perfis Docker Compose futuros, diagramas (sequência, composição temporal), ciclo de vida por trilha e organização de **PRs/milestones** no GitHub. Não substitui o contrato das regras em [`specs/plugin-contract.md`](../specs/plugin-contract.md) nem a taxonomia em [`hardcoding-map.md`](hardcoding-map.md).

**Tempos de planeamento:** os marcos definem **durações** (`Xd`), **dependências** e **composição** do trabalho — **não** datas de calendário para início ou fim. Diagramas Gantt usam um **eixo fictício T0** só para proporção visual; o que é normativo está nas tabelas e nos números de duração nos ficheiros por marco.

**Planos detalhados por marco (M0–M5):** em [`distribution-milestones/README.md`](distribution-milestones/README.md) está o **índice** com **tabela** dos seis marcos e ligações aos ficheiros `m0-baseline.md` … `m5-release-candidate.md` no mesmo diretório. Cada plano por marco inclui, conforme esse README: objetivo e trilhas; **dependências e handoff na cadeia T1→T6** (ex.: milestone **M3** em **duas ondas** — T4 e fecho de **T6** após **M4/T5**; parágrafo «Cadeia de handoff» abaixo e [`distribution-milestones/m3-channel-t4-t6.md`](distribution-milestones/m3-channel-t4-t6.md)); diagrama de sequência; **ordem, dependências e durações**; composição temporal (Gantt com eixo T0 fictício onde existir); matriz **e2e × Docker Compose**; **Camada A** (tarefas e orçamento de tokens pré-execução de agentes) e **Camada B** (execução por fase); plano GitHub (PR, branch, semver); riscos.

**Fontes técnicas:** decisões sobre ESLint, npm, Cursor e MCP devem alinhar-se a [`reference/Clippings/`](../reference/Clippings/) (índice em [`reference/Clippings/README.md`](../reference/Clippings/README.md)) e [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). Versionamento Git: [`versioning-for-agents.md`](versioning-for-agents.md), [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md).

## Princípios

1. **Contrato antes do código** — comportamento público em [`specs/plugin-contract.md`](../specs/plugin-contract.md); visão macro em [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md).
2. **`reference/`** — somente leitura para o pacote publicável; não importar Clippings em `packages/`.
3. **Massas e2e** — workspaces auxiliares `packages/e2e-fixture-*` (não publicáveis como o plugin), espelhando o papel de [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md).
4. **Trilhas** — vários **canais** da tabela mestre mapeiam para uma **trilha** quando a automação testável é a mesma (ex.: npm projeto e workspaces → mesma trilha T1 com matriz documentada).
5. **Durações sem datas fixas** — prazos expressos em dias de esforço planejado e dependências lógicas; o **calendário civil** (quando cada marco começa no mundo real) fica fora destes documentos.

**Cadeia de handoff (artefatos):** em termos de **dependência de produto**, a ordem normativa é **T1 → T2 → T3 → T4 → T5 → T6** (cada trilha consome o entregável validado da anterior). Os **marcos GitHub M0–M5** agrupam o trabalho por entregáveis e PR; esse agrupamento pode **intercalar** a sequência linear das trilhas — por exemplo, o milestone **M3** inclui T4 e trabalho relacionado a **T6**, mas o **fecho de T6** (segunda onda) exige handoff **após a conclusão de M4 (T5)**, mantendo **T5 antes de T6** na cadeia de produto. Critérios, ondas e riscos: [`distribution-milestones/m3-channel-t4-t6.md`](distribution-milestones/m3-channel-t4-t6.md).

## Trilhas de validação

| Trilha | Âmbito | Foco da validação |
|--------|--------|-------------------|
| **T1** | Consumidor Node/npm | Dependência no manifesto, flat config, `eslint` / API ESLint, monorepo opcional, `npx` / `npm exec`, registry (público ou privado), `bin` global se existir. |
| **T2** | Container / OCI | Imagem [`.docker/Dockerfile`](../.docker/Dockerfile), Compose, paridade com [`specs/agent-docker-compose.md`](../specs/agent-docker-compose.md) e [`ops-eslint`](../.github/actions/ops-eslint/). |
| **T3** | CI/CD | Workflow que instala dependências e executa lint/teste de fumaça reprodutível (ex.: GitHub Actions em [`.github/workflows/`](../.github/workflows/)). |
| **T4** | IDE / LSP | Extensão ESLint + `eslint.config`; validação mista (documentada + script opcional). |
| **T5** | Ecossistema agente | Cursor (rules, skills, hooks, CLI, marketplace), Copilot (`.github/agents/`, instructions), MCP — **indireto** (presença, smoke, política; não substituem o pacote npm). |
| **T6** | Git hooks | Husky/Lefthook ou hooks nativos acionando `eslint`; política local e reprodutibilidade limitada em CI. |

## Rastreabilidade: canal → trilha → massa → Compose / automação → estado

Cada linha corresponde à tabela mestre em [`solution-distribution-channels.md`](solution-distribution-channels.md).

| Canal | Trilha | Massa / projeto de teste (proposto ou existente) | Compose / automação | Estado |
|-------|--------|---------------------------------------------------|----------------------|--------|
| npm (projeto) | T1 | `e2e-fixture-nest` + futuro `e2e-fixture-consumer-minimal` | Perfil `e2e` existente; futuro `e2e-npm-matrix` | Parcial (Nest em uso) |
| npm workspaces / monorepo | T1 | Mesmo que T1 (cwd em pacote filho) | `docker compose --profile e2e` | Parcial |
| npm global + `bin` | T1 | Smoke documentado ou script em `packages/eslint-plugin-hardcode-detect/e2e/` | CI ou job manual | Planejado |
| `npm exec` / `npx` | T1 | Job que roda `npx eslint` ou `npm exec` com pacote linkado | Workflow dedicado ou step em CI | Planejado |
| Registries privados / `publishConfig` | T1 | Matriz `.npmrc` de exemplo **sem segredos**; **não** implementar no repositório mocks, stubs nem servidor local que imite registry para CI de integração; critério futuro: **sandbox**, registry de testes ou fluxo oficial (npm, GitHub Packages, etc.); ver [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) | Opcional perfil `e2e-registry` (só com gate externo documentado) | **Backlog (validação externa)** |
| Docker / OCI | T2 | Imagem `malnati-ops-eslint` + volume do repo | Novo perfil `e2e-ops` (planejado) | Parcial (imagem + action existentes) |
| CI/CD | T3 | Repositório consumidor mínimo ou reuse do monorepo | [`ci.yml`](../.github/workflows/) + paridade `prod` Compose | Parcial |
| Git hooks | T6 | Fixture com script `prepare` / doc de Husky | Não típico em Docker; validação local/CI opcional | Planejado |
| Cursor: regras e skills | T5 | Verificação de árvore `.cursor/` + lint de docs | N/A ou job `verify-agent-files` | Planejado |
| Cursor: hooks | T5 | Presença `hooks.json` + teste de schema se existir | N/A | Planejado |
| Cursor: Marketplace Plugin | T5 | Documentação + checklist release marketplace | Fora do npm do plugin | Planejado |
| Cursor CLI / headless | T5 | Script que invoca CLI se disponível no runner | CI condicional | Planejado |
| MCP | T5 | Validação conforme **documentação do servidor MCP** ou ambiente de desenvolvimento suportado pelo fornecedor; **não** substituir o fornecedor por mocks de integração no repo (ver [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md)) | N/A | **Backlog (validação externa)** |
| GitHub Copilot agents/instructions | T5 | `.github/agents/`, `.github/instructions/` | Workflow de verificação de ficheiros | Parcial |
| Editores com ESLint / LSP | T4 | Mesma massa T1; guia de `settings.json` / workspace | Documentação + teste opcional | Planejado |

## Diagramas de sequência

### T1 — Consumidor npm (motor ESLint + plugin)

![sequenceDiagram](./assets/diagrams/generated/mermaid-3e715ff19befe4.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
sequenceDiagram
  participant DevOrCI as DevOrCI
  participant NpmClient as npm
  participant Workspace as workspace
  participant EslintBin as eslint
  participant PluginPkg as hardcodeDetectPlugin
  participant Fixture as e2eFixture
  DevOrCI->>NpmClient: installOrCi
  NpmClient->>Workspace: node_modulesAndLinks
  DevOrCI->>EslintBin: lintFilesOrCLI
  EslintBin->>PluginPkg: loadRulesFromConfig
  PluginPkg->>Fixture: analyzeSourceFiles
  Fixture-->>EslintBin: astAndVisitors
  EslintBin-->>DevOrCI: reportOrExitCode
```

</details>

### T2 — Container ops-eslint (lint sobre volume)

![sequenceDiagram](./assets/diagrams/generated/mermaid-2b593110c5d773.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
sequenceDiagram
  participant Operator as operator
  participant DockerEngine as docker
  participant OpsImage as opsEslintImage
  participant WorkspaceVol as workspaceVolume
  participant EslintEntry as eslintEntrypoint
  Operator->>DockerEngine: runWithMount
  DockerEngine->>OpsImage: startContainer
  OpsImage->>WorkspaceVol: readSources
  OpsImage->>EslintEntry: eslintArgs
  EslintEntry-->>Operator: stdoutJsonOrStatus
```

</details>

### T3 — CI (pipeline)

![sequenceDiagram](./assets/diagrams/generated/mermaid-3305f61612df07.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
sequenceDiagram
  participant Vcs as gitHost
  participant Runner as ciRunner
  participant NpmCi as npmCi
  participant TestSuite as testSuite
  Vcs->>Runner: pushOrPullRequest
  Runner->>NpmCi: npmCiInstall
  NpmCi->>TestSuite: lintAndPluginTests
  TestSuite-->>Runner: junitOrExitCode
  Runner-->>Vcs: statusCheck
```

</details>

## Composição temporal dos marcos (durações)

Durações planejadas por marco e resumo da composição (detalhe em cada `distribution-milestones/m*.md`). **D** = dias de esforço sequencial dentro do marco salvo nota.

| Marco | Duração (D) | Composição (resumo) |
|-------|-------------|---------------------|
| **M0** | 14 | 5 + 5 + 4 — índice milestones, cruzamento specs/README, revisão massa Nest ([`m0-baseline.md`](distribution-milestones/m0-baseline.md)) |
| **M1** | 21 | 10 (T1 matriz npm) + 11 (T2 smoke ops) ([`m1-channel-t1-t2.md`](distribution-milestones/m1-channel-t1-t2.md)) |
| **M2** | 14 | 7 + 7 — mapear CI, paridade prod ([`m2-channel-t3-ci.md`](distribution-milestones/m2-channel-t3-ci.md)) |
| **M3** | 20 | 10 (onda T4 / IDE) + 10 (onda T6 / hooks) — a **segunda onda** só inicia **após conclusão de M4** (ver [`m3-channel-t4-t6.md`](distribution-milestones/m3-channel-t4-t6.md)) |
| **M4** | 18 | 8 + 10 — inventário agentes, job opcional ([`m4-channel-t5-agents.md`](distribution-milestones/m4-channel-t5-agents.md)) |
| **M5** | 14 | 5 + 5 + 4 — notas/bump, publish/tag, smoke ([`m5-release-candidate.md`](distribution-milestones/m5-release-candidate.md)) |

**Soma linear do caminho descrito abaixo:** 101d (14+21+14+10+18+10+14). Não representa calendário civil; o tempo real entre marcos depende de equipa e paralelismo fora deste doc.

### Gantt macro (eixo T0 fictício)

O eixo `2000-01-01` é **apenas** ancoragem Mermaid para desenhar barras; **só as durações e a ordem `after` são normativas**. A **segunda onda de M3** (T6) executa **após M4** (T5), não imediatamente após a primeira onda de M3 (T4).

![gantt](./assets/diagrams/generated/mermaid-f765345a58fe37.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
gantt
  title Marcos e subfases M3 (eixo T0 fictício)
  dateFormat YYYY-MM-DD
  section Baseline_a_T3
  M0_baseline :done, m0, 2000-01-01, 14d
  M1_t1_t2 :m1, after m0, 21d
  M2_t3 :m2, after m1, 14d
  section M3_onda1_T4
  M3_guia_IDE :m3a, after m2, 10d
  section M4_T5
  M4_agentes :m4, after m3a, 18d
  section M3_onda2_T6
  M3_hooks :m3b, after m4, 10d
  section Fechamento_M5
  M5_release :m5, after m3b, 14d
```

</details>

## Proposta de workspaces e perfis Docker

| Trilha | Workspace auxiliar sugerido | Notas |
|--------|----------------------------|--------|
| T1 | `packages/e2e-fixture-nest` (existente); `packages/e2e-fixture-consumer-minimal` (futuro) | Consumidor mínimo reduz tempo de CI para matrizes npm. |
| T2 | Reuso do monorepo montado em volume | Perfil proposto **`e2e-ops`**: `docker compose --profile e2e-ops run --rm e2e-ops` executando ESLint via imagem ops-eslint (alteração futura a [`docker-compose.yml`](../docker-compose.yml) e a [`specs/agent-docker-compose.md`](../specs/agent-docker-compose.md)). |
| T3 | N/A (usa raiz do repo ou subdir fixture) | Paridade: [`docker-compose.yml`](../docker-compose.yml) perfil `prod` ≈ pipeline CI. |
| T4 | Documentação em `docs/` + opcional fixture T1 | Sem serviço HTTP obrigatório no Compose (ver spec Docker). |
| T5 | Verificação por ficheiros sob `.cursor/`, `.github/agents/` | Sem novo pacote obrigatório. |
| T6 | `packages/e2e-fixture-git-hooks-sample` (futuro) | Cuidado com hooks que alterem git em CI. |

Perfis **atuais** na raiz: `dev`, `e2e`, `prod` ([`specs/agent-docker-compose.md`](../specs/agent-docker-compose.md)). Novos perfis exigem atualização do spec e de [`docs/repository-tree.md`](repository-tree.md).

## Ciclo de vida por trilha

Para cada entrega de trilha (ou sub-marco), repetir o ciclo abaixo e arquivar evidências no PR.

| Fase | Atividades |
|------|------------|
| Desenvolvimento | Spec ou contrato atualizado se comportamento mudar; código ou fixture no caminho `packages/` correto. |
| Testes | `npm test` no pacote do plugin; jobs CI adicionais quando existirem. |
| Análise de resultados | Comparar saída ESLint esperada (contagens, regras); falhas categorizadas (config vs regra vs infra). |
| Logs e artefatos | Guardar saída JSON ou texto em anexos de CI; não commitar segredos. |
| Documentação | Atualizar [`docs/repository-tree.md`](repository-tree.md), specs e2e e este plano quando o estado mudar. |
| Correções | Commits focados; Conventional Commits. |
| Deploy | `npm publish` do pacote publicável quando o marco incluir release; imagem ops-eslint / tags conforme pipeline; canais indiretos (marketplace Cursor) como checklists separados. |
| Validação pós-deploy | Smoke em consumidor limpo; tag Git e notas de release. |

## Plano no GitHub: milestones e PRs

| Marco | Conteúdo típico do PR | Milestone sugerido |
|-------|------------------------|-------------------|
| M0 | Baseline: documentação macro + e2e Nest existente | `macro-baseline` |
| M1 | T1/T2: matriz npm ampliada; rascunho perfil `e2e-ops` ou script ops-eslint | `channel-t1-t2` |
| M2 | T3: job CI explícito para fumaça reprodutível | `channel-t3-ci` |
| M3 | T4/T6: guias IDE; fixture ou doc hooks | `channel-t4-t6` |
| M4 | T5: verificações `.cursor/` e `.github/agents/` | `channel-t5-agents` |
| M5 | Release: versão semver do plugin, tag, notas | `release-candidate` |

**Práticas:** uma **pull request** por marco (ou por trilha quando o escopo for grande); **labels** `area/channel-Tn`; **Conventional Commits**; push na branch atual conforme [`versioning-for-agents.md`](versioning-for-agents.md).

## Visão geral (diagrama)

![flowchart TB](./assets/diagrams/generated/mermaid-2090d11967a184.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
flowchart TB
  subgraph docLayer [Documentacao]
    map[hardcoding-map]
    channels[solution-distribution-channels]
    macro[distribution-channels-macro-plan]
    limits[limitations-and-scope]
  end
  subgraph repo [Repositorio]
    plugin[packages/eslint-plugin-hardcode-detect]
    nest[packages/e2e-fixture-nest]
    compose[docker-compose]
  end
  map --> limits
  channels --> limits
  channels --> macro
  macro --> nest
  macro --> plugin
  compose --> macro
```

</details>

## Variante: um workspace e2e por linha da tabela

Duplicar pacotes `e2e-fixture-*` para cada linha da tabela mestre **aumenta** custo de manutenção e pode violar DRY quando o runner é idêntico. Esta variante só deve ser adotada por **decisão explícita** de produto (ex.: SLAs distintos por canal corporativo).

## Versão do documento

- **1.4.0** — Tabela rastreabilidade: registry e MCP alinhados a [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) (sandboxes; sem mocks no repo).
- **1.3.0** — Sincronização **M0** (baseline macro): índice e conteúdo dos planos por marco alinhados a [`distribution-milestones/README.md`](distribution-milestones/README.md); cadeia **T1→T6** e handoff em **M3** (incl. segunda onda T6 após M4) coerentes com [`distribution-milestones/m3-channel-t4-t6.md`](distribution-milestones/m3-channel-t4-t6.md).
- **1.2.0** — Planeamento por **durações e composição** (sem datas de calendário normativas); tabela-resumo M0–M5; Gantt macro com eixo T0 fictício e princípio explícito.
- **1.1.0** — Remissão aos planos por marco em [`distribution-milestones/README.md`](distribution-milestones/README.md); nota sobre cadeia de handoff T1→T6 vs marcos M0–M5.
- **1.0.0** — Plano macro inicial: trilhas T1–T6, rastreabilidade de canais, sequência, Gantt ilustrativo, ciclo de vida, Compose, milestones GitHub.
