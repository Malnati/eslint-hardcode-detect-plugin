# A3 (opcional pós-M4): Fixture e2e — `e2e-fixture-git-hooks-sample`

| Campo | Valor |
|-------|--------|
| milestone | M3 |
| github_milestone | channel-t4-t6 |
| task_id | A3 |
| labels_sugeridas | `area/channel-T6`, `type/docs` |
| token_budget_estimate | 35 000 |
| timelining_order | 3 |
| depends_on | M4 (T5) concluído — não encadeia A2→A3 na mesma onda |

## Plano do marco

Camada A em [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) (secções 4, 7 e 10). PRs que **fechem** T6 devem abrir **após** entregáveis de T5 (M4), conforme política Opção A do plano.

## Inputs

- Marco **M4** (`channel-t5-agents`) e handoff de agentes documentado.
- Esboço de política **A2** e guia **A1** como contexto (recomendado antes de implementar a massa).

## Outputs

- Pacote workspace futuro `packages/e2e-fixture-git-hooks-sample` (quando implementado) com **README** que declare limites, reprodutibilidade e relação com o mesmo caminho de lint que CI.

## Critério de conclusão

- README com limites claros; fixture alinhada à política de hooks sem quebrar a cadeia T5→T6.

## Dependências

- **Bloqueia:** —
- **Depende de:** **M4 (T5)** concluído; decisão de workspace na raiz se o pacote for adicionado.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M3-A3-01 | [`micro/M3-A3-01-criterios-readme-fixture-git-hooks.md`](micro/M3-A3-01-criterios-readme-fixture-git-hooks.md) |
| M3-A3-02 | [`micro/M3-A3-02-gate-nao-fechar-t6-sem-m4.md`](micro/M3-A3-02-gate-nao-fechar-t6-sem-m4.md) |
| M3-A3-03 | [`micro/M3-A3-03-matriz-sec6-e2e-compose-m3.md`](micro/M3-A3-03-matriz-sec6-e2e-compose-m3.md) |

## Paths principais

- `packages/e2e-fixture-git-hooks-sample/` (futuro; ver [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) e macro-plan)
- `docs/distribution-milestones/tasks/m3-channel-t4-t6/coverage-manifest.json`
