#!/bin/bash

set -e

yarn install

# build frontend assets
rm -rf dist

NODE_ENV=production ./node_modules/.bin/webpack --config webpack.config.js

# # todo refactor
# # copy built files
gulp build

GOOS=linux go build -o ./dist/portal server/cmd/portal/main.go

scp ./dist/portal qxp-alpha:/tmp
rsync -avz ./dist/ qxp-alpha:/qxp/dist

ssh qxp-alpha /qxp/script/reload_portal
