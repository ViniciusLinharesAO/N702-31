FROM node:22.1.0-alpine as restore
COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build

FROM node:22.1.0-alpine as server
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN NODE_ENV=production yarn install --ignore-optional --pure-lockfile --production
COPY --from=builder /app/build /app/build

ENTRYPOINT [ "yarn", "start" ]