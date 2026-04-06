# sspa/mfe-design-system/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY sspa/mfe-design-system/package*.json ./
RUN npm install --no-audit --no-fund

COPY sspa/mfe-design-system/ ./
RUN npm run build

FROM nginx:alpine
RUN addgroup -g 101 -S app && adduser -S app -u 101
COPY --chown=app:app --from=build /app/output /usr/share/nginx/html
EXPOSE 80
USER app
CMD ["nginx", "-g", "daemon off;"]
