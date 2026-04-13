# Evidência A1 — decisão de semver (M5)

Executado conforme [`A1-definir-semver-major-minor-patch.md`](../A1-definir-semver-major-minor-patch.md).

| Campo | Valor |
|-------|--------|
| Versão alvo | `0.1.0` |
| Tipo de bump | **minor** (em relação a `0.0.0` no [`package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json); não há release npm anterior) |
| Justificativa | Ver secção [Justificativa reprodutível](#justificativa-reprodutível) |

## Linha de base

| Verificação | Resultado |
|-------------|-----------|
| Tags Git de release | Nenhuma (`git tag -l` vazio no momento da análise) |
| Versão em `packages/eslint-plugin-hardcode-detect/package.json` | `0.0.0` (placeholder; pacote ainda não publicado no registry) |
| Intervalo analisado para commits Conventional Commits | Histórico completo que toca [`packages/eslint-plugin-hardcode-detect/`](../../../../../packages/eslint-plugin-hardcode-detect/) (ver `git log --oneline -- packages/eslint-plugin-hardcode-detect/`) |

## Justificativa reprodutível

1. **SemVer e linha `0.y.z`**  
   Com **major** `0`, incrementos **minor** introduzem funcionalidade compatível na série `0.x`; **`0.0.0` → `0.1.0`** é o padrão habitual para a **primeira versão publicável** com API nomeada (em oposição a `0.0.1`, mais associado a correção sobre uma linha já publicada).

2. **Conventional Commits (caminho do pacote)**  
   No histórico que altera `packages/eslint-plugin-hardcode-detect/`, aparecem `feat(plugin)`, `test(e2e)` e `docs(plugin)` / `docs(governance)` — **não** há `feat!`, rodapé `BREAKING CHANGE:` nem indício de bump **major** por quebra de API no Git.

3. **Contrato público** ([`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md))  
   - Superfície **implementada e exportada** em [`packages/eslint-plugin-hardcode-detect/src/index.ts`](../../../../../packages/eslint-plugin-hardcode-detect/src/index.ts): regras `hello-world` e `no-hardcoded-strings` + config `recommended`.  
   - A regra `standardize-error-messages` consta no contrato como comportamento esperado, mas **não** está registada em `rules` no `index` atual — gap de produto/roadmap, não uma alteração *breaking* para consumidores npm **inexistentes** antes da primeira publicação.  
   - Não há evidência de remoção ou renomeação de regra já publicada (baseline: nenhum release).

4. **Por que não patch (`0.0.1`)**  
   O conjunto entregue na primeira publicação inclui **novas** regras e fumaça e2e (`feat` / `test`), não apenas correções sobre um artefacto `0.0.z` já no registry — logo **minor** é mais fiel ao histórico e à SemVer para `0.x`.

5. **Por que não major (`1.0.0`) neste marco**  
   O marco M5 é *release candidate* da cadeia T1–T6; tratar **`1.0.0`** como estabilidade absoluta exigiria critério explícito de “GA” e superfície congelada. Até lá, **`0.1.0`** comunica API inicial em série de desenvolvimento (`0.x`).

## Ligações úteis (revisão)

- Diff sugerido (repositório completo desde o primeiro commit até `HEAD`):  
  [`f46e906...cdaf56f`](https://github.com/Malnati/eslint-hardcode-detect-plugin/compare/f46e906...cdaf56f) (ajustar se o default branch ou os SHAs mudarem).
- Reproduzir lista de commits do pacote:  
  `git log --oneline -- packages/eslint-plugin-hardcode-detect/`

## Notas

- Alinhado a [`specs/plugin-contract.md`](../../../../../specs/plugin-contract.md) e ao espírito de [`docs/versioning-for-agents.md`](../../../../../docs/versioning-for-agents.md) (mensagens Conventional Commits como pista para impacto).
- O **bump efectivo** em `package.json`, tag Git e `npm publish` ficam para o PR de release conjunto (ex. A2/A3 e plano M5), salvo decisão de manutenção em passo único.
