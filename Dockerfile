# --- Build ---
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Formulier-endpoint wordt tijdens de build in de HTML gezet (zie README, Coolify)
ARG PUBLIC_FORM_ENDPOINT=""
ENV PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT
RUN npm run build

# --- Serve ---
FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY deploy/nginx-redirects.conf /etc/nginx/snippets/redirects.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
