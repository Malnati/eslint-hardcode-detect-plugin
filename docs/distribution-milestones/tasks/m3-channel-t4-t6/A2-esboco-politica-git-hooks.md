# A2: Esboço de política — Git hooks (Husky / Lefthook / nativos)

| Campo | Valor |
|-------|--------|
| milestone | M3 |
| github_milestone | channel-t4-t6 |
| task_id | A2 |
| labels_sugeridas | `area/channel-T6`, `type/docs` |
| token_budget_estimate | 20 000 |
| timelining_order | 2 |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md) (secções 1, 2, 4, 7 e 10).

## Inputs

- **A1** (guia IDE e alinhamento ao CI).
- Política da cadeia T1→T6: T6 «forte» só após **T5** (M4); neste marco apenas **preparação** documental.

## Outputs

- Secção curta ou ADR em `docs/` sobre Husky, Lefthook ou hooks nativos acionando `eslint`, com **alvo normativo:** o mesmo caminho de lint que o CI (ver M2).
- Riscos de hooks que alteram estado git em CI citados explicitamente — ver tabela comparativa em [`micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md`](micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md) («Comparação de abordagens — riscos (entregável)»).

## Critério de conclusão

- Riscos CI e ambiguidade de comandos tratados; não se declara T6 «done» sem M4 (Opção A/B do plano M3).
- Comparação documental Husky / Lefthook / hooks nativos concluída: [`micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md`](micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md).

## Dependências

- **Bloqueia:** —
- **Depende de:** A1.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M3-A2-01 | [`micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md`](micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md) |
| M3-A2-02 | [`micro/M3-A2-02-alinhamento-cli-lint-ci-m2.md`](micro/M3-A2-02-alinhamento-cli-lint-ci-m2.md) |

## Paths principais

- `docs/` (secção ou ADR)
- [`../m2-channel-t3-ci/`](../m2-channel-t3-ci/)
- [`../../m3-channel-t4-t6.md`](../../m3-channel-t4-t6.md)
