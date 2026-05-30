<div align="center">

# 🛡️ AI 军团进化论

### 🔥 一个把全网好用 AI 工具一网打尽的宝藏社群站！

**再也不用到处找 AI 工具啦～这里全都有！！！**

🌐 **在线体验** → [superman.zhidun-ai.com](https://superman.zhidun-ai.com)

`AI 工具导航` · `深度好文` · `学习路线` · `社群共创`

💗 by **老一**（AI）&amp; **大彪** 用爱发电 💗

</div>

---

## 🌈 这是个啥？为什么你会爱上它

姐妹们！兄弟们！🙌 还在被满天飞的 AI 工具搞晕吗？
今天上线一个 GPT、明天冒出来个新神器，根本记不过来对不对？

**这个站就是来拯救你的！！！** 我们把全网真正好用的 AI 工具 + 学习资料 + 实战干货，
全部整理好、分好类、配好评测，一个地方搞定，找信息丝滑到飞起 ✨

> 🎯 不用注册、不用登录、打开即用，手机电脑都超顺手～

---

## ✨ 站里有什么宝贝？（建议收藏！）

### 🧰 工具导航 · 61+ 精选神器
对话、写代码、画图、做视频、配音、搭智能体…… **十大分类一应俱全**！
国际国产都有，还能按 `分类` / `地区` / `价格` 筛，搜索框一搜秒出 🔍

### ✍️ 博客 · 21 篇老一深度好文
不是水文！每篇都是**全网调研后写出来的硬核干货** 💪
`ChatGPT vs Claude vs Gemini 怎么选`、`AI 编程工具横评`、`Midjourney 出图技巧`、
`PainHunt 深度评测`…… 选工具不纠结，看这里就够了～

### 📚 学习中心 · 从小白到高手的进化路线
🌱 新手 → 🚀 进阶 → 🧠 高级，三阶段路线图清清楚楚，
配 42+ 精选课程 / 文档 / 视频，**绝大多数免费**！跟着走就完事了。

### 💬 社群广场 · 大家一起共建
发现好工具？一键投稿分享给整个军团 🎉 看到喜欢的点个赞顶上去～

### 📒 飞书知识库直达
社群在飞书沉淀的 7 大栏目（信息源地图、工具清单、战场地图…）一键跳转 🚪

---

## 💅 颜值 &amp; 体验（真的很能打）

- 🌙 **暗色高级风** + 紫青渐变品牌色，玻璃拟态卡片，越看越上头
- 📱 **移动端深度适配**，手机刷起来一样丝滑顺畅
- ⚡ **加载飞快**，文章页静态预渲染，秒开不卡顿
- 🔍 **SEO / GEO 全做了**，别人搜关键词能搜到我们
- 🔐 **基础安全加固**，安全响应头 + 接口限流，稳稳的
- 📈 **百度统计**已接入，数据看得明明白白

---

## 🚀 开发者看这里（上手超简单）

```bash
pnpm install
make dev          # 本地预览 → http://localhost:3000
```

**一键发布上线**（这个真的爽）👇

```bash
make publish                        # 一条命令：自检 → 推码 → 同步 → 重建 → 健康检查 全自动
make publish ARG="feat: 你的说明"
```

更多命令：`make status`（线上状态）· `make logs`（日志）· `make ssl`（证书）· `make help`

> 📖 部署细节看 [DEPLOY.md](./DEPLOY.md)，服务器拓扑看 [deploy/SERVER-TOPOLOGY.md](./deploy/SERVER-TOPOLOGY.md)

---

## 🧩 偷懒神器 · 可复用 Skills

我们把高频流程都封装成了 Claude Code skill，团队谁都能一键复用 🪄

| Skill | 能干啥 | 喊一句就行 |
|---|---|---|
| 🖋 **superman-write-blog** | 选题 + 全网调研 + 写文 + 发布，一条龙（还能并行批量写！） | "写篇博客" / "围绕 X 写文" |
| ➕ **superman-add-content** | 加工具 / 资源 / 分类 / 飞书链接（纯改数据，不碰代码） | "加个工具" / "收录 X" |
| 🚀 **superman-publish** | 发布上线 + 线上运维排查 | "发布" / "看下线上状态" |

> 💡 欢迎继续把好用的流程沉淀成新 skill 丢进 `.claude/skills/`，越攒越香～

---

## 🧱 技术栈（给好奇宝宝）

`Next.js 16` (App Router · standalone) · `React 19` · `TypeScript` · `Tailwind CSS v4`
`Markdown 博客` (gray-matter + marked) · `文件数据库` (JSON) · `Docker` · `Nginx` · `Let's Encrypt`

## 🗂️ 目录速览

```
src/
  app/            # 页面 + API（首页 / tools / blog / learn / community / submit）
  content/blog/   # 📝 博客文章（Markdown，加 .md 就能发文）
  data/           # 📦 工具 / 资源 / 分类 / 学习路径 / 飞书链接（改 JSON 就能加内容）
  lib/            # db.ts 数据层 · blog.ts 博客层 · types.ts
  components/     # 复用组件
deploy/           # 🚢 部署脚本 + nginx 配置 + 运维文档
.claude/skills/   # 🧩 可复用 skills
```

## ➕ 想加内容？超简单对照表

| 想加什么 | 改哪儿 |
|---|---|
| 📝 博客文章 | `src/content/blog/<slug>.md`（用 `superman-write-blog`） |
| 🧰 AI 工具 | `src/data/tools.json` |
| 📚 学习资源 | `src/data/resources.json` |
| 🗂 工具分类 | `src/data/categories.json` |
| 📒 飞书链接 | `src/data/feishu.json` |
| 🎨 全局配色 | `src/app/globals.css` |

> 给 AI 协作者的工程说明在 [CLAUDE.md](./CLAUDE.md) 📌

---

<div align="center">

### 🌱 由社群共建，持续进化中…

**喜欢的话，点个 ⭐ Star 支持一下呀！**

Built with 💗 by 老一 &amp; 大彪

</div>
