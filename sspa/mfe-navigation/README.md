<!-- sspa/mfe-navigation/README.md -->
# MFE Navigation

Micro-Frontend de navegação e menu principal da aplicação.

## Estrutura

```
mfe-navigation/
├── src/              # Código fonte React
├── dist/             # Build de produção
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Como instalar

```bash
cd sspa/mfe-navigation
npm install
```

## Como desenvolver

### Modo Standalone

```bash
npm run dev
# Acesse em http://localhost:5173
```

### Modo Integrado

Para testar a integração com o SSPA:

```bash
docker compose -f .docker/docker-compose.projects.postgres.yml up -d
```

## Como acessar

- **Standalone:** `http://localhost:5173`
- **Integrado:** Renderizado automaticamente no header do SSPA

## Scripts disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build de produção
npm run preview  # Preview do build de produção
```

## Configuração do modo Standalone

Este projeto utiliza `vite-plugin-single-spa` para permitir execução standalone. O plugin cria automaticamente um root-config temporário durante o desenvolvimento, permitindo visualizar o MFE diretamente no navegador sem precisar do orquestrador.

Consulte [vite-plugin-single-spa](https://single-spa.js.org/docs/create-single-spa/) para mais detalhes sobre configuração.