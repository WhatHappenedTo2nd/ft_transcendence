FROM node:16-alpine3.14

WORKDIR /usr/app

COPY	. .

RUN		npm i --save socket.io-client @types/socket.io-client
RUN		npm install
RUN		npm run build

CMD		[ "npm", "start" ]
