#!/bin/bash

set -e

IMAGE_PREFIX=dockerhub.qingcloud.com/qxpdev

docker build -t $IMAGE_PREFIX/qxp-web-nginx -f ./docker-files/nginx/Dockerfile ./docker-files/nginx

docker build -t $IMAGE_PREFIX/qxp-web-portal -f ./docker-files/portal/Dockerfile ./docker-files/portal
