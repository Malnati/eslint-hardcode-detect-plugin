# M3-A2-01: Husky, Lefthook, hooks nativos — riscos

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M3-A2-01 |
| milestone | M3 |
| depends_on | M3-A1-03 |
| blocks | M3-A2-02 |
| plan_requirements | `m3-sec4-order-2`, `m3-sec7-A2`, `m3-sec10-risks` |

## Objetivo

Comparar abordagens (Husky, Lefthook, hooks Git nativos) para acionar `eslint` no pre-commit/pre-push, com foco em **riscos:** alteração de estado git em CI, dependências extra, e divergência de versão do Node/eslint.

## Definition of done

- Tabela curta: ferramenta → prós/contras → risco em CI → mitigação sugerida (documental neste marco).

## Paths principais

- [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) §10

---

## Comparação de abordagens — riscos (entregável)

O plano do marco em [`docs/distribution-milestones/m3-channel-t4-t6.md`](../../../m3-channel-t4-t6.md) **§10** assinala dois riscos normativos: fechar **T6** antes de **T5 (M4)** quebra a cadeia T1→T6; e **hooks que alteram estado git** (format/fix + stage/commit automáticos) em fluxos mal desenhados podem surpreender **CI** ou clones automatizados. Neste marco **M3** a política de hooks para `eslint` permanece **preparação documental**; T6 «forte» (fixture e hooks operacionais) só após handoff **M4**, conforme Opção A/B do mesmo plano.

| Abordagem | Prós / contras | Risco em CI | Mitigação sugerida (documental) |
|-----------|----------------|-------------|--------------------------------|
| **Husky** | **Prós:** padrão npm (`prepare` / `postinstall`), familiar para equipas JS.<br>**Contras:** **devDependency** extra; o hook invoca o **Node** e scripts do `package.json` — versão de Node/eslint pode divergir do runner se não houver política única. | Se `npm install`/`prepare` instalar hooks e um job **reutilizar** o mesmo clone para commits de bot/merge, um hook pode correr e **mutar** working tree ou **staging**; pipelines que não esperam hooks podem falhar ou ficar não determinísticos. **Divergência** Node/eslint vs matriz do CI. | Documentar **`HUSKY=0`** (ou variável suportada pela versão) em jobs CI onde hooks não são desejados; alinhar comandos ao mesmo caminho que [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) / M2; pin de **Node** (`engines`, [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml)); evitar em hooks **auto-commit** ou `--fix` + `git add` sem revisão explícita. |
| **Lefthook** | **Prós:** config declarativa (YAML), paralelização, pode usar binário Go ou via npm.<br>**Contras:** ferramenta e ficheiro de config **adicionais**; mesma classe de acoplamento Node/caminho que Husky quando os comandos passam por `npm`/`npx`. | Idêntica em essência a Husky: execução em ambientes onde **não** se pretendem hooks; risco de **mutação** se tarefas de lint aplicam fix e alteram ficheiros rastreados; **versões** de runtime diferentes das do CI. | Desativar em CI com **`LEFTHOOK=0`** (comportamento documentado do Lefthook) ou condicionar scripts; mesma política de **um comando de lint** igual ao CI; não depender de hooks para o único gate de qualidade — o CI continua fonte de verdade (M2). |
| **Hooks Git nativos** (ex.: scripts em diretório apontado por `core.hooksPath` versionado, ou cópia manual para `.git/hooks`) | **Prós:** sem dependência npm obrigatória para o **mecanismo** do hook; controlo total do shell invocado.<br>**Contras:** `.git/hooks` **não** vai no clone — cada dev sincroniza à mão **ou** usa `core.hooksPath` para pasta no repo; **portabilidade** (Windows vs POSIX, shebang). | Em CI, clones limpos **não** trazem hooks por defeito — risco baixo de execução acidental **a menos** que o workflow **configure** `core.hooksPath` ou copie hooks. Risco maior é **inconsistência**: dev A usa `npx eslint` local, CI usa outro Node; ou script nativo chama ferramenta fora do `PATH` do runner. | Versionar scripts sob o repo + documentar `git config core.hooksPath` uma vez; no hook, chamar **exatamente** os mesmos comandos que [`CONTRIBUTING.md`](../../../../../CONTRIBUTING.md) (ex.: `npm run lint` na raiz); em CI, **não** instalar hooks; garantir **mesma major** de Node que o workflow. |
