# Grafo de arquivos e diretórios

Documentação da organização do repositório. **Atualize este arquivo quando criar, mover ou remover diretórios ou documentos normativos.**

```text
.
├── AGENTS.md                 # Instruções para agentes de IA e prioridades do repo
├── CONTRIBUTING.md           # Como contribuir (humanos e agentes)
├── LICENSE                   # Licença do projeto
├── README.md                 # Entrada principal no GitHub
├── package.json              # Monorepo npm (workspaces)
├── .gitignore
├── .cursor/
│   ├── commands/             # Comandos Cursor (/abrir-prompt-agente, /fechar-prompt-agente, /fechar-e2e-nest-fixture)
│   ├── rules/                # Regras Cursor (alwaysApply conforme cada arquivo)
│   │   ├── agent-ia-governance.mdc
│   │   ├── agent-mbra-reference.mdc
│   │   ├── agent-session.mdc
│   │   ├── clippings-official-docs.mdc
│   │   ├── documentation.mdc
│   │   ├── e2e-nest-fixture.mdc
│   │   ├── git-versioning.mdc
│   │   └── repo-layout.mdc
│   └── skills/               # Skills reutilizáveis pelos agentes
│       ├── eslint-plugin-workflow/
│       ├── git-agent-workflow/
│       ├── github-markdown-docs/
│       ├── mbra-reference-agents/
│       └── reference-clippings-workflow/
├── .github/
│   ├── agents/               # Agente GitHub Copilot (ponte para AGENTS.md e specs)
│   ├── instructions/         # Instruções Copilot com applyTo no pacote do plugin
│   ├── actions/ops-eslint/   # Composite Action (action.yml + assets/run.sh)
│   └── workflows/            # CI (ex.: ci.yml)
├── docs/                     # Documentação complementar
│   ├── README.md             # Índice dos guias em docs/
│   ├── architecture.md
│   ├── documentation-policy.md
│   ├── limitations-and-scope.md
│   ├── repository-tree.md    # Este arquivo
│   └── versioning-for-agents.md
├── packages/
│   ├── e2e-fixture-nest/               # Workspace NestJS: massa e2e (não publicável como plugin)
│   │   ├── src/fixture-hardcodes/      # Literais fixos com contagens no e2e
│   │   └── eslint.config.mjs           # Flat config + plugin via dist do pacote irmão
│   └── eslint-plugin-hardcode-detect/  # Pacote npm do plugin (implementação oficial)
│       ├── docs/rules/                 # Documentação de regras (ex.: hello-world)
│       ├── e2e/                        # Fumaça e2e (ESLint API + fixtures consumidor)
│       │   ├── fixtures/hello-world/   # Flat config mínimo + amostra
│       │   ├── hello-world.e2e.mjs
│       │   └── nest-workspace.e2e.mjs  # Massa Nest (cwd no workspace irmão)
│       ├── src/rules/                  # Implementação das regras ESLint
│       ├── tests/                      # RuleTester + node:test
│       └── eslint.config.mjs           # Lint do próprio plugin (flat config)
├── reference/                # Somente referência; não é dependência do pacote
│   ├── README.md
│   ├── agents-ref/           # Portfólio MBRA de instruções para agentes (mapear via specs/agent-mbra-reference-agents.md)
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
    ├── agent-documentation-workflow.md
    ├── agent-git-workflow.md
    ├── agent-ia-governance.md
    ├── agent-mbra-reference-agents.md
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
