# M1 — A1 — Analista de testes: matriz técnica RuleTester R1 e critérios de evidência

| Campo | Valor |
|-------|--------|
| `milestone` | M1 |
| `github_milestone` | `remediation-m1-r1` |
| `task_id` | A1 |
| `micro_id` | `M1-A1-06` |
| `role` | analista-testes |
| `labels_sugeridas` | `type/feature`, `area/remediation-R1` |
| `token_budget_estimate` | 4200 |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) — secção 7 (Camada A), tarefa A1.
- Micro-tarefa: [`micro/M1-A1-06-papel-analista-testes-ruletester-r1-suite.md`](micro/M1-A1-06-papel-analista-testes-ruletester-r1-suite.md).

## Inputs

- Critérios de aceitação negociais e matriz **S-R1-01 … S-R1-08**: [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md).
- Comando, CI e cadeia `npm test`: [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md).
- Contrato funcional (remediação R1): [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
- Implementação RuleTester: [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs).

## Objectivo deste entregável

Documentar **onde** cada cenário negocial S-R1-* está exercido na suite RuleTester, **que tipo de asserção** domina cada bloco e **que evidência** o testador (M1-A1-08) deve recolher para o gate A1. Este documento **não** substitui a especificação de negócio nem o contrato.

## Matriz técnica: S-R1-* → `no-hardcoded-strings-r1.test.mjs`

Os comentários `// S-R1-0x —` no ficheiro são a âncora de rastreabilidade. Tipos de asserção:

- **`output`**: fix R1 aplicável (RuleTester compara código fixado).
- **`errors` sem `output`**: detecção sem fix automático (ex.: `remediationMode: "off"` ou literal tipo segredo).
- **`suggestions`**: remediação oferecida como suggest (sem `output` de autofix naquele caso).

| ID | Secção no teste (comentário) | Asserção dominante | Notas técnicas |
|----|------------------------------|--------------------|----------------|
| S-R1-01 | Dois literais duplicados; constante após `import` | `output` | Ordem no topo após imports; `dedupeWithinFile` por defeito alinhado ao happy path. |
| S-R1-02 | Literal com hífens → `HELLO_WORLD` | `output` | Naming `UPPER_SNAKE_CASE` derivado do literal. |
| S-R1-03 | `dedupeWithinFile: false` | `output` | Duas constantes por valor (`AB`, `AB_2`). |
| S-R1-04 | `remediationMode: "off"` | `errors` apenas | `messageId: hardcoded`; sem fix R1. |
| S-R1-05 | `remediationExcludeGlobs` + `filename` `*.i18n.ts` | `errors` + `suggestions` | Sem autofix; suggest com texto esperado. |
| S-R1-06 | `remediationIncludeGlobs` — dentro de `src/` vs `lib/` | misto: `output` / `suggestions` | `filename` via `filePath("src", …)` / `filePath("lib", …)`; requer `cwd` no pacote (ver abaixo). |
| S-R1-07 | `envDefaultLiteralPolicy` (`ignore`, `include`, `report-separate`) | `valid` / `output` / `errors` | Inclui `messageId` `hardcodedEnvDefault` onde aplicável. |
| S-R1-08 | `*.test.ts` «arriscado» | `errors` + `suggestions` | Sem autofix; alinhado à fronteira com política A2. |

### Caso extra (regressão segurança)

| ID | Secção no teste | Asserção dominante | Notas |
|----|-----------------|--------------------|-------|
| — | Literal longo sintético (segredo provável) | `errors` apenas | Sem `output` nem `suggestions`; alinhado à revisão M1-A1-05; sem dados sensíveis reais. |

## Requisito de ambiente para caminhos (`filename`)

A função `filePath(...)` junta `process.cwd()` a segmentos (`src/`, `lib/`). O script `test` do pacote deve correr com **cwd no directório** [`packages/eslint-plugin-hardcode-detect`](../../../../packages/eslint-plugin-hardcode-detect) (equivalente a `npm test -w eslint-plugin-hardcode-detect` a partir da raiz do monorepo). Ver [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md).

## e2e na cadeia A1

O critério global A1 exige **build + RuleTester + e2e** na mesma invocação de `npm test` do pacote. Ordem definida em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json) (`scripts.test`):

1. `tests/index.test.mjs`
2. `tests/no-hardcoded-strings-r1.test.mjs`
3. `e2e/hello-world.e2e.mjs`
4. `e2e/nest-workspace.e2e.mjs`

Estes e2e são **fumaça / regressão** sobre API ESLint e massas do repositório; **não** reproduzem linha a linha a matriz S-R1-* (isso é responsabilidade do RuleTester acima).

## Critérios de evidência (M1-A1-08 — testador)

| Critério | Valor esperado |
|----------|----------------|
| Comando canónico | `npm test -w eslint-plugin-hardcode-detect` (raiz do monorepo) |
| Sucesso | Código de saída **0** em toda a cadeia (build, ambos os ficheiros RuleTester listados no script, ambos os e2e). |
| Registo mínimo | Comando executado e código de saída; se o comando falhar, últimas linhas relevantes do output para diagnóstico. |
| Ambiente | Coerente com CI (Node 22 no GitHub Actions; localmente `engines.node >=22`). |

## Modelo de relato de falha (testador, N=1)

Quando **M1-A1-08** comunicar uma falha de `npm test` ou de uma fase da cadeia do pacote, o relato deve seguir [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md) (Níveis 1–2). **N** = 1 unidade de falha; exemplo mínimo:

### Diagnóstico técnico (sênior)

[HCD-ERR-SENIOR] `npm test -w eslint-plugin-hardcode-detect` terminou com código de saída não zero; incluir trecho do output (ex.: stack ou TAP) e correlacionar com `packages/eslint-plugin-hardcode-detect/tests/` ou `packages/eslint-plugin-hardcode-detect/e2e/` conforme o log.

### Correção definitiva

[HCD-ERR-FIX] Corrigir a causa no código, testes, contrato ou CI que o log indicar (diff mínimo; regressão coberta pela mesma suite quando aplicável).

### Contorno operacional

[HCD-ERR-OPS] Até haver correção, reproduzir localmente com a mesma versão de Node que o CI (`engines.node` / `actions/setup-node`); documentar o comando exacto e o código de saída. Risco: contorno não substitui fix de causa raiz nem merge sem revisão (M1-A1-07).

## Limites de papel

Este entregável **não** constitui aprovação de merge por si só. A revisão do plano e dos critérios cabe a **M1-A1-07** (revisor de testes); a execução formal e registo de evidências a **M1-A1-08** (testador).

## Critério de conclusão (M1-A1-06)

Entregável **concluído** quando este documento estiver referenciado no micro-ficheiro M1-A1-06 e no índice [`README.md`](README.md) da pasta de tarefas M1, com matriz e critérios de evidência estáveis para M1-A1-07.

## Paths principais

- Este documento: `docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-analyst-ruletester-r1-matrix-evidence.md`
- Suite RuleTester R1: `packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`
