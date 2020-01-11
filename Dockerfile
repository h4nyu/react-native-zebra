FROM node:latest AS dev

WORKDIR /srv
COPY ./  /srv
# RUN yarn run build
