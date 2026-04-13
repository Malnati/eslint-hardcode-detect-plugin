# Evidência A2 — rascunho de notas de release (M5)

Preenchido conforme [`A2-rascunho-notas-release.md`](../A2-rascunho-notas-release.md). Versão alvo e bump: [`M5-semver-decision.md`](M5-semver-decision.md) (A1).

## Título sugerido (GitHub Release)

`eslint-plugin-hardcode-detect v0.1.0` — primeira publicação npm planeada (marco M5, *release candidate*)

## Destaques

- **Primeira versão publicável** na linha `0.x` (bump **minor** `0.0.0` → `0.1.0`); ver justificativa em [`M5-semver-decision.md`](M5-semver-decision.md).
- **Requisitos de runtime:** Node.js `>=22`; **ESLint** `>=9` com **flat config** (`eslint.config.*`). Comportamento público normativo: [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md).
- **Regras expostas** no pacote ([`packages/eslint-plugin-hardcode-detect/src/index.ts`](../../../../../packages/eslint-plugin-hardcode-detect/src/index.ts)):
  - `hardcode-detect/hello-world` — regra de demonstração (um relatório por ficheiro); **não** entra no preset `recommended`.
  - `hardcode-detect/no-hardcoded-strings` — avisa sobre literais de string com comprimento ≥ 2 (comportamento descrito no contrato).
- **Preset `recommended`:** aplica apenas `hardcode-detect/no-hardcoded-strings` como `warn` (evita ruído da regra demo em projetos reais).
- **Testes:** RuleTester em `tests/`; fumaça e2e com API `ESLint` — fixture mínima Hello World e massa NestJS em [`packages/e2e-fixture-nest`](../../../../../packages/e2e-fixture-nest) (ver [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md)).
- **Contrato vs implementação:** a regra `standardize-error-messages` está especificada em [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md), mas **ainda não** está registada em `rules` no `index` do pacote — gap de roadmap, sem impacto de *breaking change* para consumidores npm antes da primeira publicação (detalhe em A1).

## Issues / PRs

Não foi possível listar PRs/issues numerados via `gh` ou API pública neste ambiente. O intervalo abaixo cobre **todo o histórico** que toca `packages/eslint-plugin-hardcode-detect/` desde o primeiro commit até `HEAD` à data deste rascunho; revisão humana pode acrescentar links de PR do GitHub quando existirem.

| Referência | Descrição curta |
|------------|-----------------|
| [Compare `f46e906`…`main`](https://github.com/Malnati/eslint-hardcode-detect-plugin/compare/f46e906...main) | Intervalo completo (primeiro commit do repositório → ponta atual de `main`). Para um *diff* congelado no dia do *release*, substituir `main` pelo SHA da tag ou do commit de publicação. |
| [Commit `f5f047e`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/f5f047e) | Reestruturação do monorepo e governança Git para agentes (inclui criação do workspace do plugin). |
| [Commit `f99f2ec`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/f99f2ec) | Documentação Markdown e grafo do repositório. |
| [Commit `37debe9`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/37debe9) | `feat(plugin)`: regras `hello-world` e `no-hardcoded-strings` + *self-lint*. |
| [Commit `a6271ae`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/a6271ae) | `feat(plugin)`: fumaça e2e Hello World via API ESLint. |
| [Commit `e003bd2`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/e003bd2) | `test(e2e)`: fixture Nest e teste `nest-workspace`. |
| [Commit `c0e81ed`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/c0e81ed) | `docs(plugin)`: README do pacote alinhado ao contrato. |
| [Commit `eaaaef1`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/eaaaef1) | `docs(plugin)`: documentação por regra e matriz de lacunas. |
| [Commit `41ed9c7`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/41ed9c7) | `docs(plugin)`: caminho do runner e2e Nest e ligações no README. |
| [Commit `e5fbca9`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/e5fbca9) | `docs(governance)`: mensagens de falha em três partes e catálogo (contexto de contrato; não altera regras exportadas). |
| [Commit `0bd7468`](https://github.com/Malnati/eslint-hardcode-detect-plugin/commit/0bd7468) | `docs(governance)`: prefixos HCD-ERR-* e níveis de conformidade (contexto de contrato). |

## Upgrade / breaking

- **Sem alterações *breaking* para utilizadores de versões npm anteriores** — não houve pacote publicado no registry antes desta versão alvo.
- A série **`0.y.z`** continua reservada a evolução compatível na linha `0.x`; mudanças futuras de API ou de regras exportadas devem ser comunicadas nas notas seguintes e no [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md).
