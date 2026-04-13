# Contrato: sub-micro-tarefas por papel (foco único)

Este documento obriga agentes de IA a **respeitar a separação por papéis e responsabilidades** quando o trabalho envolver **planos de desenvolvimento**, **ajustes ou correcções em código**, **testes** (especificação, execução, revisão de evidências) ou **marcos de remediação/distribuição** com tarefas Camada A fragmentadas em `micro/`.

A **fonte descritiva** dos nomes de ficheiros, slugs de papel e fluxo está em [`docs/remediation-milestones/tasks/README.md`](../docs/remediation-milestones/tasks/README.md). A **obrigação de comportamento** para agentes está neste spec.

## Quando aplicar (gatilhos)

Cumprir este contrato sempre que **qualquer** das condições seguintes se verificar:

1. O pedido referir explicitamente **remediation-milestones**, **distribution-milestones**, **Camada A**, **sub-micro-tarefas** ou **micro/** nos planos em `docs/`.
2. O trabalho **alterar ou propor alterações** em `packages/` (inclui `tests/`, `e2e/`, `package.json` do pacote quando for entrega de funcionalidade ou correcção).
3. O pedido combinar **várias fases** que, nos planos do repositório, correspondem a **papéis distintos** (ex.: definir contrato + implementar + correr testes + rever evidências).
4. O utilizador pedir **vários agentes** ou **delegação** sem definir limites — neste caso, o agente orquestrador deve **parcelar por papel** ao formular sub-prompts.

**Quando relaxar:** pedidos triviais e estritamente locais (ex.: corrigir um typo num comentário, um lint único) não exigem documentar nove papéis; mantém-se no entanto o **princípio de foco único** (não misturar redacção de contrato com refactor grande no mesmo passo sem intenção).

## Papéis normativos (ordem típica)

A ordem sugerida e as responsabilidades resumidas estão na tabela em [`docs/remediation-milestones/tasks/README.md`](../docs/remediation-milestones/tasks/README.md) (secção «Papéis»). Os nove slugs são: `arquiteto`, `analista-negocio`, `revisor-negocio`, `desenvolvedor`, `revisor-desenvolvimento`, `analista-testes`, `revisor-testes`, `testador`, `dev-especialista-correcoes`.

## Regras de execução para agentes

1. **Foco único (`single_focus`):** em cada mensagem ou sub-tarefa, o agente deve ser capaz de indicar **um** papel principal alinhado ao tipo de edição. Se o utilizador não tiver definido papel, o agente **declara explicitamente** no início da resposta qual papel está a assumir para **este** turno (ex.: «Papel: desenvolvedor — …»).
2. **Sem multi-foco na mesma entrega:** não implementar funcionalidade nova enquanto se revê apenas documentação de negócio no mesmo diff, salvo o utilizador pedir explicitamente entrega combinada; nesse caso, **separar** por secções com cabeçalhos de papel ou por commits lógicos descritos na resposta.
3. **Marcos com `micro/`:** se o trabalho corresponder a uma tarefa `A{x}` já fragmentada em [`docs/remediation-milestones/tasks/*/micro/`](../docs/remediation-milestones/tasks/) (ou análogo em distribution-milestones), **seguir** o índice e dependências em `micro/README.md` e os ficheiros `M{N}-A{x}-{yy}-papel-*` aplicáveis; não substituir essa ordem por um único bloco de trabalho genérico sem justificação.
4. **Delegação:** prompts a sub-agentes ou Task devem incluir: **papel**, **caminhos relativos à raiz** autorizados, **proibidos** (ex.: «não editar `specs/` neste passo») e **critério de saída**. Um sub-agente = **preferencialmente um papel** por invocação.
5. **Testes:** o papel **testador** executa `npm test` (ou comando equivalente no pacote) e regista evidências; **desenvolvedor** não substitui a validação final combinada com o plano de testes salvo pedido explícito de «correr testes neste passo».
6. **Correcções pós-falha:** o papel **dev-especialista-correcoes** entra após falha reproduzível (CI, testes, regressão); deve **minimizar** o diff e **não** reabrir desenho de arquitectura salvo bloqueio comprovado.
7. **Coerência com outros contratos:** este spec **não** revoga [`agent-session-workflow.md`](agent-session-workflow.md), [`plugin-contract.md`](plugin-contract.md), [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md) nem [`agent-integration-testing-policy.md`](agent-integration-testing-policy.md); aplica-se **em conjunto**.

## Ligação às skills

- Implementação no pacote: [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) — combinar com **um** papel de cada vez.
- Orquestração por papel explícito: [`.cursor/skills/remediation-micro-roles-workflow/SKILL.md`](../.cursor/skills/remediation-micro-roles-workflow/SKILL.md).

## Artefatos do repositório

| Tipo | Caminho |
|------|---------|
| Rule Cursor | [`.cursor/rules/agent-remediation-micro-roles.mdc`](../.cursor/rules/agent-remediation-micro-roles.mdc) |
| Skill | [`.cursor/skills/remediation-micro-roles-workflow/SKILL.md`](../.cursor/skills/remediation-micro-roles-workflow/SKILL.md) |
| Instruções Copilot (opcional) | [`.github/instructions/milestones-planning.instructions.md`](../.github/instructions/milestones-planning.instructions.md) |

## Versão do documento

- **1.0.0** — Contrato inicial alinhado a sub-micro-tarefas por papel em `docs/remediation-milestones/tasks/`.
