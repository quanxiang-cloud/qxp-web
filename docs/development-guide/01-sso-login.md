# SSO 单点登录

## 生成 JWT Token

请按照 [JWT](https://jwt.io/) 协议，使用部署时配置的 secret 生成 token。

## 构造访问 URL

Portal 和 Home 端都是支持 SSO 单点登录，登录两者的  URL 构造方式相同，URL 格式如下：

```text
https://{hostname}/sso/auth?code={token}&redirect_url={/some/url}
```

- **hostname** 请根据部署是配置的域名和要访问的服务确定
- **/sso/auth** 此 path 为 SSO 访问地址，不可改动
- **code** code 的值为上一步中生成的 token
- **redirect_url** 登录成功后的跳转地址，默认为 `/`, 可省略

## 用户登录

根据业务场景的不同，在完成 SSO 登录地址构造之后，可以在浏览器端使用 JS 让用户跳转到 qxp-web，也可以在服务端直接返回 302 重定向。
