# ── Stage 1: Build Angular app ─────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npx ng build --configuration production

# ── Stage 2: Serve with nginx ───────────────────────────────────────
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=builder /app/dist/tutor-frontend/browser /usr/share/nginx/html

# Copy custom nginx config (handles Angular routing + API proxy)
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
