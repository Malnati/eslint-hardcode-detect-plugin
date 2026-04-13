# M1 — A2 — Revisor de negócio: validação — política `suggest` vs `fix` (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-03` |
| `role` | revisor-negocio |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 1200 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-03-papel-revisor-negocio-suggest-vs-fix-policy.md`](micro/M1-A2-03-papel-revisor-negocio-suggest-vs-fix-policy.md).

## Documento revisto

- [`A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](A2-business-analyst-suggest-vs-fix-policy-acceptance.md) (M1-A2-02).

## Âmbito da revisão

| Fonte | Secções / conteúdo considerados |
|-------|----------------------------------|
| [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) | *Remediação assistida — opções públicas planeadas (R1–R3)* — `remediationMode`, `constantNamingConvention`, `dedupeWithinFile`, `remediationIncludeGlobs`, `remediationExcludeGlobs`, `secretRemediationMode`, `envDefaultLiteralPolicy`; subsecção *R1 — constantes no mesmo ficheiro*; parágrafos sobre literais de default; estado **planeado** do schema. |
| [`docs/architecture.md`](../../../architecture.md) | *Fluxo de decisão* (comportamento de regras: contrato antes de `packages/`); papel do pacote em `packages/eslint-plugin-hardcode-detect`. |
| [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md) | Semântica fix / suggest / erros no RuleTester; comando canónico `npm test -w eslint-plugin-hardcode-detect`; **não** reescrita de CI neste parecer. |

---

## Matriz de rastreabilidade — critérios C-SVF-*

Cada critério do analista (secção 2) foi confrontado com o vocabulário e a semântica do contrato. O schema de remediação permanece **planeado** no `plugin-contract.md`; os critérios C-SVF-* são **alvos** negociais já assumidos pelo analista.

| ID critério | Resultado | Referência em `plugin-contract.md` |
|-------------|-----------|-----------------------------------|
| C-SVF-R1-BASE | Alinhado | Subsecção *R1 — constantes no mesmo ficheiro* — `fix`/`suggest` no ficheiro actual; declarações no topo; substituição no mesmo `SourceCode` quando a política permitir fix. |
| C-SVF-MODE | Alinhado | Tabela: `remediationMode` — `"off"` vs trilhas incl. `"r1"` (Transversal, M1+). |
| C-SVF-EXCL | Alinhado com condição | Tabela: `remediationExcludeGlobs`, `remediationIncludeGlobs`; ver *Riscos e condições* sobre reporte vs fix R1 e oferta de `suggestions`. |
| C-SVF-SECRET | Alinhado | Tabela: `secretRemediationMode` — enum com modo seguro por defeito e opt-in para autofix agressivo; alinhado ao macro-plan citado pelo analista. |
| C-SVF-ENV | Alinhado com condição | Tabela: `envDefaultLiteralPolicy` — Transversal, M1–M3; pormenor fino suggest vs fix por valor de política fica para implementação e doc no pacote (M1-A2-04), com A3 se divergir do planeado. |
| C-SVF-I18N-TEST | Alinhado com condição | Subsecção R1 + exclusões; o contrato não fixa todos os pormenores de *suggest-only* por contexto — a matriz P-SVF-* do analista desdobra o risco; implementação única e testável. |

---

## Matriz de rastreabilidade — políticas P-SVF-*

