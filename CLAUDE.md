# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目是什么

「AI 军团进化论」——面向 AI 学习者与实践者的社群知识 / 工具导航站。四大支柱：
**工具导航**（精选 AI 工具，可搜索筛选）、**博客**（老一撰写的 SEO 深度文章）、
**学习中心**（新手→高级学习路径 + 资源库）、**社群广场**（无需登录的投稿 + 点赞）。
前期不做用户登录注册，存储用文件数据库。线上：https://superman.zhidun-ai.com

## 常用命令

```bash
make dev / pnpm dev      # 开发服务器（默认 3000）
make build / pnpm build  # 生产构建（output: standalone，产物在 .next/standalone）
pnpm lint                # ESLint
make publish             # 一键发布到生产（见下「部署」）
make status / make logs / make ssl   # 线上状态 / 日志 / 证书
```
无单测框架。验证靠：`pnpm build` 编译通过 + 手动访问 + curl（本地打线上要加 `--noproxy '*'`）。

## 技术栈

Next.js 16（App Router, **output: standalone**）· React 19 · TypeScript（strict）·
Tailwind v4 · pnpm（**锁定 10.28**，见下）。路径别名 `@/* → src/*`。部署：Docker + nginx-ai 容器 + certbot。

## 架构要点（跨文件才看得懂的部分）

**数据是「种子 JSON（只读）+ 文件数据库（可写）+ Markdown 博客」三层**：
- 种子内容在 `src/data/*.json`（tools / resources / categories / learning-paths / feishu），
  经 `src/lib/db.ts` 断言成 `src/lib/types.ts` 的类型后导出。**加工具/资源/分类/飞书链接 = 直接改 JSON**。
- 博客文章是 `src/content/blog/*.md`（YAML frontmatter + 正文），经 `src/lib/blog.ts`
  （gray-matter 解析 + marked 编译 HTML）读取。文章页 `src/app/blog/[slug]/page.tsx` 用
  `generateStaticParams` **构建期静态预渲染**，运行时零额外开销。**加文章 = 加 .md，不用改代码**。
  写作规范见 `src/content/blog/_AUTHORING_SPEC.md`（下划线开头，构建跳过）。
- 用户投稿持久化到根目录 `content/submissions.json`（`db.ts` 用 `process.cwd()` 定位）；
  生产环境 Docker bind mount 到宿主机，更新容器不丢。读写只经过 `db.ts`。

**服务端 / 客户端边界**：页面是 Server Component，直接从 db/blog 读数据。用文件系统的逻辑
（db.ts、blog.ts、API route）必须 Node 运行时——API route 已声明 `runtime="nodejs"`，**别改 Edge**。
交互组件（ToolExplorer / SubmitForm / CommunityFeed / Navbar）标 `"use client"`，走 `/api/submissions`。

**安全**（`src/middleware.ts` + `src/lib/rate-limit.ts` + API 层）：全站安全响应头；
**改 CSP 必须放行内联 script/style + hm.baidu.com + Google Fonts**，否则白屏。投稿/点赞按 IP 限流 + 输入校验净化。

**SEO/GEO**：`robots.ts` / `sitemap.ts`（动态含全部博客）/ `manifest.ts`；各 page 导出 metadata
并注入 JSON-LD（`src/components/JsonLd.tsx`）。canonical/OG 统一 `https://superman.zhidun-ai.com`
（`layout.tsx` 的 metadataBase）。百度统计在 layout 用 next/script 注入。

**设计系统**集中在 `src/app/globals.css`：`@theme` 定义品牌色/字体 token，`@layer components`
定义 `.card/.glass/.btn-primary/.chip/.brand-text/.container-page/.prose-blog`（博客正文排版）。
**改全局风格优先动这里**。暗色优先，已做移动端适配（手机优先 grid、scroll-padding、16px 输入防缩放）。

## 部署（见 DEPLOY.md）

- **所有部署凭据（服务器地址 / SSH 密钥 / 域名 / 邮箱 / 内部路径）放在本地 `deploy/.env`，不入库**；
  脚本与 Makefile 从中读取。首次 `cp deploy/.env.example deploy/.env` 填写。
- 前置 Nginx 独占 80/443 是统一入口；本站只新增一份站点配置（`deploy/nginx-site.conf.example`），
  反代到应用容器（`APP_HOST_PORT` → 容器 3000）。
- `make publish` = 本地 build 自检 → 推 Git → rsync 同步（排除 .env/*.pem/*.key）
  → 服务器写公开环境变量并跑 `deploy/deploy.sh` 重建容器 → 健康检查。
- **红线**：只管理本站容器与本站 Nginx 配置，绝不动服务器上其它站点 / 容器。
- **Docker 构建用 pnpm 10.28**（package.json 的 `packageManager` 锁定）；新版 pnpm 11 会把忽略
  sharp 等原生构建脚本当硬错误导致 build 失败，别去掉锁定。
- 站点级公开配置（域名 / 名称 / 统计 / 社群）通过 `NEXT_PUBLIC_*` 环境变量注入，见 `src/lib/config.ts`。

## 可复用 Skills（`.claude/skills/`）

- **superman-write-blog**：选题 + 调研 + 写并发布博客（可并行批量）。
- **superman-add-content**：维护工具/资源/分类/飞书链接（纯数据）。
- **superman-publish**：发布与线上运维排查。

## 约定

- 全站中文文案，全角标点。新增工具需给 tagline + description，标注 region/pricing，
  `category` 必须是 categories.json 里的 slug，可选 featured（上首页精选）。
- 博客文章 frontmatter 的 `relatedTools` 必须是 tools.json 里真实存在的 id（站外产品评测填 `[]`）。
- 文章默认署名 `author: "老一"`。
- 注意：README/CLAUDE.md 历史上曾被 create-next-app 模板还原（CLAUDE.md 默认是 `@AGENTS.md`）；
  富内容是手写的，改动时确认没被脚手架覆盖。
