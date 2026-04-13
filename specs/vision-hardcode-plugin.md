# Visão: detecção de hardcode em múltiplos níveis

Este documento descreve a **direção do produto** para o plugin ESLint **eslint-plugin-hardcode-detect**. Não substitui o contrato normativo imediato em [`plugin-contract.md`](plugin-contract.md); funciona como **roadmap** e alinhamento entre mantenedores e agentes.

## Objetivo

Reduzir strings e valores fixos inadequados no código, com relatórios **classificados**, **ordenados** e com **níveis** de severidade configuráveis, evoluindo de análise local (arquivo) para visões mais amplas quando viável no ecossistema ESLint.

## Dimensões planejadas

| Dimensão | Descrição |
|----------|-----------|
| Por arquivo | Regras AST escopadas ao arquivo (baseline; já alinhado ao contrato atual). |
| Por dependências | Identificar padrões ligados a imports/pacotes (ex.: mensagens repetidas por módulo), quando tecnicamente suportado. |
| Classificados | Categorias de hardcode (UI, erro, log, config) com opções de regra. |
| Ordenados | Relatórios e opções que permitam priorizar correções (ex.: por severidade ou categoria). |
| Nivelados | Severidades ESLint (`off`/`warn`/`error`) e níveis de “gravidade” de negócio opcionais via schema de opções. |

## Relação com o contrato atual

As regras `no-hardcoded-strings` e `standardize-error-messages` são a **base**. A regra `standardize-error-messages` (quando implementada) deve usar o catálogo com três campos por código (`seniorDiagnostic`, `systemicRemediation`, `operationalWorkaround`), alinhados semanticamente a [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md), para separar diagnóstico técnico, correção definitiva e contorno operacional nas mensagens padronizadas; recomenda-se que cada string comece pelo prefixo correspondente do spec (auditoria unificada com respostas de agentes). **Definições de sistema para agentes:** o mesmo spec fixa prefixos obrigatórios e três **níveis de conformidade** (presença mecânica, balanceamento por contagens, análise qualitativa) para relatórios de falha. A regra `hello-world` é apenas **demonstração** para validar o carregamento do plugin; não entra no roadmap funcional de hardcode. Novas regras ou opções devem atualizar `plugin-contract.md` e este documento quando afetarem a visão macro.

## Mapa conceitual de categorias

A taxonomia de tipos de hardcoding, níveis de gravidade (L1–L4) e camadas de detecção (texto, AST, parsers, revisão) está em [`docs/hardcoding-map.md`](../docs/hardcoding-map.md). O documento complementa este roadmap sem substituir o contrato normativo em [`plugin-contract.md`](plugin-contract.md).

## Plano macro de remediação

Visão geral, princípios e diagramas do roadmap de **remediação assistida** (trilhas R1–R3, **segredos**, **reconfirmação** do índice a cada execução do ESLint) estão em [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md); orienta marcos M0–M5. O alinhamento de produto das trilhas com o **contrato** está na secção seguinte; o **vocabulário normativo** das opções públicas planejadas (nomes, tipos, semântica) está em [`plugin-contract.md`](plugin-contract.md), secção *Remediação assistida — opções públicas planeadas (R1–R3)*. Alterações de comportamento público continuam a exigir atualização de [`plugin-contract.md`](plugin-contract.md).

## Trilhas R1–R3 e relação com o contrato

Em caso de divergência entre este roadmap e o contrato, **prevalece** [`plugin-contract.md`](plugin-contract.md).

As trilhas **R1** (por ficheiro), **R2** (multi-ficheiro / módulo partilhado) e **R3** (ficheiros de dados e ambiente) podem corresponder a regras distintas ou a modos da mesma família de regras; a escolha está formalizada no contrato, incluindo a opção `remediationMode` com valores `"off"`, `"r1"`, `"r2"`, `"r3"` e `"auto"` (heurística que escolhe R1/R2/R3 quando suportado).

