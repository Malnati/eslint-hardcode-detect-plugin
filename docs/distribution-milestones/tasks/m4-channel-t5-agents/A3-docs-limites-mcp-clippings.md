# A3: Documentar limites MCP e ligação a Clippings (quando necessário)

| Campo | Valor |
|-------|--------|
| milestone | M4 |
| github_milestone | channel-t5-agents |
| task_id | A3 |
| labels_sugeridas | `area/channel-T5`, `type/docs` |
| token_budget_estimate | 18 000 |
| timelining_order | 3 |
| depends_on | A1 (recomendado; contexto T5) |

## Plano do marco

Camada A em [`../../m4-channel-t5-agents.md`](../../m4-channel-t5-agents.md) (secções 1, 7 e 10). Objetivo: **ancorar** o papel **indireto** do MCP (ferramentas/recursos no cliente) vs pacote npm, sem duplicar a política de integrações.

## Inputs

- Tabela mestre — linha MCP: [`docs/solution-distribution-channels.md`](../../../../docs/solution-distribution-channels.md).
- Limitações e integrações: [`docs/limitations-and-scope.md`](../../../../docs/limitations-and-scope.md), [`specs/agent-integration-testing-policy.md`](../../../../specs/agent-integration-testing-policy.md).
- Inventário T5: [`A1-inventario-cursor-github-agentes-checklist.md`](A1-inventario-cursor-github-agentes-checklist.md).
- Índice Clippings MCP (se for necessário recorte novo): [`reference/Clippings/dev/mcp/`](../../../../reference/Clippings/dev/mcp/) e [`specs/agent-reference-clippings.md`](../../../../specs/agent-reference-clippings.md).

## Outputs

- Atualização **focada** em `docs/limitations-and-scope.md` e/ou remissão cruzada em `solution-distribution-channels.md` / macro-plan, de modo que fique explícito:
  - MCP **não** substitui instalação do plugin npm nem valida regras por si;
  - validação de servidores MCP segue fornecedor / ambiente suportado; **sem** mocks ad hoc no repositório (alinhado ao spec de integração).
- **Clippings:** novo ou atualizado ficheiro em `reference/Clippings/` **apenas** se uma decisão normativa depender de trecho da documentação oficial MCP (política do repo); caso contrário, remissões às páginas oficiais já indexadas bastam.

## Critério de conclusão

- Leitor distingue canal **T5 (MCP)** de **T1 (npm)** e de **T3 (CI)** sem ambiguidade.
- Se não houver recorte novo em `reference/Clippings/`, o critério aceita **parágrafo explícito** «nenhum clipping novo neste ciclo» na PR ou nota no doc atualizado.

## Dependências

- **Bloqueia:** —
- **Depende de:** A1 recomendado (contexto dos artefatos T5 listados).

## Paths principais

- [`docs/limitations-and-scope.md`](../../../../docs/limitations-and-scope.md)
- [`docs/solution-distribution-channels.md`](../../../../docs/solution-distribution-channels.md)
- [`specs/agent-integration-testing-policy.md`](../../../../specs/agent-integration-testing-policy.md)
- [`reference/Clippings/README.md`](../../../../reference/Clippings/README.md)
