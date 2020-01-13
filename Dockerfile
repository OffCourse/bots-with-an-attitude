FROM node:13 as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY packages/api ./packages/api
COPY packages/botframe ./packages/botframe
COPY packages/protobot ./packages/protobot

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/api
RUN yarn build

WORKDIR /usr/src/app/packages/botframe
RUN yarn build

WORKDIR /usr/src/app/packages/protobot
RUN yarn build

FROM node:13

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY --from=build /usr/src/app/packages/api/package.json /usr/src/app/packages/api/package.json
COPY --from=build /usr/src/app/packages/api/dist /usr/src/app/packages/api/dist

COPY --from=build /usr/src/app/packages/botframe/package.json /usr/src/app/packages/botframe/package.json
COPY --from=build /usr/src/app/packages/botframe/dist /usr/src/app/packages/botframe/dist

COPY --from=build /usr/src/app/packages/protobot/package.json /usr/src/app/packages/protobot/package.json
COPY --from=build /usr/src/app/packages/protobot/dist /usr/src/app/packages/protobot/dist
COPY --from=build /usr/src/app/packages/protobot/.env /usr/src/app/packages/protobot/.env

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/packages/protobot

CMD ["node", "dist/server.js"]
