# Limitações, escopo e restrições

## Escopo do produto

**eslint-plugin-hardcode-detect** é um plugin ESLint focado em **detecção e governança de valores hardcoded** (strings e mensagens), evoluindo para análise em **vários níveis** (por arquivo, dependências, classificação, ordenação, severidade/níveis). O detalhamento da visão está em [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md).

## Restrições de repositório

| Restrição | Descrição |
|-----------|-----------|
| `reference/` | Não importar nem depender em código de produção; snapshots apenas documentais. |
| Código publicável | Somente sob `packages/eslint-plugin-hardcode-detect/`. |
| Contrato antes do código | Mudanças de comportamento público exigem atualização de `specs/plugin-contract.md` (e visão, se macro). |
| Segredos | Não commitar credenciais; variáveis de ambiente e artefatos ignorados. |

## Limitações atuais da implementação

- O pacote em `packages/` está em **construção**; regras descritas no contrato podem estar parcialmente implementadas. Consulte `specs/plugin-contract.md` e o código-fonte.

## Limitações conhecidas do ecossistema ESLint

- Regras ESLint operam por **arquivo** com o AST disponível; análise “por dependências” (grafo entre pacotes) pode exigir ferramentas complementares ou configuração explícita (ver visão).

## Política de documentação

Alterações estruturais devem refletir em [`repository-tree.md`](repository-tree.md). Ver [`documentation-policy.md`](documentation-policy.md).
