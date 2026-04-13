---
description: 'Normas do pacote eslint-plugin-hardcode-detect: contrato, sessão de agente e Clippings antes da API ESLint.'
applyTo: 'packages/eslint-plugin-hardcode-detect/**/*.{ts,mjs,cjs,js}'
---

# eslint-plugin-hardcode-detect (instruções do repositório)

Estas instruções são uma **ponte**: a fonte normativa completa está em [`AGENTS.md`](../../AGENTS.md), [`specs/plugin-contract.md`](../../specs/plugin-contract.md) e [`specs/agent-session-workflow.md`](../../specs/agent-session-workflow.md).

1. Siga a hierarquia em [`AGENTS.md`](../../AGENTS.md) e o mapeamento Copilot/Cursor em [`specs/agent-tooling-ecosystem-map.md`](../../specs/agent-tooling-ecosystem-map.md).
2. Antes de mudar regras ESLint, config ou empacotamento: consulte [`reference/Clippings/`](../../reference/Clippings/README.md) conforme [`specs/agent-reference-clippings.md`](../../specs/agent-reference-clippings.md).
3. **Não** importe nem referencie arquivos em `reference/` como dependência de código publicável; código do plugin só em `packages/eslint-plugin-hardcode-detect/`.
4. Mudanças de comportamento público: atualize [`specs/plugin-contract.md`](../../specs/plugin-contract.md) antes ou junto do código.
5. Visão de produto (hardcode multi-nível): [`specs/vision-hardcode-plugin.md`](../../specs/vision-hardcode-plugin.md).
6. Ao citar ficheiros deste repositório em texto ou exemplos, use **caminhos relativos à raiz** — [`docs/documentation-policy.md`](../../docs/documentation-policy.md) (princípio 5b).
7. Integrações (registry, publicação, MCP): [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md) — sandboxes dos provedores; sem mocks no repositório.
8. Falhas (testes, build, CI): ao relatar, [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md) — obrigatório `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; verificar Níveis 1–2.
9. Planos de dev, testes e correcções com várias fases: [`specs/agent-remediation-micro-roles.md`](../../specs/agent-remediation-micro-roles.md) — sub-micro-tarefas por **papel** (foco único); skill [`remediation-micro-roles-workflow`](../../.cursor/skills/remediation-micro-roles-workflow/SKILL.md).
