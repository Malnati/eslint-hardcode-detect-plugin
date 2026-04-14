# Distribution channels and operationalizing the solution

This document lists **how** the hardcoding detection solution (ESLint plugin, configuration, complementary tools, and governance) can be **delivered and invoked** in projects and pipelines. It does not duplicate the taxonomy of hardcoding *types* or severity levels: that is in [`hardcoding-map.md`](hardcoding-map.md). The rules contract remains in [`../specs/plugin-contract.md`](../specs/plugin-contract.md).

## Relationship to the hardcoding map

| Document | Focus |
|----------|--------|
| [`hardcoding-map.md`](hardcoding-map.md) | **What** to classify (HC-*), L1–L4 levels, detection layers (text, AST, parsers). |
| This document | **Where** the solution flows (npm, CI, Docker, IDE, agents, auxiliary protocols). |

## Master channel table

Each row describes a **distribution or execution channel**: where the artifact lives, how the consumer obtains it, and how it relates to the **eslint-plugin-hardcode-detect** ESLint plugin (**direct** = npm dependency + `eslint.config`; **indirect** = automates or contextualizes the flow without replacing the package).

| Channel | Where it lives | How it is obtained / updated | ESLint plugin | Notes |
|---------|----------------|------------------------------|---------------|-------|
| **npm (project)** | Consumer `package.json`; `node_modules/` | `npm install` / `npm ci`; pinned version or range in the manifest | **Direct** | Usual form: `devDependencies` with the scoped plugin package and reference in flat config. Packaging: [`../packages/eslint-plugin-hardcode-detect/`](../packages/eslint-plugin-hardcode-detect/). |
| **npm workspaces / monorepo** | Workspace root + child packages | Root install links internal packages | **Direct** | Symlinks between workspaces; align with the `workspaces` field in the manifest. Clipping: [`../reference/Clippings/dev/javascript/npm/npm Docs.md`](../reference/Clippings/dev/javascript/npm/npm%20Docs.md). |
| **npm global + `bin`** | Global PATH; link to package CLI | `npm install -g` when the package defines `bin` | **Direct** (if the package exposes a CLI that runs ESLint) or **indirect** | Useful for corporate command-line tools. Clipping on `bin` and global install: same npm Docs file. |
| **`npm exec` / `npx`** | Ephemeral execution | `npm exec <pkg>` / `npx` without a permanent install | **Direct** | Fits one-off scripts and ephemeral CI. |
| **Private registries / `publishConfig`** | Internal registry; credentials on CI client | `npm publish` with `publishConfig`; consumption with `.npmrc` | **Direct** | Corporate distribution of the package. Clipping: [`../reference/Clippings/dev/javascript/npm/npm Docs.md`](../reference/Clippings/dev/javascript/npm/npm%20Docs.md). |
| **Docker / OCI** | Image with Node + ESLint | `docker pull` / build from [`../.docker/Dockerfile`](../.docker/Dockerfile); Compose with profiles | **Direct** (volume mount + `eslint` command) | Aligned with [`../specs/agent-docker-compose.md`](../specs/agent-docker-compose.md) and the `ops-eslint` action. |
| **CI/CD (GitHub Actions, GitLab CI, etc.)** | Workflow YAML; runners | Trigger on push/PR; `node_modules` cache | **Direct** | **Execution** channel in the pipeline (lint), not a replacement for the npm package. |
| **Git hooks** | `.git/hooks` or a tool (Husky, Lefthook) | Local dev install; commit runs `npm run lint` / `eslint` | **Indirect** | Feedback before push; normative policy may require clippings in `reference/Clippings/` per [`../specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md). |
| **Cursor: repo rules and skills** | [`.cursor/rules/`](../.cursor/rules/), [`.cursor/skills/`](../.cursor/skills/) | Versioned in Git; IDE loads per project | **Indirect** | Document workflows; do not package the plugin; precedence vs Copilot in [`../specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md). |
| **Cursor: hooks** | `.cursor/hooks.json`; scripts in the repo | Cursor loads hooks per documentation | **Indirect** | Extend the agent loop (format, analytics, gates). Clipping: [`../reference/Clippings/dev/cursor/docs/Cursor Docs.md`](../reference/Clippings/dev/cursor/docs/Cursor%20Docs.md). Cloud/self-hosted mention project hooks: [`../reference/Clippings/dev/cursor/cloud/Cloud Agents  Cursor Docs.md`](../reference/Clippings/dev/cursor/cloud/Cloud%20Agents%20%20Cursor%20Docs.md), [`../reference/Clippings/dev/cursor/cloud/Self-Hosted Pool  Cursor Docs.md`](../reference/Clippings/dev/cursor/cloud/Self-Hosted%20Pool%20%20Cursor%20Docs.md). |
| **Cursor: Marketplace Plugin** | Repo submitted to the marketplace | Cursor review; store distribution | **Indirect** | The marketplace distributes *skills, subagents, MCPs, hooks, and rules* to the Cursor community — a channel for the **agent ecosystem**, not a replacement for the plugin npm tarball. Clipping: [`../reference/Clippings/dev/cursor/plugins/Publish a Cursor Marketplace Plugin.md`](../reference/Clippings/dev/cursor/plugins/Publish%20a%20Cursor%20Marketplace%20Plugin.md). |
| **Cursor CLI / headless** | Machine with CLI installed | CLI documentation | **Indirect** | Agent/automation flows; may call scripts that run ESLint. Index: [`../reference/Clippings/dev/cursor/cli/README.md`](../reference/Clippings/dev/cursor/cli/README.md). |
| **MCP (Model Context Protocol)** | MCP server (stdio/SSE/etc.) | Client configuration (Cursor, others) | **Indirect** | Servers expose *tools*, *resources*, and *prompts* over the protocol — they complement context and automation; they are **not** the primary install channel for the ESLint plugin. **Normative validation** of package rules remains on tracks **T1** (npm + ESLint in the project) and **T3** (CI), not on the MCP protocol (track **T5**). Clipping: [`../reference/Clippings/dev/mcp/Understanding MCP servers.md`](../reference/Clippings/dev/mcp/Understanding%20MCP%20servers.md). Anchor: [`limitations-and-scope.md`](limitations-and-scope.md#mcp-t5-npm-t1-and-ci-t3). |
| **GitHub Copilot (agents / instructions / skills)** | `.github/agents/`, `.github/instructions/`, optionally `.github/skills/` | Repository + Copilot product | **Indirect** | Equivalence with `.cursor/` in [`../specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md). |
| **Editors with ESLint / LSP** | IDE workspace | ESLint extension + `eslint.config` | **Direct** | Local run on save or problems panel; plugin anchor: [`../reference/Clippings/dev/javascript/eslint/guides/Create Plugins - ESLint - Pluggable JavaScript Linter.md`](../reference/Clippings/dev/javascript/eslint/guides/Create%20Plugins%20-%20ESLint%20-%20Pluggable%20JavaScript%20Linter.md). |

## Conceptual flow (optional)

```mermaid
flowchart LR
  pkg[npm_package]
  cfg[eslint_config]
  run_local[local_run]
  run_ci[CI_or_Docker]
  ide[IDE_ESLint]
  aux[auxiliary_channels]
  pkg --> cfg --> run_local
  cfg --> run_ci
  cfg --> ide
  aux --> run_local
  aux --> run_ci
```

*Auxiliary channels*: Cursor/Copilot (rules, skills, hooks), MCP, Git hooks — they orchestrate or enrich work; the normative lint **artifact** remains the npm package + ESLint configuration.

## Roadmap and validation by track

Macro planning (tracks T1–T6, channel-to-channel traceability, proposed e2e fixtures, Docker profiles, diagrams, and GitHub PR milestones) is in [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md). Timings are expressed as **durations and composition** (no normative calendar dates); per-milestone detail is in [`distribution-milestones/README.md`](distribution-milestones/README.md).

## Limitations

- The plugin does **not**, by itself, package every row in the table: many are **project policy** (hooks, CI, Docker).
- Repository and product scope restrictions: [`limitations-and-scope.md`](limitations-and-scope.md).
- `reference/Clippings/` is **reference only**; not imported by `packages/` (see same limitations).
- Integrations with external services (registry, MCP, publishing): no ad hoc mocks in the repository; follow [`specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md).

## References

| Resource | Link |
|----------|------|
| Macro plan (e2e, tracks, GitHub milestones) | [`distribution-channels-macro-plan.md`](distribution-channels-macro-plan.md) |
| Conceptual hardcoding map | [`hardcoding-map.md`](hardcoding-map.md) |
| Product vision | [`../specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md) |
| Rules contract | [`../specs/plugin-contract.md`](../specs/plugin-contract.md) |
| Copilot / Cursor ecosystem | [`../specs/agent-tooling-ecosystem-map.md`](../specs/agent-tooling-ecosystem-map.md) |
| Docker Compose and ops-eslint | [`../specs/agent-docker-compose.md`](../specs/agent-docker-compose.md) |
| Clippings maintenance | [`../specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md) |
| Agent instructions | [`../AGENTS.md`](../AGENTS.md) |
| Integration policy (sandboxes; no mocks) | [`../specs/agent-integration-testing-policy.md`](../specs/agent-integration-testing-policy.md) |
| npm clippings (workspaces, `bin`, publish) | [`../reference/Clippings/dev/javascript/npm/npm Docs.md`](../reference/Clippings/dev/javascript/npm/npm%20Docs.md) |
| Cursor Marketplace (plugin) | [`../reference/Clippings/dev/cursor/plugins/Publish a Cursor Marketplace Plugin.md`](../reference/Clippings/dev/cursor/plugins/Publish%20a%20Cursor%20Marketplace%20Plugin.md) |
| Cursor hooks | [`../reference/Clippings/dev/cursor/docs/Cursor Docs.md`](../reference/Clippings/dev/cursor/docs/Cursor%20Docs.md) |
| MCP — servers | [`../reference/Clippings/dev/mcp/Understanding MCP servers.md`](../reference/Clippings/dev/mcp/Understanding%20MCP%20servers.md) |
| ESLint — creating plugins | [`../reference/Clippings/dev/javascript/eslint/guides/Create Plugins - ESLint - Pluggable JavaScript Linter.md`](../reference/Clippings/dev/javascript/eslint/guides/Create%20Plugins%20-%20ESLint%20-%20Pluggable%20JavaScript%20Linter.md) |

## Document version

- **1.3.0** — US English translation; MCP row anchor updated to `limitations-and-scope.md#mcp-t5-npm-t1-and-ci-t3`.
- **1.2.0** — MCP row: normative plugin validation on **T1 + T3** (not MCP/T5); link to `limitations-and-scope.md`.
- **1.1.0** — “Roadmap and validation by track” section with link to `distribution-channels-macro-plan.md`.
- **1.0.0** — Initial channel and operationalization list, aligned with the plan and `reference/Clippings/`.
