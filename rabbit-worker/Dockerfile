FROM repo-afra.snappfood.dev/node:20.15.1-bookworm-slim AS base
WORKDIR /app

FROM base AS dev
COPY docker-entrypoint-dev.sh /usr/local/bin/
ENTRYPOINT  ["/usr/local/bin/docker-entrypoint-dev.sh"]
