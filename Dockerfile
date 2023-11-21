FROM node:19.7
RUN npm install -g npm@^9
WORKDIR /usr/src/survey-api
COPY ./package.json .
COPY ./package-lock.json .
RUN npm pkg delete scripts.prepare
RUN npm install nodemon --omit=dev