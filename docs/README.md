# Documentação do repositório

Índice dos guias mantidos para GitHub e colaboradores.

| Documento | Conteúdo |
|-----------|----------|
| [architecture.md](architecture.md) | Visão da arquitetura do monorepo |
| [architecture-r2-global-index.md](architecture-r2-global-index.md) | Índice R2 global (marco M2), CI e `settings` |
| [adr-eslint-concurrency-r2.md](adr-eslint-concurrency-r2.md) | ADR: paralelismo ESLint vs estado do índice R2 |
| [adr-hardcode-bin-r2-aggregation.md](adr-hardcode-bin-r2-aggregation.md) | ADR: entrada `bin` vs agregação R2 in-process (M5) |
| [documentation-policy.md](documentation-policy.md) | Boas práticas Markdown no GitHub |
| [social-preview-image.md](social-preview-image.md) | Imagem de Social Preview (1280×640): SVG em `docs/assets/`, raster e upload no GitHub |
| [hardcoding-map.md](hardcoding-map.md) | Taxonomia, níveis e camadas de detecção de hardcoding |
| [solution-distribution-channels.md](solution-distribution-channels.md) | Canais de distribuição e operacionalização do plugin (npm, CI, Docker, IDE, agentes) |
| [hardcode-remediation-macro-plan.md](hardcode-remediation-macro-plan.md) | Plano macro de remediação (R1–R3: arquivo, compartilhado, propriedades/env), segredos, verificação global |
| [remediation-milestones/README.md](remediation-milestones/README.md) | Índice M0–M5 com plano por ficheiro (`mN-*.md`), handoff remediação M0→M5, Camadas A/B; tarefas em `remediation-milestones/tasks/` |
| [distribution-channels-macro-plan.md](distribution-channels-macro-plan.md) | Plano macro por trilha (e2e, Compose, diagramas, marcos GitHub) |
| [distribution-milestones/README.md](distribution-milestones/README.md) | Índice M0–M5 com plano por ficheiro (`mN-*.md`), alinhado ao macro-plan; handoff T1→T6; e2e×Compose; Camadas A/B; tarefas Camada A em `tasks/` |
| [limitations-and-scope.md](limitations-and-scope.md) | Escopo, limitações e restrições |
| [repository-tree.md](repository-tree.md) | Grafo de arquivos e diretórios |
| [cursor-vps-cli-parity.md](cursor-vps-cli-parity.md) | Cursor IDE vs CLI (VPS): hooks e artefactos `.cursor/`; smoke do hook e verificação manual |
| [codex-cli-hooks-equivalence.md](codex-cli-hooks-equivalence.md) | Equivalência Cursor -> Codex CLI: hooks (`Stop`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`) e MCP local |
| [versioning-for-agents.md](versioning-for-agents.md) | Fluxo Git para agentes |
| [README do pacote eslint-plugin-hardcode-detect](../packages/eslint-plugin-hardcode-detect/README.md) | Uso npm, desenvolvimento e fumaça e2e Nest; runner `packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs` |

Especificações relacionadas: [`../specs/`](../specs/) — em especial [`agent-ia-governance.md`](../specs/agent-ia-governance.md) (governança e checklists para agentes de IA), [`agent-session-workflow.md`](../specs/agent-session-workflow.md) (fluxo por prompt), [`agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md) (Copilot/Cursor e pontes `.github/`), [`agent-docker-compose.md`](../specs/agent-docker-compose.md) (Docker Compose e perfis dev/e2e/prod/e2e-ops), [`agent-reference-agents.md`](../specs/agent-reference-agents.md) (mapeamento de [`reference/agents-ref/`](../reference/agents-ref/)), [`e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md) (massa e2e Nest), [`agent-reference-clippings.md`](../specs/agent-reference-clippings.md) (`reference/Clippings/`) e [`agent-documentation-workflow.md`](../specs/agent-documentation-workflow.md). IDE vs Cursor CLI/VPS (hooks): [`cursor-vps-cli-parity.md`](cursor-vps-cli-parity.md). Equivalência para Codex CLI: [`codex-cli-hooks-equivalence.md`](codex-cli-hooks-equivalence.md). Instruções para agentes: [`../AGENTS.md`](../AGENTS.md).
