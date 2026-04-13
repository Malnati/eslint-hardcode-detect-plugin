# M1-A1-03 — Revisor de negócio — Suite RuleTester R1

| Campo | Valor |
|-------|--------|
| micro_id | M1-A1-03 |
| milestone | M1 |
| github_milestone | remediation-m1-r1 |
| parent_task | A1 |
| role | revisor-negocio |
| labels_sugeridas | `type/feature`, `area/remediation-R1` |
| token_budget_estimate | 2800 |
| single_focus | Valida a especificação contra `specs/plugin-contract.md` e `docs/architecture.md`; **não** escreve testes nem produção. |
| depends_on | Sub-micro-tarefa `M1-A1-02` concluída. |

## Plano do marco

- [`docs/remediation-milestones/m1-remediation-r1.md`](../../../m1-remediation-r1.md) — secção 7 (Camada A).

## Inputs

Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).

## Outputs

Contribuição do papel **Revisor de negócio** para os outputs agregados de A1: Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.

## Critério de conclusão

- **Deste papel (M1-A1-03):** parecer emitido em [`../A1-business-reviewer-ruletester-r1-signoff.md`](../A1-business-reviewer-ruletester-r1-signoff.md); micro concluída quando o signoff estiver entregue (ver *Critério de conclusão (M1-A1-03)* nesse documento).

- **Cadeia A1 (global):** `npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar aplica-se **após** implementação e validação dos testes (M1-A1-04 em diante); **não** é gate do revisor de negócio.

## Dependências

Sub-micro-tarefa `M1-A1-02` concluída.

## Paths principais

`packages/eslint-plugin-hardcode-detect/tests/`

## Entregável (concluído)

Parecer normativo do revisor de negócio: [`../A1-business-reviewer-ruletester-r1-signoff.md`](../A1-business-reviewer-ruletester-r1-signoff.md) — rastreabilidade contrato ↔ critérios e cenários do analista, alinhamento a `docs/architecture.md`, riscos/condições e parecer **aprovado** com handoff para M1-A1-04.

Estado: **concluído** (entregável acima).
