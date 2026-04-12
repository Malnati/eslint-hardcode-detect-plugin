# Contrato: mensagens de erro em três partes (agentes de IA)

Este documento define o formato **obrigatório** para **comunicar falhas** (erros de ferramentas, testes, build, CI, análise de causa ou bloqueios) nas respostas de agentes de IA que atuam neste repositório. Alinha-se à regra futura `standardize-error-messages` em [`specs/plugin-contract.md`](plugin-contract.md) (catálogo com três campos semânticos) e à política de caminhos em [`docs/documentation-policy.md`](../docs/documentation-policy.md).

**Fonte única dos literais:** os três prefixos canónicos estão definidos apenas neste spec; rules, skills e remissões devem apontar para aqui em vez de duplicar tabelas completas.

## Objetivo

Separar sempre o conteúdo em **três audiências** distintas, para que:

1. perfis **sênior** encontrem rapidamente tracing, trechos de log e hipótese de causa técnica;
2. quem corrige **definitivamente** veja o que falta em produto, processo, automação, proteções ou testes que evitem recorrência;
3. quem precisa **desbloquear o uso** veja um contorno seguro enquanto a correção definitiva segue em paralelo.

## Prefixos canónicos (obrigatórios)

Cada uma das três partes deve começar pela **primeira linha de conteúdo** da secção com o prefixo correspondente (ASCII, exatamente como na tabela). Pode haver um cabeçalho Markdown antes; o prefixo é a primeira linha do corpo da parte.

| Parte | Prefixo | Função |
|-------|---------|--------|
| Diagnóstico técnico (sênior) | `[HCD-ERR-SENIOR]` | Tracing, log, hipótese de causa imediata |
| Correção definitiva | `[HCD-ERR-FIX]` | Remediação de raiz, automação, proteções, testes |
| Contorno operacional | `[HCD-ERR-OPS]` | Desbloqueio seguro em paralelo; riscos do contorno |

**Regras:**

- Não basta o título da secção: as três linhas prefixadas devem existir.
- O prefixo deve ser o **início** da primeira linha de conteúdo daquela parte (após o cabeçalho, se existir).
- Onde uma parte não tiver conteúdo útil, usar linha mínima após o prefixo, por exemplo: `[HCD-ERR-OPS] Não aplicável — …`.

## Unidade de falha

Uma **unidade de falha** é um relato que descreve um problema distinto que exige um trio completo de prefixos.

- **Uma falha principal:** um trio (SENIOR, FIX, OPS) com contagens 1:1:1.
- **Múltiplas falhas:** preferir **um trio por falha** (subsecções ou lista numerada por falha). Se o autor declarar no preâmbulo quantas falhas **N** estão cobertas, o Nível 2 exige `count(SENIOR) == count(FIX) == count(OPS) == N`.

## Formato na resposta

Quando houver **falha ou erro** a relatar, usar **três secções** com títulos legíveis (nível de cabeçalho Markdown à escolha) e, em cada secção, o conteúdo abaixo **na primeira linha de corpo** com o prefixo correspondente.

### 1. Diagnóstico técnico (sênior) — linha com `[HCD-ERR-SENIOR]`

- Trecho relevante da mensagem de erro, **stack** ou saída de comando (cerca de código quando fizer sentido).
- Correlação com ficheiros deste repositório usando **caminhos relativos à raiz** (ver [`docs/documentation-policy.md`](../docs/documentation-policy.md)).
- Hipótese clara da **causa técnica** imediata (o que falhou e onde).

### 2. Correção definitiva — linha com `[HCD-ERR-FIX]`

- O que alterar no **sistema** para o erro não voltar: código, contrato, CI, documentação normativa, automação, pré-condições, invariantes, testes de regressão.
- Se o problema for **sistémico** (ausência de proteção, falta de check, gap de automação), indicá-lo explicitamente aqui.

### 3. Contorno operacional — linha com `[HCD-ERR-OPS]`

