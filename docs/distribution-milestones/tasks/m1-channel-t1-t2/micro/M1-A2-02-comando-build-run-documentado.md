# M1-A2-02: Comando build/run documentado (smoke reprodutível)

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M1-A2-02 |
| milestone | M1 |
| depends_on | M1-A2-01 |
| blocks | M1-A2-03 |
| plan_requirements | `m1-sec4-order-2`, `m1-sec7-A2`, `m1-sec10-done-t2` |

## Objetivo

Consolidar **um** fluxo mínimo reprodutível: build da imagem ops-eslint e execução de ESLint sobre o workspace montado (ou equivalente via action local), com comandos copiáveis.

## Definition of done

- Documento ou secção em doc existente com sequência explícita (ex.: `docker build -f .docker/Dockerfile …` conforme [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md)); referência ao passo CI que exercita T2 se existir.

## Paths principais

- `specs/agent-docker-compose.md`
- `README.md` (raiz, se já documentar a imagem)
