FROM node:19.7
RUN npm install -g npm@^9
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
COPY ./package-lock.json .
RUN npm pkg delete scripts.prepare
RUN npm install nodemon --omit=dev