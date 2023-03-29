FROM node:19.7
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm pkg delete scripts.prepare
RUN npm install --omit=dev