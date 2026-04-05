<!-- core/sspa/README.md -->
# SSPA (Single-SPA Orchestrator)

Orquestrador de Micro-Frontends (MFEs) utilizando Single-SPA para composição de aplicações modulares.

## Sincronização com o repositório `rating-sspa` (git subtree)

O código deste pacote (`core/sspa/`) pode ser espelhado em **`https://github.com/tookyn/rating-sspa.git`** sem submodule: ver **[docs/sspa-subtree.md](../../docs/sspa-subtree.md)** e **[docs/sspa-subtree-spec.md](../../docs/sspa-subtree-spec.md)**. Alvos: `make sspa-subtree-help`, `make sspa-subtree-push`, `make sspa-subtree-pull` (`RATING_SSPA_REMOTE`, `RATING_SSPA_BRANCH`). O compose em `core/sspa/docker-compose.frontend.yml` permanece no monorepo (agregado em `docker-compose.yml` na raiz).

## Estrutura

```
core/sspa/
├── dashboard/          # Dashboard principal
├── mfe-account/        # MFE de gestão de contas
├── mfe-authtorization/ # MFE de autorização
├── mfe-config/         # MFE de runtime-config (CRUD)
├── mfe-api-helpers/    # Utilitários compartilhados
├── mfe-design-system/  # Design system e componentes
├── mfe-login/          # MFE de login
└── mfe-navigation/     # Componente de navegação

mfe/                    # MFEs adicionais (fora do pacote core/sspa)
├── mfe-chatbot/
├── mfe-key/
├── mfe-profile/
├── mfe-rating/
└── mfe-usage/
```

Cada `mfe-*` gera artefatos em `output/` do proprio projeto e seu respectivo `Dockerfile` copia esses arquivos para a imagem runtime.

## Como instalar

O SSPA é construído via o Docker Compose em `core/sspa/docker-compose.frontend.yml` (agregado pelo Makefile com `core/apis/docker-compose.backend.yml`):

```bash
# A partir da raiz do projeto
docker build -f core/sspa/Dockerfile -t rating-sspa-orchestrator:latest .
```

Ou utilize o docker-compose que constrói automaticamente:

```bash
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps build sspa
```

## Como subir

O SSPA faz parte do stack principal do docker-compose:

```bash
# Subir todo o stack (inclui SSPA, APIs e Postgres)
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps up -d

# Ou subir apenas o SSPA (se as dependências estiverem disponíveis)
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps up -d sspa

# Subir apenas serviços mfe-* independentes (sem orquestrador SSPA)
make mfe-up
```

## Como acessar

- **Porta:** `9000`
- **URL:** `http://localhost:9000`
- **Health:** Verifique se o container está rodando (`docker ps`)

## Variáveis de ambiente principais

- `SSPA_SKIP_AUTH` (padrão `true`) - Pula autenticação para desenvolvimento
- `VITE_PUBLIC_URL` (padrão `http://localhost:9000`) - URL pública
- `VITE_MFE_BASE_URL` - URL base dos MFEs
- `VITE_MFE_DESIGN_SYSTEM_URL` - URL do design system
- `VITE_MFE_ACCOUNT_URL` - URL do MFE de contas
- `VITE_MFE_KEY_URL` - URL do MFE de chaves
- `VITE_MFE_LOGIN_URL` - URL do MFE de login
- `VITE_MFE_RATING_URL` - URL do MFE de rating
- `VITE_MFE_USAGE_URL` - URL do MFE de uso

## MFEs disponíveis

| MFE | Rota no SSPA | API backing |
| --- | --- | --- |
| `mfe-account` | `/account` | `api-account:3005` |
| `mfe-authtorization` | `/authtorization` | `api-authorization:3007` |
| `mfe-config` | `/config` | `api-config:3010` |
| `mfe-key` | `/keys` | `api-key:3003` |
| `mfe-login` | `/login` | `api-login:3011` |
| `mfe-rating` | `/rating` | `api-rating:3002` |
| `mfe-usage` | `/usage` | `api-usage:3004` |
| `mfe-design-system` | (compartilhado) | N/A |

## Desenvolvimento Híbrido e Incremental

Uma das maiores vantagens do ecossistema Single-SPA é a flexibilidade no desenvolvimento. Você não é obrigado a ter o orquestrador (Root Config) rodando para desenvolver e testar seus Micro-Frontends (MFEs).

### Modo Standalone (Visualização Direta)

Os MFEs configurados com `vite-plugin-single-spa` podem ser executados de forma autônoma durante o desenvolvimento. Isso significa que cada MFE pode ser visualizado no navegador como uma aplicação web independente, usando sua própria URL de servidor local, enquanto também serve o código no formato de módulo esperado pelo Single-SPA para quando for integrado ao orquestrador.

Na prática, com o plugin configurado, você terá um comando adicional (ex: `npm run dev:standalone` ou similar) que cria um "root-config falso e temporário" dinamicamente apenas para renderizar e testar aquela aplicação isolada no navegador.

### Como configurar o Modo Standalone

Para habilitar o modo standalone nos MFEs, instale e configure o `vite-plugin-single-spa`:

```bash
npm install vite-plugin-single-spa -D
```

No `vite.config.ts` do MFE:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import singleSpa from 'vite-plugin-single-spa';

export default defineConfig({
  plugins: [
    react(),
    singleSpa({
      // Nome do módulo que será exportado para o Single-SPA
      name: '@mfe/seu-mfe',
      // Tipo de aplicação Single-SPA
      type: 'application',
    }),
  ],
  server: {
    // Porta para modo standalone (diferente da porta do SSPA)
    port: 3003,
  },
});
```

### Desenvolvimento Híbrido

Você pode trabalhar de duas formas:

1. **Desenvolvimento Standalone**: Execute o MFE isoladamente para迭代 rápida de UI sem dependências do orquestrador.
2. **Desenvolvimento Integrado**: Execute o SSPA completo para testar a integração real entre todos os MFEs.

Esta flexibilidade permite que você desenvolva incrementalmente, adicionando novos MFEs ou alterando existentes sem precisar do stack completo funcionando.

## Comandos úteis

```bash
# Ver logs
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps logs -f sspa

# Parar
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps stop sspa

# Reiniciar
docker compose -f core/apis/docker-compose.backend.yml -f core/sspa/docker-compose.frontend.yml --profile apps restart sspa
```
