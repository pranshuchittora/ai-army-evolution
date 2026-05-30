# 贡献指南 · Contributing Guide

> 中文为主，关键处附英文。English summary follows each major section.

感谢你愿意为 **AI 军团进化论（AI Army Evolution）** 出一份力！🎉
本项目由社群共建，无论是收录一个好用的 AI 工具、写一篇深度好文、修一个 bug，还是改进文档，都非常欢迎。

> **English:** Thanks for contributing to **AI Army Evolution**! Tools, articles, bug fixes, and docs are all welcome.

---

## 📜 行为准则 · Code of Conduct

参与本项目即表示你同意遵守我们的 [行为准则](./CODE_OF_CONDUCT.md)。请保持友善、专业。

---

## 🛠️ 开发环境搭建 · Getting Started

本项目使用 **Node 22+** 与 **pnpm 10.28**（版本锁定在 `package.json` 的 `packageManager` 字段，请勿随意升级到 pnpm 11，否则原生依赖如 sharp 的构建会失败）。

```bash
# 1. Fork 并克隆你自己的仓库
git clone https://github.com/<your-username>/ai-army-evolution.git
cd ai-army-evolution

# 2. 安装依赖
pnpm install

# 3. 准备环境变量（.env 已被 .gitignore 忽略，绝不入库）
cp .env.example .env
# 按需填写 .env，本地开发用默认值即可

# 4. 启动开发服务器 → http://localhost:3000
make dev          # 等价于 pnpm dev
```

> **English:** Use Node 22+ and pnpm 10.28 (pinned). Run `pnpm install`, `cp .env.example .env`, then `make dev`.

---

## 🗂️ 项目结构速览 · Project Layout

```
src/
  app/            # 页面 + API 路由（首页 / tools / blog / learn / community / submit）
  content/blog/   # 📝 博客文章（Markdown，加 .md 即可发文）
  data/           # 📦 工具 / 资源 / 分类 / 学习路径 / 飞书链接（改 JSON 即可加内容）
  lib/            # db.ts 数据层 · blog.ts 博客层 · types.ts 类型定义
  components/     # 复用组件
  middleware.ts   # 安全响应头 / CSP
deploy/           # 🚢 部署脚本 + nginx 配置 + 运维文档
tests/            # ✅ Vitest 测试
.claude/skills/   # 🧩 可复用的 Claude Code skills
```

数据采用「**种子 JSON（只读）+ 文件数据库（可写）+ Markdown 博客**」三层模型，详见 [CLAUDE.md](./CLAUDE.md)。

---

## ➕ 如何加内容 · Adding Content

绝大多数内容贡献**只需改数据文件，不用碰代码**。

### 收录一个 AI 工具

编辑 `src/data/tools.json`，按现有条目格式新增一项：

```jsonc
{
  "id": "your-tool",            // 唯一 slug，小写连字符
  "name": "工具名称",
  "tagline": "一句话简介（必填）",
  "description": "详细描述（必填）",
  "url": "https://example.com",
  "category": "chat",           // 必须是 categories.json 里存在的 slug
  "region": "international",     // international / china
  "pricing": "freemium",        // free / freemium / paid
  "featured": false             // 可选，true 则上首页精选
}
```

要点：
- `category` 必须是 `src/data/categories.json` 中真实存在的 slug。
- `tagline` 与 `description` 必填；`region`、`pricing` 必标。
- 也可使用 `.claude/skills/superman-add-content` skill 一键维护工具 / 资源 / 分类 / 飞书链接。

### 写一篇博客文章

在 `src/content/blog/` 下新建 `<slug>.md`，开头是 YAML frontmatter，下面是正文。**加文件即发文，无需改代码**（文章页在构建期静态预渲染）。

Frontmatter 字段说明（键名严格，不能错）：

```yaml
---
title: "文章标题（含核心关键词，≤32 字）"
description: "SEO 摘要，1-2 句，含关键词，120 字内"
author: "老一"                       # 默认署名
date: "2026-05-30"                   # 发布日期，YYYY-MM-DD
tags: ["标签1", "标签2", "标签3"]
emoji: "🤖"                          # 文章卡片图标
gradient: "from-violet-500 to-indigo-500"  # 卡片渐变，从约定色板里选
relatedTools: ["chatgpt", "claude"] # 必须是 tools.json 里真实存在的工具 id；站外评测填 []
cover: "对比"                        # 文章类型：对比 / 指南 / 入门 / 盘点
---
```

