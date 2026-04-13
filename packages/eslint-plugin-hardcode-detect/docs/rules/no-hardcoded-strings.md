# `no-hardcoded-strings`

Regra de produto (`problem`): desencoraja literais de string hardcoded no código, exceto strings triviais muito curtas.

- Em nós `Literal` cujo valor é `string`, se `value.length >= 2`, a regra reporta com a mensagem configurada (equivalente a: evitar string literal; mover para constantes ou catálogo). Strings com comprimento menor que 2 são ignoradas.
- **Mensagens**: pelo menos `hardcoded`, com texto orientando uso de constantes ou catálogo; com `envDefaultLiteralPolicy: "report-separate"` e literais de *fallback* de `process.env`, pode usar-se `hardcodedEnvDefault` (ver abaixo).
- Faz parte do preset `recommended` do plugin (`hardcode-detect/recommended`).

O vocabulário completo de opções planeadas no repositório (incluindo trilhas R2/R3 e `secretRemediationMode`) está em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md). **Neste pacote**, a remediação automática descrita abaixo aplica-se à trilha **R1** com `remediationMode: "r1"` e ao subconjunto de opções já suportado na regra (ver schema em `src/rules/no-hardcoded-strings.ts`).

---

## Remediação R1 (`remediationMode: "r1"`)

Com R1 activo, a regra pode **injectar constantes no topo do mesmo ficheiro** e substituir ocorrências no mesmo `SourceCode`, sujeita a globs, risco de caminho e heurísticas de segredo (ver matriz).

### Semântica no ESLint e no RuleTester

| Evidência no teste | Significado para o utilizador |
|--------------------|-------------------------------|
| `output` esperado | Autofix compatível com `eslint --fix` naquele reporte. |
| `suggestions` **sem** `output` no mesmo reporte | Apenas *suggest*; o utilizador aplica manualmente se quiser. |
| Só `errors` (sem `output` nem `suggestions` quando a política não oferece remediação) | Detecção sem autofix nem sugestão alinhada à remediação R1 (ex.: literal classificado como segredo provável sem outros alvos seguros no fix). |

Com `remediationMode: "off"`, mantém-se a detecção; não há autofix R1 (ver **S-R1-04** na suite).

### Matriz de política de risco (P-SVF-*) → outcome

Cada linha liga o critério de negócio [A2](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md) ao comportamento **reproduzido** na implementação e nos testes. Prioridade em sobreposição: exclusão por glob e candidatos a segredo prevalecem sobre o *happy path* de fix quando ambos se aplicam.

| ID | Contexto | Outcome (implementação actual) | Cenários na suite |
|----|----------|----------------------------------|-------------------|
| P-SVF-01 | Literal de aplicação sem segredo provável, caminho não excluído, não “arriscado”, inclusão satisfeita | Autofix R1 (`output`) | S-R1-01, S-R1-02, S-R1-03 |
| P-SVF-02 | `remediationExcludeGlobs` casa com o caminho do ficheiro | Sem autofix R1; reporte mantém-se; **suggest** oferecido quando existe pelo menos um alvo seguro para o fix sugerido | S-R1-05 |
| P-SVF-03 | `remediationIncludeGlobs` não vazio | Autofix só se o caminho estiver incluído; caso contrário sem autofix, com **suggest** como em P-SVF-02 | S-R1-06 |
| P-SVF-04 | Candidato a segredo (heurística: comprimento e charset alfanumérico; ver código) | Sem autofix nem **suggestions** quando não há alvos seguros para construir o fix sugerido | Caso “segredo provável” em [`no-hardcoded-strings-r1.test.mjs`](../../tests/no-hardcoded-strings-r1.test.mjs) |
| P-SVF-05 | Literal de *fallback* de `process.env` (`??` / `||`) | Depende de `envDefaultLiteralPolicy` (tabela abaixo) | S-R1-07 |
| P-SVF-06 | Ficheiros “i18n” (ex.: `.i18n.` no caminho) | Sem autofix por caminho arriscado; **suggest** se aplicável | S-R1-05 (exemplo `strings.i18n.ts` + exclude); heurística de caminho alinha a i18n a *suggest-only* |
| P-SVF-07 | Testes / fixtures (ex.: `.test.`, `.spec.`, `__tests__`, `test/`) | Sem autofix; **suggest** se aplicável | S-R1-08 |
| P-SVF-08 | Outros caminhos ou strings semânticas onde o fix não é neutro | *Suggest-only* ou exclusão por glob conforme configuração; pormenores alinhados a **S-R1-08** e extensível à heurística de caminho | S-R1-08 |

**Caminhos “arriscados” (implementação):** sem autofix R1; pode haver *suggest*. Inclui, entre outros, `__tests__/`, `/test/`, `.test.`, `.spec.`, `.i18n.` no caminho relativo (ver `looksRiskyFilePath` em `src/rules/no-hardcoded-strings.ts`).

### `envDefaultLiteralPolicy`

Literais que são *fallback* de `process.env` com `??` ou `||` são tratados conforme a política:

| Valor | Comportamento reproduzível na suite |
|-------|-------------------------------------|
| `"ignore"` | Não reporta o literal de *fallback* (não entra na regra para esse nó). Casos válidos **S-R1-07**. |
| `"include"` | Reporta `hardcoded` e aplica autofix R1 quando o restante da política permitir. **S-R1-07**. |
| `"report-separate"` | Usa `messageId: "hardcodedEnvDefault"`; autofix alinhado a **S-R1-07** na suite. |

### Segredos e contrato

O contrato prevê `secretRemediationMode` para modos seguros e *opt-in* a autofix agressivo ([`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)). A implementação actual usa uma heurística interna (`looksLikeSecretCandidate`) para **não** oferecer autofix nem *suggest* quando o único literal (ou o conjunto de alvos) não permite construir o fix sem expor o valor — ver caso de literal longo estilo token na suite R1.

---

## Prova automatizada e comando

- **Suite R1 (cenários S-R1-01 … S-R1-08 e segredo):** [`tests/no-hardcoded-strings-r1.test.mjs`](../../tests/no-hardcoded-strings-r1.test.mjs).
- **Comando canónico (raiz do monorepo):** `npm test -w eslint-plugin-hardcode-detect` — ver também [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-architect-suggest-vs-fix-policy-ci-environment.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-architect-suggest-vs-fix-policy-ci-environment.md).

## Rastreabilidade de negócio

- Política e critérios C-SVF-* / P-SVF-* (analista de negócio): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md).
- Parecer do revisor de negócio: [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-reviewer-suggest-vs-fix-policy-signoff.md).
- Parecer do revisor de desenvolvimento (doc da regra ↔ suite R1): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-development-reviewer-suggest-vs-fix-policy-signoff.md).
- Matriz técnica e critérios de evidência (analista de testes, P-SVF → asserções RuleTester / e2e): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md).
- Parecer do revisor de testes (matriz P-SVF ↔ suite; critérios de evidência M1-A2-08): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md).
- Execução e evidências do testador (gate `npm test`; M1-A2-08): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md).

Se o comportamento implementado divergir do contrato planeado, a sincronização formal do spec é a tarefa **A3** ([`docs/remediation-milestones/tasks/m1-remediation-r1/A3-contract-sync-post-r1.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A3-contract-sync-post-r1.md)).
