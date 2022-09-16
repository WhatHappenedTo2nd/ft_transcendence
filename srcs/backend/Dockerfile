FROM node:16-alpine3.14

WORKDIR	/usr/app
COPY	. .
RUN		npm install && npm run build
CMD		[ "npm", "run", "start:dev" ]
