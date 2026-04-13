# M1 — A1 — Analista de negócio: critérios de aceitação — suite RuleTester R1

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A1 |
| `micro_id` | `M1-A1-02` |
| `role` | analista-negocio |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |
| `token_budget_estimate` | 4200 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A1.
- Micro-tarefa: [`micro/M1-A1-02-papel-analista-negocio-ruletester-r1-suite.md`](micro/M1-A1-02-papel-analista-negocio-ruletester-r1-suite.md).

## Inputs

- [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) — regra `no-hardcoded-strings`, secção *Remediação assistida — opções públicas planeadas (R1–R3)* e subsecção *R1 — constantes no mesmo ficheiro*.
- Marco M0 (opções estáveis no contrato): alinhado ao estado **planeado** indicado no contrato; a suite RuleTester M1 deve ser **especificável** antes da implementação completa das opções no código.
- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — objectivo R1, exclusões e relação com `suggest` vs `fix`.
- Ambiente e comando de validação: [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md).

## Outputs (este entregável)

Documento normativo de **critérios de aceitação negociais**, **inputs/outputs esperados** e **matriz de cenários** para a futura suite RuleTester em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo **happy path** e **exclusões R1**, sem código de teste nem alterações ao pacote.

---

## 1. Objectivo e não-objectivos

### Objectivo

Definir o que a suite RuleTester R1 deve **provar**, em termos negociais, quando `remediationMode` estiver na trilha **R1** (`"r1"`): remediação por **constantes no topo do mesmo** `SourceCode`, com `fix` / `suggest` compatíveis com o fixer ESLint no AST corrente, conforme [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) (subsecção R1 e opções da tabela aplicáveis a R1).

### Não-objectivos

