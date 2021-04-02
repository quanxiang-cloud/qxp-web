#!/bin/bash

set -e

yarn install

# build frontend assets
# rm -rf dist
# rm -rf docker-files/nginx/dist docker-files/portal/dist

# NODE_ENV=production ./node_modules/.bin/webpack --config webpack.config.js

# # todo refactor
# # copy built files
# gulp build

# GOOS=linux go build -o ./docker-files/portal/portal server/cmd/portal/main.go

IMAGE_PREFIX=dockerhub.qingcloud.com/qxpdev

# docker build -t $IMAGE_PREFIX/qxp-web-nginx -f ./docker-files/nginx/Dockerfile ./docker-files/nginx

# docker build -t $IMAGE_PREFIX/qxp-web-portal -f ./docker-files/portal/Dockerfile ./docker-files/portal
docker build -t $IMAGE_PREFIX/qxp-web-portal .
