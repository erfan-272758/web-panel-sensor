FROM node:20.15.1-bookworm-slim AS base
WORKDIR /app
RUN apt update -y

FROM base AS dev
RUN apt update -y && apt install -y xdg-utils
COPY package.json yarn.lock /app/
RUN yarn
ENTRYPOINT  [ "yarn","dev" ]
