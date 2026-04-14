# eslint-hardcode-detect-plugin

Monorepo for the ESLint plugin **eslint-plugin-hardcode-detect**: detection of hardcoded values at multiple levels (evolving from per-file analysis toward classification, ordering, severity, and a view across dependencies), standardization of error/log messages, and normative documentation for AI agents.

## Documentation

- [`AGENTS.md`](AGENTS.md) — instructions for AI agents and contributors (priorities and required workflows).
- [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md) — consolidated governance for AI agents (checklists, graph, Clippings, closing).
- [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md) — per-prompt flow (scope, Clippings, graph, closing).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to contribute (including for agents).
- [`docs/README.md`](docs/README.md) — index of guides under `docs/`.
- [`specs/plugin-contract.md`](specs/plugin-contract.md) — functional contract for the rules.
- [`specs/e2e-fixture-nest.md`](specs/e2e-fixture-nest.md) — NestJS e2e fixture (auxiliary workspace).
- [`specs/vision-hardcode-plugin.md`](specs/vision-hardcode-plugin.md) — vision and roadmap (multi-level).
- [`specs/agent-documentation-workflow.md`](specs/agent-documentation-workflow.md) — updating documentation when work is completed.
- [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md) — using and maintaining excerpts of official documentation in [`reference/Clippings/`](reference/Clippings/).
- [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md) — commit and push when work is completed.
- [`docs/repository-tree.md`](docs/repository-tree.md) — file and directory graph.
- [`docs/hardcoding-map.md`](docs/hardcoding-map.md) — taxonomy and levels of hardcoding (conceptual map).
- [`docs/documentation-policy.md`](docs/documentation-policy.md) — Markdown best practices on GitHub.
- [`docs/limitations-and-scope.md`](docs/limitations-and-scope.md) — limitations and restrictions.
- [`docs/distribution-channels-macro-plan.md`](docs/distribution-channels-macro-plan.md) — macro plan by channel/track (e2e, Compose, GitHub milestones).
- [`docs/hardcode-remediation-macro-plan.md`](docs/hardcode-remediation-macro-plan.md) — macro remediation plan (R1–R3, secrets, global verification).
- [`docs/architecture.md`](docs/architecture.md) — repository architecture.
- [`docs/versioning-for-agents.md`](docs/versioning-for-agents.md) — Git versioning for agents.

## Useful commands (monorepo root)

- `npm run lint` — ESLint on the plugin code (`eslint-plugin-eslint-plugin`, `eslint-plugin-n`).
- `npm test` — build + RuleTester (`tests/`) + e2e smoke (`e2e/`) for the `eslint-plugin-hardcode-detect` workspace.

### Docker Compose (profiles)

Norms and command table: [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md).

- `docker compose --profile dev run --rm dev` — interactive shell with the repo at `/workspace`.
- `docker compose --profile e2e run --rm e2e` — `npm ci` and `npm test -w eslint-plugin-hardcode-detect`.
- `docker compose --profile prod run --rm prod` — `npm ci`, `npm run lint`, and plugin tests (CI-style check).

ESLint-only image (Composite Action / `docker build -f .docker/Dockerfile`): default tag `malnati-ops-eslint:local`.

#### Smoke T2 (ops-eslint image)

Minimal reproducible flow (parity with `npm run lint` in the plugin workspace). Details and CI context: [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md) (**Reproducible smoke (T2)** section).

**T1↔T2 parity (version and config):** what must align between the npm track and the image (same commit, `eslint`, plugin resolution, flat config) — [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md#paridade-t1t2-versão-e-config).

```bash
npm ci
docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .
bash .github/actions/ops-eslint/assets/run.sh \
  --path packages/eslint-plugin-hardcode-detect \
  --build-image false
```

## Layout

| Path | Contents |
|------|----------|
| [`packages/eslint-plugin-hardcode-detect`](packages/eslint-plugin-hardcode-detect) | npm plugin source (`tests/`, `e2e/`). |
| [`packages/e2e-fixture-nest`](packages/e2e-fixture-nest) | NestJS workspace for e2e smoke (controlled fixture; see spec). |
| [`reference/Clippings`](reference/Clippings) | Official documentation excerpts (required reading for ESLint/npm scope). |
| [`reference/legacy-snapshot`](reference/legacy-snapshot) | Historical snapshot (reference only; not a dependency). |
| [`.github/actions/ops-eslint`](.github/actions/ops-eslint) | Composite GitHub Action to run ESLint in a container. |
| [`.cursor/rules`](.cursor/rules) | Cursor rules for this project (`alwaysApply`). |
| [`.cursor/commands`](.cursor/commands) | Optional commands (`/abrir-prompt-agente`, `/fechar-prompt-agente`). |
| [`.cursor/skills`](.cursor/skills) | Reusable skills (plugin workflow, docs, Git, Clippings, Docker Compose). |
| [`docker-compose.yml`](docker-compose.yml), [`.docker/`](.docker/) | dev/e2e/prod/e2e-ops profiles and ops-eslint image (see [`specs/agent-docker-compose.md`](specs/agent-docker-compose.md)). |

## License

See [`LICENSE`](LICENSE).
