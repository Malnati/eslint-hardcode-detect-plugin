# M1 — A2 — Arquiteto: política suggest vs fix — CI, comando e ambiente

Entregável do papel **Arquiteto** para a tarefa Camada A **A2** (política `suggest` vs `fix` para remediação R1), alinhado a [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md) e à sub-micro-tarefa [`micro/M1-A2-01-papel-arquiteto-suggest-vs-fix-policy.md`](micro/M1-A2-01-papel-arquiteto-suggest-vs-fix-policy.md).

Este documento fixa **impacto em CI**, o **comando canónico de validação**, **limites de ambiente** e a **reprodutibilidade técnica** da política (via RuleTester). **Não** substitui a tabela de risco no doc da regra / README do pacote (outros papéis em `micro/M1-A2-*`), nem antecipa a sincronização pós-R1 em [`A3-contract-sync-post-r1.md`](A3-contract-sync-post-r1.md). A **matriz de negócio** `suggest` vs `fix` (P-SVF-*) está em [`A2-business-analyst-suggest-vs-fix-policy-acceptance.md`](A2-business-analyst-suggest-vs-fix-policy-acceptance.md) (analista de negócio, M1-A2-02).

## Comando canónico

- **Workspace (raiz do monorepo):** `npm test -w eslint-plugin-hardcode-detect`
- Equivale a executar o script `test` definido em [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json) naquele pacote.

## Reprodutibilidade suggest vs fix (RuleTester)

A política **fix** vs **suggest** materializa-se em testes **RuleTester** comparáveis máquina a máquina:

- Casos com **`output`** — o fixer aplica alteração compatível com `eslint --fix` sobre o mesmo `SourceCode` (remediação R1 quando a política o permite).
- Casos com **`suggestions`** e **sem** `output` esperado para aquele reporte — apenas *suggest* (sem autofix naquele cenário); o utilizador aplica manualmente se quiser.
- Casos só com **`errors`** (sem `output` nem `suggestions` onde o produto o fixar) — detecção sem oferta de remediação automática ou sugestão, conforme o contrato e a suite (ex.: literais alinhados a segredos prováveis).

A suite R1 em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs`](../../../../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r1.test.mjs) (cenários S-R1-01 … S-R1-08) é a âncora de reprodutibilidade; a **matriz de cenários** e critérios de negócio estão documentados na cadeia **A1** e nos papéis **A2** posteriores ao Arquiteto — **não** se duplica aqui.

## Cadeia interna do `npm test` do pacote

A ordem efectiva do script `test` do pacote é a descrita em [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md) (build, RuleTester incluindo R1, e2e). **Implicação para A2:** alterações à política suggest/fix codificadas em testes entram nesta mesma cadeia; falha em qualquer fase invalida o gate.

## CI (GitHub Actions)

O job e o **passo 7** (`npm test -w eslint-plugin-hardcode-detect`) são os mesmos fixados para A1. Ver ficheiro [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml) e a tabela de passos em [`A1-architect-ruletester-r1-ci-environment.md`](A1-architect-ruletester-r1-ci-environment.md) (inclui `timeout-minutes`, `ubuntu-latest` e ordem dos passos 1–7). Qualquer falha nos passos normativos que precedem ou incluem o teste do pacote bloqueia o merge.

## Limites de ambiente

| Aspecto | Valor / nota |
|---------|----------------|
| Node.js | `engines.node`: `>=22` no pacote; CI fixa **22**. |
| ESLint | `peerDependencies`: `eslint >= 9.0.0`; em desenvolvimento/CI vem das `devDependencies` do pacote e da raiz conforme o workspace. |
| Variáveis de ambiente | Nenhuma variável obrigatória é exigida para RuleTester ou `node --test` além do ambiente Node/ESLint habitual; integrações externas não entram no escopo deste gate (ver [`specs/agent-integration-testing-policy.md`](../../../../specs/agent-integration-testing-policy.md)). |
| Recursos | Limitados pelo runner GitHub e pelo `timeout-minutes` do job (ver A1). |

## Segredos, risco e contrato

- **Macro-plan:** [`docs/hardcode-remediation-macro-plan.md`](../../../hardcode-remediation-macro-plan.md), secção **Dados sigilosos** — auto-fix agressivo para candidatos a segredo não é o modo seguro por defeito; orientação para env/cofres sem valores sensíveis em claro.
- **Contrato:** [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md) — `secretRemediationMode`, subsecção **R1 — constantes no mesmo ficheiro** e opções transversais relevantes.
- **Fronteira com a suite A1:** [`A1-business-analyst-ruletester-r1-acceptance.md`](A1-business-analyst-ruletester-r1-acceptance.md), secção 6 (*Fronteira com M1-A2*); cenários como S-R1-08 (*arriscado* i18n / teste) dependem da política fina documentada na cadeia A2, sem a duplicar neste ficheiro.

## Critério de «verde» (alinhamento A2)

- **Marco:** [`docs/remediation-milestones/m1-remediation-r1.md`](../../m1-remediation-r1.md), secção 7 — tarefa A2: comportamento `suggest` vs `fix` **reproduzível** nos testes e/ou documentação normativa; o gate técnico continua a ser **`npm test -w eslint-plugin-hardcode-detect`** com código de saída 0 quando a política estiver codificada em RuleTester.
- **Semântica:** o mesmo critério de cadeia completa que A1 (build + RuleTester + e2e na invocação do `test` do pacote).

## ESLint, RuleTester e documentação oficial

Decisões que dependem da API ESLint, `fix`, `suggest`, RuleTester ou fixers devem seguir [`specs/agent-reference-clippings.md`](../../../../specs/agent-reference-clippings.md) e os recortes em [`reference/Clippings/`](../../../../reference/Clippings/).

## Limites de papel (sub-micro-tarefas)

Este entregável é responsabilidade do papel **Arquiteto** (CI, comando, ambiente, reprodutibilidade do gate). **Não** inclui edição de:

- `packages/eslint-plugin-hardcode-detect/docs/rules/`
- `packages/eslint-plugin-hardcode-detect/README.md`
- ficheiros em `packages/eslint-plugin-hardcode-detect/tests/`

Essas responsabilidades recaem noutros papéis da cadeia A2 (ex.: desenvolvedor, analista de testes, dev especialista em correcções), conforme [`specs/agent-remediation-micro-roles.md`](../../../../specs/agent-remediation-micro-roles.md) e o índice em [`micro/README.md`](micro/README.md).
