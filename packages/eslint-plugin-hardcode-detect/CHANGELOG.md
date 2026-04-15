# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/) on the **0.y.z** line until the plugin’s public API stabilizes (see [`specs/plugin-contract.md`](../../specs/plugin-contract.md)).

## [0.2.8] - 2026-04-14

### Added

- `no-hardcoded-strings`: option `callSiteExceptions` (string list, default `[]`) to skip reporting string literals that are the first argument of matching calls (callee serialized as `object.method` or a bare identifier), aligned with the planned `loggers` shape for `standardize-error-messages`. Ignored literals are excluded from the R2 cross-file index and from R3 data writes. Exported type `NoHardcodedStringsOptions` includes the new field.

## [0.2.6] - 2026-04-14

### Changed

- Patch version bump; no changes to exported rules, options, or plugin runtime behavior.

## [0.2.5] - 2026-04-14

### Changed

- Documentation: Mermaid diagrams are published as embedded SVG images (generated via Kroki) so README and docs render figures on GitHub and npm; editable source is kept under collapsible sections as plain text. Regenerate with `npm run docs:generate-mermaid-svgs` at the repo root (requires network).

### Notes

- No changes to exported rules, options, or plugin runtime behavior.

## [0.2.4] - 2026-04-14

### Changed

- Patch version bump; no changes to exported rules, options, or plugin runtime behavior.

## [0.2.3] - 2026-04-14

### Fixed

- Documentation: Mermaid diagrams adjusted for reliable rendering on GitHub (avoid reserved subgraph identifiers, replace `timeline`/`journey` in the package README with `flowchart`, rename a Gantt section that conflicted with the parser).

### Changed

- No changes to exported rules, options, or plugin runtime behavior.

## [0.2.2] - 2026-04-14

### Changed

- Patch release after full `npm test` validation (RuleTester + e2e R2, R3, Nest workspace): all green.
- Repository: append Cursor HCD-ERR hook audit entries (`.log/hooks/`).
- No changes to exported rules, options, or plugin runtime behavior.

## [0.2.1] - 2026-04-14

### Changed

- Maintenance release focused on repository CI/CD and documentation governance updates.
- No changes to exported rules, options, or plugin runtime behavior.

## [0.2.0] - 2026-04-14

### Changed

- Removed the exported demo rule `hello-world` from the runtime plugin surface.
- Removed `hello-world` tests and fixtures (`e2e/hello-world.e2e.mjs`, `e2e/fixtures/hello-world/`) and updated Nest e2e assertions to focus on `no-hardcoded-strings`.
- Updated active contract/spec/package docs to reflect the current public rule surface.

## [0.1.4] - 2026-04-14

### Changed

- Reworked monorepo and package README files for clearer OSS onboarding, including quickstart-first structure and remediation-focused guidance.
- Added Mermaid diagrams (`timeline`, `flowchart`, `sequenceDiagram`, `journey`) to the package README for faster conceptual adoption.
- Added community health files at the repository root: `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `SUPPORT.md`.
- Added collaboration templates under `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md`.
- Added package metadata (`homepage`, `bugs`, `repository`) to improve npm discoverability and support routing.

## [0.1.3] - 2026-04-14

### Changed

- `no-hardcoded-strings` now emits tripartite HCD-ERR messages (`[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`) for `hardcoded`, `hardcodedEnvDefault`, and `hardcodedDuplicateCrossFile`.
- Package docs now describe the HCD-ERR triplet messaging and the Nest smoke e2e coverage (detection path + controlled R1 autofix path).

## [0.1.2] - 2026-04-14

### Changed

- US English for all package Markdown (`README.md`, `docs/rules/*.md`) and `package.json` description. No changes to exported rules, options, or runtime behavior.

## [0.1.1] - 2026-04-14

### Changed

- Patch release: documentation only (repository and root `docs/` guides in US English). No changes to exported rules, options, or runtime behavior.

## [0.1.0] - 2026-04-14

### Added

- First numbered version of the publishable package after `0.0.0` development.
- Exported rules: `hello-world` (demo), `no-hardcoded-strings` (detection and remediation per contract).
- `hardcode-detect/recommended` config with `settings.hardcodeDetect` for the R2 index in the same `lintFiles` invocation.
- `remediationMode` values: `off`, `r1` (constants in the same file), `r2` (cross-file duplicates — detection; R2 autofix reserved), `r3` (merge into JSON/YAML data files when configured), `auto` (mapped to R1 in the current implementation).
- Secret options and env fallback literals aligned with [`specs/plugin-contract.md`](../../specs/plugin-contract.md).
- Exported utilities and types for R3 writers (`mergePlainObjectDeep`, `parseJsonRootObject`, YAML parsers, `stableStringifyJson` / `stableStringifyYaml`, related types) per the package public entry.

### Notes

- The `standardize-error-messages` rule remains **in the contract** and **outside** the exported artifact until dedicated implementation (see package README).
