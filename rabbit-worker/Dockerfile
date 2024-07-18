FROM node:20.15.1-bookworm-slim as base
WORKDIR /app

FROM base as dev
COPY docker-entrypoint-dev.sh /usr/local/bin/
ENTRYPOINT  ["/usr/local/bin/docker-entrypoint-dev.sh"]
