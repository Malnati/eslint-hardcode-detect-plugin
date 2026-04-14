# Hardcoding map: taxonomy, levels, and detection

This document is the **conceptual source** for classifying occurrences of fixed values (literals, text, and constants inappropriately scattered) and grading their severity for prioritization. It complements the product vision in [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md), the current contract in [`specs/plugin-contract.md`](../specs/plugin-contract.md), and ecosystem scope in [`limitations-and-scope.md`](limitations-and-scope.md).

## 1. Reference: conceptual “Ops Literal” flow (text scan)

A typical composite action design that **scans a repository** without syntactic analysis follows this logic (illustrative step names):

1. **Input validation** — Confirm token (if applicable) and target paths exist.
2. **File listing** — `find` over the tree, filter by **extensions** (`EXTS` as an alternative regex: `ts|js|…`), exclude build/cache directories (e.g. `node_modules`, `dist`, `.git`).
3. **Occurrence matching** — For each listed file, search lines that match a **quoted literal pattern** (e.g. double or single quotes with a minimum length inside the quotes). Common tools: `grep -HnE` or equivalent.
4. **Aggregation** — Results consolidated into a list (e.g. `file:line:content` lines) for later triage.

The goal of this map is **not** to prescribe CI implementation or report format; it is to provide **how to interpret** any occurrence list produced by textual scanning or other layers.

![flowchart LR](./assets/diagrams/generated/mermaid-53296a9731347a.svg)

<details>
<summary>Fonte Mermaid</summary>

```text
flowchart LR
  findFiles[find files]
  filterExt[filter by EXTS]
  filterExclude[exclude paths]
  grepLiterals[match literals]
  aggregate[aggregate for triage]
  findFiles --> filterExt --> filterExclude --> grepLiterals --> aggregate
```

</details>

## 2. Without AST: expected and intentional behavior

The absence of an **AST** (syntax tree) is **not** treated here as a detector “defect.” In a hardcoding governance pipeline:

- **Every** hit returned by grep/regex (or complementary patterns) is a **candidate** for classification and leveling — it is not automatically discarded as “noise.”
- The same pattern that finds code also finds **comments**, visible fragments of **template literals** (depending on line-based matching), much of **JSON/YAML** (quoted values), **JSX attributes** that fit on one line, **strings in shell scripts**, etc. That is **useful**: triage assigns the label (configuration, product, test, documentation).
- Occurrences that **do** **not** fit a simple quoted pattern — **magic numbers**, boolean literals, **enum identifiers**, multi-line template parts, **binary** content, **`.env`** files with heterogeneous formats, values **assembled at runtime** — should appear on the map as **categories** with **complementary detection means** (extra regex, specific parser, AST, semantic analysis, human review). That **complements** the first pass; it does not invalidate it.

## 3. File coverage: extend `EXTS`

The extension list defines **what enters the scan**. The minimum set usually includes application and configuration languages (`ts`, `js`, `jsx`, `tsx`, `java`, `py`, `go`, `cs`, `php`, `sh`, `json`, `yaml`, `yml`). For thorough hardcoding analysis in real repositories, **extend** to cover, among others:

| Group | Example extensions | Typical content |
|-------|---------------------|-----------------|
| Documentation and content | `md`, `mdx` | Text, embedded code samples, frontmatter |
| Data and contracts | `xml`, `toml`, `ini`, `cfg`, `conf` | Legacy configuration, feeds, manifests |
| JVM / enterprise | `properties`, `gradle`, `kts` (per repo policy) | Message keys, URLs, environments |
| Infrastructure as code | `tf`, `tfvars`, `hcl` | Resources, regions, fixed names |
| Database and migration | `sql` | DDL/DML, schema names, seeds |
| Mobile / native (if applicable) | `swift`, `kt`, `kts`, `gradle` | UI strings, deep links |
| Web front | `html`, `htm`, `vue`, `svelte` | Text, meta, attributes |
| Style and pipeline | `css`, `scss`, `less`, `Dockerfile`, `containerfile` | Visual tokens, base images |
| CI / automation | `yml`, `yaml` under `.github/`, `gitlab-ci` | Job names, action versions |

**Triage:** presence in deploy `json`/`yaml` is **not** “false hardcode” by itself — it is **context** (external system, environment, product) to classify per the lines of this map.

## 4. Detection layers (discovery mechanisms)

Using an **AST** in ESLint **does not prevent** using **other tools** in the same project: text search (`grep`, `ripgrep`), specialized linters, secret scanners, format-specific parsers (SQL, Terraform), or assisted review. The recommended strategy is to **combine layers**:

