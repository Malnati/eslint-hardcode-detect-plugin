# A1: Matriz npm (trilha T1)

| Campo | Valor |
|-------|--------|
| milestone | M1 |
| github_milestone | channel-t1-t2 |
| task_id | A1 |
| labels_sugeridas | `area/channel-T1`, `type/docs` ou `type/ci` |
| token_budget_estimate | 20 000 |
| timelining_order | 1 |
| depends_on | — (handoff M0) |

## Plano do marco

Camada A em [`../../m1-channel-t1-t2.md`](../../m1-channel-t1-t2.md) (secção 7).

## Inputs

- Handoff **M0:** baseline doc, massa [`packages/e2e-fixture-nest`](../../../../packages/e2e-fixture-nest), plugin em [`packages/eslint-plugin-hardcode-detect`](../../../../packages/eslint-plugin-hardcode-detect).
- Tabela de canais T1 em [`docs/distribution-channels-macro-plan.md`](../../../distribution-channels-macro-plan.md) e [`docs/solution-distribution-channels.md`](../../../solution-distribution-channels.md).

## Outputs

- Matriz T1 documentada (doc ou spec): linhas para `npm ci`, workspaces, `npx` / `npm exec` onde aplicável, massa consumidora atual e backlog explícito para linhas «Planejado».
- Critérios de sucesso reprodutíveis por linha da matriz.

## Critério de conclusão

- Tabela ou backlog com critérios por linha; ligação clara à massa e2e existente e ao comando `npm test -w eslint-plugin-hardcode-detect` como baseline técnica.

## Dependências

- **Bloqueia:** A2 (smoke T2 assume matriz T1 definida).
- **Depende de:** conclusão documental do M0 (handoff).

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M1-A1-01 | [`micro/M1-A1-01-inventario-matriz-t1-macro-plan.md`](micro/M1-A1-01-inventario-matriz-t1-macro-plan.md) |
| M1-A1-02 | [`micro/M1-A1-02-criterios-por-linha-npm.md`](micro/M1-A1-02-criterios-por-linha-npm.md) |
| M1-A1-03 | [`micro/M1-A1-03-backlog-ci-registry-policy.md`](micro/M1-A1-03-backlog-ci-registry-policy.md) |

## Paths principais

- `packages/eslint-plugin-hardcode-detect/package.json`
- `packages/eslint-plugin-hardcode-detect/e2e/`
- `docs/solution-distribution-channels.md`
- `docs/distribution-channels-macro-plan.md`
