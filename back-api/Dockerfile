FROM node:20.15.1-bookworm-slim AS base
WORKDIR /app

FROM base AS dev
ENTRYPOINT  [ "yarn","dev" ]

FROM base AS release
COPY package.json yarn.lock /app/
RUN yarn
COPY . .
ENTRYPOINT  [ "yarn","start" ]
