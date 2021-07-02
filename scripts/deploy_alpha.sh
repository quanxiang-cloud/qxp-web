#!/bin/bash

set -e

yarn install --registry=http://r.npm.internal.yunify.com

# build frontend assets
rm -rf dist

node_modules/.bin/gulp buildAssets

NODE_ENV=production ./node_modules/.bin/webpack --config webpack.config.js

GOOS=linux go build -o ./dist/portal server/cmd/portal/main.go
GOOS=linux go build -o ./dist/home server/cmd/home/main.go

scp ./dist/portal qxp-alpha:/tmp
scp ./dist/home qxp-alpha:/tmp
rsync -avz ./dist/ qxp-alpha:/qxp/dist

ssh qxp-alpha /qxp/script/reload_portal