| Layer | Examples | When to favor |
|--------|----------|---------------|
| Text / regex | quoted grep, URL patterns, IDs | Breadth, speed, heterogeneous languages |
| AST / ESLint | rules on `Literal`, `TemplateLiteral`, imports | Precision in JS/TS, context exclusions |
| Format parser | XML, `.tf`, SQL | Structure and keys without confusing code |
| Human / semantic review | API design, privacy policies | Business meaning regex cannot see |

## 5. Severity axes and business levels

To avoid conflating **tool policy** with **fix priority**:

| Axis | Values | Use |
|------|--------|-----|
| **Tool severity (ESLint)** | `off`, `warn`, `error` | Policy in `eslint.config` when the rule applies. |
| **Business severity** | **L1** through **L4** | Human and backlog priority (below). |

**Business severity (operational suggestion):**

| Level | Meaning | Why it matters |
|-------|---------|----------------|
| **L1 — Critical** | Security, compliance, secret leakage, regulated data | Direct risk; urgent fix; audit |
| **L2 — High** | Environment, deployment, integrations, URLs/non-secret but volatile credentials | Portability, ops incidents, change cost |
| **L3 — Medium** | UX, i18n, product consistency, domain error messages | Perceived quality, support, product DRY |
| **L4 — Low** | Style, comments, examples, documentation | Hygiene; improves maintenance and onboarding |

**Principles:** **DRY** (avoid duplicating semantic values), **Clean Code** (explicit names and constants), **scalability** (change environment without changing code), **reusability** (catalogs, i18n, config), **testability** (centralized fixtures).

## 6. Master table of possibilities

Columns: **ID**, **Domain / subtype**, **Where it appears**, **How to detect**, **Classification**, **Typical level**, **Notes / meaning for development**.

### 6.1 Artifacts and packaging

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-ART-01 | Docker / OCI image name and tag | `Dockerfile`, compose, CI | Image regex, quotes | Build artifact | L2 | Pinned versions complicate upgrades and CVE scanning |
| HC-ART-02 | Published artifact version (npm, jar) | Manifests, CI | Quotes in `package.json`, Gradle | Pinned version | L2–L3 | Reproducibility vs duty to update dependencies |
| HC-ART-03 | Package / bundle / asset name | Asset repo | grep on paths and imports | Delivery identity | L3 | Affects branding and pipelines |

### 6.2 Configuration and parameterization

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-CFG-01 | Feature flag default in code | Source | Literal in conditional | Parameterization | L2–L3 | Should move to remote or per-environment config |
| HC-CFG-02 | Values in deploy JSON/YAML | `config/`, Helm, K8s | Text scan + parser | Environment config | L2 | Centralize and document per environment |
| HC-CFG-03 | File paths and globs | Scripts, app | Quotes with `/` or `\` | Implicit config | L2 | Breaks across OS and deploys |
| HC-CFG-04 | “Magic” numeric limits in config | Code, yaml | Numeric regex + review | Operational limit | L2–L3 | Pagination, rate limits — affect scale |

### 6.3 Preferences and user profile

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-PRF-01 | UI defaults (language, theme) | Client | Literals and defaults | Embedded preference | L3 | Should align with persistence and account |
| HC-PRF-02 | Local or dev settings values (client placeholder) | Code | Constants in module | Initial state | L3 | Avoid divergence from backend |

### 6.4 Internationalization and content

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-I18-01 | User-visible UI strings | UI | Quotes + context review | Product copy | L3 | Requires i18n catalog for global scale |
| HC-I18-02 | Validation messages | Forms, API | Literals in errors | Domain validation | L3 | Duplication breaks UX consistency |
| HC-I18-03 | Pluralization and gender | i18n | Templates and libs | Grammar | L3 | Hardcoding blocks correct locales |

### 6.5 Meta and SEO

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-SEO-01 | `<title>`, meta description | HTML, framework | Quotes in head | SEO | L3 | Content should be manageable |
| HC-SEO-02 | Open Graph / Twitter cards | Meta tags | `content` attributes | Social meta | L3 | Marketing and sharing |

### 6.6 Content structure (CMS, frontmatter, slugs)

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-CMS-01 | Content slug or ID | Markdown, CMS | Strings in frontmatter | Structured content | L3–L4 | Coupling to CMS or routes |
| HC-CMS-02 | Fixed taxonomy fields | Code | Constants | Classification | L3 | Editorial change requires deploy if fixed |

### 6.7 Variables, constants, and duplication across files

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-VAR-01 | Same literal in N modules | Monorepo | Aggregation / duplication | Semantic DRY | L3 | Raises coordinated change cost |
| HC-VAR-02 | Duplicated non-exported “constant” | Code | AST + search | Duplication | L3 | Risk of subtle drift |

### 6.8 Numbers and units

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-NUM-01 | Timeouts and retries | Network, jobs | Digits, AST `Literal` | Resilience policy | L2–L3 | Affects reliability and latency |
| HC-NUM-02 | Pagination / size limits | API | Numbers in code | Implicit contract | L2–L3 | Scale and abuse |
| HC-NUM-03 | Money and decimal precision | Payments | Decimal literals | Business rule | L1–L2 | Tax and financial errors |
| HC-NUM-04 | Numeric protocol version | Serialization | Numbers | Compatibility | L2 | API migration |

### 6.9 Network and identity

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-NET-01 | Base URL / host / port | Client, server | `https?://` regex, quotes | Endpoint | L2 | Environments and zero trust |
| HC-NET-02 | Versioned API path | HTTP | `/v1/` strings | Coupling | L2–L3 | Coordinated change with consumers |
| HC-NET-03 | Fixed HTTP headers | Code | Literals | Transport contract | L2–L3 | Security and interoperability |