字段细则：
- `relatedTools` 里的每个值必须是 `src/data/tools.json` 中真实存在的 `id`，否则会导致引用断裂。
- `gradient` 从约定色板里选（见 `src/content/blog/_AUTHORING_SPEC.md`）。
- 正文用 Markdown，中文文案用**全角标点**，深度实用、不注水。
- 下划线 `_` 开头的文件（如 `_AUTHORING_SPEC.md`）会被构建跳过，可放规范/草稿。
- 完整写作规范见 `src/content/blog/_AUTHORING_SPEC.md`，也可使用 `superman-write-blog` skill 一条龙选题→调研→写文→发布。

> **English:** Add a tool by editing `src/data/tools.json`; add an article by dropping a `<slug>.md` into `src/content/blog/` with the frontmatter above. `relatedTools` ids must exist in `tools.json`.

---

## 🎨 代码风格 · Code Style

- **TypeScript strict**：保持类型安全，避免 `any`；新类型加到 `src/lib/types.ts`。
- **ESLint**：提交前跑 `pnpm lint`，不要引入新告警。
- **中文文案用全角标点**（，。！？：「」），英文与数字之间留空格。
- 路径别名 `@/* → src/*`。
- 用文件系统的逻辑（db.ts / blog.ts / API route）必须在 Node 运行时，**API route 已声明 `runtime = "nodejs"`，不要改成 Edge**。
- 改全局风格优先动 `src/app/globals.css`（`@theme` token + `@layer components`）。
- 改 CSP 时务必放行必要来源，否则线上白屏（详见 CLAUDE.md 的安全章节）。

---

## ✅ 跑测试与构建 · Testing & Building

提交前请确保以下命令通过：

```bash
pnpm lint     # 代码检查
pnpm test     # 单元测试（Vitest）
pnpm build    # 生产构建（output: standalone）
```

> **English:** Before submitting, ensure `pnpm lint`, `pnpm test`, and `pnpm build` all pass.

---

## 📝 提交规范 · Commit Convention

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/)。提交信息格式：

```
<type>(<scope>): <简短描述>
```

常用 `type`：

| type | 含义 |
|---|---|
| `feat` | 新功能 / 新内容 |
| `fix` | 修复 bug |
| `docs` | 文档变更 |
| `style` | 格式（不影响逻辑） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建 / 依赖 |
| `ci` | CI 配置 |
| `chore` | 杂项 |

示例：

```
feat(tools): 收录 Claude Code 工具条目
fix(blog): 修复文章页 canonical 链接
docs(contributing): 补充博客 frontmatter 字段说明
```

---

## 🔀 PR 流程 · Pull Request Flow

1. **Fork** 本仓库 `BillLucky/ai-army-evolution` 到你的账号。
2. 从 `main` 切出特性分支：`git checkout -b feat/your-feature`。
3. 完成改动，确保 `pnpm lint && pnpm test && pnpm build` 全部通过。
4. 按 Conventional Commits 提交。
5. 推送分支并发起 **Pull Request**，填写 PR 模板（改动说明、类型、自测清单）。
6. 等待 CI 通过并接受 review，按反馈迭代。

> **English:** Fork → branch from `main` → commit (Conventional Commits) → ensure CI passes → open a PR with the template filled in.

请勿在 PR / commit / issue 中包含任何密钥、令牌或真实部署凭据，相关要求见 [SECURITY.md](./SECURITY.md)。

---

## 🧩 可复用 Skills · Reusable Skills

仓库 `.claude/skills/` 下封装了团队高频流程，欢迎复用，也欢迎沉淀新 skill：

- **superman-write-blog**：选题 + 全网调研 + 写文 + 发布（可并行批量）。
- **superman-add-content**：维护工具 / 资源 / 分类 / 飞书链接（纯数据）。
- **superman-publish**：发布上线 + 线上运维排查。

---

感谢你的贡献，一起让 AI 军团持续进化！🚀
