# M1 — A1 — Revisor de negócio: validação — suite RuleTester R1

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A1 |
| `micro_id` | `M1-A1-03` |
| `role` | revisor-negocio |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |
| `token_budget_estimate` | 2800 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A1.
- Micro-tarefa: [`micro/M1-A1-03-papel-revisor-negocio-ruletester-r1-suite.md`](micro/M1-A1-03-papel-revisor-negocio-ruletester-r1-suite.md).

## Documento revisto

- [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md) (M1-A1-02).

## Âmbito da revisão

| Fonte | Secções / conteúdo considerados |
|-------|----------------------------------|
| [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) | *Remediação assistida — opções públicas planeadas (R1–R3)* — tabela de opções (linhas R1 relevantes), subsecção *R1 — constantes no mesmo ficheiro*, parágrafos sobre literais de default (`envDefaultLiteralPolicy`) em *Segredos e literais de default de ambiente*; estado **planeado** do schema. |
| [`docs/architecture.md`](../../../architecture.md) | Fluxo de decisão (alterações de regras: contrato antes de `packages/`); papel do pacote npm em `packages/eslint-plugin-hardcode-detect`; RuleTester como contrato por regra e e2e como fumaça (reforçado no contrato em *Compatibilidade*). |

---

## Matriz de rastreabilidade — critérios C-R1-*

Cada critério do analista foi confrontado com o vocabulário e a semântica do contrato. O schema de remediação permanece **planeado** no `plugin-contract.md`; a aceitação já assume esse estado — abaixo indica-se o ancoramento normativo.

| ID critério | Resultado | Referência em `plugin-contract.md` |
|-------------|-----------|-----------------------------------|
| C-R1-MODE | Alinhado | Tabela: `remediationMode` — `"off"` vs trilhas incl. `"r1"` (Transversal, M1+). |
| C-R1-NAMING | Alinhado | Tabela: `constantNamingConvention` — R1, M1; padrão planeável `"UPPER_SNAKE_CASE"`. |
| C-R1-DEDUPE | Alinhado | Tabela: `dedupeWithinFile` — R1, M1; subsecção R1 reforça substituição no mesmo `SourceCode` quando verdadeiro. |
| C-R1-INCL | Alinhado | Tabela: `remediationIncludeGlobs` — R1, M1; lista vazia = sem filtro extra além de `files` do ESLint. |
| C-R1-EXCL | Alinhado | Tabela: `remediationExcludeGlobs` — R1–R3, M1+; descrição de exclusão de caminhos (testes, i18n, exemplos). |
| C-ENV-DEF | Alinhado | Tabela: `envDefaultLiteralPolicy` — Transversal, M1–M3; parágrafo *Literais de default* na mesma secção. |
| C-R1-BASE | Alinhado | Subsecção *R1 — constantes no mesmo ficheiro* — `fix`/`suggest` no ficheiro actual; declarações no topo; `dedupeWithinFile`. |

---

## Matriz de rastreabilidade — cenários S-R1-*

| ID cenário | Resultado | Fundamento no contrato / notas |
|------------|-----------|--------------------------------|
| S-R1-01 | Alinhado | Cobre subsecção R1 + opções `remediationMode`, `constantNamingConvention`, `dedupeWithinFile`. |
| S-R1-02 | Alinhado | Variante de `constantNamingConvention` desde que o enum público o permita na implementação (contrato: convenção para identificadores injectados). |
| S-R1-03 | Alinhado | `dedupeWithinFile: false` — comportamento deve ser único e documentado; contrato não fixa o detalhe fino; aceitável com A3 se a implementação divergir da expectativa inicial. |
| S-R1-04 | Alinhado | `remediationMode` / `"off"` na tabela; apenas detecção coerente com M0. |
| S-R1-05 | Alinhado com condição | `remediationExcludeGlobs` exclui caminhos da remediação; ver secção *Riscos e condições* sobre reporte vs fix. |
| S-R1-06 | Alinhado com condição | `remediationIncludeGlobs` — mesmo racional de reporte vs fix para caminhos não incluídos. |
| S-R1-07 | Alinhado | `envDefaultLiteralPolicy` + literais de default de ambiente no contrato; fronteira suggest/fix com A2 explícita no doc do analista. |
| S-R1-08 | Alinhado | Marco M1 prevê suggest onde o fix é arriscado ([`m1-remediation-r1.md`](../../m1-remediation-r1.md)); matriz fina em A2 — o doc do analista não a duplica. |

---

## Alinhamento com `docs/architecture.md`

- A especificação do analista permanece em `docs/` e referencia o contrato em `specs/`; não antecipa implementação em `packages/` nem altera o fluxo **contrato → código** descrito em *Fluxo de decisão*.
- A futura suite em `packages/eslint-plugin-hardcode-detect/tests/` é o local correcto para RuleTester; `e2e/` como fumaça complementar está coerente com o contrato (*Compatibilidade*) e com a arquitectura do repositório (pacote versionado sob `packages/`).

---

## Riscos e condições

1. **Suposição da secção 4 do analista (exclude / reporte):** explicitar que o reporte de hardcode pode manter-se quando o fix R1 está excluído por glob é **aceitável para desbloquear casos** de RuleTester, desde que a implementação e, se necessário, o contrato (A3) fixem uma política única e os casos `valid`/`invalid` reflitam essa decisão.
2. **Schema planeado:** qualquer desvio material na implementação relativamente à tabela de opções ou à subsecção R1 exige sincronização via **A3** ou ajuste dos casos — já declarado no doc do analista.
3. **S-R1-08 vs A2:** confirmado — a aceitação apenas referencia a fronteira; não substitui a política `suggest` vs `fix` da Camada A2.

---

## Parecer

**Aprovado.** A especificação em [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md) está **alinhada** a [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) e a [`docs/architecture.md`](../../../architecture.md) no âmbito R1 descrito acima, com as **condições** indicadas para exclusões/include e para coerência futura contrato ↔ casos.

---

## Handoff

- **Seguinte na cadeia A1:** implementação dos casos RuleTester — [`micro/M1-A1-04-papel-desenvolvedor-ruletester-r1-suite.md`](micro/M1-A1-04-papel-desenvolvedor-ruletester-r1-suite.md) (`packages/eslint-plugin-hardcode-detect/tests/`).
- **Política suggest vs fix (pormenor):** tarefa Camada A **A2** (`M1-A2-*`), conforme secção 6 do documento do analista.

## Critério de conclusão (M1-A1-03)

Parecer emitido e entregável desta micro-tarefa concluído. O critério global `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar aplica-se **após** a implementação e validação na cadeia A1 (não é gate deste papel).

## Paths principais (referência)

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-business-reviewer-ruletester-r1-signoff.md`
- Documento do analista: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-business-analyst-ruletester-r1-acceptance.md`
