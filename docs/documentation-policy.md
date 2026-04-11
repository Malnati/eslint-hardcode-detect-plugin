# Política de documentação Markdown (GitHub)

Boas práticas alinhadas a repositórios públicos no GitHub e leitura em web e clone local.

## Princípios

1. **Um README na raiz** — ponto de entrada: propósito, links para docs e specs, estrutura resumida.
2. **Docs em `docs/`** — conteúdo que não cabe no README; nomes em `kebab-case` ou `snake_case` consistente (este projeto usa `kebab-case`).
3. **Specs em `specs/`** — contratos normativos (comportamento, fluxos de agente); não misturar com tutoriais longos.
4. **CONTRIBUTING.md na raiz** — expectativas para quem altera o repo (incluindo agentes).
5. **Links relativos** — preferir `[texto](docs/arquivo.md)` em vez de URLs absolutas ao próprio repositório, para branches e forks.
6. **Cabeçalhos** — hierarquia `##` → `###`; um único título `#` por página (exceto README onde o GitHub já renderiza o nome do repo).
7. **Código** — usar cercas com linguagem: ` ```ts `, ` ```bash `, etc.
8. **Tabelas** — usar para matrizes pequenas; evitar tabelas muito largas em mobile (listas são alternativa).
9. **Imagens** — preferir SVG ou PNG em `docs/assets/` se necessário; referenciar com caminho relativo.
10. **Acessibilidade** — texto de link descritivo (“ver contrato em specs/”) em vez de “clique aqui”.

## O que evitar

- Segredos, tokens ou dados pessoais em Markdown versionado.
- Duplicar o mesmo parágrafo em muitos arquivos sem um link “fonte da verdade”.
- Documentar código gerado ou pastas listadas em `.gitignore` como se fossem parte do produto.

## Manutenção por agentes

Ao alterar estrutura de pastas ou responsabilidades, atualizar [`repository-tree.md`](repository-tree.md) e, se aplicável, [`limitations-and-scope.md`](limitations-and-scope.md).
