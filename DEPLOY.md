# 部署手册

本文档说明如何把本站部署到你自己的服务器。所有**敏感信息（服务器地址、SSH 密钥、域名、邮箱等）
都放在本地 `deploy/.env`**（不入库），脚本与 Makefile 从中读取。

## 架构总览

```
浏览器 ──HTTPS──▶ 前置 Nginx (80/443, Let's Encrypt 证书)
                      │  你的域名
                      ▼
            反向代理 http://127.0.0.1:<APP_HOST_PORT>
                      │
                      ▼
        Docker 容器（Next.js standalone, 监听容器内 3000）
                      │
                      ▼
        投稿数据持久化 bind mount：
        <源码目录>-data/content  ⇄  /app/content（重建容器不丢）
```

## 一、准备配置（首次）

```bash
cp deploy/.env.example deploy/.env
# 编辑 deploy/.env，填入你的服务器、域名、端口等
cp .env.example .env
# 编辑 .env，填入站点 URL、名称、可选的统计与社群配置
```

`deploy/.env` 关键项：`DEPLOY_SSH_KEY` / `DEPLOY_SSH_USER` / `DEPLOY_SSH_HOST` /
`DEPLOY_REMOTE_DIR` / `APP_NAME` / `APP_HOST_PORT` / `SITE_DOMAIN` / `SITE_URL` / `ACME_EMAIL` 等。

## 二、一键发布

```bash
make publish                       # 默认提交信息
make publish ARG="feat: 你的说明"   # 自定义
```

`make publish` 会依次：① 本地 `pnpm build` 自检（失败即中止）→ ② 提交并推送 → ③ rsync 同步源码
到服务器（自动排除 `.env`/`*.pem`/`*.key`）→ ④ 在服务器写入公开环境变量并执行 `deploy/deploy.sh`
构建镜像、滚动重启容器 → ⑤ 线上健康检查。全过程打印在本地终端。

## 三、前置 Nginx（首次配置一次）

前置 Nginx 独占 80/443，作为所有站点统一入口。**只为本站新增一份配置，不改动其它站点。**
参考 `deploy/nginx-site.conf.example`，把 `__SITE_DOMAIN__` / `__APP_HOST_PORT__` 替换为你的值，
放入 Nginx 的 `conf.d`（或 `sites-enabled`）后 `nginx -t && nginx -s reload`。

HTTPS 证书用 Let's Encrypt：

```bash
# webroot 方式（与多数现有站点一致）
sudo certbot certonly --webroot -w <ACME_WEBROOT> -d <SITE_DOMAIN> \
  --non-interactive --agree-tos -m <ACME_EMAIL> --no-eff-email
```

签发后把证书路径写入站点配置的 `ssl_certificate` / `ssl_certificate_key`，reload 即可。
certbot 自带定时续期；如证书需复制到容器化 Nginx 的挂载目录，可加 deploy hook。

## 四、运维命令

```bash
make status   # 线上容器运行状态
make logs     # 线上应用日志（最近 120 行）
make ssl      # 检查 HTTPS 证书与有效期
```

## 五、排查

- 发布失败看终端哪一步红：本地 build 失败→修代码；rsync 失败→检查 SSH/密钥；
  服务器 build 失败→`make logs` 或 ssh 上去看 docker build 日志。
- 站点打不开：`make status` 看容器在不在 → `make logs` 看应用报错 → `nginx -t` 校验 nginx。
- 本地用 curl 验证线上请加 `--noproxy '*'`（本机若开代理，否则可能 502，那是代理问题非站点问题）。

> **数据安全**：投稿写入宿主机 `<源码目录>-data/content`，重建容器不丢。建议定期备份该目录。
> **红线**：只管理本站容器与本站 Nginx 配置，绝不改动服务器上其它站点 / 容器。
