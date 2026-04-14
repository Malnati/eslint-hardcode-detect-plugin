# Evidência M2 — matriz paridade CI × perfil Compose `prod`

Marco M2 · âncoras [`../A1-audit-ci-yml-vs-compose-prod.md`](../A1-audit-ci-yml-vs-compose-prod.md), [`../A2-ci-artifacts-logs-policy.md`](../A2-ci-artifacts-logs-policy.md)

**Propósito:** registar o alinhamento entre o job **CI** em [`.github/workflows/ci.yml`](../../../../../.github/workflows/ci.yml) e o comando reprodutível do perfil **`prod`** em [`docker-compose.yml`](../../../../../docker-compose.yml). Preencher durante as micro-tarefas M2-A1-02, M2-A2-01 e M2-A3-03.

**Inventário de steps (baseline):** [`../micro/M2-A1-01-inventario-ci-yml-jobs-steps.md`](../micro/M2-A1-01-inventario-ci-yml-jobs-steps.md).

| Dimensão | CI (GitHub Actions) | Compose `prod` | Estado |
|----------|---------------------|------------------|--------|
| Instalação de dependências | `npm install` na raiz (job `test`) | `npm ci` na raiz | Gap — decidir paridade ou documentar divergência aceite |
| Variável `CI` | Definida pelo runner | `CI=true` no serviço | Rever impacto em scripts que condicionam a `CI` |
| Lint | `npm run lint` (workspace plugin) | `npm run lint` | Alinhado após instalação coerente |
| Testes do plugin | `npm test -w eslint-plugin-hardcode-detect` | `npm test -w eslint-plugin-hardcode-detect` | Alinhado após instalação coerente |
| Validação manifest milestones | `npm run test:docs-m0` | *Não presente* no comando `prod` | Gap esperado — cobertura documental extra no CI |
| Node | 22 via `actions/setup-node` | `node:22-bookworm-slim` | Alinhado (major) |

## Conclusão (checklist DoD)

- **Paridade formal:** critérios em [`../micro/M2-A2-01-criterio-paridade-prod-ci-formal.md`](../micro/M2-A2-01-criterio-paridade-prod-ci-formal.md).
- **Handoff T4:** o que o CI garante além do Compose — [`../micro/M2-A3-02-handoff-t4-o-que-ci-garante.md`](../micro/M2-A3-02-handoff-t4-o-que-ci-garante.md).

## Notas

- **Drift:** alterações em `.github/workflows/ci.yml` ou no serviço `prod` devem actualizar esta matriz no mesmo ciclo do marco M2 quando afectarem paridade.
- **Perfil `e2e`:** comparar com a linha opcional da matriz §6 em [`docs/distribution-milestones/m2-channel-t3-ci.md`](../../../m2-channel-t3-ci.md); ver [`../micro/M2-A1-03-matriz-sec6-cross-check-compose.md`](../micro/M2-A1-03-matriz-sec6-cross-check-compose.md).
