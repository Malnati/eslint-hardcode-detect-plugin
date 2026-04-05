# sspa/mfe-design-system/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY core/sspa/mfe-design-system/package*.json ./
COPY core/sspa/mfe-design-system/scripts ./scripts/
RUN npm install --no-audit --no-fund

COPY core/sspa/mfe-design-system/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/output /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
