FROM node:18-alpine AS build-stage
WORKDIR /chaingraph
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable --immutable-cache
COPY tsconfig.json defaults.env ./
COPY bin bin
COPY src src
RUN yarn build
# Use Yarn plugin-production-install to copy only production dependencies (https://gitlab.com/Larry1123/yarn-contrib/-/tree/master/packages/plugin-production-install)
RUN yarn prod-install ./production-dependencies

FROM node:18-alpine AS production
WORKDIR /chaingraph
COPY --from=build-stage /chaingraph/production-dependencies ./
COPY --from=build-stage /chaingraph/defaults.env ./
COPY --from=build-stage /chaingraph/bin bin
COPY --from=build-stage /chaingraph/build build
ENV NODE_ENV production
EXPOSE 3200
CMD ["node", "bin/chaingraph.js"]
