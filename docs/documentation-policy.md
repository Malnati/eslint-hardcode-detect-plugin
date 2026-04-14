# Markdown documentation policy (GitHub)

Practices aligned with public GitHub repositories and reading on the web and in a local clone.

## Principles

1. **One README at the root** — entry point: purpose, links to docs and specs, brief structure.
2. **Docs under `docs/`** — content that does not belong in the README; names in consistent `kebab-case` or `snake_case` (this project uses `kebab-case`).
3. **Specs under `specs/`** — normative contracts (behavior, agent workflows); do not mix with long tutorials.
4. **CONTRIBUTING.md at the root** — expectations for anyone changing the repo (including agents).
5. **Relative links** — prefer `[text](docs/file.md)` over absolute URLs to this repository, so branches and forks work.
5b. **Paths relative to the clone root** — when citing, listing, or exemplifying files and folders **in** this repository (documentation, answers, examples, prompts to sub-agents), use **only** paths relative to the root (e.g. `packages/eslint-plugin-hardcode-detect/src/...`, `specs/plugin-contract.md`). Do not use machine absolute paths (`/Users/...`, `C:\...`, etc.) in those contexts.
6. **Headings** — hierarchy `##` → `###`; one `#` title per page (except the README, where GitHub already shows the repo name).
7. **Code** — use fenced blocks with a language: ` ```ts `, ` ```bash `, etc.
8. **Tables** — use for small matrices; avoid very wide tables on mobile (lists are an alternative).
9. **Images** — prefer SVG or PNG under `docs/assets/` if needed; reference with a relative path.
10. **Accessibility** — descriptive link text (“see contract in specs/”) instead of “click here”.

## Environment tools vs versioned communication

Editor tools or file APIs may require or prefer absolute paths at **runtime** for disambiguation. That does **not** replace principle 5b: anything **committed** or **communicated** to the user about artifact locations in this repo should use paths **relative to the clone root**.

## Exceptions to principle 5b

- **Literal excerpts** in [`reference/Clippings/`](../reference/Clippings/) (mirrored official documentation): do not rewrite examples solely to change sample paths from the source.
- **API semantics** where an absolute path is a runtime requirement (e.g. ESLint `cwd` must be absolute; `file://` URIs in specifications): document the fact without inventing the author’s machine path.

## What to avoid

- Secrets, tokens, or personal data in versioned Markdown.
- Duplicating the same paragraph across many files without a “source of truth” link.
- Documenting generated code or folders listed in `.gitignore` as if they were part of the product.
- Filesystem absolute paths when referring to files **in** this repository in normative text or internal examples (except as above).

## Maintenance by agents

When folder structure or responsibilities change, update [`repository-tree.md`](repository-tree.md) and, if applicable, [`limitations-and-scope.md`](limitations-and-scope.md). The full per-prompt cycle (scope, Clippings, closing with graph and Git) is in [`../specs/agent-session-workflow.md`](../specs/agent-session-workflow.md).
