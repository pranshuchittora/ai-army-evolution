---
name: superman-publish
description: 把本站发布上线，以及排查线上问题。当用户说"发布""上线""部署""更新到线上""make publish""看下线上状态/日志""证书/HTTPS 有问题"时使用。
---

# superman-publish · 发布与运维

> 所有部署凭据（服务器地址、SSH 密钥、域名等）都在本地 `deploy/.env`，不入库。
> 首次使用先 `cp deploy/.env.example deploy/.env` 并填写真实值。

## 一键发布（首选）
本地项目根目录执行：
```bash
make publish                          # 用默认提交信息
make publish ARG="feat: 你的说明"      # 自定义提交信息
```
脚本（`deploy/publish.sh`）依次：① 本地 `pnpm build` 自检（失败即中止，不会把坏代码发上线）→
② 提交并推送 Git → ③ rsync 同步源码到服务器（自动排除 `.env`/`*.pem`/`*.key`）→
④ 服务器写入公开环境变量并执行 `deploy/deploy.sh` 重建容器、滚动重启 → ⑤ 线上健康检查。
全过程打印在本地终端。

## 其它运维命令
```bash
make status   # 线上容器运行状态
make logs     # 线上应用日志（最近 120 行）
make ssl      # 检查 HTTPS 证书与有效期
make dev      # 本地开发预览 http://localhost:3000
make build    # 本地构建自检
make test     # 单元测试
```

## 生产环境拓扑（要点）
- 前置 Nginx 独占 80/443，是统一入口；本站只新增一份站点配置（见 `deploy/nginx-site.conf.example`），
  **绝不改动服务器上其它站点 / 容器**。
- 应用跑在 Docker 容器（`APP_NAME`），宿主机回环端口 `APP_HOST_PORT` → 容器 3000。
  投稿数据持久化挂载在 `<源码目录>-data/content`（重建容器不丢）。
- HTTPS：Let's Encrypt（webroot 方式），certbot 定时续期。
- 服务器的真实地址 / 路径 / 域名见本地 `deploy/.env` 与（若有）`deploy/SERVER-TOPOLOGY.local.md`。
- 完整说明见仓库 `DEPLOY.md`。

## 红线
- 只管理本站容器与本站 Nginx 配置，不动其它站点。
- Docker 构建用 **pnpm 10.28**（`package.json` 的 `packageManager` 锁定）。新版 pnpm 11 会把
  "忽略 sharp 等原生构建脚本"当硬错误导致 build 失败——不要去掉这个锁定。
- 本地用 curl 验证线上要加 `--noproxy '*'`（本机可能开了代理，否则会 502，那是代理问题）。

## 常见排查
- 发布失败看终端哪一步红：本地 build 失败→修代码；rsync 失败→检查 SSH/密钥（`deploy/.env` 里的 `DEPLOY_SSH_*`）；
  服务器 build 失败→`make logs` 或 ssh 上去看 docker build 日志。
- 站点打不开：`make status` 看容器 → `make logs` 看应用报错 → 服务器 `nginx -t` 校验。
- 证书告警：`make ssl` 看实际证书；服务器 `sudo certbot certificates` / `sudo certbot renew --dry-run`。
