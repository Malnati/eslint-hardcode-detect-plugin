# M1-A2-03: Paridade T1 ↔ T2 (versão e config)

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M1-A2-03 |
| milestone | M1 |
| depends_on | M1-A2-02 |
| blocks | — |
| plan_requirements | `m1-sec7-A2`, `m1-sec10-done`, `m1-sec10-parity` |

## Objetivo

Garantir rastreabilidade **mesmo commit / mesma versão do plugin** e mesma **flat config** esperada entre execução npm (T1) e imagem ops-eslint (T2), conforme handoff em [`../../../m1-channel-t1-t2.md`](../../../m1-channel-t1-t2.md) §2.

## Definition of done

- Nota explícita no doc de smoke ou na evidência [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md): o que deve coincidir (versão `eslint`, resolução do plugin, ficheiros de config).

## Paths principais

- `packages/eslint-plugin-hardcode-detect/`
- `.docker/Dockerfile`

## Onde está consolidado

- Subsecção normativa **Paridade T1↔T2 (versão e config)** e smoke T2: [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md).
- Checklist DoD e matriz por dimensão: [`../evidence/T1-t2-parity-gap-matrix.md`](../evidence/T1-t2-parity-gap-matrix.md) (inclui **Conclusão M1-A2-03**).
- Handoff do marco (§2): [`../../../m1-channel-t1-t2.md`](../../../m1-channel-t1-t2.md).