### R1 — constantes no mesmo ficheiro

Âmbito ao ficheiro actual e ao modelo clássico de `fix` / `suggest` ESLint sobre o AST corrente; declarações ordenadas (ex.: no topo do ficheiro), substituição de ocorrências do mesmo valor no mesmo `SourceCode` quando a política de deduplicação no ficheiro estiver activa — em linha com a secção *R1 — constantes no mesmo ficheiro* do contrato.

### R2 — módulo partilhado e índice no âmbito do lint

Quando o **mesmo valor normalizado** ocorre em **mais do que um** ficheiro do conjunto lintado, gerar ou actualizar um **módulo partilhado** configurável e reescrever imports e referências. O índice de literais para duplicados **reconstrói-se** ou invalida-se correctamente em cada invocação do ESLint sobre o âmbito definido pelo `eslint.config` — sem cache stale entre execuções sem política explícita; «global» significa o âmbito do projecto segundo o flat config, não o universo da organização. O desenho deve **documentar** a interacção com `concurrency` / workers, porque estado em memória partilhado pode ser inválido se vários workers processarem ficheiros em paralelo — conforme a secção *R2 — módulo partilhado e índice global no âmbito do lint* do contrato.

### R3 — ficheiros de dados e ambiente

Externalizar valores para ficheiros de dados (formatos e estratégia de merge conforme contrato) e código de leitura adequado à stack; variáveis de ambiente quando aplicável. Valores classificados como **segredos** **não** são escritos em claro em ficheiros de dados; seguem `secretRemediationMode` e o macro-plan — alinhado à secção *R3 — ficheiros de dados e ambiente* do contrato.

### Preocupações transversais

- **`remediationMode`** — selecciona a trilha de remediação ou `"auto"` quando a implementação suportar heurística; `"off"` mantém apenas detecção.
- **`secretRemediationMode`** — modo seguro por defeito; qualquer fix mais agressivo para candidatos a segredo exige opt-in explícito, em harmonia com L1 em [`docs/hardcoding-map.md`](../docs/hardcoding-map.md) e com [`specs/agent-integration-testing-policy.md`](agent-integration-testing-policy.md) (sem simular fornecedores externos no repositório).
- **`envDefaultLiteralPolicy`** — tratamento de literais que são fallbacks de `process.env` (operadores `??` ou `||`) ou espelhos em constantes; mesma classe de hardcode que o literal de default, sujeita à trilha efectiva após classificação.

Nomes de opções, tipos, valores por defeito planeáveis e marcos alvo (M1–M4) são **normativos** em [`plugin-contract.md`](plugin-contract.md), secção *Remediação assistida — opções públicas planeadas (R1–R3)*; a taxonomia HC-* e níveis L1–L4 permanecem no mapa, sem duplicar a tabela mestra aqui.

## Versão

- **0.7.0** — alinhamento M0 (tarefa A2): trilhas R1–R3, preocupações transversais (`remediationMode`, `secretRemediationMode`, `envDefaultLiteralPolicy`) e remissão normativa à secção de remediação em [`plugin-contract.md`](plugin-contract.md); coerência com o plano macro em [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md).
- **0.6.0** — remissão ao plano macro de remediação em [`docs/hardcode-remediation-macro-plan.md`](../docs/hardcode-remediation-macro-plan.md).
- **0.5.0** — mensagens de agente: prefixos HCD-ERR-* e níveis de conformidade em [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md); catálogo do plugin alinhado.
- **0.4.0** — `standardize-error-messages` e alinhamento com [`agent-error-messaging-triple.md`](agent-error-messaging-triple.md).
- **0.3.0** — referência ao mapa conceitual em [`docs/hardcoding-map.md`](../docs/hardcoding-map.md).
- **0.2.0** — distinção explícita da regra de demonstração `hello-world` em relação à base de produto.
- **0.1.0** — primeira definição da visão multi-nível.
