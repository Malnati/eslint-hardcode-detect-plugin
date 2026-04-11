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
│   ├── rules/                # Regras Cursor (alwaysApply conforme cada arquivo)
│   │   ├── documentation.mdc
│   │   ├── git-versioning.mdc
│   │   └── repo-layout.mdc
│   └── skills/               # Skills reutilizáveis pelos agentes
│       ├── eslint-plugin-workflow/
│       ├── git-agent-workflow/
│       └── github-markdown-docs/
├── .github/
│   ├── actions/ops-eslint/   # Composite Action (action.yml + assets/run.sh)
│   └── workflows/          # CI (ex.: ci.yml)
├── docs/                     # Documentação complementar
│   ├── README.md             # Índice dos guias em docs/
│   ├── architecture.md
│   ├── documentation-policy.md
│   ├── limitations-and-scope.md
│   ├── repository-tree.md    # Este arquivo
│   └── versioning-for-agents.md
├── packages/
│   └── eslint-plugin-hardcode-detect/  # Pacote npm do plugin (implementação oficial)
├── reference/                # Somente referência; não é dependência do pacote
│   ├── README.md
│   ├── hardcoded-check.yml   # Workflow de exemplo (referência; não em .github/workflows/)
│   └── legacy-snapshot/      # Snapshot histórico (ESLint local, action de exemplo)
└── specs/                    # Contratos e visão
    ├── agent-documentation-workflow.md
    ├── agent-git-workflow.md
    ├── plugin-contract.md
    └── vision-hardcode-plugin.md
```

## Relações

- **Implementação**: `packages/eslint-plugin-hardcode-detect/`.
- **Normas de produto e agente**: `specs/` + `AGENTS.md` + `.cursor/rules/`.
- **Referência histórica**: `reference/` (somente leitura para evolução do plugin).

## Diagrama (visão lógica)

```mermaid
flowchart LR
  subgraph public [Publicavel]
    pkg[packages/eslint-plugin-hardcode-detect]
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
  ref -.->|inspiracao| pkg
  gh --> pkg
```
