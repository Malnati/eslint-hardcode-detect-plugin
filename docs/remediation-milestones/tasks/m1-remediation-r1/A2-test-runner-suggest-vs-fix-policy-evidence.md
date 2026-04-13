# M1 — A2 — Testador: execução e evidências — gate `npm test` política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-08` |
| `role` | testador |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-08-papel-testador-suggest-vs-fix-policy.md`](micro/M1-A2-08-papel-testador-suggest-vs-fix-policy.md).
- Matriz técnica e critérios de evidência (referência): [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md).
- Parecer do revisor de testes (M1-A2-07): [`A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](A2-test-reviewer-suggest-vs-fix-policy-signoff.md).

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

A prova **P-SVF / S-R1-*** (autofix vs *suggest* vs só erro) permanece reproduzível na suite [`tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs), alinhada à matriz em [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) e ao parecer em [`A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](A2-test-reviewer-suggest-vs-fix-policy-signoff.md).

## Critério de conclusão (M1-A2-08)

Gate A2 satisfeito para execução formal: comando canónico com exit **0** em toda a cadeia (build, RuleTester incluindo R1, e2e). O critério global A2 (comportamento `suggest` vs `fix` reproduzível nos testes e documentação normativa) cumpre-se com esta execução em conjunto com [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md). Handoff seguinte na cadeia A2: [`micro/M1-A2-09-papel-dev-especialista-correcoes-suggest-vs-fix-policy.md`](micro/M1-A2-09-papel-dev-especialista-correcoes-suggest-vs-fix-policy.md) apenas se surgir falha reproduzível a corrigir (papel distinto).

## Paths principais

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md`
- Parecer do revisor de testes: [`A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](A2-test-reviewer-suggest-vs-fix-policy-signoff.md)