- Não especifica nem altera ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` (papel **Desenvolvedor**, M1-A1-04).
- Não substitui o contrato em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) (sincronização formal: tarefa A3 / marcos de contrato).
- Não duplica a **matriz completa** `suggest` vs `fix` por risco — ver tarefa Camada A **A2** e [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) (subtarefas 3–4 e secção 4): a política fina documenta-se em M1-A2; aqui apenas **fronteiras** para a suite A1.
- Não abrange **R2** (módulo partilhado) nem **R3** (ficheiros de dados); menções a opções R2/R3 no contrato servem só para **evitar** confusão de âmbito nos casos de teste.

---

## 2. Rastreabilidade contrato ↔ critérios

| ID critério | Âmbito | Referência em `plugin-contract.md` | Nota |
|-------------|--------|-----------------------------------|------|
| C-R1-MODE | Selecção de trilha | `remediationMode` — valor `"r1"` vs `"off"` | `"off"` = apenas detecção (comportamento base da regra); `"r1"` activa remediação R1 onde aplicável. |
| C-R1-NAMING | Nomes injectados | `constantNamingConvention` (R1, M1) | Padrão planeável `"UPPER_SNAKE_CASE"`; a suite deve incluir pelo menos um cenário que fixe a convenção por defeito e um que documente variante se o enum for alargado na implementação. |
| C-R1-DEDUPE | Uma constante por valor | `dedupeWithinFile` (R1, M1) | Quando `true`, um único identificador por valor normalizado no mesmo ficheiro; quando `false`, comportamento documentado (múltiplas declarações vs uma) deve ser testável. |
| C-R1-INCL | Filtro inclusivo | `remediationIncludeGlobs` (R1, M1) | Lista vazia = sem filtro extra além de `files`/`ignores` do ESLint. |
| C-R1-EXCL | Filtro exclusivo | `remediationExcludeGlobs` (R1–R3, M1+) | Exclui caminhos da **remediação** (ex.: testes, i18n); ver secção 4. |
| C-ENV-DEF | Literais de default | `envDefaultLiteralPolicy` (M1–M3) | Interacção com `process.env` + `??` / `\|\|`; pelo menos um cenário por valor de política relevante para R1 quando o literal for candidato. |
| C-R1-BASE | Semântica R1 | Subsecção *R1 — constantes no mesmo ficheiro* | Declarações no topo; substituição de ocorrências no mesmo `SourceCode` com `dedupeWithinFile` verdadeiro. |

**Estado do contrato:** a secção de remediação está marcada como **planeada**; os critérios acima são **alvo** da suite. Desvios na implementação exigem actualização do contrato (A3) ou ajuste dos casos.

---

## 3. Happy path — critérios de aceitação negociais

Quando `remediationMode === "r1"` e o literal é **elegível** (ex.: comprimento ≥ 2 conforme detecção actual da regra, salvo override futuro documentado):

1. **Topo do ficheiro:** as declarações geradas para constantes injectadas aparecem na zona «topo» acordada (ordem estável definida por convenção na implementação ou documentada na regra); a RuleTester deve poder comparar `output` fixado com essa ordem.
2. **Substituição:** ocorrências do mesmo valor no mesmo código passam a referenciar a(s) constante(s) gerada(s), sem alterar ficheiros externos.
3. **Naming:** identificadores novos respeitam `constantNamingConvention` (por defeito `UPPER_SNAKE_CASE`).
4. **Deduplicação:** com `dedupeWithinFile: true`, um único `const` por valor normalizado no ficheiro; ocorrências múltiplas do mesmo literal convergem para a mesma referência.
5. **Detecção vs remediação:** com `remediationMode: "off"`, os casos **invalid** actuais da regra (reporte `hardcoded`) mantêm-se testáveis; não se exige `fix` aplicável.

---

## 4. Exclusões e filtros (`include` / `exclude`)

Interpretação negocial para a suite (o contrato nomeia `remediationIncludeGlobs` e `remediationExcludeGlobs`; lista vazia = sem filtro extra):

| Tema | Comportamento esperado na especificação de testes |
|------|--------------------------------------------------|
| **`remediationExcludeGlobs`** | O caminho do ficheiro em análise (no RuleTester: opção `filename` / equivalente) **não** recebe **fix** de remediação R1 quando casa com um padrão excluído. **Suposição explícita para desbloquear casos:** o **reporte** de hardcode (regra activa) pode manter-se, a menos que o produto decida «ignorar completamente» certos globs — essa decisão deve alinhar com o contrato na implementação e reflectir-se em casos `valid`/`invalid` coerentes. |
| **`remediationIncludeGlobs`** | Se a lista **não** estiver vazia, apenas caminhos que casam recebem remediação R1; os restantes seguem a mesma regra de «reporte vs fix» que a equipa fixar em conjunto com a exclusão. |
| **Exemplos do contrato** | Padrões do tipo `**/*.i18n.ts`, `**/.env.example` ilustram exclusões típicas; a matriz abaixo usa identificadores de cenário genéricos para não pré-fixar nomes de ficheiro além do necessário. |

---

## 5. Matriz de cenários (alvo RuleTester R1)

Cada linha é um **pacote de aceitação** implementável como um ou mais casos RuleTester (papel **Analista de testes** / **Desenvolvedor**). Coluna «Resultado esperado» descreve o outcome negocial, não a API ESLint literal.

| ID | Categoria | Opções mínimas (conceito) | Resultado esperado |
|----|-----------|---------------------------|-------------------|
| S-R1-01 | Happy path | `remediationMode: "r1"`, convenção por defeito, `dedupeWithinFile: true` | Um literal duplicado no mesmo ficheiro → um `const` no topo; referências substituídas; `fix` produz `output` determinístico. |
| S-R1-02 | Happy path (naming) | `constantNamingConvention` distinto do defeito (se suportado) | Identificador injectado obedece à convenção escolhida. |
| S-R1-03 | Dedupe | `dedupeWithinFile: false` | Comportamento único e documentado (aceite pelo revisor de negócio); caso de regressão na suite. |
| S-R1-04 | Detecção sem fix | `remediationMode: "off"` | Reporte de hardcode sem oferta de fix R1 (mantém alinhamento com detecção M0). |
| S-R1-05 | Exclusão | `remediationExcludeGlobs` com padrão que casa com `filename` | Sem **fix** R1 para esse `filename`; ver secção 4 quanto ao reporte. |
| S-R1-06 | Inclusão | `remediationIncludeGlobs` não vazio | Apenas ficheiros incluídos recebem fix R1; cenário complementar a S-R1-05. |
| S-R1-07 | Env default | `envDefaultLiteralPolicy` + expressão `process.env` + fallback literal | Literal tratado segundo a política; interacção com R1 documentada no caso (pode ser `suggest`-only conforme risco — fronteira com A2). |
| S-R1-08 | Limite (suggest vs fix) | Cenário «arriscado» i18n / teste / framework | Pelo marco M1, onde o fix for arriscado, **suggest** em vez de `fix`; detalhe da tabela de risco em **M1-A2**, não neste documento. |

---

## 6. Fronteira com M1-A2 (política `suggest` vs `fix`)

- A subtarefa **3** do plano sequencial em [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) (*Matriz suggest vs fix (risco)*) e a tarefa Camada A **A2** (`M1-A2-*`) produzem a **política documentada** (contrato ou README da regra).
- **Política fina (matriz de risco P-SVF-*):** [`A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](A2-business-analyst-suggest-vs-fix-policy-acceptance.md) (M1-A2-02).
- A suite **A1** deve **referenciar** que S-R1-08 (e equivalentes) dependem dessa política para decidir entre `fix` e `suggest`, sem reproduzir aqui a tabela completa de riscos.
- Critério global A1: [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md) — `npm test -w eslint-plugin-hardcode-detect` com RuleTester e e2e na cadeia do pacote.

---

## 7. Ligação à execução técnica

- **Comando canónico e CI:** [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md).
- **Matriz técnica RuleTester e critérios de evidência (analista de testes, M1-A1-06):** [`A1-test-analyst-ruletester-r1-matrix-evidence.md`](A1-test-analyst-ruletester-r1-matrix-evidence.md).
- **Contrato funcional:** [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
- **Papel seguinte:** [`micro/M1-A1-03-papel-revisor-negocio-ruletester-r1-suite.md`](micro/M1-A1-03-papel-revisor-negocio-ruletester-r1-suite.md) — validar esta especificação contra o contrato e [`docs/architecture.md`](../../../architecture.md).
- **Resultado da revisão (M1-A1-03):** [`A1-business-reviewer-ruletester-r1-signoff.md`](A1-business-reviewer-ruletester-r1-signoff.md).

## Critério de conclusão (M1-A1-02)

Entregável deste ficheiro **concluído** quando o conteúdo das secções 1–7 estiver estável para revisão (M1-A1-03); a execução `npm test` com todos os casos R1 a passar é critério **global** da cadeia A1 após implementação dos testes.

## Dependências

- Sub-micro-tarefa [`M1-A1-01`](micro/M1-A1-01-papel-arquiteto-ruletester-r1-suite.md) concluída (documento do arquiteto).

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-business-analyst-ruletester-r1-acceptance.md`
- Implementação futura dos casos: `packages/eslint-plugin-hardcode-detect/tests/`
