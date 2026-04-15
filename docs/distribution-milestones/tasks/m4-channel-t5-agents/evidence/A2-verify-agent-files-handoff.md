# A2 — handoff: job `verify-agent-files` (CI)

| Campo | Valor |
|-------|--------|
| milestone | M4 (`channel-t5-agents`) |
| task | A2 |
| inventário A1 | [`T5-normative-files-inventory.md`](T5-normative-files-inventory.md) |

## Decisão: automação agora (não backlog)

- O inventário A1 está completo e sem gaps materiais; validar presença dos paths no disco é barato e não exige perfil Docker novo (matriz §6 em [`docs/distribution-milestones/m4-channel-t5-agents.md`](../../../m4-channel-t5-agents.md)).
- A CI continua a garantir T3: `npm install`, `npm run lint`, `npm test -w eslint-plugin-hardcode-detect` — o passo T5 não altera o pacote npm.
- Validação JSON de `.cursor/hooks.json` permanece **fora** deste ciclo (opcional; schema do fornecedor).

## Onde está a automação

| O quê | Path |
|-------|------|
| Script | Removido neste ciclo (descontinuado) |
| Comando local | Não aplicável |
| CI | [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) — sem step dedicado no CI atual |

## Tabela de remissões — inventário A1 × `agent-tooling-ecosystem-map.md`

Cada superfície do inventário (§1.1–§1.6 de [`T5-normative-files-inventory.md`](T5-normative-files-inventory.md)) remete às secções indicadas em [`specs/agent-tooling-ecosystem-map.md`](../../../../../specs/agent-tooling-ecosystem-map.md) (evitar duplicar o corpo do mapa aqui).

| Superfície inventário | Remissão no mapa |
|------------------------|------------------|
| §1.1 Regras `.cursor/rules/*.mdc` | Equivalência na tabela (instruções Copilot vs regras Cursor em `.cursor/rules/`); **Precedência de instruções** (nível 3: regras Cursor). |
| §1.2 Skills `.cursor/skills/*/SKILL.md` | Linha «Skills em `.github/skills/`» → equivalente **`.cursor/skills/`**; nota sobre não duplicar corpo normativo. |
| §1.3 Comandos `.cursor/commands/*.md` | Comportamento Cursor local; alinhar com hierarquia em **Precedência** e com [`AGENTS.md`](../../../../../AGENTS.md). |
| §1.4 Hooks `.cursor/hooks.json` + script | Linha «Ponte só HCD-ERR» + hook em **`.cursor/hooks/`**; **Cursor IDE vs Cursor CLI** (paridade não assumida por defeito). |
| §1.5 Agentes `.github/agents/*.agent.md` | Linhas «agents/*.agent.md» (ponte opcional), «Sub-agente … docker-tooling», «Ponte só HCD-ERR». |
| §1.6 Instruções `.github/instructions/*.instructions.md` | Linha «instructions/*.instructions.md … + `.github/instructions/eslint-plugin-hardcode…`»; **Anti-padrões** (pontes curtas, caminhos relativos à raiz). |

## Handoff T6

Os ficheiros listados no inventário A1 são o **contrato social** do ecossistema agente neste repositório: mantenedores devem atualizar em conjunto [`T5-normative-files-inventory.md`](T5-normative-files-inventory.md) e o mapa de equivalências quando a política T5 mudar.
