<!-- sspa/mfe-api-helpers/README.md -->
# MFE API Helpers

Módulo de utilitários e helpers compartilhados para consumo das APIs.

## Estrutura

```
mfe-api-helpers/
├── src/              # Código fonte TypeScript
├── dist/             # Build de produção
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Como instalar

```bash
cd sspa/mfe-api-helpers
npm install
```

## Como utilizar

Este módulo fornece funções helper para consumo das APIs do projeto:

```typescript
import { apiClient } from '@mfe/api-helpers';
```

## Scripts disponíveis

```bash
npm run build    # Build de produção
```

## Observações

Este não é um MFE de interface, mas sim uma biblioteca de utilitários consumida pelos outros MFEs para padronizar o consumo de APIs.