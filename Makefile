all: buildAssets buildServer startHomeServer startPortalServer rollup

clean:
	@echo "clean previsous build..."
	@rm -rf dist

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

buildAssets: copyStatics copyTemplates buildIcons

buildServer:
	@echo "build web server..."
	@go build -o ./bin/portal server/cmd/portal/main.go
	@go build -o ./bin/home server/cmd/home/main.go

startHomeServer:
	./bin/home -c config.yaml

startPortalServer:
	./bin/portal -c config.yaml

rollup:
	./node_modules/.bin/rollup -c rollup.config.js -w

build: buildAssets
