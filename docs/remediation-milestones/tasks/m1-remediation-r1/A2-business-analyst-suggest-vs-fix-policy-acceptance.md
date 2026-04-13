# M1 — A2 — Analista de negócio: política `suggest` vs `fix` (R1)

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A2 |
| `micro_id` | `M1-A2-02` |
| `role` | analista-negocio |
| `labels_sugeridas` | `type/docs`, `area/remediation-R1` |
| `token_budget_estimate` | 1800 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A2.
- Micro-tarefa: [`micro/M1-A2-02-papel-analista-negocio-suggest-vs-fix-policy.md`](micro/M1-A2-02-papel-analista-negocio-suggest-vs-fix-policy.md).

## Inputs

- [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) — subsecção *R1 — constantes no mesmo ficheiro*, opções `secretRemediationMode`, `envDefaultLiteralPolicy`, `remediationIncludeGlobs`, `remediationExcludeGlobs`, e tabela de opções planeadas para R1.
- [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md) — secção *Dados sigilosos* e *Defaults de variáveis de ambiente e constantes espelho*.
- Reprodutibilidade técnica e semântica RuleTester: [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md); âncora de testes em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) (cenários S-R1-01 … S-R1-08).
- Matriz de cenários e fronteira A1↔A2: [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md) (em especial S-R1-07 e S-R1-08).
- Taxonomia de gravidade e segredos (contexto L1): [`docs/hardcoding-map.md`](../../../hardcoding-map.md).

## Outputs (este entregável)

Documento normativo de **critérios de aceitação negociais** para decidir, em R1, entre **auto-fix** (`eslint --fix` / `output` no RuleTester), **apenas sugestões** (`suggestions` sem `output` para o mesmo reporte) e **detecção sem remediação automática** no cenário, com **rastreabilidade** ao contrato e ligação aos IDs de cenário S-R1-*.

**Não** inclui edição de [`packages/eslint-plugin-hardcode-detect/docs/rules/`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/), [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../packages/eslint-plugin-hardcode-detect/README.md) nem de testes — responsabilidade dos papéis **Revisor de negócio** (M1-A2-03) e **Desenvolvedor** (M1-A2-04).

---

## 1. Objectivo e não-objectivos

### Objectivo

Fixar, para a trilha **R1** com `remediationMode: "r1"`, uma **política de risco** reproduzível que diga, por categoria de contexto, se a remediação deve materializar-se como **fix** no mesmo `SourceCode`, como **suggest-only**, ou como reporte **sem** oferta de fix/suggest alinhada à remediação R1 — em coerência com [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) e com a semântica de evidência em [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md).

### Não-objectivos

- Não substitui nem altera directamente [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) (sincronização formal: tarefa **A3** / [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md)).
- Não duplica o documento do **Arquiteto** sobre CI, comando canónico ou ordem interna do `npm test` — ver [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md).
- Não reescreve a matriz S-R1-01 … S-R1-08 linha a linha — remete-se a [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md); aqui desdobra-se a **política fina** que A1 reservou para A2 (nomeadamente S-R1-08 e fronteiras com S-R1-07).
- Não define desenho R2/R3; menções apenas onde o contrato ou o macro-plan exigem fronteira (ex.: segredos transversais).

---

## 2. Rastreabilidade contrato ↔ política de remediação (suggest vs fix)

| ID critério | Âmbito | Referência em `plugin-contract.md` | Nota |
|-------------|--------|-----------------------------------|------|
| C-SVF-R1-BASE | Âmbito R1 | Subsecção *R1 — constantes no mesmo ficheiro* | `fix`/`suggest` no ficheiro actual; declarações no topo e substituição no mesmo `SourceCode` quando a política permitir **fix**. |
| C-SVF-MODE | Trilha | `remediationMode` | `"off"` — sem fix R1; `"r1"` — aplica esta política onde o literal for elegível e não estiver excluído por glob. |
| C-SVF-EXCL | Exclusão de remediação | `remediationExcludeGlobs`, `remediationIncludeGlobs` | Sem **fix** R1 quando o `filename` estiver excluído (reporte pode manter-se — alinhado à matriz A1 secção 4); **suggest** pode ou não ser oferecido conforme produto; deve ser um comportamento único e testável. |
| C-SVF-SECRET | Candidatos a segredo | `secretRemediationMode` | Por defeito **seguro**: não copiar valores sensíveis em claro; alinhar a *suggest-only*, placeholder ou autofix agressivo só com opt-in, conforme enum do contrato e [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md). |
| C-SVF-ENV | Literais de default de env | `envDefaultLiteralPolicy` | Interacção com `process.env` + `??`/`||`; pares reporte/fix por valor da política — ver §3.1 e S-R1-07. |
| C-SVF-I18N-TEST | Contexto “arriscado” | R1 + exclusões / macro-plan | Cópia i18n, testes, frameworks: onde o fix automático altera semântica de tradução ou contratos de teste, preferir **suggest** ou exclusão por glob em vez de **fix** por defeito. |