- Passos para **continuar trabalhando** ou mitigar o impacto **enquanto** a correção definitiva não está aplicada (flags, ordem de tarefas, bypass documentado, rollback seguro).
- **Riscos** ou limitações do contorno (o que não resolve).

### Exemplo mínimo (estrutura)

```markdown
### Diagnóstico técnico (sênior)

[HCD-ERR-SENIOR] Comando falhou com exit 1; trecho: …; hipótese: …

### Correção definitiva

[HCD-ERR-FIX] Ajustar …; adicionar teste …

### Contorno operacional

[HCD-ERR-OPS] Até aplicar a correção, usar …; risco: …
```

## Níveis de conformidade

### Nível 1 — Presença (mecânico)

Para o texto auditado, verificar que existe **pelo menos uma ocorrência de cada um** dos três prefixos `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`. Falha se faltar qualquer prefixo ou se o relato pretende descrever uma falha completa mas só traz uma ou duas partes.

### Nível 2 — Quantitativo (balanceamento)

Contar ocorrências de cada prefixo no texto (um prefixo por linha que o inicia). Para conformidade estrita, com **N** unidades de falha no relato:

`count(SENIOR) == count(FIX) == count(OPS) == N`.

Se houver ambiguidade no número de falhas, o autor deve declarar **N** no preâmbulo ou estruturar um trio explícito por falha.

### Nível 3 — Análise (qualitativo)

Revisão humana (não basta regex): separação semântica correta (diagnóstico sem misturar com contorno; contorno sem prometer correção de causa raiz; caminhos relativos à raiz no bloco sênior quando aplicável; riscos do contorno no bloco OPS). Segue os bullets das três secções acima e [`docs/documentation-policy.md`](../docs/documentation-policy.md).

## Auditoria rápida (Níveis 1 e 2)

Sobre o texto exportado (log, comentário, ficheiro colado):

```bash
grep -c '\[HCD-ERR-SENIOR\]' arquivo.md
grep -c '\[HCD-ERR-FIX\]' arquivo.md
grep -c '\[HCD-ERR-OPS\]' arquivo.md
```

Comparar os três totais entre si e com **N**. O Nível 3 permanece checklist manual.

**Extensão futura:** automatizar no CI só quando existir artefacto estável (ex. relatório em ficheiro) gerado pelo fluxo.

## Casos limite

| Situação | O que fazer |
|----------|-------------|
| **Sucesso** sem falha a reportar | Não é obrigatório usar as três secções nem os prefixos. |
| **Falha trivial** (mensagem muito curta) | Manter as **três partes** com os **três prefixos**; usar *Não aplicável* ou uma frase mínima após o prefixo onde não houver conteúdo útil. |
| **Delegação** a sub-agentes (Task, Copilot, etc.) | O **relatório devolvido** ao agente orquestrador deve usar os mesmos prefixos na primeira linha de cada parte; o orquestrador **consolida** ou reexporta no mesmo formato. |
| **Múltiplas falhas** | Um trio por falha principal ou preâmbulo com **N** e contagens balanceadas conforme Nível 2; não misturar audiências num único parágrafo. |

## Relação com o plugin ESLint

A regra planejada `standardize-error-messages` (ver [`specs/plugin-contract.md`](plugin-contract.md)) usará um catálogo cujas entradas contêm três campos (`seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround`) **semanticamente alinhados** a este spec. **Recomenda-se** que cada string do catálogo **comece** pelo prefixo da parte correspondente (mesma tabela acima), para auditoria unificada entre mensagens de agente e mensagens emitidas pelo código. Agentes que implementarem essa regra devem manter a mesma separação de significados.

## Versão do documento

- **2.0.0** — prefixos canónicos obrigatórios; unidade de falha; níveis de conformidade 1–3; receita de auditoria; exemplo mínimo.
- **1.0.0** — contrato inicial: três blocos, casos limite, remissões.
