FROM node:14.16.1-alpine3.13 AS build-stage
WORKDIR /chaingraph
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY tsconfig.json defaults.env ./
COPY bin bin
COPY src src
RUN yarn build

FROM node:14.16.1-alpine3.13 AS production
WORKDIR /chaingraph
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=build-stage /chaingraph/defaults.env ./
COPY --from=build-stage /chaingraph/bin bin
COPY --from=build-stage /chaingraph/build build
EXPOSE 3200
CMD ["node", "bin/chaingraph"]
