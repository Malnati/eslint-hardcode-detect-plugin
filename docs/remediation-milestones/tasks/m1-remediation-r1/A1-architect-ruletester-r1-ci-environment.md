# M1 — A1 — Arquiteto: RuleTester R1 — CI, comando e ambiente

Entregável do papel **Arquiteto** para a tarefa Camada A **A1** (suite RuleTester R1), alinhado a [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) e à sub-micro-tarefa [`micro/M1-A1-01-papel-arquiteto-ruletester-r1-suite.md`](micro/M1-A1-01-papel-arquiteto-ruletester-r1-suite.md).

Este documento fixa **impacto em CI**, o **comando canónico de validação** e **limites de ambiente**. Não substitui o contrato funcional em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) nem os critérios de negócio da suite (papéis posteriores em `micro/M1-A1-*`).

## Comando canónico

- **Workspace (raiz do monorepo):** `npm test -w eslint-plugin-hardcode-detect`
- Equivale a executar o script `test` definido em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json) naquele pacote.

## Cadeia interna do `npm test` do pacote

Ordem efectiva:

1. `npm run build` — compilação TypeScript (`tsc`) para `dist/`.
2. `node --test` sobre (ordem do script `test` em [`package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json)):
   - [`packages/eslint-plugin-hardcode-detect/tests/index.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/index.test.mjs) (RuleTester e regras);
   - [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) (RuleTester R1, S-R1-01 … S-R1-08);
   - [`packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs`](../../../../packages/eslint-plugin-hardcode-detect/e2e/hello-world.e2e.mjs);
   - [`packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`](../../../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs).

**Implicação para A1:** o critério global «testes verdes» na linha do marco inclui **RuleTester e e2e** na mesma invocação; falha em qualquer fase invalida o gate.

## CI (GitHub Actions)

Ficheiro: [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml).

Ordem dos passos no job `test` antes e incluindo o pacote:

| Ordem | Passo | Comando |
|-------|--------|---------|
| 1 | Checkout | — |
| 2 | Node 22 | `actions/setup-node` com `node-version: "22"` |
| 3 | Instalação | `npm install` (raiz) |
| 6 | Lint do workspace | `npm run lint` |
| 7 | Teste do pacote plugin | `npm test -w eslint-plugin-hardcode-detect` |

Índice normativo: [`docs/remediation-milestones/tasks/README.md`](../README.md).

- **Timeout do job:** `timeout-minutes: 10`.
- **SO:** `ubuntu-latest`.

Qualquer falha nos passos 4–7 bloqueia o merge; para trabalho focado na suite A1, o passo 7 é o gate directo do pacote, dependendo dos anteriores na mesma pipeline.

## Limites de ambiente

| Aspecto | Valor / nota |
|---------|----------------|
| Node.js | `engines.node`: `>=22` no pacote; CI fixa **22**. |
| ESLint | `peerDependencies`: `eslint >= 9.0.0`; em desenvolvimento/CI vem das `devDependencies` do pacote e da raiz conforme o workspace. |
| Variáveis de ambiente | Nenhuma variável obrigatória é exigida para RuleTester ou `node --test` além do ambiente Node/ESLint habitual; integrações externas não entram no escopo deste gate (ver [`specs/agent-integration-testing-policy.md`](../../../../specs/agent-integration-testing-policy.md)). |
| Recursos | Limitados pelo runner GitHub e pelo `timeout-minutes` do job. |

## Critério de «verde» (alinhamento A1)

- **Marco:** [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md), secção 7 — tarefa A1: ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1, com **`npm test -w eslint-plugin-hardcode-detect`** a terminar com código de saída 0.
- **Semântica técnica:** «verde» = build + RuleTester + e2e do script `test` do pacote, sem regressão nessa cadeia.

## ESLint, RuleTester e documentação oficial

Decisões que dependem da API ESLint, RuleTester ou fixers devem seguir [`specs/agent-reference-clippings.md`](../../../../specs/agent-reference-clippings.md) e os recortes em [`reference/Clippings/`](../../../../reference/Clippings/).

## Limites de papel (sub-micro-tarefas)

Este entregável é responsabilidade do papel **Arquiteto** (ambiente, execução, CI). **Não** inclui edição de ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` — essa responsabilidade recai noutros papéis da cadeia A1 (ex.: desenvolvedor, analista de testes), conforme [`specs/agent-remediation-micro-roles.md`](../../../../specs/agent-remediation-micro-roles.md) e o índice em [`micro/README.md`](micro/README.md).
