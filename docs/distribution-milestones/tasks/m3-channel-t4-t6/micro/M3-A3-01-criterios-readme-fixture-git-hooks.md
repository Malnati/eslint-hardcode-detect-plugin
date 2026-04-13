# M3-A3-01: Critérios e limites — README da fixture git hooks

| Campo | Valor |
|-------|--------|
| parent_task | A3 |
| micro_id | M3-A3-01 |
| milestone | M3 |
| depends_on | M3-A3-02 |
| blocks | M3-A3-03 |
| plan_requirements | `m3-sec4-order-3`, `m3-sec7-A3` |

## Objetivo

Definir critérios para o futuro pacote `packages/e2e-fixture-git-hooks-sample`: o que o README deve prometer (reprodutibilidade local, relação com monorepo, ausência de serviço HTTP obrigatório), o que fica fora de escopo.

## Definition of done

- Lista de critérios pronta para copiar para o README quando o pacote for criado; alinhada ao plano M3 §6 (matriz e2e × Compose).

## Paths principais

- [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §4 onda 3

---

## Critérios para o README — `e2e-fixture-git-hooks-sample` (entregável)

Texto normativo **pronto para copiar** (ou adaptar) para o futuro `packages/e2e-fixture-git-hooks-sample/README.md` quando o workspace existir. Alinha [`m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §4 onda 3, §6 (matriz e2e × Compose), §7 camada A3 e o gate M4 em [`M3-A3-02-gate-nao-fechar-t6-sem-m4.md`](M3-A3-02-gate-nao-fechar-t6-sem-m4.md).

### O que o README deve deixar explícito

- **Natureza do pacote:** workspace **auxiliar** do monorepo, **não** pacote npm publicável; o código publicável do plugin continua **somente** em [`packages/eslint-plugin-hardcode-detect`](../../../../../packages/eslint-plugin-hardcode-detect/) (ver [`AGENTS.md`](../../../../../AGENTS.md) e o paralelo em [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md)).
- **Reprodutibilidade local:** a partir da **raiz** do clone, `npm install` (workspaces); documentar comandos **concretos** para instalar o hook de exemplo e correr o lint que o hook dispara. O hook deve espelhar o **mesmo** tipo de comandos que o CI e [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) — alvo normativo em [`M3-A2-02-alinhamento-cli-lint-ci-m2.md`](M3-A2-02-alinhamento-cli-lint-ci-m2.md) (ex.: `npm run lint` na raiz; testes do plugin via `npm test -w eslint-plugin-hardcode-detect` quando relevante).
- **Relação com o monorepo:** declarar que o `cwd` efetivo dos scripts é a **raiz** do repositório; evitar `npx eslint` isolado ou outro diretório de trabalho **salvo** decisão documentada e alinhada ao M2/M3.
- **Sem serviço HTTP obrigatório:** a massa T6 é **validação local** do fluxo de hooks + ESLint; **não** exigir aplicação web nem porto HTTP para reproduzir o exemplo. Isto espelha a linha **§6** do plano M3 (*Fixture hooks (futura)*: perfil Compose *N/A típico*; contraste com a linha T4/Nest onde a IDE é local e o Compose também é *N/A típico* para o fluxo principal).
- **CI:** «Job **opcional** ou **documentado**» (matriz §6); o README **não** deve exigir um job de CI para o contribuidor validar o exemplo no próprio clone.
- **Gate T6 / M4:** não declarar T6 «done» nem sugerir merge que **feche** T6 sem o marco **M4** satisfeito; remeter ao checklist em [`M3-A3-02`](M3-A3-02-gate-nao-fechar-t6-sem-m4.md) e a [`m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §10.

### Fora de escopo (o README deve admitir limites)

- Substituir ou duplicar o **pipeline de CI** como fonte de verdade; o CI permanece normativo.
- Exigir **Docker** ou perfil Compose para o fluxo **mínimo** de reprodução (Compose pode ser *alternativa* documentada, como em [`specs/e2e-fixture-nest.md`](../../../../../specs/e2e-fixture-nest.md), mas não barreira obrigatória para o exemplo de hooks).
- Ignorar riscos de hooks que **alteram estado git** em ambientes de CI (contexto em [`distribution-channels-macro-plan.md`](../../../../distribution-channels-macro-plan.md) e [`M3-A2-01`](M3-A2-01-husky-lefthook-hooks-nativos-riscos.md)).

### README modelo (opcional — colar e preencher)

```markdown
# e2e-fixture-git-hooks-sample

Workspace **auxiliar** (não publicável no npm) para demonstrar git hooks (ex.: Husky / Lefthook / hooks nativos) que disparam o **mesmo** fluxo de lint/CLI documentado para o monorepo.

## Pré-requisitos

- Node.js compatível com `engines` do pacote [`eslint-plugin-hardcode-detect`](../../eslint-plugin-hardcode-detect/).
- Clone com `npm install` na **raiz** do repositório (`workspaces`).

## O que este pacote promete

- Reprodução **local** do hook de exemplo sem serviço HTTP obrigatório.
- Comandos alinhados a [`CONTRIBUTING.md`](../../CONTRIBUTING.md) e ao CI (ver guia M3-A2-02 no repositório).

## O que este pacote não promete

- Substituir o job de CI; não declarar o canal T6 «fechado» sem o gate M4 (ver docs do marco M3).

## Como validar

- (Preencher: instalar hook de exemplo; correr lint da raiz; etc.)
```

*(Os links relativos do modelo assumem `README.md` dentro de `packages/e2e-fixture-git-hooks-sample/`; ajustar após criar o diretório.)*
