# 自定义组件开发

qxp-web 是个开放的、可扩展的低代码平台前端，从项目开始的第一天起我们就将扩展性和自定义的能力放在了首位。qxp-web 有一套完成的自定义组件使用和升级流程，后期还会增加组件的开发功能。

我们在 one-for-all 项目中提供了一套没有样式的组件 [@one-for-all/headless-ui](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/headless-ui)。在这套组件库中，我们只编写了组件的基础结构样式，没有写表现类样式，如 color、background、border 等，但是我们定义了组件样式配置接口，或者说组件 DOM CSS Selector 的结构，开发者可以在 qxp-web 中根据自己的要求为组件增加样式。

我们认为 @one-for-all/headless-ui 的这种设计思想是具有革命性的，它是真正的可以自定义样式的组件库，真正的可以很容易替换其他或者被替换的组件库。

@one-for-all/headless-ui 虽然是我们开发的，但是它遵循了一般的自定义组件开发流程，也就是说介绍我们是如何将 @one-for-all/headless-ui 应用到 qxp-web 中的过程就是介绍自定义组件的开发流程。

## 对组件库的要求

- 组件的分发模块格式必须是 SystemJS
- 将构建好的组件文件上传到某个静态文件服务器上，需要可以公开访问
- 如果要在页面引擎中使用自定义组件，需要提供组件的 manifest 和 propsSpec

推荐使用 Rollup 对组件进行打包，Rollup 的配置文件可以参考 @one-for-all/headless-ui 的[配置](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/headless-ui/rollup.config.js)。因为 qxp-web 是基于 React 实现的，所以在打包过程中可以将 React 的相关库声明为外部依赖，不用和组件的实现 bundle 在一起。

组件打包完成之后需要将打包好的文件上传到静态文件服务器上，可以是 CDN，可以是对象存储，也可以是自己的某个 nginx 服务目录。总之，只要最后能通过一个 URL 下载到打包的文件即可。

**特别提醒一下，不管使用何种方式，都请处理好跨域问题。**

这里不推荐在文件名中携带 hash 值，因为我们可以采用更易维护和对人类友好的方式。我们可以将组件库的版本号加入到 bundle 文件的 URL 中，每次更新组件后，都应该根据更新的内容，按照 semantic version 的规范升级组件的版本号。在上传文件时，最后上传的 URL 可以采用类似的格式：`https://example.com/<packagename/<packageVersion>/index.js>`。

这样实现最大好处就是组件版本的兼容，假设我们在 Artery 中有三个节点，他们都是用到了同一个组件库的组件，他们的版本分别为 `1.0.0` `1.0.1` `2.0.0`。显而易见的，前两个节点他们对应的组件版本是兼容的，那么我们在下载组件时就可以只下载最新的兼容版本 `1.0.1`。版本 `2.0.0` 和前两者不兼容，那我们可以单独下载，这样也做到了在同一个页面中使用不同版本的组件实现，最大程度上的减少了版本升级的压力。还有的好处就是可读性，组件不可避免的存在 bug，只要根据 URL 中的版本号，我们就能很容易的知道是哪个版本出了问题，可以选择升级版本或提交 bug fix。

## 将组件的 bundle 文件地址保存到配置中心

配置中心是前端的重度依赖服务，前端的自定义页面的 Artery 都是保存到了配置中心里。配置中心支持批量查询和修改数据，API 格式如下：

查询 API：

```text
# REQUEST

POST /api/v1/persona/batchGetValue

{
  keys: [{ key: key1, version: 1.0.0 }, { key: key2, version: 2.0.0 }]
}

# RESPONSE

{
  code: 0,
  data: {
    result: {
      key1: <string_value>,
      key2: <string_value>
    }
  }
}
```

修改 API:

```text
# REQUEST

POST /api/v1/persona/batchSetValue

{
  keys: [{ key: key1, version: 1.0.0, value: <string_value> }, { key: key2, version: 2.0.0, value: <string_value> }]
}

# RESPONSE

{
  code: 0,
  data: {
    failKeys: [key1, key2...],
    successKeys: [key1, key2...]
  }
}
```

