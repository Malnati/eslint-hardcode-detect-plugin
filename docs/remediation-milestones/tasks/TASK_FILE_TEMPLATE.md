# Modelo de ficheiro de tarefa (Camada A)

Copie este ficheiro para `docs/remediation-milestones/tasks/<slug-do-marco>/A{N}-<slug-curto>.md` e preencha os campos. Os caminhos no corpo devem ser **relativos à raiz do repositório**.

## Metadados (cabeçalho sugerido)

Use uma tabela ou lista no topo de cada ficheiro:

| Campo | Exemplo |
|-------|---------|
| `milestone` | M{N} |
| `github_milestone` | nome sugerido no plano do marco (ex.: `remediation-m1-r1`) |
| `task_id` | A{N} |
| `labels_sugeridas` | `type/docs`, `area/remediation-R*` |
| `token_budget_estimate` | número |
| `timelining_order` | número da linha na secção «Ordem…» do plano, ou — |
| `depends_on` | A1, … |

### Sub-micro-tarefas por papel (`micro/`)

Quando a tarefa `A{N}` for substituída por ficheiros em `micro/` (ver [`README.md`](README.md)), use **um ficheiro por papel** com o nome `M{N}-A{x}-{yy}-papel-<papel>-<slug>.md` e acrescente à tabela:

| Campo | Exemplo |
|-------|---------|
| micro_id | `M1-A1-01` — na tabela Markdown, chave `micro_id` **sem** backticks (facilita validação textual consistente) |
| `role` | `arquiteto` … `dev-especialista-correcoes` |
| `parent_task` | `A1` |
| `single_focus` | Uma frase: o que este agente faz e o que **não** faz (evitar multi-foco) |

## Secções obrigatórias no corpo

1. **Plano do marco** — link para a secção 7 (Camada A) do ficheiro `mN-*.md` correspondente em `docs/remediation-milestones/`.
2. **Inputs**
3. **Outputs**
4. **Critério de conclusão**
5. **Dependências** (o que bloqueia / do que depende)

## Secções opcionais

- **Paths principais** — lista de paths relativos à raiz.
- **Micro-tarefas (filhas de A{N})** — quando o marco tiver pasta `micro/` e `coverage-manifest.json`, alinhar a [`docs/remediation-milestones/tasks/README.md`](README.md) (validação por revisão documental local do marco).
- **Notas**
