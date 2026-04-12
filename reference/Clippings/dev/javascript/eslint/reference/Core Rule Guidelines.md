---
title: "Propose a New Rule - ESLint - Pluggable JavaScript Linter"
source: "https://eslint.org/docs/latest/contribute/propose-new-rule"
author:
published:
created: 2026-04-11
description: "A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease."
tags:
  - "clippings"
---
## Core Rule Guidelines

In general, ESLint core rules must be:

1. **Widely applicable.** The rules we distribute need to be of importance to a large number of developers. Individual preferences for uncommon patterns are not supported.
2. **Generic.** Rules cannot be so specific that users will have trouble understanding when to use them. A rule is typically too specific if describing what it does requires more than two "and"s (if a and b and c and d, then this rule warns).
3. **Atomic.** Rules must function completely on their own. Rules are expressly forbidden from knowing about the state or presence of other rules.
4. **Unique.** No two rules can produce the same warning. Overlapping rules confuse end users and there is an expectation that core ESLint rules do not overlap.
5. **Library agnostic.** Rules must be based solely on JavaScript runtime environments and not on specific libraries or frameworks. For example, core rules shouldn’t only apply if you’re using jQuery but we may have some rules that apply only if you’re using Node.js (a runtime).
6. **No conflicts.** No rule must directly conflict with another rule. For example, if we have a rule requiring semicolons, we cannot also have a rule disallowing semicolons (which is why we have one rule, `semi`, that does both).

## Create Your Own Rules

Remember that ESLint is completely pluggable, which means you can create your own rules and distribute them using plugins. We did this on purpose because we don’t want to be the gatekeepers for all possible rules. Even if we don’t accept a rule into the core, that doesn’t mean you can’t have the exact rule that you want. See the [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) and [Create Plugins](https://eslint.org/docs/latest/extend/plugins) documentation for more information.