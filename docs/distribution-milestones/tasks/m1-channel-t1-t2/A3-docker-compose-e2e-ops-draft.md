# A3: Alinhar `agent-docker-compose` e rascunho perfil `e2e-ops`

| Campo | Valor |
|-------|--------|
| milestone | M1 |
| github_milestone | channel-t1-t2 |
| task_id | A3 |
| labels_sugeridas | `area/channel-T2`, `type/docs` |
| token_budget_estimate | 25 000 |
| timelining_order | 3 (opcional até existir perfil) |
| depends_on | A2 |

## Plano do marco

Camada A em [`../../m1-channel-t1-t2.md`](../../m1-channel-t1-t2.md) (secções 6–7).

## Inputs

- [`docker-compose.yml`](../../../../docker-compose.yml) (perfis atuais `dev`, `e2e`, `prod`; **`e2e-ops` planejado**).
- [`specs/agent-docker-compose.md`](../../../../specs/agent-docker-compose.md).
- Matriz §6 de [`../../m1-channel-t1-t2.md`](../../m1-channel-t1-t2.md).

## Outputs

- Secção ou issue com **próximos passos** para o perfil `e2e-ops` (quando implementado): serviço, volumes, comando alinhado à imagem ops-eslint.
- [`docs/repository-tree.md`](../../../../docs/repository-tree.md) atualizado na mesma PR quando a árvore normativa mudar (perfis Compose novos, scripts).

## Critério de conclusão

- Spec e árvore **coerentes** com o estado real do repositório; estado «planejado» do `e2e-ops` explícito até haver implementação em `docker-compose.yml`.

## Dependências

- **Bloqueia:** —
- **Depende de:** A2.

## Micro-tarefas

Execução fragmentada: [`micro/README.md`](micro/README.md).

| micro_id | Ficheiro |
|----------|----------|
| M1-A3-01 | [`micro/M1-A3-01-rascunho-e2e-ops-agent-docker-compose.md`](micro/M1-A3-01-rascunho-e2e-ops-agent-docker-compose.md) |
| M1-A3-02 | [`micro/M1-A3-02-repository-tree-quando-perfil.md`](micro/M1-A3-02-repository-tree-quando-perfil.md) |
| M1-A3-03 | [`micro/M1-A3-03-matriz-m1-sec6-cross-check.md`](micro/M1-A3-03-matriz-m1-sec6-cross-check.md) |

## Paths principais

- `specs/agent-docker-compose.md`
- `docker-compose.yml`
- `docs/repository-tree.md`
