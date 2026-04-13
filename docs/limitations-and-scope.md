# Limitações, escopo e restrições

## Escopo do produto

**eslint-plugin-hardcode-detect** é um plugin ESLint focado em **detecção e governança de valores hardcoded** (strings e mensagens), evoluindo para análise em **vários níveis** (por arquivo, dependências, classificação, ordenação, severidade/níveis). O detalhamento da visão está em [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md). Uma taxonomia conceitual de tipos de hardcoding e níveis de gravidade (fora do contrato normativo imediato das regras) está em [`hardcoding-map.md`](hardcoding-map.md).

## Relação entre documentos de escopo conceitual

| Documento | Papel |
|-----------|--------|
| [`hardcoding-map.md`](hardcoding-map.md) | **O quê** classificar: IDs HC-*, gravidade de negócio L1–L4, camadas de detecção (texto, AST, parsers). Não substitui o contrato das regras. |
| [`solution-distribution-channels.md`](solution-distribution-channels.md) | **Por onde** a solução circula (npm, CI, Docker, IDE, agentes). Lista canais diretos e indiretos em relação ao pacote ESLint. |
| [`specs/plugin-contract.md`](../specs/plugin-contract.md) | **Comportamento normativo** das regras e opções públicas do plugin; precedência sobre interpretações genéricas. |
| [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md) | **Roadmap macro** por trilha de validação e2e, diagramas, ciclo de vida e marcos em PRs (planejamento; nem todo item está implementado). |
| [`hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md) | **Roadmap macro** de remediação (trilhas R1–R3: constantes por arquivo, módulo compartilhado, propriedades/env), segredos, verificação global por execução; não substitui o contrato das regras (planejamento; nem todo item está implementado). |
| [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) | **Integrações externas** (registry, publicação, MCP, etc.): sem mocks no repositório; usar sandboxes ou ambientes de teste oficiais dos provedores. |

*Distinção entre trilhas **T1** (npm), **T3** (CI) e **T5** (MCP e ecossistema agente) e limites do MCP: ver secção [MCP (T5), npm (T1) e CI (T3)](#mcp-t5-npm-t1-e-ci-t3).*

## Canais de distribuição e artefatos indiretos

A solução completa de governança de hardcoding pode combinar o **pacote npm** com políticas de projeto (CI, Docker, hooks, IDEs). Vários canais da tabela em [`solution-distribution-channels.md`](solution-distribution-channels.md) são **indiretos**: orquestram ou documentam o fluxo (Cursor, Copilot, MCP, hooks Git) **sem** substituir o tarball do plugin. O detalhe de cobertura planejada por trilha e massa de testes está em [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md). O planejamento de **remediação multi-nível** (constantes, duplicados entre arquivos, externalização para arquivos de propriedades) está em [`hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md).

## MCP (T5), npm (T1) e CI (T3)

As **trilhas** (ordem de handoff de artefatos) estão definidas em [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md). Para evitar ambiguidade entre **canal npm**, **pipeline de CI** e **MCP**:

| Trilha | Papel em relação ao plugin ESLint |
|--------|-------------------------------------|
| **T1** (consumidor npm) | Dependência no manifesto, configuração flat/legacy, execução do **motor ESLint** no projeto — inclui validação local das regras do pacote. |
| **T3** (CI/CD) | Instala dependências e executa lint/teste **reprodutível** na pipeline — continuação normativa da mesma validação em ambiente agregado. |
| **T5** (ecossistema agente) | Cursor, Copilot, **MCP**, etc.: canais **indiretos**; documentam ou enriquecem o fluxo **sem** substituir o tarball nem a política de lint. |

O **Model Context Protocol (MCP)** expõe, no cliente (ex.: IDE), *tools*, *resources* e *prompts*; **não** substitui `npm install` do plugin, **não** dispensa a dependência npm no consumidor e **não** valida, por si só, as regras publicadas do **eslint-plugin-hardcode-detect**. A verificação normativa das regras permanece em **T1** e **T3** (e, no IDE, na trilha **T4** quando o ESLint corre localmente). A linha **MCP** da tabela mestre está em [`solution-distribution-channels.md`](solution-distribution-channels.md).

Para **testar ou validar integração** com servidores MCP (como para outros serviços externos), aplicam-se as regras de [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md): ambientes suportados pelo fornecedor ou documentação oficial; **sem** mocks, stubs ou simuladores ad hoc neste repositório.

**Clippings (MCP):** decisões que dependam da especificação ou documentação oficial do protocolo devem cruzar-se com o índice em [`reference/Clippings/dev/mcp/README.md`](../reference/Clippings/dev/mcp/README.md) e com [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). **Nenhum recorte novo em `reference/Clippings/` foi necessário neste ciclo** para esta ancoragem normativa — bastam as remissões já indexadas (por exemplo o recorte sobre servidores MCP).

## Versionamento e rastreabilidade

O fluxo Git resumido para agentes está em [`versioning-for-agents.md`](versioning-for-agents.md); a norma completa (Conventional Commits, escopos) em [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md). Marcos de produto e entregas por canal podem ser organizados como **milestones** e **PRs** no GitHub, alinhados a releases e tags do pacote publicável quando aplicável (ver roadmap em [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md)).

## Testes e2e e massas de fixture

Hoje existe massa e2e **NestJS** em [`packages/e2e-fixture-nest/`](../packages/e2e-fixture-nest/), consumida pela fumaça e2e do plugin conforme [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md). Workspaces auxiliares adicionais e perfis Docker dedicados por trilha são **planejados** no documento macro; até serem implementados, não se assume cobertura e2e automatizada para todos os canais da tabela mestre.

## Clippings e documentação oficial

Decisões que dependam da API do ESLint, npm, empacotamento ou configuração flat/legacy devem cruzar-se com [`reference/Clippings/`](../reference/Clippings/) conforme [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). O índice por domínio está em [`reference/Clippings/README.md`](../reference/Clippings/README.md). Remissões ao portfólio em [`reference/agents-ref/`](../reference/agents-ref/) seguem [`specs/agent-reference-agents.md`](../specs/agent-reference-agents.md).

## Restrições de repositório

| Restrição | Descrição |
|-----------|-----------|
| `reference/` | Não importar nem depender em código de produção; material apenas documental. |
| `reference/Clippings/` | Recortes da documentação **oficial** externa; consulta obrigatória em escopo relevante; ver [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). |
| `reference/legacy-snapshot/` | Snapshot histórico; não tratar como fonte normativa do contrato atual. |
| Código publicável | Somente sob `packages/eslint-plugin-hardcode-detect/`. |
| Workspace e2e Nest | [`packages/e2e-fixture-nest/`](../packages/e2e-fixture-nest/) é auxiliar (massa de testes); não substitui o pacote do plugin. Ver [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md). |
| Contrato antes do código | Mudanças de comportamento público exigem atualização de `specs/plugin-contract.md` (e visão, se macro). |
| Segredos | Não commitar credenciais; variáveis de ambiente e artefatos ignorados. |

## Limitações atuais da implementação

- O pacote em `packages/` está em **construção**; regras descritas no contrato podem estar parcialmente implementadas. Consulte `specs/plugin-contract.md` e o código-fonte.

## Limitações conhecidas do ecossistema ESLint

- Regras ESLint operam por **arquivo** com o AST disponível; análise “por dependências” (grafo entre pacotes) pode exigir ferramentas complementares ou configuração explícita (ver visão).

## Política de documentação

Alterações estruturais devem refletir em [`repository-tree.md`](repository-tree.md). Ver [`documentation-policy.md`](documentation-policy.md).
