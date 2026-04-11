# Abrir sessão de agente (hardcode-detect)

Antes de editar arquivos neste repositório:

1. Leia [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) (checklist de abertura) e classifique o escopo conforme [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md).
2. Se o trabalho envolver ESLint (regras, API do plugin, RuleTester, flat/legacy config), empacotamento npm do pacote ou CI que interprete essas ferramentas: consulte **primeiro** [`reference/Clippings/`](reference/Clippings/) e [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md).
3. Confirme limites em [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) e contrato em [`specs/plugin-contract.md`](specs/plugin-contract.md) se houver mudança de comportamento.

Em seguida, execute o pedido do usuário seguindo as skills aplicáveis em `.cursor/skills/`.
