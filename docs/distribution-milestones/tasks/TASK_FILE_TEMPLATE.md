# Modelo de ficheiro de tarefa (Camada A)

Copie este ficheiro para `tasks/<slug-do-marco>/A{N}-<slug-curto>.md` e preencha os campos. Os caminhos no corpo devem ser **relativos à raiz do repositório**.

## Metadados (cabeçalho sugerido)

Use uma tabela ou lista no topo de cada ficheiro:

| Campo | Exemplo |
|-------|---------|
| `milestone` | M{N} |
| `github_milestone` | nome sugerido no plano do marco |
| `task_id` | A{N} |
| `labels_sugeridas` | `type/docs`, `area/channel-T*` |
| `token_budget_estimate` | número |
| `timelining_order` | número da linha na secção «Ordem…» do plano, ou — |
| `depends_on` | A1, … |

## Secções obrigatórias no corpo

1. **Plano do marco** — link para a secção 7 (Camada A) do ficheiro `mN-*.md` correspondente.
2. **Inputs**
3. **Outputs**
4. **Critério de conclusão**
5. **Dependências** (o que bloqueia / do que depende)

## Secções opcionais

- **Paths principais** — lista de paths relativos à raiz.
- **Micro-tarefas (filhas de A{N})** — quando o marco tiver pasta `tasks/<slug>/micro/` com ficheiros `M{N}-A<1-5>-<nn>-<slug>.md` (prefixo do marco, ex. `M0-`, `M1-`), listar na âncora A{N} uma tabela com `micro_id` e links; manter `coverage-manifest.json` na pasta do marco (ex.: `docs/distribution-milestones/tasks/m0-baseline/coverage-manifest.json`) alinhado ao plano e revisado no próprio marco.
- **Notas**