下面我们需要做的就是调用修改 API 把自定义组件的 bundle 地址保存到配置中心。请求参数中 `key` 的值为以下格式：

```text
third_party_package_entry:${packageName}:${packageVersion}
```

其中 `third_party_package_entry` 是我们约定好的前缀；`packageName` 即为组件库的名称，它应该是全局唯一的；`packageVersion` 就是组件的版本。例如我们现在想在 qxp-web 中使用的组件库名称为 `my-awesome-components`，版本为 `1.0.1`，那调用配置中心的请求应该为：

```text
POST /api/v1/persona/batchSetValue

{
  keys: [{
    key: third_party_package_entry:my-awesome-components:1.0.1,
    version: 1.0.0,
    value: https://example.com/some/path/to/index.js
  }]
}
```

保存完成之后，在 qxp-web 中就可以使用自定义组件了。我们在 portal 端提供了配置 home 首页 [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) 的功能，此功能在系统管理中的平台参数配置。假如你现在自己开发了一个很酷的图表组件，在完成了上面的操作之后，只要写类似这样的一段 Artery, 然后保存，那在 home 端的首页就能看到组件被渲染到页面上。

```json
{
  "node": {
    "id": "some_id",
    "type": "react-component",
    "packageName": "my-awesome-components",
    "packageVersion": "1.0.0",
    "exportName": "AwesomeChart",
    "props": {
      "test": {
        "type": "constant_property",
        "value": "some value"
      }
    }
  }
}
```

## 在页面引擎中使用自定义组件

如果想要在页面引擎中使用自定义组件，除了完成前面提到的工作完，还需要提供两份说明文件，一份是 manifest，另一份是 propsSpec。下面先介绍一下背景，然后再说明一下如何编写和配置两份说明文件。

### 页面引擎和自定义组件

通常意义上的页面引擎是指构建页面的一个功能模块，但其实不是这样的，页面引擎不提供任何构建页面的能力，它只是一个框架，是一系列规范，是具体功能模块的运行容器，“页面引擎的功能”也是由一个个的功能模块独立提供的。这样设计和实现的目的就是为了扩展性，有了良好的扩展性，开发者才能将自己的自定义组件加入到页面引擎中。

我们把页面引擎的完成具体功能的部分称为 Block，页面引擎中有三个重要的 Block：组件库 FountainHead、canvas 和组件配置 Node Carve。在页面引擎中使用自定义组件，其实就是和分别和这三个 block 对接，如果已经完成了前面的步骤，那和 canvas 的对接就完成了。下面介绍一下与组件库和组件配置对接的过程。

### 组件库 Block 和 manifest json

页面引擎的组件库展示了我们可以使用的组件有哪些，这些组件都是以 package 为单位归类的，package 的名称需要全局唯一。那一个 package 中有哪些组件可用呢？这个组件的 export name 又是什么的？

