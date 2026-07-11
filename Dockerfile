# Stage 1: build
FROM node:24-alpine AS builder
WORKDIR /app
COPY invoicingfrontend/package*.json ./
RUN npm ci
COPY invoicingfrontend/ .
# kalau perlu inject URL backend saat build:
ARG VITE_API_URL=http://localhost:8069
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
