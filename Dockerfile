FROM deliveroo/hopper-runner:1.9.9 as hopper-runner

FROM node:16.16.0 as builder

WORKDIR /app
COPY package.json yarn.lock .yarnrc .npmrc ./
COPY .yarn ./.yarn

RUN yarn install --silent --frozen-lockfile

# ENVs declared here are for `yarn build` (compiling the client application)
ARG ENVIRONMENT_NAME_ARG
ENV ENVIRONMENT_NAME=$ENVIRONMENT_NAME_ARG
ARG EXAMPLE_BUILD_ENV_VAR_ARG
ENV EXAMPLE_BUILD_ENV_VAR=$EXAMPLE_BUILD_ENV_VAR_ARG
ARG RELEASE_HASH_ARG
ENV RELEASE_HASH=$RELEASE_HASH_ARG
ARG PIPELINE_ARG
ENV PIPELINE=$PIPELINE_ARG

COPY . .

# If attempting to build from the template, choose typescript to begin with
RUN if [ "$PIPELINE" = "template" ] ; then yarn choose:typescript ; fi

RUN yarn build

FROM node:16.16.0-alpine
WORKDIR /app
COPY --from=hopper-runner /hopper-runner /usr/bin/hopper-runner
COPY --from=builder /app .

ENTRYPOINT ["hopper-runner"]

# ENVs are duplicated here after we've changed to another image. They need to be
# redeclared for them to be accessible for `yarn start` (the server process),
# making the env vars available at runtime
ARG ENVIRONMENT_NAME_ARG
ENV ENVIRONMENT_NAME=$ENVIRONMENT_NAME_ARG
ARG EXAMPLE_BUILD_ENV_VAR_ARG
ENV EXAMPLE_BUILD_ENV_VAR=$EXAMPLE_BUILD_ENV_VAR_ARG
ARG RELEASE_HASH_ARG
ENV RELEASE_HASH=$RELEASE_HASH_ARG

CMD yarn start
