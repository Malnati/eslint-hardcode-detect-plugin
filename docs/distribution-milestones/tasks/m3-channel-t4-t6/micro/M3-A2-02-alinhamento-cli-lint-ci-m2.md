# M3-A2-02: Alinhamento ao CLI / lint do CI (ponte M2)

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M3-A2-02 |
| milestone | M3 |
| depends_on | M3-A2-01 |
| blocks | — |
| plan_requirements | `m3-sec4-order-2`, `m3-sec7-A2`, `m3-sec2-handoff` |

## Objetivo

Documentar o **alvo normativo** para T6: o hook deve invocar o **mesmo** caminho de validação que o contribuidor e o CI usam (ex.: `npm run lint` na raiz ou comando equivalente descrito em [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) / M2).

## Definition of done

- Bullets com comando(s) de referência e referência explícita a [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md); aviso de que fecho completo de T6 depende de M4.

## Paths principais

- [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml)
- [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md)

---

## Alinhamento CLI / lint / CI — alvo normativo para T6 (entregável)

Comandos canónicos alinhados ao job `test` em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) (após `npm install`): o pipeline executa, por esta ordem, `npm run lint` e `npm test -w eslint-plugin-hardcode-detect`. Os scripts na raiz do monorepo estão em [`package.json`](../../../../../package.json) (`lint` e `test` delegam ao workspace `eslint-plugin-hardcode-detect`).

- **Lint (alvo principal para um hook de pré-commit que espelhe o CI):** `npm run lint` na raiz — corresponde ao passo *Lint workspace* do workflow e ao fluxo descrito em [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) («Fluxo recomendado»).
- **Testes do plugin:** `npm test -w eslint-plugin-hardcode-detect`, ou `npm test` na raiz (equivalente ao script raiz) — corresponde ao passo *Test workspace* do CI.
- **Contribuidores e agentes:** seguir o fluxo recomendado em [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md); o **CI continua a fonte de verdade** para o que é executado em runner.

**Ponte M2:** o marco T3 e a matriz prod/CI estão documentados em [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md) (em especial a secção 6 e o handoff «o que o CI garante» para T4). O workflow atual materializa essa pipeline reprodutível; qualquer hook T6 deve invocar o **mesmo** tipo de comandos (raiz do monorepo, mesmos scripts), não atalhos paralelos (`npx eslint` isolado, outro diretório de trabalho) salvo decisão documentada e alinhada ao M2.

**T6 e M4:** o **fecho completo** de T6 (hooks operacionais + fixture, para além deste alvo documental) depende do marco **M4 (T5)** e da Opção A/B descrita em [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md); ver também o contexto em [`micro/M3-A2-01-husky-lefthook-hooks-nativos-riscos.md`](M3-A2-01-husky-lefthook-hooks-nativos-riscos.md).
