# Referência (somente leitura)

Esta pasta contém material de **referência apenas**: não é código-fonte do produto publicável nem dependência de build.

- [`Clippings/`](Clippings/) — **trechos da documentação oficial** (ESLint, npm, Node, etc.) recortados para consulta por agentes e humanos; ver [`Clippings/README.md`](Clippings/README.md) e o contrato em [`specs/agent-reference-clippings.md`](../specs/agent-reference-clippings.md).
- [`legacy-snapshot/`](legacy-snapshot/) — cópia organizada dos artefatos iniciais (ESLint local, composite action de exemplo, script `assets/run.sh`).
- [`hardcoded-check.yml`](hardcoded-check.yml) — workflow GitHub Actions de exemplo (`workflow_call`); referência apenas; não ativo na raiz nem instalado em `.github/workflows/` aqui.

**Política de alteração:** `legacy-snapshot/` muda só em PR explícito de snapshot. `Clippings/` pode ser atualizado em commits dedicados de sincronização de documentação oficial (sem refatoração acidental). Não refatore nem “corrija” este material como efeito colateral de trabalho em `packages/`.

Consulte também [`specs/plugin-contract.md`](../specs/plugin-contract.md) e [`AGENTS.md`](../AGENTS.md).
