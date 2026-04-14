# eslint-plugin-hardcode-detect

Official plugin implementation. Rule contract: [`specs/plugin-contract.md`](../../specs/plugin-contract.md); multi-level vision: [`specs/vision-hardcode-plugin.md`](../../specs/vision-hardcode-plugin.md).

The contract describes **three** rules (`hello-world`, `no-hardcoded-strings`, `standardize-error-messages`). **In this package**, the publishable build currently exports only `hello-world` and `no-hardcoded-strings`. The `standardize-error-messages` rule is in the contract (options and `messageId`s) but is **not** yet part of the publishable artifact — future implementation aligned with the spec.

## Quick start (ESLint 9 flat config)

```javascript
import { defineConfig } from "eslint/config";
import hardcodeDetect from "eslint-plugin-hardcode-detect";

export default defineConfig([
  {
    plugins: {
      "hardcode-detect": hardcodeDetect,
    },
    extends: ["hardcode-detect/recommended"],
  },
]);
```

Or enable rules manually (e.g. demo rule `hello-world`):

```javascript
rules: {
  "hardcode-detect/hello-world": "warn",
  "hardcode-detect/no-hardcoded-strings": "warn",
},
```

The plugin exposes `meta.name`, `meta.version`, and `meta.namespace` (`hardcode-detect`), per official [plugins](https://eslint.org/docs/latest/extend/plugins) documentation.

## Adopting remediation

Goal: enable **R1** (constants in the same file), **R2** (duplicates across files in the same run), or **R3** (writing to data files) with copy-pasteable steps. Exact option semantics: [`specs/plugin-contract.md`](../../specs/plugin-contract.md); detail and matrices: [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md).

1. **Start from** the `hardcode-detect/recommended` preset (injects `settings.hardcodeDetect: {}`, required for the R2 index when overriding the rule).
2. **Override** `hardcode-detect/no-hardcoded-strings` with an array `[severity, options]` as in the examples below.
3. **Secrets:** use `secretRemediationMode` according to your risk (`suggest-only` is the contract default). Summary in [Secrets, environment, and vaults](#secrets-environment-and-vaults).

### R1 remediation (`remediationMode: "r1"`)

Autofix constants in the **same** file (when context is safe for fix; otherwise only *suggestions* may apply).

```javascript
import { defineConfig } from "eslint/config";
import hardcodeDetect from "eslint-plugin-hardcode-detect";

export default defineConfig([
  {
    plugins: { "hardcode-detect": hardcodeDetect },
    extends: ["hardcode-detect/recommended"],
    rules: {
      "hardcode-detect/no-hardcoded-strings": [
        "warn",
        {
          remediationMode: "r1",
          // secretRemediationMode: "suggest-only" | "placeholder-default" | "aggressive-autofix-opt-in"
        },
      ],
    },
  },
]);
```

### R2 remediation (`remediationMode: "r2"`)

**Detection** of duplicates **across** files: the same normalized value seen in another file already processed in the **same** `lintFiles` invocation yields `messageId` `hardcodedDuplicateCrossFile`. R2 autofix (shared module) is **not** in the current implementation. Requires a mutable `settings.hardcodeDetect` object — `recommended` already injects it.

```javascript
import { defineConfig } from "eslint/config";
import hardcodeDetect from "eslint-plugin-hardcode-detect";

export default defineConfig([
  {
    plugins: { "hardcode-detect": hardcodeDetect },
    extends: ["hardcode-detect/recommended"],
    rules: {
      "hardcode-detect/no-hardcoded-strings": ["warn", { remediationMode: "r2" }],
    },
  },
]);
```

### R3 remediation (`remediationMode: "r3"`)

Write / merge entries into **JSON** or **YAML** files listed in `dataFileTargets` (paths relative to ESLint `cwd`). With `dataFileTargets: []` there is no write — detection only.

```javascript
import { defineConfig } from "eslint/config";
import hardcodeDetect from "eslint-plugin-hardcode-detect";

export default defineConfig([
  {
    plugins: { "hardcode-detect": hardcodeDetect },
    extends: ["hardcode-detect/recommended"],
    rules: {
      "hardcode-detect/no-hardcoded-strings": [
        "warn",
        {
          remediationMode: "r3",
          dataFileTargets: ["config/strings.json", "config/strings.yml"],
          dataFileFormats: ["json", "yaml", "yml"],
          dataFileMergeStrategy: "merge-keys",
        },
      ],
    },
  },
]);
```

### R2 tooling and limits

- **No `bin` in this package:** two-phase aggregation via a dedicated CLI is **not** part of this release; the supported design is in-process index + `settings.hardcodeDetect` (see [`docs/adr-hardcode-bin-r2-aggregation.md`](../../docs/adr-hardcode-bin-r2-aggregation.md)).
- **ESLint parallelism:** with multithreaded lint, the R2 index may be incomplete; see [`docs/adr-eslint-concurrency-r2.md`](../../docs/adr-eslint-concurrency-r2.md).

## Rules

The `hardcode-detect/recommended` preset applies only `no-hardcoded-strings`. The `hello-world` rule is a **demo** and is **not** part of `recommended` (avoids noise in real projects).

| ID | Description |
|----|-------------|
| `hello-world` | Minimal demo (one warning per file); see [`docs/rules/hello-world.md`](docs/rules/hello-world.md). |
| `no-hardcoded-strings` | Discourages string literals with length ≥ 2; see [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md). |
| `standardize-error-messages` | Contract and reference page; not yet exported from the package; see [`docs/rules/standardize-error-messages.md`](docs/rules/standardize-error-messages.md). |

With `remediationMode: "r1"` on `no-hardcoded-strings`, the rule may apply **R1** remediation (constants at the top of the same file). **Autofix** policy (`eslint --fix` / RuleTester `output`) vs **suggestions-only** (`suggestions` without `output`) and error-only cases is documented in [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md), with P-SVF-* matrix and S-R1-* scenarios mirrored in [`tests/no-hardcoded-strings-r1.test.mjs`](tests/no-hardcoded-strings-r1.test.mjs). Normative proof criteria (P-SVF → assertion type; e2e role in the `npm test` chain): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md). Test reviewer sign-off (A2): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md). Test runner execution evidence (`npm test` gate; M1-A2-08): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md`](../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md).

To validate the package from the monorepo root: `npm test -w eslint-plugin-hardcode-detect`.

## Secrets, environment, and vaults

Literals that look like tokens or secrets (rule heuristic, aligned with L1 in [`docs/hardcoding-map.md`](../../docs/hardcoding-map.md)) must be handled carefully: **do not** commit sensitive values; prefer **environment variables** and **vaults** or your platform’s secret management (official cloud / CI vendor documentation).

- **Repository policy:** we do not simulate external vendors or store real credentials in tests — see [`specs/agent-integration-testing-policy.md`](../../specs/agent-integration-testing-policy.md).
- **Plugin:** the `secretRemediationMode` option on `no-hardcoded-strings` controls whether R1 autofix may copy the plaintext value (`aggressive-autofix-opt-in`), use a stable placeholder (`placeholder-default`), or keep the safe default (`suggest-only`). Detail and sentinel: [`specs/plugin-contract.md`](../../specs/plugin-contract.md) and [`docs/rules/no-hardcoded-strings.md`](docs/rules/no-hardcoded-strings.md).
- **Recommended reading (external):** [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) and your runtime’s official documentation (Node.js `process.env`, Kubernetes secrets management, etc.).

## Development

- `npm run build` — compile `src/` to `dist/`.
- `npm run lint` — ESLint on the plugin code (`eslint-plugin-eslint-plugin`, `eslint-plugin-n`, `typescript-eslint`).
- `npm test` — compile and run tests with `RuleTester` + `node:test` + e2e smoke ([`e2e/hello-world.e2e.mjs`](e2e/hello-world.e2e.mjs), [`e2e/nest-workspace.e2e.mjs`](e2e/nest-workspace.e2e.mjs); see next section).

### Nest e2e smoke

Per [`specs/plugin-contract.md`](../../specs/plugin-contract.md) (Compatibility / e2e smoke), the **NestJS fixture** is the auxiliary workspace [`packages/e2e-fixture-nest`](../../packages/e2e-fixture-nest) (real Nest app). The runner is [`e2e/nest-workspace.e2e.mjs`](e2e/nest-workspace.e2e.mjs) — path from repo root: `packages/eslint-plugin-hardcode-detect/e2e/nest-workspace.e2e.mjs`.

That file covers two smoke paths against the fixture flat config:

1. **Detection path (`fix: false`)**: instantiates ESLint with `cwd` on the Nest workspace, calls `lintFiles` on `src/fixture-hardcodes/**/*.ts`, and asserts stable counts for `hardcode-detect/hello-world` and `hardcode-detect/no-hardcoded-strings`.
2. **Autofix path (`fix: true`)**: creates one controlled temporary file (`src/autofix-smoke.e2e.ts`) inside the Nest fixture, applies a local `overrideConfig` (`remediationMode: "r1"`) for that smoke file, runs `ESLint({ fix: true })` plus `ESLint.outputFixes(results)`, and verifies that `no-hardcoded-strings` is fixed while preserving the expected `hello-world` report. The temporary file is removed in the test `finally` block.

Norms and count table: [`specs/e2e-fixture-nest.md`](../../specs/e2e-fixture-nest.md).

Requires **Node.js ≥ 22** (aligned with CI and the package `engines` field).

Install dependencies from the monorepo root (`npm install`) or only in this package, per your environment policy.
