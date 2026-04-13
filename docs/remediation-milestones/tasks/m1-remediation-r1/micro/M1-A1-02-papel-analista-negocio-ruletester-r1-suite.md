# M1-A1-02 — Analista de negócio — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-02 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | analista-negocio |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 4200 |
| single_focus | Especifica critérios de aceitação e inputs/outputs alinhados a `specs/plugin-contract.md` e M0; **não** implementa código. |
| depends_on | Sub-micro-tarefa `M1-A1-01` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

**Entregável directo deste papel:** documento normativo [`../A1-business-analyst-ruletester-r1-acceptance.md`](../A1-business-analyst-ruletester-r1-acceptance.md) (critérios de aceitação, matriz S-R1-*, fronteira com M1-A2). **Não** inclui edição de `packages/eslint-plugin-hardcode-detect/tests/` — essa pasta é alvo da cadeia A1 agregada (Desenvolvedor M1-A1-04 e outros papéis), com casos derivados desta especificação.

## Critério de conclusão

Papel **Analista de negócio**: entregáveis deste ficheiro concluídos; alinhado ao critério global de A1: `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.

## Dependências

Sub-micro-tarefa `M1-A1-01` concluída.

## Paths principais

- Documento de aceitação (este papel): [`../A1-business-analyst-ruletester-r1-acceptance.md`](../A1-business-analyst-ruletester-r1-acceptance.md).
- `packages/eslint-plugin-hardcode-detect/tests/` — alvo da implementação da suite (outros papéis); o analista de negócio não edita esta pasta.

## Entregável (concluído)

Especificação normativa do analista de negócio: [`../A1-business-analyst-ruletester-r1-acceptance.md`](../A1-business-analyst-ruletester-r1-acceptance.md) — critérios de aceitação, rastreabilidade ao contrato, exclusões/include globs, matriz de cenários R1 e fronteira com M1-A2.

Estado: **concluído** (entregável acima).
