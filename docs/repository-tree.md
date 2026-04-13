# Grafo de arquivos e diretórios

Documentação da organização do repositório. **Atualize este arquivo quando criar, mover ou remover diretórios ou documentos normativos.**

```text
.
├── AGENTS.md                 # Instruções para agentes de IA e prioridades do repo
├── CONTRIBUTING.md           # Como contribuir (humanos e agentes)
├── LICENSE                   # Licença do projeto
├── README.md                 # Entrada principal no GitHub
├── package.json              # Monorepo npm (workspaces)
├── scripts/                  # Scripts auxiliares na raiz (ex.: validação cobertura planos M0/M1, smoke do hook HCD-ERR, verify ficheiros normativos T5)
│   ├── validate-milestone-plan-coverage.mjs
│   ├── verify-normative-agent-files.mjs
│   └── smoke-cursor-hcd-err-hook.sh
├── docker-compose.yml        # Perfis dev / e2e / prod / e2e-ops (ver specs/agent-docker-compose.md)
├── .dockerignore             # Contexto de build da imagem ops-eslint
├── .docker/
│   └── Dockerfile            # Imagem ESLint para Composite Action ops-eslint
├── .gitignore
├── .log/                     # Ex.: hooks/YYYYMMDD-hcd-err-audit.md (versionável); hooks/.state/ ignorado no Git
├── .cursor/
│   ├── hooks.json            # Hooks do Cursor (auditoria HCD-ERR após Write + stop; ver .cursor/hooks/)
│   ├── hooks/                # Scripts invocados por hooks.json (ex.: hcd-err-triple-audit.sh)
│   ├── commands/             # Comandos Cursor (/abrir-prompt-agente, /fechar-prompt-agente, /fechar-e2e-nest-fixture)
│   ├── rules/                # Regras Cursor (alwaysApply conforme cada arquivo)
│   │   ├── agent-error-messaging-triple.mdc
│   │   ├── agent-ia-governance.mdc
│   │   ├── agent-integration-testing-policy.mdc
│   │   ├── agent-reference-agents.mdc
│   │   ├── agent-session.mdc
│   │   ├── clippings-official-docs.mdc
│   │   ├── documentation.mdc
│   │   ├── docker-compose-tooling.mdc
│   │   ├── e2e-nest-fixture.mdc
│   │   ├── git-versioning.mdc
│   │   ├── repo-layout.mdc
│   │   └── repo-relative-paths.mdc
│   └── skills/               # Skills reutilizáveis pelos agentes
│       ├── agent-error-messaging-triple/
│       ├── docker-compose-workflow/
│       ├── eslint-plugin-workflow/
│       ├── git-agent-workflow/
│       ├── github-markdown-docs/
│       ├── reference-agents-portfolio/
│       └── reference-clippings-workflow/
├── .github/
│   ├── agents/               # Agentes GitHub Copilot (pontes: eslint-hardcode-plugin, docker-tooling, hcd-err-messaging)
│   ├── instructions/         # Instruções Copilot (applyTo: pacote do plugin, docker-compose)
│   ├── actions/ops-eslint/   # Composite Action (action.yml + assets/run.sh)
│   └── workflows/            # CI (ex.: ci.yml)
├── docs/                     # Documentação complementar
│   ├── README.md             # Índice dos guias em docs/
│   ├── cursor-vps-cli-parity.md  # IDE vs CLI/VPS, verificação de hooks e smoke
│   ├── architecture.md
│   ├── documentation-policy.md
│   ├── hardcoding-map.md     # Taxonomia e níveis de hardcoding (mapa conceitual)
│   ├── solution-distribution-channels.md  # Canais npm/CI/Docker/IDE/agentes
│   ├── distribution-channels-macro-plan.md  # Plano macro e2e por trilha, diagramas, marcos, durações
│   ├── distribution-milestones/  # Planos M0–M5 (durações relativas, template, handoff T1→T6, Camada A/B)
│   │   ├── README.md
│   │   ├── milestone-template.md
│   │   ├── m0-baseline.md
│   │   ├── m1-channel-t1-t2.md
│   │   ├── m2-channel-t3-ci.md
│   │   ├── m3-channel-t4-t6.md
│   │   ├── m4-channel-t5-agents.md
│   │   ├── m5-release-candidate.md
│   │   └── tasks/                # Ficheiros Camada A por marco (modelo + M0–M5; M0–M3 com micro/manifesto)
│   │       ├── README.md
│   │       ├── TASK_FILE_TEMPLATE.md
│   │       ├── m0-baseline/      # Tarefas M0 Camada A (âncoras + micro + evidence + manifesto)
│   │       │   ├── README.md
│   │       │   ├── A1-index-milestones-readme.md
│   │       │   ├── A2-macro-plan-index.md
│   │       │   ├── A3-repository-tree.md
│   │       │   ├── A4-plugin-contract-vs-readme.md
│   │       │   ├── A5-nest-massa-e2e-documentada.md
│   │       │   ├── coverage-manifest.json
│   │       │   ├── evidence/
│   │       │   │   └── A4-plugin-contract-gap-matrix.md
│   │       │   └── micro/
│   │       │       ├── README.md
│   │       │       └── M0-A*-*.md            # 15 micro-tarefas (M0-A1-01 … M0-A5-03)
│   │       └── m1-channel-t1-t2/   # Tarefas M1 Camada A (T1/T2 + micro + manifesto)
│   │           ├── README.md
│   │           ├── A1-npm-matrix-t1.md
│   │           ├── A2-smoke-ops-eslint-image.md
│   │           ├── A3-docker-compose-e2e-ops-draft.md
│   │           ├── coverage-manifest.json
│   │           ├── evidence/
│   │           │   └── T1-t2-parity-gap-matrix.md
│   │           └── micro/
│   │               ├── README.md
│   │               └── M1-A*-*.md            # 9 micro-tarefas (M1-A1-01 … M1-A3-03)
│   │       └── m2-channel-t3-ci/   # Tarefas M2 Camada A (T3 CI + micro + manifesto)
│   │           ├── README.md
│   │           ├── A1-audit-ci-yml-vs-compose-prod.md
│   │           ├── A2-ci-artifacts-logs-policy.md
│   │           ├── A3-contributing-ci-handoff.md
│   │           ├── coverage-manifest.json
│   │           ├── evidence/
│   │           │   └── T3-ci-prod-parity-gap-matrix.md
│   │           └── micro/
│   │               ├── README.md
│   │               └── M2-A*-*.md            # 9 micro-tarefas (M2-A1-01 … M2-A3-03)
│   │       └── m3-channel-t4-t6/   # Tarefas M3 Camada A (T4 IDE + preparação T6 + micro + manifesto)
│   │           ├── README.md
│   │           ├── A1-guia-ide-eslint-flat-config.md
│   │           ├── A2-esboco-politica-git-hooks.md
│   │           ├── A3-fixture-e2e-git-hooks-sample-pos-m4.md
│   │           ├── coverage-manifest.json
│   │           └── micro/
│   │               ├── README.md
│   │               └── M3-A*-*.md            # 8 micro-tarefas (M3-A1-01 … M3-A3-03)
│   │       └── m4-channel-t5-agents/   # Tarefas M4 Camada A (T5 agentes; sem micro/manifesto nesta iteração)
│   │           ├── README.md
│   │           ├── evidence/
│   │           │   └── T5-normative-files-inventory.md
│   │           ├── A1-inventario-cursor-github-agentes-checklist.md
│   │           ├── A2-propor-job-verify-agent-files.md
│   │           └── A3-docs-limites-mcp-clippings.md
│   │       └── m5-release-candidate/   # Tarefas M5 Camada A (release; sem micro/manifesto nesta iteração)
│   │           ├── README.md
│   │           ├── evidence/
│   │           │   ├── M5-semver-decision.md
│   │           │   ├── M5-release-notes-draft.md
│   │           │   └── M5-smoke-post-publish.md
│   │           ├── A1-definir-semver-major-minor-patch.md
│   │           ├── A2-rascunho-notas-release.md
│   │           └── A3-plano-smoke-pos-publish.md
│   ├── limitations-and-scope.md
│   ├── repository-tree.md    # Este arquivo
│   └── versioning-for-agents.md
├── packages/
│   ├── e2e-fixture-nest/               # Workspace NestJS: massa e2e (não publicável como plugin)
│   │   ├── src/fixture-hardcodes/      # Literais fixos com contagens no e2e
│   │   └── eslint.config.mjs           # Flat config + plugin via dist do pacote irmão
│   └── eslint-plugin-hardcode-detect/  # Pacote npm do plugin (implementação oficial)
│       ├── docs/rules/                 # Uma página por regra do contrato (hello-world, no-hardcoded-strings, standardize-error-messages)
│       ├── e2e/                        # Fumaça e2e (ESLint API + fixtures consumidor)
│       │   ├── fixtures/hello-world/   # Flat config mínimo + amostra
│       │   ├── hello-world.e2e.mjs
│       │   └── nest-workspace.e2e.mjs  # Massa Nest (cwd no workspace irmão)
│       ├── src/rules/                  # Implementação das regras ESLint
│       ├── tests/                      # RuleTester + node:test
│       └── eslint.config.mjs           # Lint do próprio plugin (flat config)
├── reference/                # Somente referência; não é dependência do pacote
│   ├── README.md
│   ├── agents-ref/           # Portfólio de referência de instruções para agentes (mapear via specs/agent-reference-agents.md)
│   ├── Clippings/            # Trechos da documentação oficial (ESLint, npm, etc.)
│   │   ├── README.md
│   │   ├── dev/
│   │   │   └── javascript/
│   │   │       ├── eslint/   # Recortes ESLint (API, regras, plugins, etc.)
│   │   │       └── npm/      # Recortes npm
│   │   └── standards/        # Padrões (ex.: Conventional Commits)
│   ├── hardcoded-check.yml   # Workflow de exemplo (referência; não em .github/workflows/)
│   └── legacy-snapshot/      # Snapshot histórico (ESLint local, action de exemplo)
└── specs/                    # Contratos e visão
    ├── agent-docker-compose.md         # Docker Compose, .docker/ e action ops-eslint
    ├── agent-error-messaging-triple.md # Falhas relatadas em três partes (agentes de IA)
    ├── agent-documentation-workflow.md
    ├── agent-git-workflow.md
    ├── agent-ia-governance.md
    ├── agent-integration-testing-policy.md  # Integrações: sandboxes; sem mocks no repo
    ├── agent-reference-agents.md
    ├── agent-reference-clippings.md
    ├── agent-session-workflow.md
    ├── agent-tooling-ecosystem-map.md  # Copilot/Awesome vs Cursor; precedência; pontes .github/
    ├── e2e-fixture-nest.md     # Massa e2e NestJS (workspace auxiliar)
    ├── plugin-contract.md
    └── vision-hardcode-plugin.md
```

## Relações

- **Implementação**: `packages/eslint-plugin-hardcode-detect/`.
- **Massa e2e Nest**: `packages/e2e-fixture-nest/` (ver [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md)).
- **Normas de produto e agente**: `specs/` + `AGENTS.md` + `.cursor/rules/`; pontes opcionais GitHub Copilot em `.github/agents/` e `.github/instructions/` (ver [`specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md)).
- **Referência**: `reference/Clippings/` (documentação oficial espelhada), `reference/legacy-snapshot/` (histórico); somente leitura para código em `packages/`.

## Diagrama (visão lógica)

```mermaid
flowchart LR
  subgraph public [Publicavel]
    pkg[packages/eslint-plugin-hardcode-detect]
  end
  subgraph e2eNest [Massa e2e]
    nest[packages/e2e-fixture-nest]
  end
  subgraph norms [Normativo]
    sp[specs]
    agents[AGENTS.md]
  end
  subgraph frozen [Congelado]
    ref[reference]
  end
  subgraph ci [Automacao]
    gh[.github]
  end
  pkg --> sp
  agents --> pkg
  nest --> pkg
  ref -.->|inspiracao| pkg
  gh --> pkg
```
