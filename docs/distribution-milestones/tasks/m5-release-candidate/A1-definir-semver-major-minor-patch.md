# A1: Definir semver (major / minor / patch)

| Campo | Valor |
|-------|--------|
| milestone | M5 |
| github_milestone | release-candidate |
| task_id | A1 |
| labels_sugeridas | `area/channel-T1`, `type/chore` |
| token_budget_estimate | 15 000 |
| timelining_order | 1 |
| depends_on | — (antecede A2; consome handoff T1–T6 e M4 conforme plano M5) |

## Plano do marco

Camada A em [`../../m5-release-candidate.md`](../../m5-release-candidate.md) (secções 1, 2, 4, 7, 9 e 10).

## Inputs

- Contrato público das regras: [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
- Política de versionamento para agentes: [`docs/versioning-for-agents.md`](../../../../docs/versioning-for-agents.md).
- Versão atual e metadados do pacote: [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json).
- Histórico de commits / PRs desde o último release (breaking vs não-breaking).

## Outputs

- Decisão explícita **major | minor | patch** com **justificativa** (incluindo breaking changes, se houver).
- Registo no artefato [`evidence/M5-semver-decision.md`](evidence/M5-semver-decision.md) (ou equivalente rastreável no mesmo PR).

## Critério de conclusão

- Tipo de bump alinhado ao contrato e a **Conventional Commits**; um revisor consegue reproduzir a decisão a partir da justificativa e do diff de contrato/código.

## Dependências

- **Bloqueia:** A2 (notas devem refletir o número e o tipo de release).
- **Depende de:** conclusão lógica de pré-requisitos do plano (M4; T6 conforme política M3/M4).

## Paths principais

- [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json)
- [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)
- [`docs/versioning-for-agents.md`](../../../../docs/versioning-for-agents.md)
