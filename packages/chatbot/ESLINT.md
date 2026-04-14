# ESLint Integration Report (`chatbot`)

## Context

- Date/time: `2026-04-14 14:41:19 -03`
- Subtree import: `packages/chatbot` from `https://github.com/tookyn/chatboot.git` (`main`)
- Subtree commit observed via `git log -- packages/chatbot`:
  - `c30434f5c2409a1e3df474c6dc553288789a468a` (imported through subtree)

## Effective tool versions

- Node.js: `v22.14.0`
- npm: `10.9.2`
- ESLint (`packages/chatbot/api`): `v9.39.4`
- `eslint-plugin-hardcode-detect` (`packages/chatbot/api`): `0.2.5` (installed from npm latest)

## Executed commands

In `packages/chatbot/api`:

1. `npm install -D eslint@latest @eslint/js@latest typescript-eslint@latest globals@latest eslint-plugin-hardcode-detect@latest`
2. `npm install -D eslint@^9 @eslint/js@^9` (compatibility pin to ESLint 9)
3. `npm run build`
4. `npm run lint`

Support checks:

1. `npx eslint -v`
2. `npm ls eslint-plugin-hardcode-detect --depth=0`
3. `npx eslint "{src,apps,libs,test,e2e}/**/*.ts" -f json` (for warning aggregation)

## Results

### `api` (`packages/chatbot/api`)

- Build: **PASS**
  - `npm run build` succeeded and executed the original rotate script.
- Lint: **PASS with warnings**
  - Exit code: `0`
  - Total findings: `786` warnings, `0` errors
  - Top warning rules:
    - `hardcode-detect/no-hardcoded-strings`: `785`
    - `null`: `1` (warning without `ruleId`, reported by ESLint output)

### `frontend`

- Status: **NOT APPLICABLE in imported subtree**
- Reason: the current remote `main` imported into `packages/chatbot` contains `api/` but no `monolito/frontend` directory.

## Notes

- The lint configuration was migrated to flat config in `packages/chatbot/api/eslint.config.mjs`.
- `npm run lint` was configured as non-destructive and `npm run lint:fix` was added for optional auto-fix usage.
