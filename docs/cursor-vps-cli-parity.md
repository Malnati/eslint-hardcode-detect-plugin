# Cursor IDE vs Cursor CLI (incl. VPS): paridade e verificação

Este guia alinha expectativas sobre **onde** os artefactos em [`.cursor/`](../.cursor/) e pontes em [`.github/agents/`](../.github/agents/) / [`.github/instructions/`](../.github/instructions/) são aplicados, em particular ao usar **Cursor no ambiente de secretária** versus **Cursor CLI** (por exemplo num **VPS** com `agent` em modo não interativo).

## Âmbito no repositório

| Área | Conteúdo típico |
|------|-----------------|
| [`.cursor/hooks.json`](../.cursor/hooks.json) + [`.cursor/hooks/`](../.cursor/hooks/) | Hooks do agente (ex.: auditoria HCD-ERR após `Write` e ao `stop`) |
| [`.cursor/rules/`](../.cursor/rules/) | Regras do projeto (`alwaysApply`, `globs`, …) |
| [`.cursor/skills/`](../.cursor/skills/) | Skills reutilizáveis |
| [`.cursor/commands/`](../.cursor/commands/) | Comandos com barra (`/…`) |
| [`.github/agents/`](../.github/agents/) | Pontes GitHub Copilot (frontmatter + links para `specs/`) |
| [`.github/instructions/`](../.github/instructions/) | Instruções Copilot por glob |

A norma funcional do produto e dos agentes continua em [`AGENTS.md`](../AGENTS.md), [`specs/`](../specs/) (em especial [`specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md)) e [`specs/agent-error-messaging-triple.md`](../specs/agent-error-messaging-triple.md) para o hook HCD-ERR.

## IDE vs CLI: o que a documentação oficial costuma cobrir

Os recortes em [`reference/Clippings/dev/cursor/docs/`](../reference/Clippings/dev/cursor/docs/) descrevem hooks no contexto do **Cursor Agent** (chat/composer), **Tab** e **agentes na nuvem**. **Não** devemos assumir, neste repositório, que o **Cursor CLI** (`agent`, modo headless) executa **exactamente** o mesmo pipeline de hooks que a aplicação de secretária até ser **confirmado na tua versão** do cliente.

Regra prática: tratar a paridade **IDE ↔ CLI** como **hipótese a validar**, não como garantia.

## Dois níveis de verificação

### Nível 1 — Smoke do script do hook (sem Agent)

O script [`scripts/smoke-cursor-hcd-err-hook.sh`](../scripts/smoke-cursor-hcd-err-hook.sh) envia JSON mínimo para [`.cursor/hooks/hcd-err-triple-audit.sh`](../.cursor/hooks/hcd-err-triple-audit.sh) e verifica códigos de saída e saída padrão.

- **O que valida:** Python/bash, `CURSOR_PROJECT_DIR`, e a lógica do hook (eventos `afterFileEdit` e `stop`, incluindo um caso de violação simulada).
- **O que não valida:** se o binário `agent` do Cursor CLI invoca de facto os hooks no teu ambiente.

Executar na raiz do clone (local ou VPS):

```bash
bash scripts/smoke-cursor-hcd-err-hook.sh
```

### Nível 2 — Integração com Agent (manual na VPS ou local)

1. Abrir o repositório como workspace de projeto (no IDE: **trusted** quando o Cursor pedir).
2. Executar um prompt que provoque **edição de ficheiro** (ferramenta Write) e **conclusão do turno** (para o evento `stop` correr).
3. Verificar se surgem entradas novas em `.log/hooks/` (ficheiros `YYYYMMDD-hcd-err-audit.md` ou estado em `.log/hooks/.state/`). O directório `.log/` **não** está em [`.gitignore`](../.gitignore); podes versionar os relatórios de auditoria se fizer sentido para a equipa.
4. Se não aparecer nada, o CLI dessa versão pode não estar a despachar hooks — regista a versão do Cursor CLI e consulta a documentação oficial actual.

## Pré-requisitos úteis

- Raiz do repositório como directório de trabalho do agente.
- Variável `CURSOR_PROJECT_DIR` apontando para essa raiz (o próprio hook usa-a quando o cliente a define).
- Mesmo clone e mesma branch que usas no IDE, para comparações justas.

## Ligações

- [`specs/agent-error-messaging-triple.md`](../specs/agent-error-messaging-triple.md) — contrato HCD-ERR e automação local do hook
- [`specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md) — mapa Copilot / Cursor
- [`AGENTS.md`](../AGENTS.md) — hierarquia e mapa de pastas

## Versão do documento

- **1.0.0** — introdução: IDE vs CLI/VPS, dois níveis de verificação, smoke do hook.
