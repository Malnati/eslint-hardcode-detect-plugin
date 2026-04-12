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
| [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) | **Integrações externas** (registry, publicação, MCP, etc.): sem mocks no repositório; usar sandboxes ou ambientes de teste oficiais dos provedores. |

## Canais de distribuição e artefatos indiretos

A solução completa de governança de hardcoding pode combinar o **pacote npm** com políticas de projeto (CI, Docker, hooks, IDEs). Vários canais da tabela em [`solution-distribution-channels.md`](solution-distribution-channels.md) são **indiretos**: orquestram ou documentam o fluxo (Cursor, Copilot, MCP, hooks Git) **sem** substituir o tarball do plugin. O detalhe de cobertura planejada por trilha e massa de testes está em [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md).

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
