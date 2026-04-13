# Ficheiros de tarefa por marco (Camada A)

Cada marco em [`..`](..) (`m0-contract-baseline.md`, `m1-remediation-r1.md`, …) tem uma pasta homónima sob `tasks/` com **um ficheiro Markdown por tarefa** da **Camada A** (pré-execução de agentes: inputs, outputs, teto de tokens, critérios).

## Convenções

| Item | Regra |
|------|-------|
| Pasta do marco | Nome alinhado ao plano e à branch sugerida: `m0-contract-baseline/`, `m1-remediation-r1/`, … |
| Nome do ficheiro | `A{N}-<slug-descritivo>.md` |
| IDs | `A1`, `A2`, … por marco |
| Ligação ao GitHub | Usar o **milestone GitHub sugerido** no cabeçalho do plano do marco |
| Timelining | Quando uma subtarefa da secção «Ordem, dependências e durações» não tiver linha na tabela Camada A, acrescentar linha **A{N}** no plano do marco e ficheiro correspondente |
| Micro-tarefas | Opcional: pasta `micro/` com ficheiros `M{N}-A<1-5>-<nn>-<slug>.md`, índice em `micro/README.md`, `coverage-manifest.json`. **Validação:** o script [`scripts/validate-milestone-plan-coverage.mjs`](../../../scripts/validate-milestone-plan-coverage.mjs) (`npm run test:docs-milestones` na raiz) cobre hoje os manifestos em `docs/distribution-milestones/tasks/`. Se forem adicionados manifestos de cobertura para **remediation-milestones**, é necessário **estender** `MILESTONE_CONFIG` nesse script para incluir os novos caminhos — até lá, a validação de micro-tarefas aplica-se apenas quando o manifesto existir e o script for actualizado. |

## Modelo

- [`TASK_FILE_TEMPLATE.md`](TASK_FILE_TEMPLATE.md)

## Índices por marco

| Marco | Pasta |
|-------|-------|
| M0 | [`m0-contract-baseline/`](m0-contract-baseline/README.md) |
| M1 | [`m1-remediation-r1/`](m1-remediation-r1/README.md) |
| M2 | [`m2-remediation-r2-global/`](m2-remediation-r2-global/README.md) |
| M3 | [`m3-remediation-r3-data-files/`](m3-remediation-r3-data-files/README.md) |
| M4 | [`m4-secrets-remediation/`](m4-secrets-remediation/README.md) |
| M5 | [`m5-remediation-release/`](m5-remediation-release/README.md) |
