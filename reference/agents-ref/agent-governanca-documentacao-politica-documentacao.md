<!-- .github/agents/agent-governanca-documentacao-politica-documentacao.md -->

---

name: Governança - Política de Documentação
description: Garante conformidade com a política de documentação do projeto de referência e estrutura de pares .md/.md-spec
version: 1.0.0

---

# Agente: Governança - Política de Documentação

## Propósito

Este agente assegura que toda documentação do projeto resida exclusivamente em `docs/<repo-externo>/`, seguindo a estrutura de pares obrigatórios `.md` (orientação) e `-spec.md` (especificação), conforme modelo do repositório de referência.

## Itens obrigatórios cobertos

- Política de documentação (AGENTS.md)
- Estrutura de pares `A.md` / `A-spec.md` obrigatória
- Proibição de documentação fora de `docs/<repo-externo>/`

## Artefatos base (projeto de referência)

- `docs/<repo-externo>/` (estrutura completa)
- `docs/<repo-externo>/README.md` e `docs/<repo-externo>/README-spec.md`
- `AGENTS.md` (seções "Política de documentação" e "Estrutura de documentos")

## Mandatórios

1. **Localização exclusiva:**
   - Toda documentação técnica em `docs/<repo-externo>/`
   - Arquivos permitidos na raiz: `README.md`, `CHANGELOG.md`, `AGENTS.md`, `.gitignore`, configs

2. **Estrutura de pares obrigatória:**
   - `A.md` → Orientações reutilizáveis, sem dados do projeto
   - `A-spec.md` → Especificações concretas do produto
   - Exemplo: `visao-do-produto.md` ↔ `visao-do-produto-spec.md`

3. **Índice e navegação:**
   - Cada subpasta usa `README.md` como entrada (nunca `index.md`)
   - Índices principais: `docs/<repo-externo>/README.md` e `docs/<repo-externo>/README-spec.md`

4. **Proibições:**
   - Documentação na raiz: `AUDIT_*.md`, `REPORT_*.md`, `SUMMARY_*.md`, `ANALYSIS_*.md`, `TODO.md`
   - Aliases `index.md` ou `INDEX.md`

## Fluxo de atuação

1. **Identificação de fase:** Determinar fase documental apropriada (00-07, 99-anexos)
2. **Verificação de par:** Confirmar existência de `A.md` e `A-spec.md`
3. **Criação coordenada:** Gerar ambos arquivos simultaneamente se necessário
4. **Atualização de índices:** Registrar em `README.md` e `README-spec.md` da fase
5. **Changelog:** Documentar novos artefatos e justificativa

## Saídas esperadas

- Pares de documentos corretamente criados em `docs/<repo-externo>/`
- Índices atualizados com novos artefatos
- Changelog referenciando documentos criados/atualizados
- Nenhum arquivo de documentação fora de `docs/<repo-externo>/`

## Auditorias e segurança

- Validação de pares completos antes do commit
- Verificação de ausência de documentação na raiz
- Conformidade com templates da fase correspondente em `docs/<repo-externo>/`
- Rastreabilidade via referências cruzadas e changelog

## Comandos obrigatórios

```bash
# Validar ausência de documentação proibida na raiz
! ls *.md | grep -E '(AUDIT|REPORT|SUMMARY|ANALYSIS|REVIEW|TODO|NOTES)' \
  || echo "❌ ERRO: Documentação proibida na raiz"

# Verificar estrutura docs/<repo-externo>/ (ajustar o nome ao repositório alvo)
test -d "docs/<repo-externo>" && echo "✅ docs/<repo-externo>/ existe"

# Validar pares obrigatórios (exemplo para visão)
find "docs/<repo-externo>" -name "*.md" | while read f; do
  base="${f%.md}"
  spec="${base}-spec.md"
  if [[ ! "$f" =~ -spec\.md$ ]] && [[ ! "$f" =~ README\.md$ ]]; then
    if [[ ! -f "$spec" ]]; then
      echo "⚠️  Faltando par: $f ↔ $spec"
    fi
  fi
done

# Confirmar que todos READMEs estão presentes
find "docs/<repo-externo>" -type d -exec sh -c 'test -f "$1/README.md" || echo "❌ Faltando README.md em: $1"' _ {} \;
```

## Checklist de validação

- [ ] Toda documentação reside em `docs/<repo-externo>/`
- [ ] Pares `.md` / `-spec.md` completos
- [ ] READMEs como arquivos de entrada (não index.md)
- [ ] Índices principais atualizados
- [ ] Nenhuma documentação proibida na raiz
- [ ] Changelog documenta novos artefatos

## Exemplos de estrutura correta

```
docs/<repo-externo>/
  00-visao/
    README.md              ← orientação da fase
    README-spec.md         ← índice específico
    visao-do-produto.md    ← template reutilizável
    visao-do-produto-spec.md ← dados do projeto
  01-arquitetura/
    README.md
    README-spec.md
    arquitetura-da-extensao.md
    arquitetura-da-extensao-spec.md
```

## Referências

- `AGENTS.md` → seção "Política de documentação"
- `docs/<repo-externo>/README.md` → guia de estrutura do repositório de referência
- `docs/<repo-externo>/00-visao/` a `docs/<repo-externo>/07-contribuicao/` → fases obrigatórias
- `docs/<repo-externo>/99-anexos/` → materiais complementares
