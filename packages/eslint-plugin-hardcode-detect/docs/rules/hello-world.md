# `hello-world`

Regra de **demonstração** (“Hello World”): emite um único aviso por arquivo na raiz do programa, para confirmar que `eslint-plugin-hardcode-detect` está carregado.

- **Não** está incluída no preset `recommended` do plugin (evita ruído).
- Ative explicitamente no flat config, por exemplo: `"hardcode-detect/hello-world": "warn"`.

Ver contrato em [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
