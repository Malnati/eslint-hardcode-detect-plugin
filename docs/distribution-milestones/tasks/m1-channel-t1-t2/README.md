# M1 — ficheiros de tarefa (T1 + T2)

Marco: [`../../m1-channel-t1-t2.md`](../../m1-channel-t1-t2.md) · **GitHub:** `channel-t1-t2`

**Micro-tarefas** (escopo reduzido): [`micro/README.md`](micro/README.md).

**Cobertura do plano (§4, §7, §10):** [`coverage-manifest.json`](coverage-manifest.json) — validação: `npm run test:docs-milestones` na raiz do repositório.

## Grafo de dependências (Camada A)

```text
A1 ──► A2 ──► A3
```

| ID | Ficheiro | Timelining (secção 4) |
|----|----------|------------------------|
| A1 | [`A1-npm-matrix-t1.md`](A1-npm-matrix-t1.md) | Ordem 1 (matriz T1) |
| A2 | [`A2-smoke-ops-eslint-image.md`](A2-smoke-ops-eslint-image.md) | Ordem 2 (smoke ops-eslint) |
| A3 | [`A3-docker-compose-e2e-ops-draft.md`](A3-docker-compose-e2e-ops-draft.md) | Ordem 3 (rascunho `e2e-ops`, opcional) |

**Nota:** A3 depende do contexto estabelecido por A2 (paridade T1/T2); pode ser documental enquanto o perfil `e2e-ops` não existir em [`docker-compose.yml`](../../../../docker-compose.yml).
