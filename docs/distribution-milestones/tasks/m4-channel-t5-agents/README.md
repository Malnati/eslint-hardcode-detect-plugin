# M4 — ficheiros de tarefa (T5 — ecossistema agente)

Marco: [`../../m4-channel-t5-agents.md`](../../m4-channel-t5-agents.md) · **GitHub:** `channel-t5-agents`

**Micro-tarefas / manifesto:** nesta iteração **não** há `coverage-manifest.json` nem pasta `micro/` — a validação `npm run test:docs-milestones` continua a cobrir apenas M0–M3 (ver [`scripts/validate-milestone-plan-coverage.mjs`](../../../../scripts/validate-milestone-plan-coverage.mjs)). Uma fase futura pode acrescentar micro-tarefas `M4-*` e alargar o script.

## Grafo de dependências (Camada A)

Handoff **T4** (M3, onda 1) alimenta **A1**. **A2** depende do inventário (A1). **A3** pode seguir A1 em paralelo lógico com A2; ambos alimentam o handoff **T6** (política de agente alinhada ao CI).

```text
T4 (M3) ──► A1 ──► A2 ──► handoff T6 (com M3 §10)

         └──► A3 ─────────► handoff T6
```

| ID | Ficheiro | Timelining (secção 4 do plano M4) |
|----|----------|-----------------------------------|
| A1 | [`A1-inventario-cursor-github-agentes-checklist.md`](A1-inventario-cursor-github-agentes-checklist.md) | 1 — Inventário `.cursor/` e pontes Copilot |
| A2 | [`A2-propor-job-verify-agent-files.md`](A2-propor-job-verify-agent-files.md) | 2 — Job opcional `verify-agent-files` |
| A3 | [`A3-docs-limites-mcp-clippings.md`](A3-docs-limites-mcp-clippings.md) | 3 — Cruzamento `agent-tooling-ecosystem-map` / limites MCP (doc) |

**Âncora normativa:** [`specs/agent-tooling-ecosystem-map.md`](../../../../specs/agent-tooling-ecosystem-map.md). Gate T6 só após M4: [`m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) §10.
