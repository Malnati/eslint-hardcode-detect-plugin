# A2: Propor job `verify-agent-files` (CI ou backlog)

| Campo | Valor |
|-------|--------|
| milestone | M4 |
| github_milestone | channel-t5-agents |
| task_id | A2 |
| labels_sugeridas | `area/channel-T5`, `type/ci`, `type/docs` |
| token_budget_estimate | 25 000 |
| timelining_order | 2 |
| depends_on | A1 |

## Plano do marco

Camada A em [`../../m4-channel-t5-agents.md`](../../m4-channel-t5-agents.md) (secções 4, 6, 7 e 9). O job é **opcional** no plano; a entrega pode ser **YAML** em [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml) **ou** **backlog** (issue) com critérios aceitáveis e ligação ao inventário A1.

## Inputs

- Resultado de [`A1-inventario-cursor-github-agentes-checklist.md`](A1-inventario-cursor-github-agentes-checklist.md) (lista mínima de ficheiros ou padrões a garantir).
- Matriz §6 do plano M4: ficheiros normativos T5 vs Compose — validação por workflow, sem obrigar perfil Docker novo.
- Pipeline atual: [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml) (ordem: `test:docs-milestones`, `lint`, testes do workspace).

### Artefacto entregue

- Handoff e remissões: [`evidence/A2-verify-agent-files-handoff.md`](evidence/A2-verify-agent-files-handoff.md) (`npm run verify:agent-files`, step em [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml)).

## Outputs

- **Proposta concreta** numa destas formas:
  - **(a)** Novo step ou job (ex.: `verify-agent-files`) que falha se ficheiros canónicos listados em A1 estiverem em falta; ou verificação de lista com `test -f` / script Node mínimo na raiz; **ou**
  - **(b)** Issue ou secção em doc com critérios de merge e referência ao inventário, quando a automação for adiada.
- Tabela de **remissões** cruzando entradas do inventário com linhas relevantes de [`specs/agent-tooling-ecosystem-map.md`](../../../../specs/agent-tooling-ecosystem-map.md) (evitar duplicar parágrafos longos no workflow).

## Critério de conclusão

- Decisão explícita **automação agora vs backlog**, com justificativa.
- Se YAML: não regredir T3 (após `npm install`, a pipeline continua a passar quando o repo está íntegro); tempo de job dentro do `timeout-minutes` existente ou justificativa.
- Handoff para **T6:** mantenedores sabem que ficheiros de agente são «contrato social» alinhado ao que A1 listou.

## Dependências

- **Bloqueia:** —
- **Depende de:** A1.

## Paths principais

- [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml)
- [`package.json`](../../../../package.json) (scripts na raiz)
- [`A1-inventario-cursor-github-agentes-checklist.md`](A1-inventario-cursor-github-agentes-checklist.md)

## Notas

- Validação **JSON** de `.cursor/hooks.json` (schema) é opcional e pode ficar em fase posterior se o fornecedor não expuser schema estável no repo.
- Não introduzir mocks de MCP ou serviços externos no repositório para «passar» o job — ver [`specs/agent-integration-testing-policy.md`](../../../../specs/agent-integration-testing-policy.md).
