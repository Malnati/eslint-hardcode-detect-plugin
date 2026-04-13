# A1: Guia IDE — extensão ESLint e flat config

| Campo | Valor |
|-------|--------|
| milestone | M3 |
| github_milestone | channel-t4-t6 |
| task_id | A1 |
| labels_sugeridas | `area/channel-T4`, `type/docs` |
| token_budget_estimate | 28 000 |
| timelining_order | 1 |
| depends_on | — (consome handoff T3 via M2) |

## Plano do marco

Camada A em [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) (secções 1, 2, 4, 7 e 10).

## Inputs

- Handoff **T3:** o que o CI garante sobre regras e config — ver [`../../m2-channel-t3-ci.md`](../../m2-channel-t3-ci.md) e [`../m2-channel-t3-ci/A3-contributing-ci-handoff.md`](../m2-channel-t3-ci/A3-contributing-ci-handoff.md).
- Massa **T1** / Nest onde aplicável: [`specs/e2e-fixture-nest.md`](../../../../specs/e2e-fixture-nest.md), [`packages/e2e-fixture-nest/`](../../../../packages/e2e-fixture-nest/).

## Outputs

- Documento(s) em `docs/` com **caminhos relativos à raiz do repositório**: guia reprodutível para extensão ESLint + carregamento de `eslint.config` (flat) em workspace/settings do IDE.
- Passos alinhados ao que já é validado em CI (sem comandos divergentes).

## Critério de conclusão

- Passos reprodutíveis; um leitor consegue obter diagnostics ESLint no IDE de forma consistente com o repositório.
- Cross-check massa Nest (`packages/e2e-fixture-nest`) × handoff T3 e matriz M3 §6: [`micro/M3-A1-03-cross-check-massa-nest-handoff-t3.md`](micro/M3-A1-03-cross-check-massa-nest-handoff-t3.md).

## Dependências

- **Bloqueia:** —
- **Depende de:** entrega T3 documentada (M2); marco M2 concluído no fluxo do projeto.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M3-A1-01 | [`micro/M3-A1-01-inventario-ide-extensao-requisitos-t1.md`](micro/M3-A1-01-inventario-ide-extensao-requisitos-t1.md) |
| M3-A1-02 | [`micro/M3-A1-02-passos-eslint-config-workspace-settings.md`](micro/M3-A1-02-passos-eslint-config-workspace-settings.md) |
| M3-A1-03 | [`micro/M3-A1-03-cross-check-massa-nest-handoff-t3.md`](micro/M3-A1-03-cross-check-massa-nest-handoff-t3.md) |

## Paths principais

- `docs/` (novo ou atualizado)
- `packages/eslint-plugin-hardcode-detect/eslint.config.mjs`
- `docs/distribution-milestones/m2-channel-t3-ci.md`
