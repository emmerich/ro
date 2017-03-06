FROM node:7.7.0

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/common

# Copy application files
COPY ./front /usr/src/app
COPY ./wait-for-it.sh /usr/src/app
COPY ./common /usr/src/common

WORKDIR /usr/src/app

RUN npm install --production --no-progress

# CMD [ "node", "server.js" ]
CMD [ "yarn", "start" ]
