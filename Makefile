all: buildAssets server rollup

clean:
	@echo "clean previsous build..."
	@rm -rf dist

buildAssets: copyStatics copyTemplates buildIcons

copyStatics:
	@echo "copy clients/assets to dist/assets..."
	@mkdir -p dist
	@cp -r ./clients/assets/* dist

copyTemplates:
	@echo "copy clients/templates/* to dist/templates..."
	@mkdir -p dist
	@cp -r ./clients/templates dist

buildIcons:
	@echo "build icons..."
	@node -e 'require("./scripts/svg-to-sprite").generateSprite()'

server: startHomeServer startPortalServer

startHomeServer: buildHome
	./bin/home -c config.yaml

startPortalServer: buildPortal
	./bin/portal -c config.yaml

buildPortal:
	@echo "build portal web server..."
	@go build -o ./bin/portal server/cmd/portal/main.go

buildHome:
	@echo "build home web server..."
	@go build -o ./bin/home server/cmd/home/main.go

rollup:
	./node_modules/.bin/rollup -c rollup.config.js -w

build: buildAssets
