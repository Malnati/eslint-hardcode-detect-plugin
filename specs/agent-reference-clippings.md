# Contrato: `reference/Clippings` e documentação oficial

Agentes de IA e colaboradores **devem** tratar [`reference/Clippings/`](../reference/Clippings/) como repositório de **trechos da documentação oficial** usados para orientar implementação e revisão do plugin **eslint-plugin-hardcode-detect**, sem violar as restrições de `reference/` descritas em [`AGENTS.md`](../AGENTS.md) e [`docs/limitations-and-scope.md`](../docs/limitations-and-scope.md).

## Hierarquia (complementar)

Este contrato complementa:

1. [`specs/agent-session-workflow.md`](agent-session-workflow.md) — fluxo por prompt (classificação de escopo, fases A–D).
2. [`specs/plugin-contract.md`](plugin-contract.md) — comportamento público do plugin.
3. [`specs/vision-hardcode-plugin.md`](vision-hardcode-plugin.md) — visão multi-nível (arquivo, dependências, classificação, etc.).
4. [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md) — documentação e grafo do repositório ao finalizar prompts.

## Obrigação por execução de prompt (escopo relevante)

Para **cada prompt** cujo trabalho envolva **API do ESLint**, **autoria de regras**, **RuleTester**, **flat config**, **empacotamento npm** do plugin ou **CI** que interprete documentação do ecossistema:

1. **Consultar primeiro** os arquivos em [`reference/Clippings/`](../reference/Clippings/) aplicáveis ao tópico (listar diretório, abrir arquivos por nome ou índice no `README` da pasta).
2. Se **não houver** clipping adequado ou estiver obviamente desatualizado para a tarefa:
   - Consultar a documentação **oficial** atual (ferramentas MCP de documentação do projeto, quando disponíveis, ou fonte canônica na Web).
   - **Propor ou adicionar** um novo arquivo em `reference/Clippings/` (ou atualizar o existente) **no mesmo ciclo de mudança** sempre que a decisão técnica se apoiar nesse material — para que os próximos prompts reutilizem o mesmo recorte.
3. **Nunca** importar código ou módulos de `reference/Clippings/` a partir de `packages/` (mantém-se a regra absoluta: código publicável só em `packages/eslint-plugin-hardcode-detect/`).

## Grafo do repositório

Qualquer alteração na **estrutura** de `reference/Clippings/` (novos arquivos normativos, subpastas) deve refletir em [`docs/repository-tree.md`](../docs/repository-tree.md) no mesmo ciclo, conforme [`specs/agent-documentation-workflow.md`](agent-documentation-workflow.md).

## Distinção: `Clippings` vs `legacy-snapshot`

| Pasta | Finalidade | Atualização |
|-------|------------|-------------|
| `reference/Clippings/` | Trechos da documentação **oficial** externa | Commits explícitos de sincronização/atualização de recortes |
| `reference/legacy-snapshot/` | Snapshot histórico do projeto | Apenas em PRs dedicados de snapshot, sem refatoração acidental |

## Boas práticas de mercado

- **Proveniência**: URL oficial, data e contexto em todo clipping.
- **Mínimo necessário**: copiar só o trecho que fundamenta decisões (API, assinaturas, deprecações).
- **Licença e uso justo**: preferir trechos curtos com atribuição; para textos longos, link + resumo e trecho mínimo.
- **Consistência**: alinhar com [`docs/documentation-policy.md`](../docs/documentation-policy.md) para Markdown e com o contrato do plugin para comportamento.

## Versão do documento

- **1.1.0** — referência a [`agent-session-workflow.md`](agent-session-workflow.md) na hierarquia complementar.
- **1.0.0** — introdução do contrato de Clippings e consulta obrigatória por prompt em escopo relevante.
