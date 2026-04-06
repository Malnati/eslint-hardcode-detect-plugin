# sspa/Dockerfile
FROM node:22-alpine AS dashboard-build

WORKDIR /app

COPY sspa/dashboard/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

COPY sspa/dashboard/ ./
COPY sspa/build-number.json ./build-number.json
RUN npm run build

FROM nginx:alpine
RUN addgroup -g 101 -S app && adduser -S app -u 101
COPY --chown=app:app --from=dashboard-build /app/dist /usr/share/nginx/html
COPY --chown=app:app --from=dashboard-build /app/build-number.json /usr/share/nginx/html/build-number.json
COPY sspa/dynamic.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
USER app
CMD ["nginx", "-g", "daemon off;"]