**Estado do contrato:** a secção de remediação está marcada como **planeada**; os critérios acima são **alvo** negocial. Desvios na implementação exigem actualização do contrato (A3) ou ajuste dos casos e documentação no pacote (cadeia M1-A2-03+).

---

## 3. Matriz principal `suggest` vs `fix` (risco R1)

Cada linha descreve o **outcome negocial** esperado quando `remediationMode: "r1"` e o literal é reportável, salvo quando uma exclusão por glob **remove** a remediação R1 (ver coluna *Notas*).

| ID política | Categoria de risco / contexto | Outcome esperado | Opções e notas | Ligação cenários |
|-------------|------------------------------|------------------|----------------|------------------|
| P-SVF-01 | Literal de **aplicação** sem indício de segredo (L1), **fora** de zonas i18n/teste exclusivas | **Fix** (`output` determinístico no RuleTester) | Convenção `constantNamingConvention`, `dedupeWithinFile` conforme contrato; ficheiro não excluído por `remediationExcludeGlobs`. | S-R1-01, S-R1-02, S-R1-03 |
| P-SVF-02 | **Caminho excluído** de remediação (`remediationExcludeGlobs` casa com `filename`) | **Sem fix R1** | Reporte de hardcode pode manter-se (política A1); **não** exigir `output` de remediação R1 para esse ficheiro. | S-R1-05 |
| P-SVF-03 | **Inclusão restrita** (`remediationIncludeGlobs` não vazio) | **Fix** só se o caminho **incluído**; caso contrário sem fix R1 | Coerente com S-R1-06. | S-R1-06 |
| P-SVF-04 | **Candidato a segredo** (heurística L1 / tokens sensíveis) | Com `secretRemediationMode` por defeito (**`suggest-only`**): **sem autofix** que copie o valor em claro; **sem** `suggestions` que reproduzam o valor sensível na suite M1 — apenas reporte (`errors`). Autofix completo só com **`aggressive-autofix-opt-in`**. | Alinhado a *Dados sigilosos* no macro-plan e ao enum em contrato. | Evidência: bloco «Segredo provável» em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) (sem ID S-R1-* em A1). |
| P-SVF-05 | **Literal de default** de `process.env` (`??` / `||`) | Ver **§3.1** — por valor de `envDefaultLiteralPolicy`; em M1 a suite fixa pares concretos com `output` ou `valid`. | Macro-plan (*Defaults de variáveis de ambiente*); revisão humana recomendada para alterar contratos de env em projectos reais. | S-R1-07 |
| P-SVF-06 | **i18n / cópia de UI** / mensagens de tradução | **Suggest-only** por defeito (sem `output` que reescreva chaves ou textos de catálogo) ou **exclusão** por glob se o projecto externalizar noutro fluxo | Evita `eslint --fix` a alterar ficheiros de tradução de forma opaca. | S-R1-08 |
| P-SVF-07 | **Testes / fixtures** (strings que definem contratos de teste ou snapshots) | **Suggest-only** por defeito ou exclusão por glob | Risco de quebrar expectativas ou duplicar constantes no sítio errado. | S-R1-08 |
| P-SVF-08 | **Frameworks** com strings semânticas (rotas, keys) | **Suggest-only** por defeito quando o fix R1 não for semanticamente neutro | Detalhe de implementação documentado na regra / README pelo desenvolvedor (M1-A2-04). | S-R1-08 (extensível) |

### 3.1 Pares `envDefaultLiteralPolicy` × evidência RuleTester (S-R1-07)

Valores do contrato: `include` \| `report-separate` \| `ignore` (ver [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)). A tabela abaixo fixa o **par negocial** aceite em M1, alinhado aos comentários S-R1-07 em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs).

| Valor | Reporte do literal de fallback | Remediação R1 na suite M1 |
|-------|-------------------------------|---------------------------|
| `include` | `messageId: "hardcoded"` no reporte do literal de fallback | **`output`**: constante no topo; o literal do fallback passa a referenciar a constante (`??` e `||` cobertos). |
| `report-separate` | `messageId: "hardcodedEnvDefault"` (classe distinta de `include`) | **`output`** com a mesma forma de substituição que em `include`; distinção negocial no `messageId`. |
| `ignore` | Sem reporte de hardcode para o par `process.env` + literal nos exemplos da suite | Casos **`valid`** (sem `errors` para esse literal de fallback). |

### 3.2 Rastreabilidade S-R1-* ↔ P-SVF-* ↔ forma RuleTester

