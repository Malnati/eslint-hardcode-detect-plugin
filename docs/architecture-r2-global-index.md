# Arquitectura: índice R2 global no âmbito do lint

Âncora: [`docs/remediation-milestones/m2-remediation-r2-global.md`](remediation-milestones/m2-remediation-r2-global.md) (marco M2, Camada A).

## Papel (arquitecto)

- **CI / `npm test`**: o pacote [`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect) executa build (`tsc`), RuleTester e e2e na mesma sequência; os testes R2 usam a API `ESLint` com dois ficheiros temporários ou a fixture `e2e/fixtures/r2-dup/`.
- **Limites**: o índice de literais normalizados para duplicados **entre ficheiros** depende de estado partilhado na mesma invocação `lintFiles` (ver [`docs/adr-eslint-concurrency-r2.md`](adr-eslint-concurrency-r2.md)).
- **Config recomendado**: o plugin injecta `settings.hardcodeDetect: {}` no config `recommended` para permitir anexar o `Map` do índice ao objecto `settings` fundido pelo ESLint.

## O que não faz este documento

- Não altera código em `packages/`; referencia o contrato em [`specs/plugin-contract.md`](../specs/plugin-contract.md) e a implementação em [`packages/eslint-plugin-hardcode-detect/src/rules/no-hardcoded-strings.ts`](../packages/eslint-plugin-hardcode-detect/src/rules/no-hardcoded-strings.ts).
