# Rascunho — notas de release (GitHub / npm)

**Pacote:** `eslint-plugin-hardcode-detect` **v0.1.0**

## Resumo

Primeira versão numerada após desenvolvimento em `0.0.0`, com regras e preset documentados em [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md), remediação **R1** (autofix no mesmo ficheiro), detecção **R2** (duplicados entre ficheiros na mesma execução) e **R3** (escrita controlada em JSON/YAML quando configurado), mais políticas de segredos e literais de fallback de ambiente.

## Destaques

- Preset `hardcode-detect/recommended` com bolsa `settings.hardcodeDetect` para o índice R2.
- Opção `remediationMode` com valores `off` | `r1` | `r2` | `r3` | `auto` (ver contrato para semântica exacta).
- Exportação de utilitários de merge/serialização para cenários R3 avançados.

## Breaking changes

- Nenhum face a um release npm anterior publicado; utilizadores que dependiam apenas de `0.0.0` local devem validar contra o contrato actual.

## Documentação

- [`packages/eslint-plugin-hardcode-detect/README.md`](../../../../../packages/eslint-plugin-hardcode-detect/README.md)
- [`packages/eslint-plugin-hardcode-detect/CHANGELOG.md`](../../../../../packages/eslint-plugin-hardcode-detect/CHANGELOG.md)

## Instalação

```bash
npm install eslint-plugin-hardcode-detect@0.1.0
```

(Requer `eslint` peer ≥ 9 e Node ≥ 22 conforme `package.json`.)
