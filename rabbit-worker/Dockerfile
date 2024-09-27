FROM node:20.15.1-bookworm-slim AS base
WORKDIR /app

FROM base AS dev
COPY docker-entrypoint-dev.sh /usr/local/bin/
ENTRYPOINT  ["/usr/local/bin/docker-entrypoint-dev.sh"]

FROM base AS release
COPY package.json yarn.lock /app/
RUN yarn
COPY . .
COPY docker-entrypoint-prod.sh /usr/local/bin/
ENTRYPOINT  ["/usr/local/bin/docker-entrypoint-prod.sh"]
