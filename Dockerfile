# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production


# Serve stage
FROM nginx:alpine

# install envsubst
RUN apk add --no-cache gettext

# copy angular build
COPY --from=build /app/dist/my-angular-app/browser /usr/share/nginx/html

# copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy env template
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js

# copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]