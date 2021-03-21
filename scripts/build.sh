#!/bin/bash

set -e

gulp build

GOOS=linux go build -o ./docker-files/portal/portal server/cmd/portal/main.go

IMAGE_PREFIX=dockerhub.qingcloud.com/qxpdev

docker build -t $IMAGE_PREFIX/qxp-web-nginx -f ./docker-files/nginx/Dockerfile ./docker-files/nginx

docker build -t $IMAGE_PREFIX/qxp-web-portal -f ./docker-files/portal/Dockerfile ./docker-files/portal
