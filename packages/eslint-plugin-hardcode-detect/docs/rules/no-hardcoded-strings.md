# `no-hardcoded-strings`

Product rule (`problem`): discourages hardcoded string literals in code, except very short trivial strings.

- On `Literal` nodes whose value is `string`, if `value.length >= 2`, the rule reports with the configured message (equivalent to: avoid string literal; move to constants or a catalog). Strings shorter than length 2 are ignored.
- **`callSiteExceptions`** (optional, default `[]`): list of callee names in the same style as `loggers` in [`standardize-error-messages`](./standardize-error-messages.md) / [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) — e.g. `console.log`, `console.debug`, `logger.warn`, or a bare identifier such as `debug`. When the list is non-empty, a string literal is **not** reported if it is the **first argument** of a `CallExpression` whose callee serializes to one of those names (non-computed member chain or simple identifier; optional chaining on the callee is normalized, e.g. `console?.log` matches `console.log`). Such literals are also excluded from the R2 cross-file index and from R3 data-file writes. Computed calls like `console["log"](...)` do not match.
- **Messages**: `hardcoded`, `hardcodedEnvDefault`, and `hardcodedDuplicateCrossFile` emit content in three lines with `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, and `[HCD-ERR-OPS]`; `envDefaultLiteralPolicy: "report-separate"` still selects `hardcodedEnvDefault` for `process.env` *fallback* literals (see below). The strings are maintained in [`src/rules/no-hardcoded-strings.messages.json`](../../src/rules/no-hardcoded-strings.messages.json) and published next to the compiled rule in `dist/rules/`.
- Part of the plugin `recommended` preset (`hardcode-detect/recommended`).

The full vocabulary of options planned in the repository (including R2/R3 tracks and `secretRemediationMode`) is in [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md). **In this package**, the automatic remediation described below applies to the **R1** track with `remediationMode: "r1"` and the subset of options already supported in the rule (see schema in `src/rules/no-hardcoded-strings.ts`).

---

## R2 detection (`remediationMode: "r2"`)

- **No R1 autofix** (same as `off` for remediation in the same file).
- With the **same normalized value** (string value + env-fallback flag, aligned with R1) in **more than one file** in the same `lintFiles` invocation, files processed **after** the first with that value get `messageId` **`hardcodedDuplicateCrossFile`** instead of `hardcoded` / `hardcodedEnvDefault` (the first file keeps the base report up to that point).
- The shared index uses `settings.hardcodeDetect` (the `recommended` preset injects a mutable empty object). **ESLint parallelism:** see [`docs/adr-eslint-concurrency-r2.md`](../../../../docs/adr-eslint-concurrency-r2.md).
- Tests: [`tests/no-hardcoded-strings-r2.test.mjs`](../../tests/no-hardcoded-strings-r2.test.mjs), e2e [`e2e/r2-multi-file.e2e.mjs`](../../e2e/r2-multi-file.e2e.mjs).

---

## R3 remediation (`remediationMode: "r3"`)

- **No R1 autofix** (same as `off` for constants in the same file).
- With **non-empty `dataFileTargets`** and source path not excluded by the same rules that limit R1 autofix (`remediationIncludeGlobs` / `remediationExcludeGlobs`, “risky” path, likely secret), on `Program:exit` the rule **writes** (merges) eligible literals into listed JSON/YAML files under `hardcodeDetect.strings`, with stable key names across files via `settings.hardcodeDetect`. With **`dataFileTargets: []`**, there is no write — detection only.
- **Formats and merge:** `dataFileFormats`, `dataFileMergeStrategy`; paths relative to ESLint `cwd` (see [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md)).
- Utility tests: [`tests/r3-data-file-writers.test.mjs`](../../tests/r3-data-file-writers.test.mjs); e2e [`e2e/r3-data-files.e2e.mjs`](../../e2e/r3-data-files.e2e.mjs).

---

## R1 remediation (`remediationMode: "r1"`)

With R1 active, the rule may **inject constants at the top of the same file** and replace occurrences in the same `SourceCode`, subject to globs, path risk, and secret heuristics (see matrix).

### Semantics in ESLint and RuleTester

| Test evidence | Meaning for the user |
|---------------|----------------------|
| Expected `output` | Autofix compatible with `eslint --fix` on that report. |
| `suggestions` **without** `output` on the same report | Suggest-only; the user applies manually if desired. |
| Only `errors` (no `output` or `suggestions` when policy offers no remediation) | Detection without R1-aligned autofix or suggestion (e.g. literal classified as likely secret with no other safe targets for the fix). |

With `remediationMode: "off"`, detection remains; there is no R1 autofix (see **S-R1-04** in the suite).

### Risk policy matrix (P-SVF-*) → outcome

Each row links the business criterion [A2](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md) to **reproduced** behavior in implementation and tests. Priority on overlap: glob exclusion and secret candidates override the fix *happy path* when both apply.

| ID | Context | Outcome (current implementation) | Suite scenarios |
|----|---------|-----------------------------------|-------------------|
| P-SVF-01 | Application literal without likely secret, path not excluded, not “risky”, inclusion satisfied | R1 autofix (`output`) | S-R1-01, S-R1-02, S-R1-03 |
| P-SVF-02 | `remediationExcludeGlobs` matches file path | No R1 autofix; report remains; **suggest** offered when at least one safe target exists for the suggested fix | S-R1-05 |
| P-SVF-03 | Non-empty `remediationIncludeGlobs` | Autofix only if path is included; otherwise no autofix, with **suggest** as in P-SVF-02 | S-R1-06 |
| P-SVF-04 | Secret candidate (heuristic: length and alphanumeric charset; see code) | No autofix or **suggestions** when there are no safe targets to build the suggested fix | “Likely secret” case in [`no-hardcoded-strings-r1.test.mjs`](../../tests/no-hardcoded-strings-r1.test.mjs) |
| P-SVF-05 | `process.env` *fallback* literal (`??` / `||`) | Depends on `envDefaultLiteralPolicy` (table below) | S-R1-07 |
| P-SVF-06 | “i18n” files (e.g. `.i18n.` in path) | No autofix for risky path; **suggest** if applicable | S-R1-05 (example `strings.i18n.ts` + exclude); path heuristic aligns i18n to *suggest-only* |
| P-SVF-07 | Tests / fixtures (e.g. `.test.`, `.spec.`, `__tests__`, `test/`) | No autofix; **suggest** if applicable | S-R1-08 |
| P-SVF-08 | Other paths or semantic strings where fix is not neutral | *Suggest-only* or glob exclusion per configuration; detail aligned with **S-R1-08** and extensible path heuristic | S-R1-08 |

**“Risky” paths (implementation):** no R1 autofix; *suggest* may apply. Includes, among others, `__tests__/`, `/test/`, `.test.`, `.spec.`, `.i18n.` in the relative path (see `looksRiskyFilePath` in `src/rules/no-hardcoded-strings.ts`).

### `envDefaultLiteralPolicy`

Literals that are `process.env` *fallbacks* with `??` or `||` are handled per policy:

| Value | Behavior reproduced in the suite |
|-------|----------------------------------|
| `"ignore"` | Does not report the *fallback* literal (rule does not apply to that node). Valid cases **S-R1-07**. |
| `"include"` | Reports `hardcoded` and applies R1 autofix when the rest of the policy allows. **S-R1-07**. |
| `"report-separate"` | Uses `messageId: "hardcodedEnvDefault"`; autofix aligned with **S-R1-07** in the suite. |

### Secrets and `secretRemediationMode`

- **Heuristic:** `looksLikeSecretCandidate` (minimum length and charset) classifies secret candidates; does not replace a dedicated *secret scanner*.
- **`suggest-only` (default):** no R1 autofix that copies the sensitive value into a new `const`; with mixed literals, fix applies only to “safe” targets. *Suggestions* only build snippets from safe targets (the literal classified as secret may stay unchanged until manual action).
- **`placeholder-default`:** R1 autofix may inject `const NAME = "<HCD_SECRET_PLACEHOLDER>"` (exported as `HCD_SECRET_PLACEHOLDER` from the package) and replace the literal with the identifier, **without** repeating the sensitive value in the injected declaration.
- **`aggressive-autofix-opt-in`:** explicit *opt-in* — R1 autofix may inject the full literal value like normal constants; review diffs before commit.
- **R3:** secret candidates are **not** written to data files (JSON/YAML), in any mode.

Full semantics: *Secrets — `secretRemediationMode`* subsection in [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md). Dedicated suite: [`tests/no-hardcoded-strings-secrets.test.mjs`](../../tests/no-hardcoded-strings-secrets.test.mjs) (complements the “likely secret” case in [`no-hardcoded-strings-r1.test.mjs`](../../tests/no-hardcoded-strings-r1.test.mjs)).

---

## Automated proof and command

- **R1 suite (scenarios S-R1-01 … S-R1-08 and secret):** [`tests/no-hardcoded-strings-r1.test.mjs`](../../tests/no-hardcoded-strings-r1.test.mjs).
- **M4 suite (`secretRemediationMode`):** [`tests/no-hardcoded-strings-secrets.test.mjs`](../../tests/no-hardcoded-strings-secrets.test.mjs).
- **Call site exceptions (`callSiteExceptions`):** [`tests/no-hardcoded-strings-call-sites.test.mjs`](../../tests/no-hardcoded-strings-call-sites.test.mjs), R2 index behaviour in [`tests/no-hardcoded-strings-r2.test.mjs`](../../tests/no-hardcoded-strings-r2.test.mjs), and e2e [`e2e/call-site-exceptions.e2e.mjs`](../../e2e/call-site-exceptions.e2e.mjs) with fixtures under [`e2e/fixtures/call-site-exceptions/`](../../e2e/fixtures/call-site-exceptions/), [`call-site-baseline/`](../../e2e/fixtures/call-site-baseline/), and [`call-site-exceptions-r2/`](../../e2e/fixtures/call-site-exceptions-r2/).
- **Canonical command (monorepo root):** `npm test -w eslint-plugin-hardcode-detect` — see also [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-architect-suggest-vs-fix-policy-ci-environment.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-architect-suggest-vs-fix-policy-ci-environment.md).

## Business traceability

- Policy and C-SVF-* / P-SVF-* criteria (business analyst): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-analyst-suggest-vs-fix-policy-acceptance.md).
- Business reviewer sign-off: [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-business-reviewer-suggest-vs-fix-policy-signoff.md).
- Development reviewer sign-off (rule doc ↔ R1 suite): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-development-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-development-reviewer-suggest-vs-fix-policy-signoff.md).
- Technical matrix and evidence criteria (test analyst, P-SVF → RuleTester / e2e assertions): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md).
- Test reviewer sign-off (P-SVF matrix ↔ suite; M1-A2-08 evidence criteria): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md).
- Test runner execution and evidence (`npm test` gate; M1-A2-08): [`docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-runner-suggest-vs-fix-policy-evidence.md).
- Remediation dev specialist close-out (re-validation post-gate; M1-A2-09): [`docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-09-papel-dev-especialista-correcoes-suggest-vs-fix-policy.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/micro/M1-A2-09-papel-dev-especialista-correcoes-suggest-vs-fix-policy.md).

If implemented behavior diverges from the planned contract, formal spec sync is task **A3** ([`docs/remediation-milestones/tasks/m1-remediation-r1/A3-contract-sync-post-r1.md`](../../../../docs/remediation-milestones/tasks/m1-remediation-r1/A3-contract-sync-post-r1.md)).
