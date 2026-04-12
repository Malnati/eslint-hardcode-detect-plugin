# `no-hardcoded-strings`

Regra de produto (`problem`): desencoraja literais de string hardcoded no código, exceto strings triviais muito curtas.

- Em nós `Literal` cujo valor é `string`, se `value.length >= 2`, a regra reporta com a mensagem configurada (equivalente a: evitar string literal; mover para constantes ou catálogo). Strings com comprimento menor que 2 são ignoradas.
- **Mensagens**: pelo menos `hardcoded`, com texto orientando uso de constantes ou catálogo.
- Faz parte do preset `recommended` do plugin (`hardcode-detect/recommended`).

Ver contrato em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
