# A5: Massa Nest e e2e `nest-workspace.e2e.mjs` documentadas

| Campo | Valor |
|-------|--------|
| milestone | M0 |
| github_milestone | macro-baseline |
| task_id | A5 |
| labels_sugeridas | `type/docs`, `area/channel-T1` |
| token_budget_estimate | — (partilhar orçamento com A3/A4 se no mesmo PR) |
| timelining_order | 3 |
| depends_on | A4 |

## Plano do marco

Secção 4 (timelining, ordem 3) e Camada A em [`../../m0-baseline.md`](../../m0-baseline.md). Esta tarefa desdobra a subtarefa «Confirmar massa Nest + e2e … documentados» que não estava numa linha A1–A4 isolada.

## Inputs

- [`specs/e2e-fixture-nest.md`](../../../../specs/e2e-fixture-nest.md)
- [`packages/e2e-fixture-nest/`](../../../../packages/e2e-fixture-nest/) (massa de testes)
- [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs)

## Outputs

- Referências coerentes em specs e `docs/` (comando `npm test`, workspace, papel do fixture Nest na cadeia e2e).

## Critério de conclusão

- Referências em specs e docs alinhadas; leitor consegue localizar massa Nest, script e2e e relação com o pacote do plugin.

## Dependências

- **Bloqueia:** handoff «baseline e2e» para T1.
- **Depende de:** A4 (ordem 3 do timelining depende de 2).

## Paths principais

- `specs/e2e-fixture-nest.md`
- `packages/e2e-fixture-nest/`
- `packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`
