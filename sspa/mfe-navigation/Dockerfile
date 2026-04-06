# sspa/mfe-navigation/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY sspa/mfe-navigation/package*.json ./
RUN npm install --no-audit --no-fund

COPY sspa/mfe-navigation/ ./
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/* \
    && addgroup -g 101 -S app && adduser -S app -u 101
COPY --chown=app:app --from=build /app/output /usr/share/nginx/html
EXPOSE 80
USER app
CMD ["nginx", "-g", "daemon off;"]
