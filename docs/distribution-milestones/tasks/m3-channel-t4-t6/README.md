# M3 — ficheiros de tarefa (T4 + preparação T6)

Marco: [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) · **GitHub:** `channel-t4-t6`

**Micro-tarefas:** [`micro/README.md`](micro/README.md).

**Cobertura do plano (§4, §6, §7, §10):** [`coverage-manifest.json`](coverage-manifest.json) — validação: `npm run test:docs-milestones` na raiz do repositório.

## Grafo de dependências (Camada A)

Handoff **T3** (M2) alimenta **A1**. **A3** depende do marco **M4 (T5)** concluído, não de A2.

```text
T3 (M2) ──► A1 ──► A2

M4 (T5) ──► A3   (opcional pós-M4)
```

| ID | Ficheiro | Timelining (secção 4) |
|----|----------|------------------------|
| A1 | [`A1-guia-ide-eslint-flat-config.md`](A1-guia-ide-eslint-flat-config.md) | Onda 1 — Guia IDE + settings exemplo |
| A2 | [`A2-esboco-politica-git-hooks.md`](A2-esboco-politica-git-hooks.md) | Onda 1 (preparação) — backlog T6 Husky/Lefthook |
| A3 | [`A3-fixture-e2e-git-hooks-sample-pos-m4.md`](A3-fixture-e2e-git-hooks-sample-pos-m4.md) | Onda 2 — após M4: hooks + fixture |

**Nota:** Não declarar T6 «done» sem M4 (ver plano M3 §4 e §10). A3 só após handoff de agentes (T5).