| ID política | Resultado | Fundamento no contrato / notas |
|-------------|-----------|--------------------------------|
| P-SVF-01 | Alinhado | Fix R1 coerente com subsecção R1 + opções de naming/dedupe; cenários S-R1-01 … S-R1-03. |
| P-SVF-02 | Alinhado com condição | `remediationExcludeGlobs` — sem fix R1 no caminho excluído; reporte pode manter-se (já aceite em A1); política única para `suggestions` conforme produto — S-R1-05. |
| P-SVF-03 | Alinhado com condição | `remediationIncludeGlobs` — fix só se incluído; mesmo racional que S-R1-06. |
| P-SVF-04 | Alinhado | `secretRemediationMode` + segredos no contrato/macro-plan; outcome *suggest-only* / placeholder / opt-in agressivo explícito no enum. |
| P-SVF-05 | Alinhado com condição | `envDefaultLiteralPolicy` + S-R1-07; o analista deixa o par reporte/`output`/`suggestions` dependente da política — documentar no pacote de forma reproduzível. |
| P-SVF-06 | Alinhado com condição | i18n/UI — *suggest-only* por defeito ou glob; coerente com exclusões na tabela de opções e com [`m1-remediation-r1.md`](../../m1-remediation-r1.md) (fix arriscado). |
| P-SVF-07 | Alinhado com condição | Testes/fixtures — idem; S-R1-08. |
| P-SVF-08 | Alinhado com condição | Frameworks / strings semânticas — *suggest-only* quando o fix não for neutro; pormenor na regra/README (M1-A2-04). |

**Prioridade (P-SVF-02 / P-SVF-04 vs P-SVF-01):** conforme tabela do analista — confirmada como racional de negócio e compatível com exclusões e modo segredo no contrato.

---

## Reprodutibilidade (RuleTester)

A secção 4 do analista está **alinhada** à semântica fixada em [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md):

- **`output`** — fix aplicável (compatível com `eslint --fix`).
- **`suggestions`** sem `output` no mesmo reporte — apenas suggest.
- Só **`errors`** onde o produto não oferecer remediação automática nem sugestão alinhada.

A âncora de testes [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) (S-R1-01 … S-R1-08) é o local normativo para **materializar** P-SVF-* no âmbito M1; alterações a essa suite **não** são responsabilidade deste parecer (papel desenvolvedor / testador na cadeia A2).

---

## Alinhamento com `docs/architecture.md`

- A política `suggest` vs `fix` permanece especificada em `docs/` e referencia `specs/`; o fluxo **contrato → código** não é invertido: o desenvolvedor (M1-A2-04) reflecte a tabela aprovada em documentação do pacote e testes, sem alterar o contrato sem **A3**.
- RuleTester e e2e no pacote sob `packages/` são coerentes com a arquitectura (pacote versionado; `reference/` não é dependência).

---

## Riscos e condições

1. **Reporte vs fix vs suggest em caminhos excluídos ou não incluídos:** a combinação exacta (erro + ausência de `output` + opcional `suggestions`) deve ser **única e testável** na implementação; divergência material implica **A3** ou ajuste de casos, como no doc do analista.
2. **Schema planeado:** desvios na implementação relativamente à tabela de opções ou à subsecção R1 exigem sincronização via **A3** ou ajuste dos casos e documentação no pacote.
3. **P-SVF-05 / P-SVF-06–08:** o contrato não fixa cada combinação de `envDefaultLiteralPolicy` e contexto i18n/teste/framework; o analista fixou outcomes negociais — o desenvolvedor deve documentar critérios reproduzíveis no README/doc da regra.

---

## Parecer

**Aprovado.** A especificação em [`A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](A2-business-analyst-suggest-vs-fix-policy-acceptance.md) está **alinhada** a [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) e a [`docs/architecture.md`](../../../architecture.md) no âmbito A2 descrito acima, com as **condições** indicadas para exclusões/include, segredos, env defaults e contextos arriscados (S-R1-07 / S-R1-08).

---

## Handoff

- **Seguinte na cadeia A2:** documentação no pacote e coerência com testes — [`micro/M1-A2-04-papel-desenvolvedor-suggest-vs-fix-policy.md`](micro/M1-A2-04-papel-desenvolvedor-suggest-vs-fix-policy.md) (`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md`, alinhamento com `tests/`).
- **Contrato:** se a implementação divergir do planeado — [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md).

## Critério de conclusão (M1-A2-03)

Parecer emitido e entregável desta micro-tarefa concluído. O critério **global** da tarefa A2 (comportamento `suggest` vs `fix` reproduzível em testes e/ou documentação normativa no pacote) completa-se após **M1-A2-04** e evidência de teste na cadeia A2.

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-reviewer-suggest-vs-fix-policy-signoff.md`
- Documento do analista: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md`
