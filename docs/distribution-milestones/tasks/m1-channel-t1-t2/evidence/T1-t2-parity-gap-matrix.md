# Evidência M1 — matriz paridade T1 × T2

Marco M1 · âncoras [`../A1-npm-matrix-t1.md`](../A1-npm-matrix-t1.md), [`../A2-smoke-ops-eslint-image.md`](../A2-smoke-ops-eslint-image.md)

**Propósito:** registar o que deve permanecer **alinhado** entre a trilha **T1** (consumidor npm / `npm test` / e2e no workspace do plugin) e a trilha **T2** (imagem ops-eslint, Composite Action, eventual perfil `e2e-ops`). Preencher durante as micro-tarefas M1-A1-02, M1-A2-02 e M1-A2-03.

| Dimensão | T1 (npm / CI atual) | T2 (Docker / ops-eslint) | Estado |
|----------|---------------------|---------------------------|--------|
| Versão do ESLint global vs workspace | Conforme `packages/eslint-plugin-hardcode-detect` e lockfile na raiz | Comentário / versão em [`.docker/Dockerfile`](../../../../../.docker/Dockerfile) | A preencher |
| Resolução do plugin | Workspace `node_modules` no monorepo | Imagem + checkout montado (mesmo repositório) | A preencher |
| Flat config | `ESLINT_USE_FLAT_CONFIG`, ficheiros `eslint.config.*` usados nos e2e | Variáveis e paths no `run.sh` / action | A preencher |
| Comando de fumo reprodutível | `npm test -w eslint-plugin-hardcode-detect` | `docker build …` + run documentado em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) | A preencher |

## Notas

- **Drift:** qualquer divergência não intencional entre linhas da tabela deve gerar correção de doc ou de infra na mesma onda do marco M1.
- **Perfil `e2e-ops`:** enquanto não existir em [`docker-compose.yml`](../../../../../docker-compose.yml), a coluna T2 pode referir apenas imagem manual + action, sem serviço Compose dedicado.
