# Política de documentação Markdown (GitHub)

Boas práticas alinhadas a repositórios públicos no GitHub e leitura em web e clone local.

## Princípios

1. **Um README na raiz** — ponto de entrada: propósito, links para docs e specs, estrutura resumida.
2. **Docs em `docs/`** — conteúdo que não cabe no README; nomes em `kebab-case` ou `snake_case` consistente (este projeto usa `kebab-case`).
3. **Specs em `specs/`** — contratos normativos (comportamento, fluxos de agente); não misturar com tutoriais longos.
4. **CONTRIBUTING.md na raiz** — expectativas para quem altera o repo (incluindo agentes).
5. **Links relativos** — preferir `[texto](docs/arquivo.md)` em vez de URLs absolutas ao próprio repositório, para branches e forks.
5b. **Caminhos relativos à raiz do clone** — ao citar, listar ou exemplificar arquivos e pastas **deste** repositório (documentação, respostas, exemplos, prompts a sub-agentes), usar **somente** caminhos relativos à raiz (ex.: `packages/eslint-plugin-hardcode-detect/src/...`, `specs/plugin-contract.md`). Não usar caminhos absolutos de máquina (`/Users/...`, `C:\...`, etc.) nesses contextos.
6. **Cabeçalhos** — hierarquia `##` → `###`; um único título `#` por página (exceto README onde o GitHub já renderiza o nome do repo).
7. **Código** — usar cercas com linguagem: ` ```ts `, ` ```bash `, etc.
8. **Tabelas** — usar para matrizes pequenas; evitar tabelas muito largas em mobile (listas são alternativa).
9. **Imagens** — preferir SVG ou PNG em `docs/assets/` se necessário; referenciar com caminho relativo.
10. **Acessibilidade** — texto de link descritivo (“ver contrato em specs/”) em vez de “clique aqui”.

## Ferramentas do ambiente vs comunicação versionada

Ferramentas do editor ou APIs de leitura de arquivos podem exigir ou preferir paths absolutos no **runtime** para desambiguar. Isso **não** substitui o princípio 5b: tudo o que for **commitado** ou **comunicado** ao usuário sobre a localização de artefatos neste repo deve usar caminhos **relativos à raiz do clone**.

## Exceções ao princípio 5b

- **Trechos literais** em [`reference/Clippings/`](../reference/Clippings/) (documentação oficial espelhada): não reescrever exemplos só para trocar paths de exemplo vindos da fonte.
- **Semântica de API** em que path absoluto é requisito do runtime (ex.: ESLint `cwd` deve ser absoluto; URIs `file://` em especificações): documentar o fato, sem inventar path de máquina do autor.

## O que evitar

- Segredos, tokens ou dados pessoais em Markdown versionado.
- Duplicar o mesmo parágrafo em muitos arquivos sem um link “fonte da verdade”.
- Documentar código gerado ou pastas listadas em `.gitignore` como se fossem parte do produto.
- Caminhos absolutos de sistema de arquivos ao referir arquivos **deste** repositório em texto normativo ou exemplos internos (salvo as exceções acima).

## Manutenção por agentes

Ao alterar estrutura de pastas ou responsabilidades, atualizar [`repository-tree.md`](repository-tree.md) e, se aplicável, [`limitations-and-scope.md`](limitations-and-scope.md). O ciclo completo por prompt (escopo, Clippings, fechamento com grafo e Git) está em [`../specs/agent-session-workflow.md`](../specs/agent-session-workflow.md).
