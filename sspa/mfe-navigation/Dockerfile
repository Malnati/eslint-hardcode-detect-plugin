# sspa/mfe-navigation/Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY core/sspa/mfe-navigation/package*.json ./
COPY core/sspa/mfe-navigation/scripts ./scripts/
RUN npm install --no-audit --no-fund

COPY core/sspa/mfe-navigation/ ./
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/output /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
