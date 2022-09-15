FROM node:16-alpine3.14

WORKDIR	/usr/app
COPY	. .
RUN		npm install
RUN		npm run build
CMD		[ "npm", "start" ]
