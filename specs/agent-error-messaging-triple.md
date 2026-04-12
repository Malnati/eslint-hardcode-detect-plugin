# Contrato: mensagens de erro em três partes (agentes de IA)

Este documento define o formato **obrigatório** para **comunicar falhas** (erros de ferramentas, testes, build, CI, análise de causa ou bloqueios) nas respostas de agentes de IA que atuam neste repositório. Alinha-se à regra futura `standardize-error-messages` em [`specs/plugin-contract.md`](plugin-contract.md) (catálogo com três campos semânticos) e à política de caminhos em [`docs/documentation-policy.md`](../docs/documentation-policy.md).

## Objetivo

Separar sempre o conteúdo em **três audiências** distintas, para que:

1. perfis **sênior** encontrem rapidamente tracing, trechos de log e hipótese de causa técnica;
2. quem corrige **definitivamente** veja o que falta em produto, processo, automação, proteções ou testes que evitem recorrência;
3. quem precisa **desbloquear o uso** veja um contorno seguro enquanto a correção definitiva segue em paralelo.

## Formato na resposta

Quando houver **falha ou erro** a relatar, usar **três secções** com estes títulos estáveis (nível de cabeçalho Markdown à escolha do agente, desde que os rótulos permaneçam legíveis):

### 1. Diagnóstico técnico (sênior)

- Trecho relevante da mensagem de erro, **stack** ou saída de comando (cerca de código quando fizer sentido).
- Correlação com ficheiros deste repositório usando **caminhos relativos à raiz** (ver [`docs/documentation-policy.md`](../docs/documentation-policy.md)).
- Hipótese clara da **causa técnica** imediata (o que falhou e onde).

### 2. Correção definitiva

- O que alterar no **sistema** para o erro não voltar: código, contrato, CI, documentação normativa, automação, pré-condições, invariantes, testes de regressão.
- Se o problema for **sistémico** (ausência de proteção, falta de check, gap de automação), indicá-lo explicitamente aqui.

### 3. Contorno operacional

- Passos para **continuar trabalhando** ou mitigar o impacto **enquanto** a correção definitiva não está aplicada (flags, ordem de tarefas, bypass documentado, rollback seguro).
- **Riscos** ou limitações do contorno (o que não resolve).

## Casos limite

| Situação | O que fazer |
|----------|-------------|
| **Sucesso** sem falha a reportar | Não é obrigatório usar as três secções. |
| **Falha trivial** (mensagem muito curta) | Manter as **três secções**; usar *Não aplicável* ou uma frase mínima onde não houver conteúdo útil. |
| **Delegação** a sub-agentes (Task, Copilot, etc.) | O **relatório devolvido** ao agente orquestrador deve seguir este formato quando descrever falhas; o orquestrador **consolida** ou reexporta no mesmo formato. |
| **Múltiplas falhas** | Uma tripla por falha principal ou agrupar com subsecções claras, sem misturar audiências num único parágrafo. |

## Relação com o plugin ESLint

A regra planejada `standardize-error-messages` (ver [`specs/plugin-contract.md`](plugin-contract.md)) usará um catálogo cujas entradas contêm três campos (`seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround`) **semanticamente alinhados** a este spec. Agentes que implementarem essa regra devem manter a mesma separação de significados.

## Versão do documento

- **1.0.0** — contrato inicial: três blocos, casos limite, remissões.
