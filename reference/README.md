# Referência (somente leitura)

Esta pasta contém **snapshots históricos** usados como inspiração e documentação de comportamento esperado. Não é código-fonte do produto publicável.

- [`legacy-snapshot/`](legacy-snapshot/) — cópia organizada dos artefatos iniciais (ESLint local, composite action de exemplo, script `assets/run.sh`).
- [`hardcoded-check.yml`](hardcoded-check.yml) — workflow GitHub Actions de exemplo (`workflow_call`); referência apenas; não ativo na raiz nem instalado em `.github/workflows/` aqui.

Alterações aqui são **intencionais** (por exemplo, atualizar o snapshot após decisão explícita em PR). Não refatore nem “corrija” este material como efeito colateral de trabalho em `packages/`.

Consulte também [`specs/plugin-contract.md`](../specs/plugin-contract.md) e [`AGENTS.md`](../AGENTS.md).
