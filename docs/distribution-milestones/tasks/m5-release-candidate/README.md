# M5 — ficheiros de tarefa (release candidate)

Marco: [`../../m5-release-candidate.md`](../../m5-release-candidate.md) · **GitHub:** `release-candidate`

**Micro-tarefas / manifesto:** nesta iteração **não** há `coverage-manifest.json` nem pasta `micro/`.

**Evidências (artefactos ao executar Camada A):**

| Tarefa | Ficheiro alvo |
|--------|----------------|
| A1 | [`evidence/M5-semver-decision.md`](evidence/M5-semver-decision.md) |
| A2 | [`evidence/M5-release-notes-draft.md`](evidence/M5-release-notes-draft.md) |
| A3 | [`evidence/M5-smoke-post-publish.md`](evidence/M5-smoke-post-publish.md) |

## Grafo de dependências (Camada A)

Cadeia **A1 → A2 → A3**: o tipo de bump (A1) informa o texto das notas (A2); notas e matriz §6 do plano informam o smoke reprodutível (A3).

```text
A1 (semver) ──► A2 (notas) ──► A3 (smoke pós-publish)
```

| ID | Ficheiro | Timelining (secção 4 do plano M5) |
|----|----------|-----------------------------------|
| A1 | [`A1-definir-semver-major-minor-patch.md`](A1-definir-semver-major-minor-patch.md) | 1 — Congelar escopo release |
| A2 | [`A2-rascunho-notas-release.md`](A2-rascunho-notas-release.md) | 2 — Changelog / notas |
| A3 | [`A3-plano-smoke-pos-publish.md`](A3-plano-smoke-pos-publish.md) | 3 — Publish + tag; validação pós-deploy (ver §5–6 do plano) |

**Âncoras normativas:** [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md); [`docs/versioning-for-agents.md`](../../../../docs/versioning-for-agents.md); tabela de canais em [`docs/solution-distribution-channels.md`](../../../../docs/solution-distribution-channels.md).
