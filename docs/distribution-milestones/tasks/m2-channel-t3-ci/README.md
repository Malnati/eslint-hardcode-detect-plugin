# M2 — ficheiros de tarefa (T3 CI)

Marco: [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) · **GitHub:** `channel-t3-ci`

**Micro-tarefas** (escopo reduzido): [`micro/README.md`](micro/README.md).

**Cobertura do plano (§4, §7, §10):** [`coverage-manifest.json`](coverage-manifest.json) — validação: `npm run test:docs-milestones` na raiz do repositório.

## Grafo de dependências (Camada A)

```text
A1 ──► A2 ──► A3
```

| ID | Ficheiro | Timelining (secção 4) |
|----|----------|------------------------|
| A1 | [`A1-audit-ci-yml-vs-compose-prod.md`](A1-audit-ci-yml-vs-compose-prod.md) | Ordem 1 (mapear `ci.yml`) |
| A2 | [`A2-ci-artifacts-logs-policy.md`](A2-ci-artifacts-logs-policy.md) | Ordens 2–3 (paridade prod ↔ CI; logs/anexos incl. em 2) |
| A3 | [`A3-contributing-ci-handoff.md`](A3-contributing-ci-handoff.md) | Handoff T4 e CONTRIBUTING (§7) |

**Nota:** A2 consolida o critério de paridade documental e a política de artefatos/logs descritos no plano M2 §4.
