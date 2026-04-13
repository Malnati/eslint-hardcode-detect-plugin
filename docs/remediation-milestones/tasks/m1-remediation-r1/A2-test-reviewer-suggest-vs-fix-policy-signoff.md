# M1 — A2 — Revisor de testes: validação — matriz P-SVF / suggest vs fix e critérios de evidência (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-07` |
| `role` | revisor-testes |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 1200 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md`](micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md).

## Documento revisto

- [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) (M1-A2-06).

## Âmbito da revisão

| Fonte | Secções / conteúdo considerados |
|-------|----------------------------------|
| [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) | Matriz P-SVF-01 … P-SVF-08 → cenários S-R1-* e tipo de asserção dominante; caso segredo sintético; e2e na cadeia `npm test`; requisito de `cwd` do pacote para `filePath`; critérios de evidência para M1-A2-08; modelo HCD-ERR para relato de falha. |
| [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) | Âncoras `// S-R1-0x`, caso segredo, e coerência com `output` / `errors` / `suggestions`. |
| [`A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](A2-development-reviewer-suggest-vs-fix-policy-signoff.md) (M1-A2-05) | Coerência prévia doc ↔ suite; esta revisão foca o **plano de prova** e critérios de evidência do analista A2, sem reabrir a revisão de desenvolvimento. |
| [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md) | Comando canónico, `cwd` no pacote, ordem `scripts.test`, semântica `output` / `suggestions` / só `errors`. |
| [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) | Exemplo mínimo N=1 para falhas comunicadas pelo testador (referenciado no doc do analista). |

---

## Matriz de rastreabilidade — P-SVF-* ↔ `no-hardcoded-strings-r1.test.mjs`

Confronto entre a matriz técnica do analista A2 (tipo de asserção dominante por política) e a implementação. O tipo de asserção coincide com o descrito em [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) e com as âncoras da suite.

| ID política | Resultado | Verificação |
|-------------|-----------|-------------|
| P-SVF-01 | Alinhado | S-R1-01, S-R1-02, S-R1-03 com `output` onde a matriz exige autofix R1. |
| P-SVF-02 | Alinhado | S-R1-05; `errors` + `suggestions`; sem `output` (exclude + `*.i18n.ts`). |
| P-SVF-03 | Alinhado com condição | S-R1-06; `filePath("src", …)` vs `filePath("lib", …)`; misto `output` / `suggestions`; depende de `cwd` no pacote (documentado). |
| P-SVF-04 | Alinhado | Caso segredo; só `errors`; sem `output` nem `suggestions`. |
| P-SVF-05 | Alinhado | S-R1-07; `valid` / `output` / `errors` e `hardcodedEnvDefault` em `report-separate` conforme matriz. |
| P-SVF-06 | Alinhado | Mesmo pacote de asserção que P-SVF-02 em S-R1-05 (exemplo i18n). |
| P-SVF-07 | Alinhado | S-R1-08; `errors` + `suggestions`; sem autofix. |
| P-SVF-08 | Alinhado | S-R1-08; *suggest-only* / heurística extensível; evidência principal na suite como no doc do analista. |

**Prioridade em sobreposição:** conforme doc da regra e matriz do analista — exclusões e segredo prevalecem sobre o happy path de fix quando ambos se aplicam; a suite modela cenários coerentes com isso.

---

## Caso extra (regressão segurança)

| Secção no teste | Resultado | Verificação |
|-----------------|-----------|-------------|
| Comentário `// Segredo provável` + `SECRET_LIKE_LITERAL` | Alinhado | `errors` apenas; sem `output` nem `suggestions`; literal sintético; coerente com P-SVF-04 e com [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) (contexto qualitativo de segredos). |

---

## Revisão dos critérios de evidência (M1-A2-08)

| Tópico | Avaliação |
|--------|-----------|
| Comando canónico | **Suficiente** — `npm test -w eslint-plugin-hardcode-detect` na raiz do monorepo está explícito no doc do analista A2 e alinhado ao arquiteto A2. |
| Sucesso (exit 0) | **Suficiente** — exige código de saída 0 em toda a cadeia (build, RuleTester incluindo R1, e2e). |
| Registo mínimo | **Suficiente** — comando, código de saída e trecho de diagnóstico em falha. |
| Ambiente (Node) | **Suficiente** — coerência com CI / `engines.node >= 22`. |
| Modelo HCD-ERR | **Suficiente e claro** — remissão a [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) com exemplo mínimo; o testador não substitui a revisão de testes (M1-A2-07) ao comunicar falhas. |

**Lacunas identificadas:** nenhuma para desbloquear M1-A2-08; ajustes futuros à matriz P-SVF ou à suite devem manter comentários `// S-R1-*` e a matriz do analista A2 sincronizados.

## Exemplo canónico N=1 (HCD-ERR, alinhado ao analista A2)

O relato de falha referenciado na matriz do analista cumpre [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) com **N** = 1 unidade de falha (Níveis 1–2: uma linha por prefixo). Texto de referência (idêntico ao bloco em [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md)):

### Diagnóstico técnico (sênior)

[HCD-ERR-SENIOR] `npm test -w eslint-plugin-hardcode-detect` terminou com código de saída não zero; incluir trecho do output (ex.: stack ou TAP) e correlacionar com `packages/eslint-plugin-hardcode-detect/tests/` ou `packages/eslint-plugin-hardcode-detect/e2e/` conforme o log.

### Correção definitiva

[HCD-ERR-FIX] Corrigir a causa no código, testes, contrato ou CI que o log indicar (diff mínimo; regressão coberta pela mesma suite quando aplicável).

### Contorno operacional

[HCD-ERR-OPS] Até haver correção, reproduzir localmente com a mesma versão de Node que o CI (`engines.node` / `actions/setup-node`); documentar o comando exacto e o código de saída. Risco: contorno não substitui fix de causa raiz nem merge sem revisão (M1-A2-07).

---

## e2e e cadeia `npm test`

O doc do analista A2 declara que `tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, `e2e/hello-world.e2e.mjs` e `e2e/nest-workspace.e2e.mjs` entram na mesma invocação conforme [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json). Os e2e são **fumaça / regressão** e **não** reproduzem linha a linha a matriz P-SVF / S-R1-* — **aceite** para o gate A2.

---

## Riscos e condições

1. **Deriva doc ↔ suite:** alterações em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) sem actualizar [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) (ou o inverso) enfraquece a rastreabilidade; recomenda-se rever ambos no mesmo ciclo.
2. **`cwd` e `filePath`:** casos P-SVF-03 / S-R1-06 exigem execução com diretório de trabalho no pacote — já documentado no analista A2 e no arquiteto A2.
3. **Gate formal de testes:** a execução registada e o critério global `npm test` cabem ao **testador** (M1-A2-08), não ao revisor de testes.
4. **P-SVF-08:** leque descritivo amplo; a suite fixa evidência principal em S-R1-08; extensões futuras exigem manter doc ↔ testes sincronizados (ou A3 se o contrato divergir).

---

## Parecer

**Aprovado.** O plano de testes e os critérios de log e artefactos em [`A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md) estão **alinhados** à suite em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs), ao parecer de desenvolvimento em [`A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](A2-development-reviewer-suggest-vs-fix-policy-signoff.md) e ao ambiente descrito em [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md), com as **condições** indicadas acima.

---

## Handoff

- **Seguinte na cadeia A2:** execução formal e evidências — [`micro/M1-A2-08-papel-testador-suggest-vs-fix-policy.md`](micro/M1-A2-08-papel-testador-suggest-vs-fix-policy.md).

## Critério de conclusão (M1-A2-07)

Parecer emitido e entregável desta micro-tarefa concluído. O critério global A2 (comportamento `suggest` vs `fix` reproduzível) com a cadeia `npm test` a passar aplica-se **após** a execução pelo testador na cadeia A2 (**M1-A2-08**); **não** é gate deste papel nem substitui a execução formal da suíte pelo revisor de testes.

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md`
- Documento do analista de testes (A2): `docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`
