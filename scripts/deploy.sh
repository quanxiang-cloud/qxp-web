#!/bin/bash

set -euo pipefail

yarn install
gulp build

echo "copy files to firstbox..."
rsync -avz ./dist ./bin/ root@139.198.189.182:/tmp

echo "run reload script..."

ssh root@139.198.189.182 /qxp/scripts/sync_and_reload_web
