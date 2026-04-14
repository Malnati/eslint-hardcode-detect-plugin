# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato é inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/) na linha **0.y.z** até estabilização da API pública do plugin (ver [`specs/plugin-contract.md`](../../specs/plugin-contract.md)).

## [0.1.1] - 2026-04-14

### Changed

- Patch release: documentation only (repository and `docs/` guides in US English). No changes to exported rules, options, or runtime behavior.

## [0.1.0] - 2026-04-14

### Added

- Primeira versão numerada do pacote publicável após `0.0.0` de desenvolvimento.
- Regras exportadas: `hello-world` (demonstração), `no-hardcoded-strings` (detecção e remediação conforme contrato).
- Config `hardcode-detect/recommended` com `settings.hardcodeDetect` para índice R2 na mesma invocação `lintFiles`.
- Modos de remediação `remediationMode`: `off`, `r1` (constantes no mesmo ficheiro), `r2` (duplicados cross-file — detecção; autofix R2 reservado), `r3` (merge em ficheiros de dados JSON/YAML quando configurado), `auto` (mapeado para R1 na implementação actual).
- Opções de segredo e literais de fallback de ambiente alinhadas a [`specs/plugin-contract.md`](../../specs/plugin-contract.md).
- Exportação de utilitários e tipos para writers R3 (`mergePlainObjectDeep`, `parseJsonRootObject`, parsers YAML, `stableStringifyJson` / `stableStringifyYaml`, tipos associados) conforme entrada pública do pacote.

### Notes

- A regra `standardize-error-messages` permanece **no contrato** e **fora** do artefacto exportado até implementação dedicada (ver README do pacote).
