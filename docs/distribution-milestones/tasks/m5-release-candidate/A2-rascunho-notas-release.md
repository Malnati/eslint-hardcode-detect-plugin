# A2: Rascunho de notas de release

| Campo | Valor |
|-------|--------|
| milestone | M5 |
| github_milestone | release-candidate |
| task_id | A2 |
| labels_sugeridas | `area/channel-T1`, `type/chore`, `type/docs` |
| token_budget_estimate | 20 000 |
| timelining_order | 2 |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m5-release-candidate.md`](../../m5-release-candidate.md) (secções 1, 4, 7, 8 e 9).

## Inputs

- Resultado de **A1** (versão alvo e tipo de bump).
- Issues e PRs incluídos no release (links GitHub).
- CHANGELOG do pacote, se existir em [`packages/eslint-plugin-hardcode-detect/`](../../../../packages/eslint-plugin-hardcode-detect/).
- Roadmap / macro-plan, se relevante para contexto: [`docs/distribution-channels-macro-plan.md`](../../../../docs/distribution-channels-macro-plan.md).

## Outputs

- Texto de **notas de release** (adequado a GitHub Release ou secção de changelog) com **links** para issues/PRs.
- Rascunho em [`evidence/M5-release-notes-draft.md`](evidence/M5-release-notes-draft.md) ou corpo de PR dedicado, de forma rastreável.

## Critério de conclusão

- Texto revisável por um humano; referências explícitas a mudanças de comportamento público quando aplicável (`specs/plugin-contract.md`).

## Dependências

- **Bloqueia:** A3 (o plano de smoke deve mencionar a versão e os artefactos esperados).
- **Depende de:** A1.

## Paths principais

- [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json)
- [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)
