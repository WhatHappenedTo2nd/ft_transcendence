FROM node:16-alpine3.14

WORKDIR	/usr/app
COPY	. .
RUN		yarn install
RUN		yarn run build
CMD		[ "yarn", "start:dev" ]
