# M1 — A1 — Revisor de testes: validação — matriz RuleTester R1 e critérios de evidência

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A1 |
| `micro_id` | `M1-A1-07` |
| `role` | revisor-testes |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |
| `token_budget_estimate` | 2800 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A1.
- Micro-tarefa: [`micro/M1-A1-07-papel-revisor-testes-ruletester-r1-suite.md`](micro/M1-A1-07-papel-revisor-testes-ruletester-r1-suite.md).

## Documento revisto

- [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md) (M1-A1-06).

## Âmbito da revisão

| Fonte | Secções / conteúdo considerados |
|-------|----------------------------------|
| [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md) | Matriz S-R1-01 … S-R1-08 → comentários e tipo de asserção dominante; caso extra de literal sintético tipo segredo; e2e na cadeia `npm test`; requisito de `cwd` do pacote para `filePath`; critérios de evidência para M1-A1-08; modelo HCD-ERR para relato de falha. |
| [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) | Âncoras `// S-R1-0x` e coerência com `output` / `errors` / `suggestions`. |
| [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md) | Cenários S-R1-* ao nível negocial (sanidade de cobertura). |
| [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md) | Comando canónico, `cwd` no pacote, ordem `scripts.test`. |
| [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) | Exemplo mínimo N=1 para falhas comunicadas pelo testador (referenciado no doc do analista). |

---

## Matriz de rastreabilidade — S-R1-* ↔ `no-hardcoded-strings-r1.test.mjs`

Confronto entre a matriz técnica do analista (tipo de asserção dominante) e a implementação. Todos os IDs têm comentário de rastreio no ficheiro de teste; o tipo de asserção coincide com o descrito em [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md).

| ID cenário | Resultado | Verificação |
|------------|-----------|---------------|
| S-R1-01 | Alinhado | `output` em duplicados e ordem após `import`; `dedupeWithinFile` por defeito. |
| S-R1-02 | Alinhado | `output` com `HELLO_WORLD` a partir de literal com hífens. |
| S-R1-03 | Alinhado | `output` com `dedupeWithinFile: false` e duas constantes por valor. |
| S-R1-04 | Alinhado | `errors` apenas; `remediationMode: "off"`; sem `output` R1. |
| S-R1-05 | Alinhado | `remediationExcludeGlobs` + `filename` `*.i18n.ts`; `errors` + `suggestions`; sem autofix. |
| S-R1-06 | Alinhado com condição | `filePath("src", …)` vs `filePath("lib", …)`; misto `output` / `suggestions` conforme matriz; depende de `cwd` no pacote (documentado). |
| S-R1-07 | Alinhado | `valid` para `ignore`; `invalid` com `output` ou `errors` e `hardcodedEnvDefault` onde aplicável. |
| S-R1-08 | Alinhado | `*.test.ts` com `errors` + `suggestions`; sem autofix. |

---

## Caso extra (regressão segurança)

| Secção no teste | Resultado | Verificação |
|-----------------|-----------|-------------|
| Comentário `// Segredo provável` + `SECRET_LIKE_LITERAL` | Alinhado | `errors` apenas; sem `output` nem `suggestions`; literal sintético sem dados sensíveis reais; coerente com a matriz do analista e com a revisão M1-A1-05. |

---

## Revisão dos critérios de evidência (M1-A1-08)

| Tópico | Avaliação |
|--------|-----------|
| Comando canónico | **Suficiente** — `npm test -w eslint-plugin-hardcode-detect` na raiz do monorepo está explícito no doc do analista e alinhado ao arquiteto. |
| Sucesso (exit 0) | **Suficiente** — exige código de saída 0 em toda a cadeia (build, RuleTester, e2e). |
| Registo mínimo | **Suficiente** — comando, exit code e trecho de diagnóstico em falha. |
| Ambiente (Node) | **Suficiente** — coerência com CI / `engines.node >= 22`. |
| Modelo HCD-ERR | **Suficiente e claro** — remissão a [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) com exemplo mínimo; o testador não substitui a revisão de testes (M1-A1-07) ao comunicar falhas. |

**Lacunas identificadas:** nenhuma para desbloquear M1-A1-08; ajustes futuros à matriz ou à suite devem manter comentários `// S-R1-*` sincronizados com o doc do analista.

---

## e2e e cadeia `npm test`

O doc do analista declara que `tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, `e2e/hello-world.e2e.mjs` e `e2e/nest-workspace.e2e.mjs` entram na mesma invocação conforme [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json). Os e2e são **fumaça / regressão** e não reproduzem linha a linha S-R1-* — **aceite** para o gate A1.

---

## Riscos e condições

1. **Deriva doc ↔ suite:** alterações em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) sem actualizar [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md) (ou o inverso) enfraquece a rastreabilidade; recomenda-se rever ambos no mesmo ciclo.
2. **`cwd` e `filePath`:** casos S-R1-06 exigem execução com diretório de trabalho no pacote — já documentado no analista e no arquiteto; violação manifesta-se como falhas de caminho, não como falso verde silencioso na maioria dos cenários.
3. **Gate formal de testes:** a execução registada e o critério global `npm test` cabem ao **testador** (M1-A1-08), não ao revisor de testes.

---

## Parecer

**Aprovado.** O plano de testes e os critérios de log e artefactos em [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md) estão **alinhados** à suite em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs), à aceitação negocial S-R1-* e ao ambiente descrito em [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md), com as **condições** indicadas acima.

---

## Handoff

- **Seguinte na cadeia A1:** execução formal e evidências — [`micro/M1-A1-08-papel-testador-ruletester-r1-suite.md`](micro/M1-A1-08-papel-testador-ruletester-r1-suite.md).

## Critério de conclusão (M1-A1-07)

Parecer emitido e entregável desta micro-tarefa concluído. O critério global `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar aplica-se **após** a validação pelo testador na cadeia A1 (**M1-A1-08**); **não** é gate deste papel nem substitui a execução formal da suíte pelo revisor de testes.

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-reviewer-ruletester-r1-signoff.md`
- Documento do analista de testes: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-analyst-ruletester-r1-matrix-evidence.md`
