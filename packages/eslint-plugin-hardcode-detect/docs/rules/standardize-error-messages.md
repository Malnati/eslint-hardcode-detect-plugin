# `standardize-error-messages`

Rule (`problem`) defined in the plugin contract: standardize error and log messages with an identifiable code and, when a catalog exists, validate against the catalog in flat config. Includes options (`messages`, `codePattern`, `loggers`, `errorConstructors`) and report `messageId`s (`missingCode`, `unknownCode`, `invalidCatalogEntry`, `dynamicMessage`).

Each `messages` catalog entry (code → object map) must define three non-empty strings, semantically aligned with [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md):

| Field | Role |
|-------|------|
| `seniorDiagnostic` | Text for technical diagnosis (tracing, correlation, immediate cause). **Recommended** to start with `[HCD-ERR-SENIOR]`. |
| `systemicRemediation` | Text for definitive remediation (root cause, automation, guardrails, tests). **Recommended** to start with `[HCD-ERR-FIX]`. |
| `operationalWorkaround` | Text for a safe operational workaround alongside definitive remediation. **Recommended** to start with `[HCD-ERR-OPS]`. |

Prefixes match the agent spec; they enable unified auditing (Levels 1–2) across messages emitted by code and agent failure reports.

**In this package**, the rule is in the public contract but is **not** yet included in the publishable artifact exported by `eslint-plugin-hardcode-detect` — future implementation aligned with the spec.

See contract in [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
