# M1-A2-09 — Desenvolvedor especialista em correcções — Política suggest vs fix (R1)

| Campo | Valor |
|-------|--------|
| micro_id | M1-A2-09 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A2 |
| role | dev-especialista-correcoes |
| labels_sugeridas | `type/docs`, `area/remediation-R1` |
| token_budget_estimate | 900 |
| single_focus | Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial. |
| depends_on | Sub-micro-tarefa `M1-A2-08` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).

## Outputs

Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.

## Critério de conclusão

Papel **Desenvolvedor especialista em correcções**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A2: Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.

## Dependências

Sub-micro-tarefa `M1-A2-08` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`

## Entregável (concluído)

Verificação pós-M1-A2-08 e encerramento do papel **dev-especialista-correcoes** (M1-A2-09):

- **Artefacto:** correlacionado com [`../A2-test-runner-suggest-vs-fix-policy-evidence.md`](../A2-test-runner-suggest-vs-fix-policy-evidence.md) (gate M1-A2-08).
- **Verificações:** `timeout 600 npm test -w eslint-plugin-hardcode-detect` com código de saída **0**; Node `v22.14.0` (`engines.node >=22`; alinhado ao CI Node 22); `cwd` na raiz do clone do monorepo; cadeia `npm run build` + `node --test` em `tests/index.test.mjs`, `tests/no-hardcoded-strings-r1.test.mjs`, `e2e/hello-world.e2e.mjs`, `e2e/nest-workspace.e2e.mjs` conforme [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json); saída `node --test`: `# tests 5`, `# pass 5`, `# fail 0`; re-execução de confirmação registada em **2026-04-13** (UTC).
- **Correcções de código:** nenhuma aplicada neste passo — não surgiu **falha reproduzível** após o gate do testador; o papel condicional cumpre-se por re-execução com sucesso (sem patch mínimo necessário em `src/`, `tests/` ou documentação do pacote). A documentação normativa reproduzível para `suggest` vs `fix` permanece a entregue em M1-A2-04 e validada nas revisões / matriz / gate M1-A2-08.
- **Critério global A2:** comportamento `suggest` vs `fix` reproduzível na suite e na documentação normativa.

Estado: **concluído**.

