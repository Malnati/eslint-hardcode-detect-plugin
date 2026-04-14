# Repository architecture

## Overview

This repository separates four concerns:

1. **npm package** ([`packages/eslint-plugin-hardcode-detect`](../packages/eslint-plugin-hardcode-detect)) — official ESLint plugin implementation, versioned and testable.
2. **Frozen reference** ([`reference/`](../reference/)) — historical snapshots; not part of the package dependency chain.
3. **GitHub automation** ([`.github/actions/ops-eslint`](../.github/actions/ops-eslint)) — composite action that runs ESLint in a container; requires a Docker image and [`.docker/Dockerfile`](../.docker/Dockerfile) at the checkout root when `build_image` is enabled.
4. **Docker Compose** ([`docker-compose.yml`](../docker-compose.yml)) — profiles `dev` (interactive shell), `e2e` (`npm ci` + plugin workspace tests), and `prod` (monorepo lint + plugin tests), defined in [`specs/agent-docker-compose.md`](../specs/agent-docker-compose.md). The ESLint-only tooling image (`.docker/Dockerfile`, default tag `malnati-ops-eslint:local`) is separate from services based on `node:22-bookworm-slim` used to install repository dependencies.

## Decision flow

- New or changed rule behavior: update [`specs/plugin-contract.md`](../specs/plugin-contract.md) first, then code under `packages/`.
- Documentation-only changes may go in `docs/` and the README.

## Distribution

- **npm**: the publishable artifact is the package under `packages/`.
- **GitHub Actions**: consumers may reference `uses: ./.github/actions/ops-eslint` in this repository or the published path after release.

## Versioning (agents)

Normative flow: [`specs/agent-git-workflow.md`](../specs/agent-git-workflow.md) and [`docs/versioning-for-agents.md`](versioning-for-agents.md). Agents should commit and push when finishing work with local changes, unless there are no changes or push failure is documented.

## Documentation (agents)

Normative flow: [`specs/agent-documentation-workflow.md`](../specs/agent-documentation-workflow.md), policy in [`documentation-policy.md`](documentation-policy.md), and graph in [`repository-tree.md`](repository-tree.md). Any structural change requires updating the graph and staying aligned with [`limitations-and-scope.md`](limitations-and-scope.md) and [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md) when scope evolves.
