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
| Micro-tarefas | Opcional: pasta `micro/` com ficheiros `M{N}-A<1-5>-<nn>-<slug>.md` (ou com `papel-<papel>-` no slug, ver linha seguinte), índice em `micro/README.md`, `coverage-manifest.json` na pasta do marco. **Validação:** revisão documental local no próprio marco para manter manifesto e índices consistentes entre `docs/distribution-milestones/tasks/` e `docs/remediation-milestones/tasks/`. |
| **Sub-micro-tarefas por papel** | Quando uma tarefa Camada A envolve alterações em `packages/` (código-fonte, `tests/` ou `e2e/`), **não** se usa um único `A{N}.md` agregador: esse ficheiro é **substituído** por ficheiros em `micro/` com o padrão `M{N}-A{x}-{yy}-papel-<papel>-<slug>.md`. O `{yy}` é sequencial **por tarefa-mãe** `A{x}` (01, 02, …). Tarefas estritamente documentais (`specs/`, `docs/` sem `packages/`) mantêm **um** `A{N}.md`. **Excepção M5:** tarefas de release com impacto mínimo (ex.: semver) podem permanecer como `A{N}` único — ver nota em [`m5-remediation-release/README.md`](m5-remediation-release/README.md). **Validação:** manter `coverage-manifest.json` em M1–M4 remediação alinhado ao conteúdo das micro-tarefas. **Regeneração em massa (opcional):** [`scripts/remediation-micro-generate.mjs`](../../../scripts/remediation-micro-generate.mjs) — só após alteração coordenada do plano; rever diffs. |

### Papéis (`<papel>`)

| Slug | Papel |
|------|--------|
| `arquiteto` | Ambiente, infra, desempenho, políticas de execução e deployment quando relevante |
| `analista-negocio` | Critérios de aceitação, inputs/outputs alinhados ao contrato e ao macro-plan |
| `revisor-negocio` | Revisão de especificações contra contrato e arquitectura |
| `desenvolvedor` | Implementação em `packages/` (e fixtures permitidas) |
| `revisor-desenvolvimento` | Revisão de código/diffs sem expandir o âmbito funcional |
| `analista-testes` | Especificação de testes (RuleTester, e2e) e matriz de cobertura |
| `revisor-testes` | Revisão de planos de teste e critérios de evidência |
| `testador` | Execução de `npm test` no workspace do pacote e registo de evidências |
| `dev-especialista-correcoes` | Ciclo condicional: análise de falhas, patches, revalidação (não substitui o desenvolvedor na entrega inicial) |

**Ordem sugerida entre papéis:** arquiteto → analista de negócio → revisor de negócio → desenvolvedor → revisor de desenvolvimento → analista de testes → revisor de testes → testador → (se falha) dev especialista em correcções → testador.

**Índice:** cada pasta `micro/README.md` lista dependências e `micro_id` por ficheiro. **Manifesto:** ficheiro `coverage-manifest.json` na pasta do marco (ex.: [`m1-remediation-r1/coverage-manifest.json`](m1-remediation-r1/coverage-manifest.json)), mantido em sincronia com as micro-tarefas.

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
