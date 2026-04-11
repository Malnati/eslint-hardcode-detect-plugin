# Visão: detecção de hardcode em múltiplos níveis

Este documento descreve a **direção do produto** para o plugin ESLint **eslint-plugin-hardcode-detect**. Não substitui o contrato normativo imediato em [`plugin-contract.md`](plugin-contract.md); funciona como **roadmap** e alinhamento entre mantenedores e agentes.

## Objetivo

Reduzir strings e valores fixos inadequados no código, com relatórios **classificados**, **ordenados** e com **níveis** de severidade configuráveis, evoluindo de análise local (arquivo) para visões mais amplas quando viável no ecossistema ESLint.

## Dimensões planejadas

| Dimensão | Descrição |
|----------|-----------|
| Por arquivo | Regras AST escopadas ao arquivo (baseline; já alinhado ao contrato atual). |
| Por dependências | Identificar padrões ligados a imports/pacotes (ex.: mensagens repetidas por módulo), quando tecnicamente suportado. |
| Classificados | Categorias de hardcode (UI, erro, log, config) com opções de regra. |
| Ordenados | Relatórios e opções que permitam priorizar correções (ex.: por severidade ou categoria). |
| Nivelados | Severidades ESLint (`off`/`warn`/`error`) e níveis de “gravidade” de negócio opcionais via schema de opções. |

## Relação com o contrato atual

As regras `no-hardcoded-strings` e `standardize-error-messages` são a **base**. A regra `hello-world` é apenas **demonstração** para validar o carregamento do plugin; não entra no roadmap funcional de hardcode. Novas regras ou opções devem atualizar `plugin-contract.md` e este documento quando afetarem a visão macro.

## Versão

- **0.2.0** — distinção explícita da regra de demonstração `hello-world` em relação à base de produto.
- **0.1.0** — primeira definição da visão multi-nível.
