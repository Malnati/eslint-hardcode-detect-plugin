# A1: Auditar `ci.yml` vs perfil `prod` (Compose)

| Campo | Valor |
|-------|--------|
| milestone | M2 |
| github_milestone | channel-t3-ci |
| task_id | A1 |
| labels_sugeridas | `area/channel-T3`, `type/ci`, `type/docs` |
| token_budget_estimate | 18 000 |
| timelining_order | 1 |
| depends_on | — (handoff M1 T1/T2) |

## Plano do marco

Camada A em [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) (secção 7).

## Inputs

- [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml).
- [`docker-compose.yml`](../../../../docker-compose.yml) (perfil `prod`).
- [`specs/agent-docker-compose.md`](../../../../specs/agent-docker-compose.md).

## Outputs

- Tabela de paridade **jobs/steps CI** vs **comando reprodutível** do perfil `prod` (gaps listados).
- Evidência editável em [`evidence/T3-ci-prod-parity-gap-matrix.md`](evidence/T3-ci-prod-parity-gap-matrix.md) alinhada às micro-tarefas A1.

## Critério de conclusão

- Gaps explícitos (ex.: `npm ci` vs `npm install`, ordem lint/test/validação de docs); matriz §6 do plano M2 cruzada com o estado do repositório.

## Dependências

- **Bloqueia:** A2 (política de artefatos e critério de paridade assumem auditoria A1).
- **Depende de:** handoff M1 (pacote + smoke T2 documentados).

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M2-A1-01 | [`micro/M2-A1-01-inventario-ci-yml-jobs-steps.md`](micro/M2-A1-01-inventario-ci-yml-jobs-steps.md) |
| M2-A1-02 | [`micro/M2-A1-02-tabela-paridade-prod-vs-ci.md`](micro/M2-A1-02-tabela-paridade-prod-vs-ci.md) |
| M2-A1-03 | [`micro/M2-A1-03-matriz-sec6-cross-check-compose.md`](micro/M2-A1-03-matriz-sec6-cross-check-compose.md) |

## Paths principais

- `.github/workflows/ci.yml`
- `docker-compose.yml`
- `package.json` (raiz)
