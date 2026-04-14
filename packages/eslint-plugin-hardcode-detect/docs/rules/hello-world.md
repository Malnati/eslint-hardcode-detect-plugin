# `hello-world`

**Demonstration** rule (“Hello World”): on the `Program` node visit, emits a single report per file with `messageId` `hello`, to confirm `eslint-plugin-hardcode-detect` is loaded.

- **Not** included in the plugin’s `recommended` preset (avoids noise).
- Enable explicitly in flat config, for example: `"hardcode-detect/hello-world": "warn"`.

See contract in [`specs/plugin-contract.md`](../../../../specs/plugin-contract.md).
