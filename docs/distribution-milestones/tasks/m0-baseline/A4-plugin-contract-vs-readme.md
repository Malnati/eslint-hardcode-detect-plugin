# A4: Revisão cruzada `plugin-contract` × README do plugin

| Campo | Valor |
|-------|--------|
| milestone | M0 |
| github_milestone | macro-baseline |
| task_id | A4 |
| labels_sugeridas | `type/docs`, `area/channel-T1` |
| token_budget_estimate | 25 000 |
| timelining_order | 2 |
| depends_on | — (recomendado após A1–A2 para contexto macro alinhado) |

## Plano do marco

Camada A em [`../../m0-baseline.md`](../../m0-baseline.md) (secção 7).

## Inputs

- [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)
- [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../packages/eslint-plugin-hardcode-detect/README.md)
- Documentação de regras sob `packages/eslint-plugin-hardcode-detect/docs/` quando relevante para o contrato.

## Outputs

- Lista de gaps entre contrato e documentação do pacote, **ou** registo explícito de «OK»; registo em PR ou documento conforme [`../../m0-baseline.md`](../../m0-baseline.md) (critério de done do marco).

## Critério de conclusão

- Divergências óbvias documentadas ou ausentes; issues abertas se necessário.

## Dependências

- **Bloqueia:** confiança na linha de base T1 sobre o que o plugin garante publicamente.
- **Depende de:** — (opcionalmente A1–A2 para alinhamento de índices).

## Paths principais

- `specs/plugin-contract.md`
- `packages/eslint-plugin-hardcode-detect/README.md`
