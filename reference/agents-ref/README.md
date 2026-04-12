<!-- .github/agents/README.md -->

# Agentes MBRA

Este diretório reúne agentes de governança, compliance e engenharia usados para padronizar instruções de IA nos repositórios MBRA.

## Uso neste repositório (`eslint-plugin-hardcode-detect`)

Estes arquivos são **referência** (portfólio reutilizável), **não** substituem [`AGENTS.md`](../../AGENTS.md) nem os contratos em [`specs/`](../../specs/). Antes de aplicar caminhos como `docs/rup/`, `shared/constants.*` ou relatórios em `docs/review/`, leia o mapeamento normativo em **[`specs/agent-mbra-reference-agents.md`](../../specs/agent-mbra-reference-agents.md)**. A skill do Cursor [`mbra-reference-agents`](../../.cursor/skills/mbra-reference-agents/SKILL.md) descreve o procedimento.

## Como usar (projetos MBRA genéricos)

1. Selecione os agentes aplicáveis ao seu projeto.
2. Referencie-os no arquivo principal de instruções (por exemplo, `AGENTS.md` ou equivalente).
3. Adapte descrições e requisitos conforme o contexto do projeto consumidor.

## Organização

- Governança: requisitos gerais, documentação, rastreabilidade, mudanças e estrutura.
- Compliance: ética e segurança.
- Engenharia: automação, docker, convenções de código, higiene, DRY, makefile, hardcoded e cabeçalho de caminho.
- Release: diretrizes de branches.

## Índice de agentes

- <code>agent-compliance-etica-seguranca.md</code>: garante conformidade ética, LGPD e políticas de segurança/marketplaces.
- <code>agent-engineering-automacao-scripts.md</code>: valida automação e scripts; abre issues para violações em PRs.
- <code>agent-engineering-cabecalho-caminho.md</code>: exige cabeçalho de caminho no topo dos arquivos.
- <code>agent-engineering-codigo-convencoes.md</code>: aplica convenções de código e extração de hardcoded para constantes.
- <code>agent-engineering-codigo-higiene.md</code>: remove código morto e resíduos após refatorações.
- <code>agent-engineering-ddl-seeds-compliance.md</code>: padroniza DDL, seeds, UUIDs e comentários de banco.
- <code>agent-engineering-docker-operacional.md</code>: garante cadeia de configuração e boas práticas Docker operacionais.
- <code>agent-engineering-docker-stack.md</code>: valida docker-stack completo por app e defaults de variáveis.
- <code>agent-engineering-hardcoded.md</code>: elimina hardcoded e centraliza constantes compartilhadas.
- <code>agent-engineering-makefile-boas-praticas.md</code>: aplica padrões de Makefile e indentação com TAB.
- <code>agent-engineering-no-aesthetic-changes.md</code>: bloqueia alterações estéticas não solicitadas.
- <code>agent-engineering-reuso-dry.md</code>: reforça DRY e reutilização de lógica.
- <code>agent-governanca-change-changelog-obrigatorio.md</code>: exige CHANGELOGs por mudança com formato padrão.
- <code>agent-governanca-documentacao-politica-documentacao.md</code>: impõe documentação apenas em <code>docs/rup/</code> com pares .md/.md-spec.
- <code>agent-governanca-estrutura-diretorios.md</code>: preserva estrutura de diretórios e artefatos obrigatórios.
- <code>agent-governanca-planos-mudanca-padrao.md</code>: aplica padrão obrigatório para planos de mudança.
- <code>agent-governanca-rastreabilidade-conformidade.md</code>: garante rastreabilidade e conformidade com requisitos/riscos.
- <code>agent-governanca-requisitos-gerais.md</code>: valida requisitos gerais e responsabilidades do projeto.
- <code>agent-governanca-requisitos-registro-novos.md</code>: reservado para requisitos de registro; conteúdo pendente.
- <code>agent-release-branches-governanca.md</code>: define convenções de branches e aprovações obrigatórias.
- <code>my-agent.md</code>: exemplo de agente que referencia <code>AGENTS.md</code> e RUP.

## Observações

- Mantenha os agentes genéricos e reutilizáveis.
- Atualize este índice quando novos agentes forem adicionados.
