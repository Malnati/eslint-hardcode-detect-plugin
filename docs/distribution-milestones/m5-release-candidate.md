# Marco M5: release (`release-candidate`)

Plano para **congelar versão semver**, **tag Git**, **notas de release** e **validação pós-deploy** da **cadeia completa T1→T6**. Inclui **aceite final de T6** se ainda estiver em aberto após M4 (hooks alinhados ao lint validado).

**Milestone GitHub sugerido:** `release-candidate`  
**Labels:** `area/channel-T1` … `area/channel-T6` (release transversal), `type/chore` ou release tooling.

---

## 1. Objetivo e escopo (trilhas e canais)

- Bump em [`../../packages/eslint-plugin-hardcode-detect/package.json`](../../packages/eslint-plugin-hardcode-detect/package.json), changelog ou notas; tag; smoke em consumidor limpo opcional.
- **Distribuições:** npm; imagem ops-eslint se política de tag; canais indiretos (marketplace) como checklist **fora** do tarball principal.

---

## 2. Dependências e handoff (cadeia T1→T6)

| | Conteúdo |
|---|-----------|
| **Entrada (consome)** | **T1–T6:** artefatos e documentação dos marcos anteriores; **M4** concluído para política de agente; **T6** fechado conforme política M3/M4. |
| **Saída (entrega)** | Versão publicada ou tag RC; evidências de smoke; documentação de suporte. |
| **Risco se handoff falhar** | Tag sem testes verdes; consumidores quebrados; docs desatualizados. |

---

## 3. Diagrama de sequência (Mermaid)

```mermaid
sequenceDiagram
  participant Maint as Maintainer
  participant Ver as verificacao_T1_T6
  participant Pkg as npm_pack
  participant Reg as registry
  Maint->>Ver: checagens_finais
  Ver-->>Maint: ok
  Maint->>Pkg: bump_version
  Maint->>Reg: npm_publish
  Reg-->>Maint: tarball
  Maint->>Maint: git_tag_release
```

---

## 4. Timelining

| Ordem | Subtarefa | Depende de | “Pronto para PR” quando |
|-------|-----------|------------|-------------------------|
| 1 | Congelar escopo release | M4 + T6 | Lista de PRs merged |
| 2 | Changelog / notas | 1 | Texto revisado |
| 3 | Publish + tag | 2 | Artefato verificável |

---

## 5. Gantt (janela do marco)

```mermaid
gantt
  title Marco M5 release
  dateFormat YYYY-MM-DD
  section Release
  Notas_e_bump :m5a, 2026-07-01, 5d
  Publish_tag :m5b, after m5a, 5d
  section Pos_deploy
  Smoke_consumidor :m5c, after m5b, 4d
```

---

## 6. Matriz e2e × Docker Compose

| Massa / projeto | Trilha | Perfil | Comando ou job |
|-----------------|--------|--------|----------------|
| Consumidor limpo (opcional) | T1 | `e2e` ou host | `npm pack` / install em temp | 
| Paridade local | T3 | `prod` | Última verificação antes de tag |

---

## 7. Camada A — Tarefas e orçamento de tokens (pré-execução de agentes)

| ID | Tarefa | Teto (tokens) estimado | Critério de conclusão |
|----|--------|------------------------|----------------------|
| A1 | Definir semver (major/minor/patch) | 15 000 | Justificativa breaking |
| A2 | Rascunho notas release | 20 000 | Links issues/PRs |
| A3 | Plano smoke pós-publish | 18 000 | Passos reprodutíveis |

---

## 8. Camada B — Execução de agentes por fase

| Fase | O que executar | Evidência | Handoff |
|------|----------------|-----------|---------|
| Desenvolvimento | Ajustes finais código/docs se necessário | PR | |
| Testes | `npm test` completo; CI verde | Logs | |
| Análise | Comparar com roadmap | | |
| Logs e documentos | CHANGELOG, GitHub Release | | |
| Correções | Hotfix se necessário | | |
| Deploy / releasing | `npm publish`, tag | Artefatos | |
| Validações | Smoke consumidor | Captura | |
| Distribuições | Registries privados / imagem | Checklists | |

---

## 9. Plano GitHub (PR, branch, semver)

- **PR:** `chore(release): milestone M5 — version bump and notes` (ajustar)
- **Branch:** `milestone/m5-release-candidate` ou `release/x.y.z`
- **Semver:** **obrigatório** alinhar tipo de bump ao contrato e breaking changes; seguir Conventional Commits e [`../versioning-for-agents.md`](../versioning-for-agents.md).

---

## 10. Riscos e critérios de “done”

- **Riscos:** secret leak em CI; tag em commit errado.
- **Done:** versão publicada (ou RC documentada); tag; notas; smoke documentado; cadeia T1→T6 referenciada como validada.
