# M1 — A1 — Testador: execução e evidências — gate `npm test` RuleTester R1

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A1 |
| `micro_id` | `M1-A1-08` |
| `role` | testador |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A1.
- Micro-tarefa: [`micro/M1-A1-08-papel-testador-ruletester-r1-suite.md`](micro/M1-A1-08-papel-testador-ruletester-r1-suite.md).
- Critérios de evidência (referência): [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md).

## Execução registada

| Critério | Valor |
|----------|--------|
| Data (UTC) | 2026-04-13 |
| `cwd` | Raiz do clone do monorepo |
| Node.js | `v22.14.0` (`engines.node >=22`; alinhado ao CI Node 22) |
| Comando canónico | `timeout 600 npm test -w eslint-plugin-hardcode-detect` |
| Código de saída | **0** |

## Cadeia verificada (script `test` do pacote)

Conforme [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json): `npm run build` seguido de `node --test` sobre `tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, `e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs`. Saída `node --test` (trecho): `# tests 5`, `# pass 5`, `# fail 0`; subtestes incluem `no-hardcoded-strings — remediação R1 (S-R1-01 … S-R1-08)`.

## Critério de conclusão (M1-A1-08)

Gate A1 satisfeito: comando canónico com exit **0** em toda a cadeia (build, RuleTester em `tests/`, e2e). Handoff seguinte na cadeia A1: [`micro/M1-A1-09-papel-dev-especialista-correcoes-ruletester-r1-suite.md`](micro/M1-A1-09-papel-dev-especialista-correcoes-ruletester-r1-suite.md) apenas se surgir falha reproduzível a corrigir (papel distinto).

## Paths principais

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-runner-ruletester-r1-evidence.md`
- Parecer prévio do revisor de testes: [`A1-test-reviewer-ruletester-r1-signoff.md`](A1-test-reviewer-ruletester-r1-signoff.md)
