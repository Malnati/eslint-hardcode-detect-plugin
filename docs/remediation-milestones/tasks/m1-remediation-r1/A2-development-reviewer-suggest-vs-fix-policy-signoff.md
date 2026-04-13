# M1 — A2 — Revisor de desenvolvimento: validação — política `suggest` vs `fix` (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-05` |
| `role` | revisor-desenvolvimento |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 1500 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-05-papel-revisor-desenvolvimento-suggest-vs-fix-policy.md`](micro/M1-A2-05-papel-revisor-desenvolvimento-suggest-vs-fix-policy.md).

## Documentos revistos (entrega M1-A2-04)

| Artefacto | Caminho |
|-----------|---------|
| Doc da regra (matriz P-SVF-*, semântica RuleTester, env, segredos) | [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) |
| README do pacote (excerto R1 + remissão) | [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../packages/eslint-plugin-hardcode-detect/README.md) |
| Parecer de negócio (contexto, não re-revisão de negócio) | [`A2-business-reviewer-suggest-vs-fix-policy-signoff.md`](A2-business-reviewer-suggest-vs-fix-policy-signoff.md) |
| Âncora técnica de reprodutibilidade | [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) |

## Inputs normativos adicionais

- [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md) — semântica `output` / `suggestions` / só `errors`; comando `npm test -w eslint-plugin-hardcode-detect`.
- [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) — enquadramento qualitativo de segredos e auto-fix.

---

## Verificação — semântica ESLint / RuleTester

A secção **Remediação R1** em `no-hardcoded-strings.md` (tabela *Semântica no ESLint e no RuleTester*) está **alinhada** ao doc do arquiteto A2 e à implementação na suite:

| Evidência no doc | Suite R1 | Resultado |
|------------------|----------|-----------|
| `output` ⇒ autofix | S-R1-01, S-R1-02, S-R1-03, S-R1-06 (incluído), S-R1-07 (`include` / `report-separate` com output) | Coerente |
| `suggestions` sem `output` ⇒ só suggest | S-R1-05, S-R1-06 (fora de include), S-R1-08 | Coerente |
| Só `errors` sem remediação alinhada | S-R1-04 (`remediationMode: "off"`), segredo sintético | Coerente |
| `envDefaultLiteralPolicy: "ignore"` — válido sem reporte do fallback | Casos *valid* em S-R1-07 | Coerente |

---

## Verificação — matriz P-SVF-* ↔ cenários S-R1-* e teste

| ID política (doc) | Cenários citados no doc | Confirmação na suite `no-hardcoded-strings-r1.test.mjs` |
|-------------------|-------------------------|--------------------------------------------------------|
| P-SVF-01 | S-R1-01, S-R1-02, S-R1-03 | Presentes com `output` onde aplicável |
| P-SVF-02 | S-R1-05 | `remediationExcludeGlobs` + ficheiro `strings.i18n.ts`; suggest sem `output` |
| P-SVF-03 | S-R1-06 | Include `src/**/*.ts`: fix em `src/included.ts`; suggest sem fix em `lib/outside.ts` |
| P-SVF-04 | Caso segredo | Literal `SECRET_LIKE_LITERAL` (40 chars); só `errors`, sem `output` nem `suggestions` |
| P-SVF-05 | S-R1-07 | `ignore` / `include` / `report-separate` cobertos; `hardcodedEnvDefault` no caso report-separate |
| P-SVF-06 | S-R1-05 (exemplo i18n) | Mesmo caso P-SVF-02; caminho `.i18n.` coerente com exclusão |
| P-SVF-07 | S-R1-08 | `foo.test.ts` — suggest, sem autofix |
| P-SVF-08 | S-R1-08 + extensível | Alinhado ao caso de teste; doc declara heurística extensível |

**Prioridade em sobreposição:** o doc declara que exclusões / segredo prevalecem sobre o happy path; a suite modela cenários disjuntos coerentes com isso (sem contradição detectada nesta revisão).

---

## Links e caminhos relativos

- Remissões desde `docs/rules/no-hardcoded-strings.md` para `docs/remediation-milestones/tasks/m1-remediation-r1/*`, `specs/plugin-contract.md` e `tests/no-hardcoded-strings-r1.test.mjs` seguem o padrão de quatro níveis (`../../../../`) até à raiz do repositório — **consistente**.
- README do pacote remete a `docs/rules/no-hardcoded-strings.md` e à suite com caminhos relativos ao pacote — **consistente**.

---

## Segurança e escopo

- Literais na suite são sintéticos (`"ab"`, token de 40 caracteres alfanumérico); **não** há credenciais ou segredos reais em texto de teste ou doc.
- Redacção sobre segredos e `secretRemediationMode` remete ao contrato e à heurística; alinhamento qualitativo ao macro-plan **aceite** para documentação do pacote.
- Esta revisão **não** altera código de regra nem expande produto; limita-se a validar documentação e correspondência com a suite existente.

---

## Riscos residuais (documentação)

1. **P-SVF-08** descreve um leque amplo (“outros caminhos ou strings semânticas”); a suite fixa evidência principal em S-R1-08; extensões futuras exigem manter doc e testes sincronizados (ou A3 se o contrato divergir).
2. **Divergência futura contrato ↔ implementação** permanece sob **A3**, não coberta por este parecer.

---

## Parecer

**Aprovado.** A documentação em [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) e o excerto em [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../packages/eslint-plugin-hardcode-detect/README.md) estão **alinhados** à suite [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) e à semântica fixada em [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md), com as **condições** acima.

---

## Handoff

- **Seguinte na cadeia A2:** [`micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md`](micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md) — matriz de casos RuleTester/e2e e critérios de evidência.
- **Contrato:** desvios materiais — [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md).

## Critério de conclusão (M1-A2-05)

Parecer emitido; entregável desta micro-tarefa concluído. O critério global A2 (comportamento `suggest` vs `fix` reproduzível) continua sustentado pela combinação doc do pacote + suite R1 + comando canónico do arquiteto A2.

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-development-reviewer-suggest-vs-fix-policy-signoff.md`
- Doc da regra: `packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`
