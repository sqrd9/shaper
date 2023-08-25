FROM --platform=linux/amd64 node:20
ENV YARN_VERSION 3.2.2
RUN mkdir -p /app
COPY package.json yarn.lock .editorconfig .prettierrc README.md tsconfig.json /app/
COPY src/ /app/src
WORKDIR /app
RUN corepack enable
RUN yarn set version stable
RUN yarn config set --home enableTelemetry 0
RUN yarn install
RUN yarn run build
ENV SHAPER_PORT=5801
CMD yarn run start
EXPOSE 5801
