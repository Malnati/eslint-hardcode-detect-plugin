# A3: Plano de smoke pós-publish

| Campo | Valor |
|-------|--------|
| milestone | M5 |
| github_milestone | release-candidate |
| task_id | A3 |
| labels_sugeridas | `area/channel-T1`, `area/channel-T3`, `type/chore` |
| token_budget_estimate | 18 000 |
| timelining_order | 3 |
| depends_on | A2 |

## Plano do marco

Camada A em [`../../m5-release-candidate.md`](../../m5-release-candidate.md) (secções 1, 6, 7, 8 e 10).

## Inputs

- **A2** (versão e notas; o que foi declarado como validado).
- Matriz **e2e × Docker Compose** do plano M5 (secção 6): consumidor limpo opcional (T1); paridade local (T3 / perfil `prod`).
- Tabela mestre de canais: [`docs/solution-distribution-channels.md`](../../../../docs/solution-distribution-channels.md).
- Comandos de teste do pacote: `npm test` no workspace do plugin (ver [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../packages/eslint-plugin-hardcode-detect/package.json)).

## Outputs

- Lista de **passos reprodutíveis** pós-`npm publish` (ou pós-tag RC): instalação a partir do registry ou `npm pack` em diretório temporário; verificação mínima de que o consumidor corre ESLint com o plugin na versão publicada.
- Documento em [`evidence/M5-smoke-post-publish.md`](evidence/M5-smoke-post-publish.md) com checklist e comandos copiáveis.

## Critério de conclusão

- Qualquer mantenedor consegue executar o smoke num ambiente limpo seguindo apenas o documento; resultado esperado (pass/fail) explícito.

## Dependências

- **Depende de:** A2 (versão e âmbito do release definidos).
- **Opcional:** alinhamento com imagem ops-eslint / tags, se política do projeto o exigir (ver plano M5 §1).

## Paths principais

- [`docs/solution-distribution-channels.md`](../../../../docs/solution-distribution-channels.md)
- [`specs/agent-docker-compose.md`](../../../../specs/agent-docker-compose.md) (se smoke incluir Compose)
- [`packages/eslint-plugin-hardcode-detect/e2e/`](../../../../packages/eslint-plugin-hardcode-detect/e2e/)
