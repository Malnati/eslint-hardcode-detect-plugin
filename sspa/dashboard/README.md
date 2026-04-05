<!-- sspa/dashboard/README.md -->
# Dashboard

Dashboard principal estático (página inicial) do sistema.

## Estrutura

```
dashboard/
├── src/              # Código fonte
├── public/           # Arquivos estáticos
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Como instalar

```bash
cd sspa/dashboard
npm install
```

## Como desenvolver

```bash
npm run dev
# Acesse em http://localhost:5173
```

## Como acessar

- **Desenvolvimento:** `http://localhost:5173`
- **Produção:** Via SSPA em `http://localhost:9000/`

## Scripts disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build de produção
npm run preview  # Preview do build de produção
```

## Observações

Este é um projeto estático simples que serve como dashboard/landing page do sistema.