| ID cenário (A1) | Políticas P-SVF | Forma na âncora R1 |
|-----------------|-----------------|-------------------|
| S-R1-01 … S-R1-03 | P-SVF-01 | `output` |
| S-R1-04 | (sem remediação R1) | Só `errors`, sem `output` |
| S-R1-05 | P-SVF-02 | `errors` + `suggestions`, sem `output` |
| S-R1-06 | P-SVF-03 | `output` se `filename` incluído; senão `suggestions` sem `output` |
| S-R1-07 | P-SVF-05 | Ver §3.1 (`include` / `report-separate` / `ignore`) |
| S-R1-08 | P-SVF-06, P-SVF-07, P-SVF-08 | `suggestions` sem `output` (ex.: ficheiro `*.test.ts` na suite) |
| (bloco «Segredo provável», sem ID S-R1 em A1) | P-SVF-04 | Só `errors`, sem `output` nem `suggestions` |

### 3.3 P-SVF-06, P-SVF-07, P-SVF-08 e o cenário S-R1-08

A matriz A1 define **um** pacote S-R1-08 para contexto «arriscado» (i18n / teste / framework). Na suite M1, esse pacote está **instanciado** com um `filename` de teste (`*.test.ts`), pelo que a **forma** de evidência é **suggest-only** (sem `output`). As categorias P-SVF-06 (i18n), P-SVF-07 (testes/fixtures) e P-SVF-08 (frameworks) partilham, para efeito de RuleTester, a mesma **política de risco**: não autofix R1 por defeito nesses contextos; exemplos adicionais (ficheiros i18n, rotas) podem ser acrescentados na documentação da regra e na suite pelo **M1-A2-04**, mantendo a política negocial aqui fixada.

**Prioridade em caso de sobreposição:** exclusão por glob (P-SVF-02) e modo segredo (P-SVF-04) prevalecem sobre P-SVF-01 para o mesmo literal quando ambos se apliquem.

---

## 4. Reprodutibilidade (RuleTester e documentação)

A correspondência entre outcome negocial e prova automatizada segue [`A2-architect-suggest-vs-fix-policy-ci-environment.md`](A2-architect-suggest-vs-fix-policy-ci-environment.md):

- **Fix aplicável:** casos com **`output`** — o fixer aplica alteração compatível com `eslint --fix` sobre o mesmo `SourceCode`.
- **Apenas suggest:** casos com **`suggestions`** e **sem** `output` esperado para aquele reporte — o utilizador aplica manualmente se quiser.
- **Só erros** (sem `output` nem `suggestions` onde o produto fixar remediação): detecção sem oferta de remediação automática ou sugestão, conforme contrato e suite.

A suite em [`no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) deve **materializar** cada linha da matriz (P-SVF-*) que esteja no âmbito M1, com identificadores de cenário alinhados a S-R1-*. A consolidação S-R1 ↔ P-SVF ↔ `output` / `suggestions` / só `errors` está em **§3.2**; o bloco «Segredo provável» segue **P-SVF-04** (§3.2, última linha).

---

## 5. Fronteiras com outros artefactos

- **A3 — contrato:** se a implementação divergir desta política ou do contrato planeado, actualizar [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) segundo [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md).
- **M1-A2-03 — revisor de negócio:** validar este documento contra o contrato e [`docs/architecture.md`](../../../architecture.md).
- **M1-A2-04 — desenvolvedor:** reflectir a tabela acima em [`packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md`](../../../../packages/eslint-plugin-hardcode-detect/docs/rules/no-hardcoded-strings.md) e excertos do [`README.md`](../../../../packages/eslint-plugin-hardcode-detect/README.md) do pacote, e garantir testes coerentes.

---

## 6. Fronteira com M1-A1 (suite S-R1-*)

A especificação de cenários S-R1-01 … S-R1-08 permanece em [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md). O presente documento define a **política fina** de **suggest vs fix** para cumprir S-R1-07 e S-R1-08 (§3.1 e §3.3) e para alinhar P-SVF-* à reprodutibilidade técnica (§3.2).

---

## Critério de conclusão (M1-A2-02)

Entregável **concluído** quando as secções 1–6 estiverem estáveis para revisão pelo **Revisor de negócio** (M1-A2-03). O critério **global** da tarefa A2 (comportamento reproduzível em testes e/ou documentação normativa no pacote) completa-se após a cadeia M1-A2-03 → M1-A2-04 e evidência de teste.

## Dependências

- Sub-micro-tarefa [`M1-A2-01`](micro/M1-A2-01-papel-arquiteto-suggest-vs-fix-policy.md) concluída (documento do arquiteto).

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md`
- Documentação futura no pacote: `packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md`
- Testes: `packages/eslint-plugin-hardcode-detect/tests/`
