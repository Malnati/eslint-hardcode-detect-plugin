# Política: testes de integração sem mocks; sandboxes dos provedores

Este documento define o comportamento **normativo** para agentes de IA e mantenedores quando o trabalho envolver **integrações externas** (registries npm, publicação de pacotes, servidores MCP, OAuth, webhooks, APIs de terceiros, etc.). Complementa [`agent-ia-governance.md`](agent-ia-governance.md) e [`agent-session-workflow.md`](agent-session-workflow.md).

## Objetivo

Evitar mocks, stubs, fakes ou simuladores ad hoc no código e na documentação de planeamento deste repositório; em vez disso, **validar integrações** com **ambientes de sandbox, staging ou documentação oficial** do provedor do serviço.

## Proibições

No âmbito deste repositório **não** se deve:

- Implementar ou propor **mocks, stubs, fakes** ou **servidores locais que imitem** serviços externos para substituir o provedor real em validação de integração.
- Descrever em specs de roadmap, CI planejado ou issues **estratégias baseadas em mock** para registry, publicação, MCP ou credenciais (ex.: “registry simulado”, “servidor stub”).
- Adicionar **dependências** cuja finalidade seja **apenas** simular serviços externos para testes de integração (além do que já vier transitivamente de ferramentas existentes).

## Obrigação (alternativa aos mocks)

Quando for necessário testar integração com um serviço externo:

1. Usar o **sandbox**, **ambiente de testes** ou **fluxo documentado pelo provedor** (ex.: registry de desenvolvimento, conta de testes, política de publicação em modo dry-run quando existir e for oficial).
2. Seguir a **documentação oficial** do produto (npm/GitHub Packages, MCP, Docker registry, etc.) para credenciais **fora do repositório** e variáveis de ambiente no runtime (sem commitar segredos).
3. Para automação futura em CI: documentar **passos reprodutíveis** que apontem para esses ambientes, não para substitutos mockados no código do repo.

## Exceções (não confundir com “mock de integração”)

- **RuleTester**, **API `ESLint`**, ficheiros em disco e **fumaça e2e** que invocam o motor ESLint real são testes **legítimos** do plugin; **não** são substitutos de serviços externos nem entram na proibição acima.
- **Dependências transitivas** de runners de teste (ex.: pacotes internos referenciados por Jest no fixture auxiliar) **não** constituem, por si só, violação desta política; **não** introduzir mocks manuais nem bibliotecas novas só para simular registry/MCP.

## Clippings (`reference/Clippings/`)

Ficheiros em [`reference/Clippings/`](../reference/Clippings/) são **recortes literais** da documentação oficial de terceiros. Podem conter palavras como “mockup” em exemplos de UI ou prompts; isso **não** prescreve uso de mocks neste projeto. **Não** alterar Clippings só para remover terminologia colateral; ao aplicar ideias ao código deste repo, seguir **esta política**.

## Conflito com o portfólio `reference/agents-ref/`

Se um ficheiro em [`reference/agents-ref/`](../reference/agents-ref/) sugerir mocks de integração, prevalece **este spec** — ver substituições em [`agent-reference-agents.md`](agent-reference-agents.md).

## Versão do documento

- **1.0.0** — política inicial: integrações via sandbox do provedor; sem mocks de serviço no repo.
