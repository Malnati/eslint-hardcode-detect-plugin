# `standardize-error-messages`

Regra (`problem`) definida no contrato do plugin: padronizar mensagens de erro e de log com código identificável e, quando houver catálogo, validar contra o catálogo no flat config. Inclui opções (`messages`, `codePattern`, `loggers`, `errorConstructors`) e `messageId`s de relatório (`missingCode`, `unknownCode`, `invalidCatalogEntry`, `dynamicMessage`).

Cada entrada do catálogo `messages` (mapa código → objeto) deve definir três strings não vazias, alinhadas semanticamente a [`specs/agent-error-messaging-triple.md`](../../../../specs/agent-error-messaging-triple.md):

| Campo | Papel |
|-------|--------|
| `seniorDiagnostic` | Texto para diagnóstico técnico (tracing, correlação, causa imediata). **Recomenda-se** iniciar por `[HCD-ERR-SENIOR]`. |
| `systemicRemediation` | Texto para correção definitiva (causa raiz, automação, proteções, testes). **Recomenda-se** iniciar por `[HCD-ERR-FIX]`. |
| `operationalWorkaround` | Texto para contorno operacional seguro em paralelo à correção definitiva. **Recomenda-se** iniciar por `[HCD-ERR-OPS]`. |

Os prefixos são os mesmos do spec de agentes; permitem auditoria unificada (Níveis 1–2) entre mensagens emitidas pelo código e relatórios de falha de agentes.

**Neste pacote**, a regra consta do contrato público mas **ainda não** está incluída no artefacto publicável exportado por `eslint-plugin-hardcode-detect` — implementação futura alinhada ao spec.

Ver contrato em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
