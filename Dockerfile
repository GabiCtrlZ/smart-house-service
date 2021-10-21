FROM node:14.17.0-alpine3.13 AS builder

ARG GITHUB_REPOSITORY
ARG CI

ENV CI=${CI} \
    GITHUB_REPOSITORY=${GITHUB_REPOSITORY}

LABEL org.opencontainers.image.source https://github.com/${GITHUB_REPOSITORY}

WORKDIR /app
COPY . .

RUN npm ci \
    npm run build



FROM node:14.17.0-alpine3.13

ARG GITHUB_REPOSITORY
ARG CI

ENV CI=${CI} \
    GITHUB_REPOSITORY=${GITHUB_REPOSITORY}

LABEL autodelete="true"

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY --from=builder /app/dist ./dist

RUN apk update \
    && apk upgrade \
    && apk add bash \
    bash-completion \
    nano \
    curl && \
    npm i --no-optional pm2 -g && \
    rm -rf /var/cache/apk/* 

RUN npm ci --only-prod

RUN addgroup -S gabi && adduser -S gabi -G gabi && \
    chown -R gabi:gabi $HOME && \
    chmod -R 755 $HOME

USER gabi

ENTRYPOINT ["pm2-runtime", "--no-autorestart"]

CMD ["dist/src/index.js"]
