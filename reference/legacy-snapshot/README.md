# Legacy snapshot (v0)

Conteúdo congelado para **referência**: exemplos de regras ESLint em arquivo local, configuração flat de exemplo, composite GitHub Action e script em `assets/run.sh` compatível com `action.yml`.

## Política

- **Não importar** estes módulos a partir de `packages/` nem de configs de produção.
- **Não** tratar este diretório como dependência de build ou runtime.
- Para evoluir o plugin oficial, implementar em [`packages/eslint-plugin-hardcode-detect`](../../packages/eslint-plugin-hardcode-detect) conforme [`specs/plugin-contract.md`](../../specs/plugin-contract.md).

## Layout

| Caminho | Descrição |
|---------|-----------|
| `eslint-hardcode-sentinel.mjs` | Plugin de exemplo: regra `no-hardcoded-strings`. |
| `eslint-local-rules.mjs` | Plugin de exemplo: regra `standardize-error-messages`. |
| `eslint.config.mjs` / `eslint.config.mjs.template` | Exemplos de flat config consumindo os plugins locais. |
| `action.yml` | Composite action “Ops ESLint” (referência). |
| `assets/run.sh` | Script invocado pela action; `repo_root` resolve via `GITHUB_WORKSPACE` ou raiz do Git. |

A action de produção no repositório está em [`.github/actions/ops-eslint`](../../.github/actions/ops-eslint).
