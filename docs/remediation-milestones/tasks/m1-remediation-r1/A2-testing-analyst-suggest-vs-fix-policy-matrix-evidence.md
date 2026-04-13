# M1 — A2 — Analista de testes: matriz técnica suggest vs fix e critérios de evidência (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-06` |
| `role` | analista-testes |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 1800 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md`](micro/M1-A2-06-papel-analista-testes-suggest-vs-fix-policy.md).

## Inputs

- Parecer do revisor de desenvolvimento (M1-A2-05): [`A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](A2-development-reviewer-suggest-vs-fix-policy-signoff.md) — tabela P-SVF-* ↔ cenários S-R1-* e confirmação na suite.
- Comando, CI e semântica `output` / `suggestions` / só `errors`: [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md).
- Matriz de política de risco (P-SVF-*) no doc da regra: [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md).
- Âncora técnica S-R1-* (estrutura de asserções por cenário): [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md) (M1-A1-06) — **não** se duplica aqui o detalhe linha a linha; este documento cruza **P-SVF** com **tipo de prova** para a política A2.
- Suite RuleTester R1: [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs).
- Contexto segredos (qualitativo): [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md).

## Objectivo deste entregável

Documentar **como** a política `suggest` vs `fix` fica **provável por máquina** na suite R1: para cada linha P-SVF-*, qual **asserção dominante** esperar no RuleTester (`output`, `suggestions` sem `output`, ou só `errors`), e qual o **papel dos e2e** na mesma invocação de `npm test` (fumaça, não matriz P-SVF linha a linha).

Este documento **não** substitui o parecer M1-A2-05 nem a matriz de negócio em [`A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](A2-business-analyst-suggest-vs-fix-policy-acceptance.md).

## Matriz técnica: P-SVF-* → cenários S-R1-* → asserção dominante

Tipos de asserção (alinhados a [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md)):

- **`output`** — autofix R1 comparável ao `eslint --fix` naquele reporte.
- **`suggestions` sem `output`** no mesmo reporte — apenas *suggest*.
- **Só `errors`** — detecção sem `output` nem `suggestions` onde a política não oferece remediação segura (ex.: segredo provável).

| ID política | Cenários (suite) | Asserção dominante | Notas |
|-------------|------------------|--------------------|-------|
| P-SVF-01 | S-R1-01, S-R1-02, S-R1-03 | `output` | Happy path e variantes documentadas no signoff M1-A2-05. |
| P-SVF-02 | S-R1-05 | `errors` + `suggestions` | Exclude glob; sem autofix R1; suggest quando há alvo seguro. |
| P-SVF-03 | S-R1-06 | `output` (incluído) / `suggestions` (fora do include) | Dois blocos `invalid` em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs). |
| P-SVF-04 | Caso segredo (`SECRET_LIKE_LITERAL`) | Só `errors` | Sem `output` nem `suggestions`; ver signoff § Verificação — matriz P-SVF. |
| P-SVF-05 | S-R1-07 | `valid` / `output` / `errors` conforme `envDefaultLiteralPolicy` | Inclui `hardcodedEnvDefault` em `report-separate`. |
| P-SVF-06 | S-R1-05 (exemplo i18n) | Idem P-SVF-02 | Mesmo pacote de asserção que exclusão + ficheiro `strings.i18n.ts`. |
| P-SVF-07 | S-R1-08 | `errors` + `suggestions` | Caminho arriscado (`foo.test.ts`); sem autofix. |
| P-SVF-08 | S-R1-08 (+ extensível) | `errors` + `suggestions` | Evidência principal na suite; extensões futuras exigem manter doc ↔ testes sincronizados (ver riscos no signoff M1-A2-05). |

**Prioridade em sobreposição:** conforme doc da regra e signoff M1-A2-05 — exclusões e segredo prevalecem sobre o happy path de fix quando ambos se aplicam.

## Requisito de ambiente para caminhos (`filename`)

Igual a M1-A1-06: `filePath(...)` na suite assume **cwd** no directório do pacote [`packages/eslint-plugin-hardcode-detect`](../../../../packages/eslint-plugin-hardcode-detect); usar `npm test -w eslint-plugin-hardcode-detect` a partir da raiz do monorepo. Ver [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md).

## e2e na cadeia A2

O critério global A2 mantém o **mesmo gate técnico** que A1: build + RuleTester (incluindo R1) + e2e na invocação única do `test` do pacote.

Ordem em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json) (`scripts.test`):

1. `tests/index.test.mjs`
2. `tests/no-hardcoded-strings-r1.test.mjs`
3. `e2e/hello-world.e2e.mjs`
4. `e2e/nest-workspace.e2e.mjs`

Os e2e são **fumaça / regressão** sobre a API `ESLint` e massas do repositório ([`e2e/nest-workspace.e2e.mjs`](../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs) fixa contagens de mensagens por regra na massa Nest). **Não** substituem a prova cenário a cenário da matriz P-SVF / S-R1-* — essa prova está no RuleTester acima.

Normas da massa e contagens: [`specs/e2e-fixture-nest.md`](../../../../specs/e2e-fixture-nest.md).

## Critérios de evidência (M1-A2-08 — testador)

| Critério | Valor esperado |
|----------|----------------|
| Comando canónico | `npm test -w eslint-plugin-hardcode-detect` (raiz do monorepo) |
| Sucesso | Código de saída **0** em toda a cadeia (build, RuleTester incluindo R1, ambos os e2e). |
| Registo mínimo | Comando executado e código de saída; em falha, últimas linhas relevantes do output para diagnóstico. |
| Ambiente | Coerente com CI (Node 22 no GitHub Actions; localmente `engines.node >= 22` no pacote). |

## Modelo de relato de falha (testador, N=1)

Quando **M1-A2-08** comunicar uma falha do `npm test` ou de uma fase da cadeia, o relato deve seguir [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) (Níveis 1–2). **N** = 1 unidade de falha; exemplo mínimo:

### Diagnóstico técnico (sênior)

[HCD-ERR-SENIOR] `npm test -w eslint-plugin-hardcode-detect` terminou com código de saída não zero; incluir trecho do output (ex.: stack ou TAP) e correlacionar com `packages/eslint-plugin-hardcode-detect/tests/` ou `packages/eslint-plugin-hardcode-detect/e2e/` conforme o log.

### Correção definitiva

[HCD-ERR-FIX] Corrigir a causa no código, testes, contrato ou CI que o log indicar (diff mínimo; regressão coberta pela mesma suite quando aplicável).

### Contorno operacional

[HCD-ERR-OPS] Até haver correção, reproduzir localmente com a mesma versão de Node que o CI (`engines.node` / `actions/setup-node`); documentar o comando exacto e o código de saída. Risco: contorno não substitui fix de causa raiz nem merge sem revisão (M1-A2-07).

## Limites de papel

Este entregável **não** constitui aprovação de merge por si só. A revisão do plano e dos critérios cabe a **M1-A2-07** (revisor de testes); a execução formal e registo de evidências a **M1-A2-08** (testador).

## Handoff

- **Seguinte na cadeia A2:** [`micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md`](micro/M1-A2-07-papel-revisor-testes-suggest-vs-fix-policy.md).
- **Desvios materiais contrato ↔ implementação:** [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md).

## Critério de conclusão (M1-A2-06)

Entregável **concluído** quando este documento estiver referenciado no micro-ficheiro M1-A2-06, na rastreabilidade do doc da regra `no-hardcoded-strings`, e com matriz e critérios de evidência estáveis para M1-A2-07.

## Paths principais

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`
- Suite RuleTester R1: `packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`
