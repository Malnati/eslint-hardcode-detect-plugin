# Fechar alteração na massa e2e Nest

Use após editar [`packages/e2e-fixture-nest`](../../packages/e2e-fixture-nest) ou [`nest-workspace.e2e.mjs`](../../packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs).

1. Reler [`specs/e2e-fixture-nest.md`](../../specs/e2e-fixture-nest.md): contagens esperadas, ordem build → teste, proibições.
2. Se mudou literais em `src/fixture-hardcodes/`, recalcule mensagens `hello-world` e `no-hardcoded-strings` (ex.: `eslint -f json` no diretório do fixture) e alinhe o objeto `EXPECTED` no e2e + a tabela no spec.
3. Rode `npm test` no pacote [`eslint-plugin-hardcode-detect`](../../packages/eslint-plugin-hardcode-detect).
4. Cumpra o fechamento geral em [`specs/agent-documentation-workflow.md`](../../specs/agent-documentation-workflow.md) se documentação normativa mudou.
