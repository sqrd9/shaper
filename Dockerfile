FROM node:20
ENV YARN_VERSION 3.2.2
RUN mkdir -p /app
COPY . /app
COPY yarn.lock /app
WORKDIR /app
RUN corepack enable
RUN yarn set version stable
RUN yarn install
RUN yarn run build
ENV SHAPER_PORT=5801
CMD yarn run start
EXPOSE 5801
