# `standardize-error-messages`

Regra (`problem`) definida no contrato do plugin: padronizar mensagens de erro e de log com código identificável e, quando houver catálogo, validar contra o catálogo no flat config. Inclui opções (`messages`, `codePattern`, `loggers`, `errorConstructors`) e `messageId`s de relatório (`missingCode`, `unknownCode`, `invalidCatalogEntry`, `dynamicMessage`).

**Neste pacote**, a regra consta do contrato público mas **ainda não** está incluída no artefacto publicável exportado por `eslint-plugin-hardcode-detect` — implementação futura alinhada ao spec.

Ver contrato em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
