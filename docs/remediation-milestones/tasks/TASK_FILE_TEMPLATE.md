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

## Secções obrigatórias no corpo

1. **Plano do marco** — link para a secção 7 (Camada A) do ficheiro `mN-*.md` correspondente em `docs/remediation-milestones/`.
2. **Inputs**
3. **Outputs**
4. **Critério de conclusão**
5. **Dependências** (o que bloqueia / do que depende)

## Secções opcionais

- **Paths principais** — lista de paths relativos à raiz.
- **Micro-tarefas (filhas de A{N})** — quando o marco tiver pasta `micro/` e `coverage-manifest.json`, alinhar a [`docs/remediation-milestones/tasks/README.md`](README.md) (validação via `scripts/validate-milestone-plan-coverage.mjs` quando o manifesto estiver registado no script).
- **Notas**
