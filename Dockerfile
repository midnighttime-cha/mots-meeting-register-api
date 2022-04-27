FROM node:14-slim
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY package*.json .
COPY .env .env
COPY ./ .
RUN yarn install && yarn build
RUN chown -R node:node /app
RUN chmod -R 777 /app
USER node

CMD [ "yarn", "start:prod" ]
