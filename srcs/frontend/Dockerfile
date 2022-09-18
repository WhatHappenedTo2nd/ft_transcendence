FROM node:16-alpine3.14

WORKDIR /usr/app

COPY	. .

<<<<<<< HEAD
RUN		npm i --save socket.io-client @types/socket.io-client
RUN		npm install
RUN		npm run build
=======
RUN		npm install && npm i socket.io-client && npm run build
>>>>>>> c1b15d29be89ebf77d86a10996c3783411bbf8c4

CMD		[ "npm", "start" ]
