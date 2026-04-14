# M5 (remediation) — decisão semver

| Campo | Valor |
|-------|--------|
| Marco | M5 — `remediation-m5-release` |
| Tarefa | A1 |
| Data | 2026-04-14 |

## Superfície pública (resumo)

- **Pacote:** `eslint-plugin-hardcode-detect` — ver [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) e [`packages/eslint-plugin-hardcode-detect/src/index.ts`](../../../../../packages/eslint-plugin-hardcode-detect/src/index.ts).
- **Regras exportadas:** `hello-world`, `no-hardcoded-strings`.
- **Configs:** `recommended` (injeta plugin, `settings.hardcodeDetect: {}`, `no-hardcoded-strings` em `warn`).
- **Exports adicionais:** utilitários e tipos R3 listados no contrato e no `index.ts` (writers / merge).
- **Contrato normativo:** [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) (inclui `standardize-error-messages` como regra contratual ainda não empacotada).

## Decisão

- **Bump:** `0.0.0` → **`0.1.0`** (patch field como **minor** na série 0.x, primeiro release numerado com remediação R1–R3 documentada no contrato).
- **Tipo semver:** **minor** na linha **0.y.z** — adequado a entrega coesa de funcionalidade já descrita no contrato sem saltar para `1.0.0` (produto ainda em evolução).

## Breaking changes

- **Relativamente a um release npm anterior:** não há — não existia versão publicada além de `0.0.0` de trabalho.
- **Consumidores que pinavam `0.0.0` local:** devem rever o contrato e o CHANGELOG; mudanças de schema e `messageId`s normativos estão em [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md).

## Paridade com `m5-release-candidate` (distribuição)

- Alinhado ao processo de «congelar versão + notas» descrito em [`docs/distribution-milestones/m5-release-candidate.md`](../../../distribution-milestones/m5-release-candidate.md); publicação/tag no registry é responsabilidade do maintainer.
