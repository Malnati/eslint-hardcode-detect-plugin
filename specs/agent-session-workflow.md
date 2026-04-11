# Contrato: fluxo por execução de prompt (sessão do agente)

Este documento define o **ciclo completo** que agentes de IA (Cursor / Cursor CLI) **devem** seguir em **cada prompt** que altere ou dependa do repositório, para que:

- [`reference/Clippings/`](../reference/Clippings/) seja consultado e mantido quando o escopo exigir;
- o **grafo** documentado em [`docs/repository-tree.md`](../docs/repository-tree.md) permaneça fiel à árvore real;
- **restrições** e **limitações** em [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md), [`AGENTS.md`](../AGENTS.md) e [`specs/plugin-contract.md`](plugin-contract.md) sejam respeitados;
- práticas alinhadas a repositórios públicos e documentação oficial sejam aplicadas (ver [`docs/documentation-policy.md`](../docs/documentation-policy.md) e [`specs/agent-reference-clippings.md`](agent-reference-clippings.md)).

## Hierarquia

Este contrato **orquestra** os demais; em caso de ambiguidade sobre “o que fazer neste prompt”, prevalece a ordem abaixo:

1. [`AGENTS.md`](../AGENTS.md) — prioridades e mapa do repositório.
2. Este arquivo — abertura e fechamento da sessão.
3. [`specs/plugin-contract.md`](plugin-contract.md) e [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) — produto e visão.
4. [`specs/agent-reference-clippings.md`](agent-reference-clippings.md) — Clippings e documentação oficial.
5. [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md) — documentação e grafo ao finalizar.
6. [`specs/agent-git-workflow.md`](agent-git-workflow.md) — versionamento ao finalizar.

## Fase A — Entender o pedido e classificar o escopo

1. Extrair do prompt o **objetivo**, **arquivos prováveis** e **restrições** explícitas do usuário.
2. Classificar o trabalho em uma ou mais categorias:

| Categoria | Exemplos | Ação obrigatória relacionada a Clippings |
|-----------|----------|-------------------------------------------|
| **Ecossistema ESLint / plugin / RuleTester / flat ou legacy config** | Nova regra, mudança de API do ESLint no código, ajuste de `eslint.config` do pacote | Consultar **primeiro** `reference/Clippings/` no tópico; ver [`specs/agent-reference-clippings.md`](agent-reference-clippings.md). |
| **Empacotamento npm / metadados do pacote** | `package.json`, exports, build do plugin | Idem quando a decisão depender de documentação oficial (npm, Node). |
| **CI** que interpreta ESLint, Node ou npm | Workflows que rodam o linter ou publicam o pacote | Consultar Clippings ou doc oficial quando a semântica do toolchain não for óbvia no repo. |
| **Somente Markdown / specs / governança** sem tocar em API ESLint | README, `docs/`, rules do Cursor | Clippings **não** é obrigatório salvo o texto **altere** contratos que citam ESLint ou exija validar citação contra fonte oficial. |
| **Estrutura de pastas** | Novo diretório normativo, mover Clippings | Atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) no mesmo ciclo. |

3. Se o escopo for **misturado** (ex.: código + doc), aplicar a coluna mais restritiva (ex.: código ESLint → consulta a Clippings).

## Fase B — Fontes antes de implementar (escopo relevante)

1. Reler trechos aplicáveis de [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) se o pedido puder **expandir escopo** ou **trocar limites** do plugin.
2. Se a Fase A classificou como ecossistema ESLint/npm/CI relacionada:
   - Listar e abrir arquivos em [`reference/Clippings/`](../reference/Clippings/) (índice em [`reference/Clippings/README.md`](../reference/Clippings/README.md)).
   - Se não houver recorte adequado ou estiver desatualizado: consultar documentação **oficial** atual (MCP de documentação do projeto, quando existir; senão fonte canônica na Web) e **registrar** trecho em `reference/Clippings/` conforme [`specs/agent-reference-clippings.md`](agent-reference-clippings.md).
3. Para mudanças de **comportamento** do plugin: garantir alinhamento com [`specs/plugin-contract.md`](plugin-contract.md) **antes** ou **junto** com o código (o spec tem precedência sobre implementação legada em `reference/`, exceto `legacy-snapshot` que não é contrato).

## Fase C — Executar o trabalho

1. Manter **todo** código publicável somente em [`packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/); **nunca** importar `reference/` desde `packages/`.
2. Não alterar [`reference/legacy-snapshot/`](../reference/legacy-snapshot/) exceto em mudança **explícita** de snapshot (PR ou prompt dedicado).
3. Preferir imports **relativos** dentro do pacote, conforme [`AGENTS.md`](../AGENTS.md).
4. Após edições que afetem estilo ou tipos no pacote, corrigir lints conforme a configuração do pacote.

## Fase D — Fechar o prompt (sempre que houver entrega relevante)

1. Cumprir [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md):
   - Atualizar [`docs/repository-tree.md`](../docs/repository-tree.md) se qualquer diretório ou artefato normativo listado lá tiver mudado (inclui árvore sob `reference/Clippings/` e `.cursor/`).
   - Atualizar [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md) ou [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) se limites ou visão mudarem.
   - Ajustar `README.md`, `CONTRIBUTING.md` ou `docs/` conforme impacto.
2. Garantir que o **índice** em [`reference/Clippings/README.md`](../reference/Clippings/README.md) liste arquivos recortados relevantes quando arquivos forem adicionados, renomeados ou removidos.
3. Na **resposta ao usuário**, listar documentação alterada ou declarar explicitamente que **nenhuma** atualização foi necessária (e por quê).
4. Se houver alterações locais rastreadas: seguir [`specs/agent-git-workflow.md`](agent-git-workflow.md) (commit e push na branch atual, salvo working tree vazia — então declarar “nada a commitar”).

## Skills e rules do repositório

| Artefato | Função |
|----------|--------|
| [`.cursor/skills/reference-clippings-workflow/SKILL.md`](../.cursor/skills/reference-clippings-workflow/SKILL.md) | Consulta e manutenção de Clippings |
| [`.cursor/skills/eslint-plugin-workflow/SKILL.md`](../.cursor/skills/eslint-plugin-workflow/SKILL.md) | Implementação no pacote |
| [`.cursor/skills/github-markdown-docs/SKILL.md`](../.cursor/skills/github-markdown-docs/SKILL.md) | Documentação e grafo |
| [`.cursor/skills/git-agent-workflow/SKILL.md`](../.cursor/skills/git-agent-workflow/SKILL.md) | Fechamento Git |
| [`.cursor/rules/agent-session.mdc`](../.cursor/rules/agent-session.mdc) | Lembrete Cursor: este fluxo |

## Versão do documento

- **1.0.0** — contrato de sessão por prompt: fases A–D, tabela de escopo e ligação a Clippings, grafo e Git.
