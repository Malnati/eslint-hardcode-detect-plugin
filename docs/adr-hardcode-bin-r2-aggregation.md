# ADR: CLI `bin` vs agregação R2 no processo ESLint

**Estado:** aceite  
**Contexto:** marco M5 — release e adopção; opções de desenho em [`docs/hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md) (R2, duas fases / `bin`).

## Contexto

- O plano macro prevê, para **R2** (duplicados entre ficheiros), três estratégias possíveis: estado partilhado no **mesmo processo** Node, índice prévio injectado via `settings`, ou **`bin` / duas fases** (passagem externa que constrói um índice e o consumidor seguinte aplica fixes).
- O pacote [`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect) implementa hoje **detecção R2** com índice em memória no âmbito de uma invocação `lintFiles`, usando `context.settings.hardcodeDetect` quando o flat config expõe um objecto mutável comum (ver [`docs/architecture-r2-global-index.md`](architecture-r2-global-index.md)).
- Um executável **`bin`** publicado no npm implicaria script de entrada, contrato de linha de comandos, testes de integração reais e manutenção — fora do valor entregue neste ciclo se não houver agregação de duas fases implementada.

## Decisão

1. **Não** adicionar entrada `bin` em [`packages/eslint-plugin-hardcode-detect/package.json`](../packages/eslint-plugin-hardcode-detect/package.json) neste marco.
2. O caminho **suportado e documentado** para R2 é: **mesma invocação** da API `ESLint` / CLI com config que mantém `settings.hardcodeDetect` partilhado (preset `recommended` injecta `{}`).
3. Uma futura **CLI de agregação em duas fases** (macro-plan) permanece **backlog** explícito: só deve ser empacotada com `bin` quando existir implementação completa, testes e documentação de operação **sem** mocks de integração externa (política em [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md)).

## Consequências

- Consumidores que precisem de um índice global **entre** processos ou **entre** corridas ESLint separadas devem orquestrar isso **fora** do plugin (script próprio do repositório) até haver suporte first-party — não há comando `npx eslint-plugin-hardcode-detect` neste pacote.
- Limitações de **paralelismo** ESLint vs estado R2 continuam normativas em [`docs/adr-eslint-concurrency-r2.md`](adr-eslint-concurrency-r2.md).

## Referências

- [`docs/hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md) — secção R2 e estratégias (a), (b), (c).
- [`docs/remediation-milestones/m5-remediation-release.md`](remediation-milestones/m5-remediation-release.md) — entregável `bin` opcional.
