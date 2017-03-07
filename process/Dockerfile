FROM node:7.7.0

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/common

COPY ./process /usr/src/app
COPY ./wait-for-it.sh /usr/src/app
COPY ./common /usr/src/common

WORKDIR /usr/src/app
RUN yarn install --force
RUN ./node_modules/.bin/webpack

CMD [ "npm", "start" ]
