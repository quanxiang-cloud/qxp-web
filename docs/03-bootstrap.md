# 安装和启动

注：本安装和启动指南之针对 Mac OS 环境，Windows 和 Linux 上安装启动虽然略有差异，但也可参考本文。

**TL;DR;**

- 安装 Golang 1.16.x 或以上版本, 安装 NodeJS 16.x.x, yarn 1.22.x 和 redis
- 安装 nginx, 复制 `docs/appendix/qxp-web.conf` 到 nginx 配置文件夹下
- 修改 `qxp-web.conf` 中的 root 路径
- 复制一份 `config.yaml.example` 为 `config.yaml` 并修改为合适的本地开发地址，特别注意 `server_port` 需要和 nginx 配置转发端口一致
- 执行 `yarn install`
- 执行 `make -p`
- 打开浏览器，访问 `http://portal.qxp.localhost` 或者 `http://home.qxp.localhost`

## 安装依赖

如 [架构和技术栈](02-architecture.md) 中所述，qxp-web 是一个大前端项目，所以除了安装 NodeJS 等相关前端依赖以外，还需要安装 Golang 等其他后端依赖，下面逐步详细说明安装步骤。

### 安装 Golang

在 [Golang 的官网](https://go.dev/dl/)上有详细的安装过程，安装步骤请以官方为准，这里不再复述。需要注意的是请安装 1.16 或以上版本。

特别的，推荐国内用户在环境变量中导出代理配置 `export GOPROXY=https://goproxy.cn`。

### 安装 Redis

qxp-web 需要依赖 redis 保存用户的 session 等信息，请参考 [Redis 官网的安装指南](https://redis.io/docs/getting-started/)安装。一般在安装好之后不需要任何配置，直接可用。

### 安装 Nginx

我们需要 nginx 来状态动态请求和 host 静态文件，Mac OS 上推荐使用 Homebrew 安装 Nginx

```bash
brew install nginx
```

然后执行下面的命令就可以启动 nginx

```bash
nginx
```

nginx 的配置文件一般都位于 `/usr/local/etc/nginx`，主配置文件的地址为 `/usr/local/etc/nginx/nginx.conf`，自定义的配置文件一般可以放到 `/usr/local/etc/nginx` 下的 `conf.d` 目录里，然后在 `/usr/local/etc/nginx/nginx.conf` 将其 include 进去，这里有一份简化版本的主配置文件。

```text
http {
    access_log /var/logs/nginx/access.log;
    error_log /var/logs/nginx/error.log;

    include conf.d/*.conf;
}
```

推荐配置并记住的 nginx 的 `access_log` `error_log`，在后面遇到问题的时候可以通过查看日志排查问题。上面配置的最后一行就是将 `conf.d` 里的所有以 `.conf` 结尾的文件都加到 nginx 配置中，为了便于管理和维护，我们推荐将 qxp-web 相关的 nginx 配置也放到 `conf.d` 中。

[这里](appendix/qxp-web.conf)提供了一份 qxp-web 的 nginx 配置文件示例，你可以将其复制到 `/usr/local/etc/nginx/conf.d` 中。示例配置文件中定义了两个 `server` block，一个用户处理访问管理端（ Portal）的请求，一个用于处理访问用户端（home），两个 block 的配置内容大部分都相同，但是请逐个确认或修改以下内容为适合你本地开发的值：

- **`server_name`**, 默认为 `portal.qxp.localhost` 和 `home.qxp.localhost`，推荐使用默认值，在使用 Chrome 开发时，访问以 `localhost` 结尾的域名时，IP 会始终解析为 `127.0.0.1`，这样就省去了配置 hosts 的步骤
- **`root`**, 这里需要将其指定为 qxp-web 项目的绝对路径，两个 block 需要保持一致，请根据自己本机的实际地址修改即可
- `location /` 中的 **`proxy_pass`**，这里指定了转发动态请求到哪个地址，既然我们是本地开发，那自然就应该是指向本机的地址。管理端 Portal 和 用户端 Home 是两个服务，所以应该分别配置，你可以使用默认的地址，或者修改成你认为合适的端口号，但是请注意，**一定要保持转发的端口号和服务启动的监听端口保持一致**，不然 nginx 无法将动态请求转发到对应的服务上。

完成配置文件的更新后，可以执行 `nginx -t` 检查一下配置文件是否有语法错误，如果没有错误可以执行 `nginx -s reload` 重启 nginx 使配置文件生效。

### 安装 NodeJS 和 yarn

相信你本地大概率已经安装了，只要保证 NodeJS 版本大于 16.x，yarn 版本为 1.x 即可。

## 项目启动

### 更新服务配置文件

将项目根目录下的 `config.yaml.example` 复制一份为 `config.yaml`，同样放在根目录下即可。修改配置文件中的示例内容，注意 `server_port` 需要和 nginx 的转发端口对应。

### 启动服务

如果一切顺利的话，cd 到项目跟目录，然后执行 `make -j` 后等待一段时间，web server 和前端的 bundle 进程等就启动了，打开浏览器访问在 nginx 配置的 server_name, 例如 http://porta.qxp.localhost 或者 http://home.qxp.localhost 就能看到登录页面。

如果改了前端代码，等待 bundle 完成后，刷新一下浏览器就能看到效果。如果改了服务端代码则需要中断后重新执行 `make -j`，因为服务端的代码很少改动，所以没有加自动重启。

总有些事情不会很顺利，不要慌，如果你看不到登录页面，建议先看看 [架构和技术栈](architecture.md) 和 [项目构建说明](04-build_instructions.md)，分析一下问题后再看看下面的 Troubleshooting。

### Troubleshooting

**Chrome 访问页面提示请求被拒绝或者 404**
