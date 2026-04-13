# Abrir sessão de agente (hardcode-detect)

Antes de editar arquivos neste repositório:

1. Leia [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) (checklist de abertura) e classifique o escopo conforme [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md).
2. Se o trabalho envolver ESLint (regras, API do plugin, RuleTester, flat/legacy config), empacotamento npm do pacote ou CI que interprete essas ferramentas: consulte **primeiro** [`reference/Clippings/`](reference/Clippings/) e [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md).
3. Confirme limites em [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) e contrato em [`specs/plugin-contract.md`](specs/plugin-contract.md) se houver mudança de comportamento.

4. Ao referir ficheiros deste repositório na conversa ou em prompts a sub-agentes, use **caminhos relativos à raiz** — [`docs/documentation-policy.md`](../../docs/documentation-policy.md).
5. Se precisar **relatar falhas** durante ou após o trabalho, siga [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md) e a skill `agent-error-messaging-triple` — prefixos `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]` na primeira linha de cada parte; verificar Níveis 1–2 antes de enviar.
6. Se o trabalho envolver **planos de desenvolvimento**, **testes**, **correcções** em `packages/` ou **marcos** em `docs/remediation-milestones/` / `docs/distribution-milestones/`, leia [`specs/agent-remediation-micro-roles.md`](../../specs/agent-remediation-micro-roles.md) e use a skill `remediation-micro-roles-workflow` — **um papel por turno** (ou por sub-agente) salvo pedido explícito em contrário.

Em seguida, execute o pedido do usuário seguindo as skills aplicáveis em `.cursor/skills/`.
