# 项目构建说明

## 为什么使用 `make` 来构建项目

1. qxp-web 是一个有一定复杂度的项目，有两个 web server 和三个前端入口。
2. `npm scripts` 仅仅只适合执行简单命令，且不推荐对 scripts 进行组合
3. webpack 是打包工具，不是构建工具，任何使用 webpack 来构建的项目都是不可扩展的
4. vite 等新兴构建工具只适合构建前端项目
5. grunt 和 gulp 已经很久不更新了，而且他们也是为前端构建而设计的，执行各种 shell 命令并不方便
6. make 有灵活的 task 组合能力，简单易读的语法，执行 shell 命令方便

## qxp-web 中的 Makefile task 简介

不管一个项目的构建步骤多么复杂，我们都可以将其分解成多个 task 的组合，有些 task 可能只需要执行一次，有些则会被调用多次，甚至是在前台一直执行。

对于 qxp-web 来说，核心的构建任务可以分为三类：一是 build golang 代码，二是 bundle js，还有就是构建起其他静态文件。

Golang 的构建要比 bundle js 简单的多，我们只需要先将 `.go` 源文件 build 成可执行的二进制文件，然后执行这个二进制文件就能启动 web 服务。

```makefile
buildPortal:
  @echo "build portal web server..."
  @go build -o ./bin/portal server/cmd/portal/main.go

startPortalServer: buildPortal
  ./bin/portal -c config.yaml
```

上面的 makefile 片段中有两个 task，`buildPortal` 是编译 golang 源代码成可执行文件，`startPortalServer` 是执行这个可执行的文件，而 `startPortalServer` 是依赖 `buildPortal` 的，我们只要声明了他们之间的依赖关系，make 会自动帮助我们按预期的顺序执行 task。所以，要启动 web server，只需要执行 `make startPortalServer` 就好。

下面是执行 bundle 的 task，因为前端代码量较大，如果每次都打包完成的文件那构建速度会很慢，所以可以根据自己目前正在开发的模块，选择执行 `make bundlePortal` 或者 `make bundleAppLand`，加快项目打包速度。

```makefile
rollup:
  ./node_modules/.bin/rollup -c rollup.config.js -w

bundleHome:
  ./node_modules/.bin/rollup -c rollup.config.js -w --input home

bundleAppLand:
  ./node_modules/.bin/rollup -c rollup.config.js -w --input appLand

bundlePortal:
  ./node_modules/.bin/rollup -c rollup.config.js -w --input portal

bundleMobile:
  ./node_modules/.bin/rollup -c rollup.config.js -w --input mobile
```

### 为什么使用 Rollup 来打包前端代码

Rollup 是目前（20220620）最适合 qxp-web 的打包工具，因为他对 SystemJS 格式的模块支持最好。除了 Rollup 外，其他的 bundler 要么不支持输出 SystemJS 格式，要么就是输出的最后格式没有 follow SystemJS 的依赖规范。

为什么 qxp-web 要将文件打包成 SystemJS 格式呢？

不要忘记，qxp-web 是全象低代码平台的前端，我们要做的是为开发者而生的开发工具和平台。具体到前端，需要能够足够灵活的大家前端页面，不能被组件给束缚住，开发者可以使用平台提供的组件，也可以使用自己的组件。

在平台中要使用自己开发的组件需要考虑这些问题：

- 没有组件和平台代码之间的打包过程，意思就是组件和平台在开发和发布上是完全独立的
- 一个页面中将要用到哪些组件是不确定的，这意味着不能提前将可能用到的组件库都打包
- 组件的版本升级和平台的升级是独立的，不能互相影响
- 开发者不应该为了在平台中使用自己的组件而写 patch 类的代码，应该尽可能的提供常规开发模式的体验

其实，最新 ECMAScript 模块规范完全能解决我们的问题。

先从打包的角度看，如果要使用一个模块，只要使用 `import` 关键字后面跟模块的地址即可，这个地址可以是相对地址，也可以是绝对地址，这个地址是最终用户访问的地址，而不是文件系统的地址，所以要在页面中使用一个组件那可以直接写为 `import foo from 'https://cdn.example.com/foo.js'`，而 `https://cdn.example.com/foo.js` 的打包是可以完全独立于平台的。

其次，使用最新的 ECMAScript 规范，可以按照业务逻辑去实现按需加载。不但可以在执行一个模块之前先去下载好需要的依赖，也可以在模块执行时，按照条件来选择加载模块，就是我们已经在使用的 dynamic import

```javascript
if (someCondition) {
  const foo = await import('/path/to/module/foo.js');
}
```

ECMAScript 模块规范中，还定了 `import-maps` 的相关规范，有了 import-maps 的支持，在 import 模块时就不用写相对或者绝对地址，而是可以直接写 `import foo from 'foo'` 这种 bare import，然后在 import-maps 中定义该去如何解析模块 `foo` 的实际地址。有了 import maps 的支持，那我们解决版本问题就简单很多了。

import maps 是可以根据配置生成的，当发布新版本的组件后，直接改一下配置，然后就能生成新的 import maps。

同时，在 import maps 的支持下，对开发者编码也更加友好，当开发者写代码时，只要使用 bare import 就可以，不用写冗长的全路径。

不过目前我们还不能在生产环境中使用 ES Module，但是 SystemJS 是一种类似 ES Module 的实现，我们完全可以将在 EM module 下的工作流搬到 SystemJS 上，因此 SystemJS 就成了我们的最终选择。而目前之后 Rollup 对 SystemJS 格式的支持最为全面，所以 qxp-web 选择了使用 Rollup 来作为打包工具。
