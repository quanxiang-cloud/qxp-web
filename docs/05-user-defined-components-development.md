# 自定义组件开发

qxp-web 是个开放的、可扩展的低代码平台前端，从项目开始的第一天起我们就将扩展性和自定义的能力放在了首位。qxp-web 有一套完成的自定义组件使用和升级流程，后期还会增加组件的开发功能。

我们在 one-for-all 项目中提供了一套没有样式的组件 [@one-for-all/headless-ui](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/headless-ui)。在这套组件库中，我们只编写了组件的基础结构样式，没有写表现类样式，如 color、background、border 等，但是我们定义了组件样式配置接口，或者说组件 DOM CSS Selector 的结构，开发者可以在 qxp-web 中根据自己的要求为组件增加样式。

我们认为 @one-for-all/headless-ui 的这种设计思想是具有革命性的，它是真正的可以自定义样式的组件库，真正的可以很容易替换其他或者被替换的组件库。

@one-for-all/headless-ui 虽然是我们开发的，但是它遵循了一般的自定义组件开发流程，也就是说介绍我们是如何将 @one-for-all/headless-ui 应用到 qxp-web 中的过程就是介绍自定义组件的开发流程。

## 对组件库的要求

- 组件的分发模块格式必须是 SystemJS
- 将构建好的组件文件上传到某个静态文件服务器上，需要可以公开访问
- 如果要在页面引擎中使用自定义组件，需要提供组件的 manifest 和 propsSpec

推荐使用 Rollup 对组件进行打包，Rollup 的配置文件可以参考 @one-for-all/headless-ui 的[配置](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/headless-ui/rollup.config.js)。有条件的话可以直接将打包好的文件上传到 CDN 服务器上，没有条件可以将文件上传到全象低代码平台的 file-server 上，请记住最后组件的 js 文件地址。
