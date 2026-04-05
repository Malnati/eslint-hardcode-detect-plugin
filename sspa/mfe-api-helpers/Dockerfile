# sspa/mfe-api-helpers/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY core/sspa/mfe-api-helpers/package*.json ./
COPY core/sspa/mfe-api-helpers/scripts ./scripts/
RUN npm install --no-audit --no-fund

COPY core/sspa/mfe-api-helpers/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/output /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