上述的信息就需要组件库的作者提供一份声明文件，我们把这份描述文件叫做 manifest json。你可以在[这里](https://github.com/quanxiang-cloud/qxp-web/blob/develop/clients/portal/modules/apps-management/pages/page-design/blocks/fountainhead/type.ts#L63)找到 manifest 的类型定义，也可以参考 @one-for-all/headless-ui 中的组件的 manifest，比如这是 divider 组件的 [manifest](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/headless-ui/src/shared/divider/artery-config.ts#L3)，下面给出一个简单的示例说明：

```typescript
const dividerManifest = {
  // category 表示此组件在 package 中的分类，组件库 block 会按照分类按展示组件，可以省略
  category: '基础组件',
  // 组件的 props 可能会很多，为了更好的用户体验，我们可以在 manifest 里定义一些 props 的组合，
  // 为组件指定一些默认的 props。所以我们定义了一个名为 variants 的对象数组，数组中的每一项就是
  // 预制的组件 props 组合。当然，如果一个组件比较简单，那 variants 的长度可以直接为 1。
  variants: [
    {
      // 组件的 icon，使用 icon 标识组件用户体验更友好
      icon: {
        type: 'image',
        // 图片的地址或者图片的 base64 字符串
        src: 'base64_image_string',
      },
      // 组件的描述
      desc: '分隔线',
      // 组件的显示名称
      label: '分隔线',
      // 此 variants 的默认 props 组合
      initialProps: {
        direction: 'horizontal',
        size: '100%',
        thickness: '1px',
      },
    },
  ],
};

const packageManifest: Record<string, Inventory> = {
  // `divider` 是分割符组件在此 package 中的 export name
  divider: dividerManifest,
  anotherComponent: anotherManifest,
};
```

只有声明了 manifest 的组件才能显示在组件库中。写完之后我们需要将其保存到配置中心，key 为 `PACKAGE_MANIFEST:<packageName>`，packageName 自然就是组件库的名称，请求的参数的版本和组件的版本保持一致就可以，value 就是把整个 package 的 manifest 序列化成字符串。所以一段示例 js 代码可以写为：

```javascript
batchSetPersona([{
  key: 'PACKAGE_MANIFEST:myAwesomeComponents',
  version: '1.0.0',
  value: JSON.stringify(packageManifest)
}])
```

### 组件配置 Block 和 Props Spec json

页面引擎的组件配置 Block 是用来配置组件的 props 的，通过传入不同的 props，我们就能让组件表现出不同的行为或者渲染预期的 UI。那组件具体有哪些 props 可以配置呢？这些 props 又是什么数据格式的？

同样的，我们需要为每个组件写一份 Props Spec。Props Spec 的定义比 manifest 定义要复杂，因为组件的 props 类型是不确定的，props 的值也有不同的约束，[这里](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/node-carve/src/index.d.ts)是 Props Spec 的定义。这里不对 props 的写法举例，请直接参考 [@one-for-all/headless-ui 的实现](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/headless-ui)。

一份完整的组件 Props Spec 定义类型是 `Record<string, PropsSpec>`，和 manifest 一样，使用组件的 export name 来作为唯一的 key。

在写完 Props Spec 之后，需要将其保存到配置中心。key 为 `PACKAGE_PROPS_SPEC:<packageName>`，packageName 自然就是组件库的名称，请求的参数的版本和组件的版本保持一致就可以，value 就是把整个 package 的 Props Spec 序列化成字符串，具体请求参考前面保存 manifest 的示例代码。

#### PropsSpec

PropsSpec 即组件库的属性描述文件，里面包含了对组件自身以及组件属性的具体描述以及在表单中期望的展现形式，最终通过这份配置文件去生成配置表单。

单个组件 `PropsSpec` 由三部分组成:

- `props` 描述组件具体的属性的配置项
  在 props 中接收一个描述数组 `BasePropSpec[]`，每一个描述项针对单独的一个属性。同时用 `type` 描述属性的基本类型，如果在没有传递 `will` 的情况下，会根据 `type` 渲染默认的配置组件

    | name      | required | type                    | description                                                ｜
    |  ----     | ----     | ----                    | ----                                                       |
    | label     | 是       | string                  | 配置表单中配置此属性的标题                                       |
    | type      | 是       | string                  | 表示属性的类型，例如 string number boolean 等                   |
    | name      | 是       | string                  | 此属性在对应组件的 key                                          |
    | desc      | 否       | string                  | 此属性的一些额外描述                                            |
    | will      | 否       | WillTypes               | 配置表单中渲染的具体配置组件，不传递的话则会根据 type 渲染默认的配置组件 |
    | willProps | 否       | Record<string, unknown> | 配置组件的属性，暂不支持函数属性                                  |

- `isContainer` 描述组件是否能够接受 `children`
- `isOverLayer` 描述组件是否是存在于额外的浮层中

### 启用自定义组件

页面引擎中可以使用的组件库不止一套，组件库后面也肯定会升级，为此需要维护一个可以使用的组件库列表。

在配置中心里有这样一份数据，它的 key 是 `PACKAGES`, version 是 `1.0.0`, value 反序列化后是一个对象数组，数组中的对象格式如下：

```typescript
interface Package {
  // 组件的显示名称，一般为中文
  label: string;
  // 组件的唯一标识
  name: string;
  // 组件的版本
  version: string;
}
```

如果要新增一个可用组件库的话，直接在数组后面新增一个，然后保存就好。如果要更新组件库的版本，那把原数组中的 package 的版本更新之后重新保存即可。

这是最后一步了。
