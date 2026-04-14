# Limitations, scope, and restrictions

## Product scope

**eslint-plugin-hardcode-detect** is an ESLint plugin focused on **detecting and governing hardcoded values** (strings and messages), evolving toward **multi-level** analysis (per file, dependencies, classification, ordering, severity/levels). Product vision detail is in [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md). A conceptual taxonomy of hardcoding types and severity levels (outside the immediate normative contract of the rules) is in [`hardcoding-map.md`](hardcoding-map.md).

## Relationship between conceptual scope documents

| Document | Role |
|----------|------|
| [`hardcoding-map.md`](hardcoding-map.md) | **What** to classify: HC-* IDs, business severity L1–L4, detection layers (text, AST, parsers). Does not replace the rules contract. |
| [`solution-distribution-channels.md`](solution-distribution-channels.md) | **Where** the solution flows (npm, CI, Docker, IDE, agents). Lists direct and indirect channels relative to the ESLint package. |
| [`specs/plugin-contract.md`](../specs/plugin-contract.md) | **Normative behavior** of the rules and public plugin options; takes precedence over generic interpretations. |
| [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md) | **Macro roadmap** by e2e validation track, diagrams, lifecycle, and milestones in PRs (planning; not every item is implemented). |
| [`hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md) | **Macro remediation roadmap** (tracks R1–R3: per-file constants, shared module, properties/env), secrets, global verification per run; does not replace the rules contract (planning; not every item is implemented). |
| [`remediation-milestones/README.md`](remediation-milestones/README.md) | **Milestone index** M0–M5 remediation (`mN-*.md`), handoff, and Layer A tasks under `remediation-milestones/tasks/`; complements the macro plan with per-milestone structure; planning (not every item is implemented); does not replace [`specs/plugin-contract.md`](../specs/plugin-contract.md). |
| [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) | **External integrations** (registry, publishing, MCP, etc.): no mocks in the repository; use sandboxes or vendor official test environments. |

*Distinction among tracks **T1** (npm), **T3** (CI), and **T5** (MCP and agent ecosystem) and MCP limits: see [MCP (T5), npm (T1), and CI (T3)](#mcp-t5-npm-t1-and-ci-t3).*

## Distribution channels and indirect artifacts

Full hardcoding governance may combine the **npm package** with project policy (CI, Docker, hooks, IDEs). Several channels in the table in [`solution-distribution-channels.md`](solution-distribution-channels.md) are **indirect**: they orchestrate or document the flow (Cursor, Copilot, MCP, Git hooks) **without** replacing the plugin tarball. Planned coverage by track and test fixtures are in [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md). **Multi-level remediation** planning (constants, cross-file duplicates, externalization to property files) is in [`hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md).

## MCP (T5), npm (T1), and CI (T3)

**Tracks** (artifact handoff order) are defined in [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md). To avoid ambiguity among the **npm channel**, **CI pipeline**, and **MCP**:

| Track | Role relative to the ESLint plugin |
|-------|--------------------------------------|
| **T1** (npm consumer) | Dependency in the manifest, flat/legacy configuration, **ESLint engine** execution in the project — includes local validation of package rules. |
| **T3** (CI/CD) | Installs dependencies and runs **reproducible** lint/test in the pipeline — normative continuation of the same validation in an aggregated environment. |
| **T5** (agent ecosystem) | Cursor, Copilot, **MCP**, etc.: **indirect** channels; document or enrich the flow **without** replacing the tarball or lint policy. |

The **Model Context Protocol (MCP)** exposes *tools*, *resources*, and *prompts* in the client (e.g. IDE); it does **not** replace `npm install` of the plugin, does **not** remove the npm dependency for consumers, and does **not**, by itself, validate published rules of **eslint-plugin-hardcode-detect**. Normative verification of rules remains in **T1** and **T3** (and on the IDE track **T4** when ESLint runs locally). The **MCP** row of the master table is in [`solution-distribution-channels.md`](solution-distribution-channels.md).

To **test or validate integration** with MCP servers (as for other external services), follow [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md): vendor-supported environments or official documentation; **no** mocks, stubs, or ad hoc simulators in this repository.

**Clippings (MCP):** decisions that depend on the official protocol spec or documentation should cross-check the index at [`reference/Clippings/dev/mcp/README.md`](../reference/Clippings/dev/mcp/README.md) and [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). **No new excerpt under `reference/Clippings/` was required in this cycle** for this normative anchor — existing indexed references suffice (for example the excerpt on MCP servers).

## Versioning and traceability

The Git flow summary for agents is in [`versioning-for-agents.md`](versioning-for-agents.md); the full norm (Conventional Commits, scopes) is in [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md). Product milestones and channel deliveries may be organized as **milestones** and **PRs** on GitHub, aligned with releases and tags of the publishable package when applicable (see roadmap in [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md)).

## e2e tests and fixture workspaces

There is a **NestJS** e2e fixture today under [`packages/e2e-fixture-nest/`](../packages/e2e-fixture-nest/), consumed by the plugin e2e smoke per [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md). Additional auxiliary workspaces and Docker profiles per track are **planned** in the macro document; until implemented, automated e2e coverage is not assumed for every row of the master table.

## Clippings and official documentation

Decisions that depend on the ESLint API, npm, packaging, or flat/legacy configuration should cross-check [`reference/Clippings/`](../reference/Clippings/) per [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). The domain index is at [`reference/Clippings/README.md`](../reference/Clippings/README.md). References to the portfolio under [`reference/agents-ref/`](../reference/agents-ref/) follow [`specs/agent-reference-agents.md`](../specs/agent-reference-agents.md).

## Repository restrictions

| Restriction | Description |
|-------------|-------------|
| `reference/` | Do not import or depend on it from production code; documentation-only material. |
| `reference/Clippings/` | Excerpts of **official** external documentation; mandatory consultation in relevant scope; see [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). |
| `reference/legacy-snapshot/` | Historical snapshot; do not treat as the normative source for the current contract. |
| Publishable code | Only under `packages/eslint-plugin-hardcode-detect/`. |
| Nest e2e workspace | [`packages/e2e-fixture-nest/`](../packages/e2e-fixture-nest/) is auxiliary (test fixture); does not replace the plugin package. See [`specs/e2e-fixture-nest.md`](../specs/e2e-fixture-nest.md). |
| Contract before code | Public behavior changes require updating `specs/plugin-contract.md` (and vision, if macro). |
| Secrets | Do not commit credentials; environment variables and ignored artifacts. |

## Current implementation limitations

- The package under `packages/` is **under construction**; rules described in the contract may be partially implemented. See `specs/plugin-contract.md` and the source.

## Known ESLint ecosystem limitations

- ESLint rules operate **per file** with the AST available; “by dependencies” analysis (graph across packages) may require complementary tools or explicit configuration (see vision).

## Documentation policy

Structural changes should be reflected in [`repository-tree.md`](repository-tree.md). See [`documentation-policy.md`](documentation-policy.md).