### 6.10 Secrets and sensitive identifiers

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-SEC-01 | Secrets and tokens (even fragile placeholders) | Anywhere | Scanners + policy | Secret | **L1** | Never commit real values in this repository |
| HC-SEC-02 | Tenant / account IDs in logic | Code | Pattern strings | Multi-tenant isolation | L1–L2 | Leaking context across clients |
| HC-SEC-03 | Symbolic crypto keys (kid) | Config | Quotes | Crypto ops | L1–L2 | Rotation and KMS |

### 6.11 Persistence and query

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-SQL-01 | Dynamic SQL fragment | Repositories | SQL strings | Persistence | L1–L2 | SQL injection and migrations |
| HC-SQL-02 | Table/column/index name | ORM, SQL | Literals | Schema | L2 | Coupling to DDL |
| HC-SQL-03 | Fixed filters and partitions | NoSQL | Strings | Data | L2 | Hotspot and cost |

### 6.12 Contracts and serialization

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-SER-01 | Stable JSON field name | API | Quotes on keys/values | Contract | L2–L3 | Consumer breakage |
| HC-SER-02 | Enum as string in languages without enum | TS/JS | Literal unions | Domain | L3 | Align with OpenAPI/Proto |
| HC-SER-03 | Domain error code | Application layer | Strings | Stable API | L2–L3 | Support and clients |

### 6.13 Observability

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-OBS-01 | Log message for correlation | Services | Literals | Log | L2–L3 | Cardinality and PII |
| HC-OBS-02 | Metric / trace name | Instrumentation | Strings | Observability | L2 | Naming patterns and dashboards |

### 6.14 Tests and fixtures

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-TST-01 | Test data identical to production | `test/` | Duplication | Fixture | L3–L4 | Risk of leaking real format |
| HC-TST-02 | Snapshot with fragile strings | Jest, etc. | Snapshot files | Regression | L4 | Test maintenance |

### 6.15 Comments, annotations, and pseudocode

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-CMT-01 | Example with real host/URL in comment | Source | grep + review | Documentation | L3–L4 | May encourage unsafe copy-paste |
| HC-CMT-02 | TODO with magic constant | Comment | Text | Technical debt | L4 | Hides debt from the compiler |
| HC-CMT-03 | Annotations (Decorator, JPA, etc.) with literal | Java, TS | AST + text | Metadata | L2–L3 | Reflection-driven behavior |

### 6.16 Platform security

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-PLT-01 | IAM policy / permission as string | Infra, SDK | JSON/HCL/quotes | Authorization | L1–L2 | Excessive privilege |
| HC-PLT-02 | Firewall rule / CIDR | Terraform, cloud | Literals | Network | L1–L2 | Attack surface |

### 6.17 Colors, themes, and design tokens

| ID | Domain / subtype | Where it appears | How to detect | Classification | Level | Notes |
|----|------------------|------------------|---------------|----------------|-------|-------|
| HC-DSG-01 | Hex/rgb color in component | CSS-in-JS, Vue | Color regex | Visual token | L3–L4 | Brand and accessibility consistency |
| HC-DSG-02 | Repeated magic spacing | UI | Numbers + context | Layout | L4 | Design system and responsiveness |

## 7. How to use this map

1. **Ingest occurrences** from any tool (text, AST, hybrid).
2. For each occurrence, assign **classification** (column) and **level** (L1–L4) from context.
3. **Order** the backlog by level and fix cost.
4. **Evolve** ESLint plugin rules and scanners per [`specs/vision-hardcode-plugin.md`](../specs/vision-hardcode-plugin.md), without requiring a single technology to cover every row in the table.

## 8. Document version

- **1.0.1** — US English translation.
- **1.0.0** — Introduction of the conceptual map aligned with intentional text scanning, extended extensions, detection layers, and master table by domain.
