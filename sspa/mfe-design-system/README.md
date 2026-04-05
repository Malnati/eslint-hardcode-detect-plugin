<!-- sspa/mfe-design-system/README.md -->
# MFE Design System

Micro-Frontend contendo o design system e componentes React compartilhados entre todos os MFEs.

## Estrutura

```
mfe-design-system/
├── src/              # Código fonte dos componentes
├── dist/             # Build de produção
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Como instalar

```bash
cd sspa/mfe-design-system
npm install
```

## Como desenvolver

### Modo Standalone

Este MFE pode ser executado de forma autônoma para desenvolvimento e testes de componentes:

```bash
npm run dev
# Acesse em http://localhost:5173 (porta padrão Vite)
```

### Modo Integrado

Para testar a integração com o SSPA:

```bash
# 1. Suba o SSPA completo
docker compose -f .docker/docker-compose.projects.postgres.yml up -d
```

## Como acessar

- **Standalone (desenvolvimento):** `http://localhost:5173`
- **Integrado (SSPA):** Acessível como biblioteca compartilhada via import map

## Scripts disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build de produção (biblioteca)
npm run preview  # Preview do build de produção
```

## Uso como dependência

Este design system é consumido pelos outros MFEs. Para usar um componente:

```typescript
import { Button } from '@mfe/design-system';
```

## Configuração do modo Standalone

Este projeto utiliza `vite-plugin-single-spa` para permitir execução standalone. O plugin cria automaticamente um root-config temporário durante o desenvolvimento, permitindo visualizar o MFE diretamente no navegador sem precisar do orquestrador.

Consulte [vite-plugin-single-spa](https://single-spa.js.org/docs/create-single-spa/) para mais detalhes sobre configuração.