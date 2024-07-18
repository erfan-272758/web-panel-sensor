FROM node:20.15.1-bookworm-slim as base
WORKDIR /app
RUN apt update -y

FROM base as dev
RUN apt install -y xdg-utils
ENTRYPOINT  [ "yarn","dev" ]
