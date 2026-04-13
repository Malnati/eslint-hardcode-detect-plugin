# M1-A1-09 — Desenvolvedor especialista em correcções — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-09 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 2100 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M1-A1-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Verificação pós-M1-A1-08 e encerramento do papel **dev-especialista-correcoes** (M1-A1-09):

- **Artefacto:** correlacionado com [`../A1-test-runner-ruletester-r1-evidence.md`](../A1-test-runner-ruletester-r1-evidence.md) (gate M1-A1-08).
- **Verificações:** `timeout 600 npm test -w eslint-plugin-hardcode-detect` com código de saída **0**; Node `v22.14.0` (`engines.node >=22`; alinhado ao CI Node 22); `cwd` na raiz do clone do monorepo; cadeia `npm run build` + `node --test` em `tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, `e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs` conforme [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json); saída `node --test`: `# tests 5`, `# pass 5`, `# fail 0`.
- **Correcções de código:** nenhuma aplicada neste passo — não surgiu **falha reproduzível** após o gate do testador; o papel condicional cumpre-se por re-execução com sucesso (sem patch mínimo necessário).
- **Critério global A1:** casos R1 na suite RuleTester e restante cadeia do pacote a passar.

Estado: **concluído**.

