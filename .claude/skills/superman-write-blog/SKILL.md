---
name: superman-write-blog
description: 为「AI 军团进化论」站点(superman.zhidun-ai.com)做选题 + 全网调研 + 撰写并发布 SEO 深度博客文章。当用户说"写篇博客""加几篇文章""做个选题""围绕 X 写文""写一篇 X 评测/对比/指南"时使用。支持单篇或多篇并行批量。
---

# superman-write-blog · 写并发布博客文章

为本站博客（`/blog`）产出**真正有价值、能抓搜索流量**的中文深度文章。文章用 Markdown 写、构建时静态预渲染，署名默认「老一」。

## 适用场景
- 给定方向/工具/关键词，做选题并写成文章
- 工具深度对比（如「A vs B vs C 怎么选」）
- 实战指南 / 入门科普 / 盘点 / 产品评测
- 批量写多篇（用并行子 agent，每个 agent 领 3-4 篇）

## 工作目录
项目根：`/Users/libiao/Documents/Code/luck-for-my-friends/helloworld`（`/Users/libiao/Code/...` 是其软链，等价）。
文章目录：`src/content/blog/<slug>.md`。写作规范：`src/content/blog/_AUTHORING_SPEC.md`（下划线开头，构建会跳过）。

## 流程

### 1. 选题（若用户只给方向）
- 先看 `src/data/tools.json`（61 个工具的真实 id/name/category）和已有文章 `ls src/content/blog/*.md`，避免重复选题。
- 好选题方向：高搜索意图的「X vs Y 怎么选」对比、热门工具实战指南、"X 是什么"科普、"2026 免费/最佳 X 工具盘点"、产品评测。
- 选题要能对应站内真实工具（`relatedTools` 要用得上）。

### 2. 调研（必做，决定文章价值）
- 用 `WebSearch` 查真实现状：功能、**2026 年价格**、优缺点、最新动态、竞品。对比类务必查全各方。
- 评测某个具体产品时用 `WebFetch` 抓官网/定价页/FAQ 吃透它。
- **不编造**不确定的数字/价格/功能，拿不准就定性描述。

### 3. 写作
严格按 `_AUTHORING_SPEC.md`。要点：
- frontmatter 字段：`title`（含关键词，≤32字）、`description`（SEO 摘要，120字内）、`author: "老一"`、`date`（写当天，格式 YYYY-MM-DD）、`tags`（数组）、`emoji`、`gradient`（从规范列出的 Tailwind 渐变里选）、`relatedTools`（**必须是 tools.json 里真实存在的 id**，2-5 个；评测站外产品则填 `[]`）、`cover`（对比/指南/入门/盘点/评测）。
- 正文：中文全角标点，1600–2800 字（评测可到 3200）。`##`/`###` 分章、列表、**加粗**重点。**对比类必须含 Markdown 表格**。开头点题、结尾给明确选型建议。
- 口吻：资深 AI 实践者「老一」的专业中立第一人称，**不要写"作为 AI"**。
- 正文不要写 H1（标题由页面渲染），从 `##` 或正文段落开始。
- 文件名 = slug（英文短横线，如 `cursor-vs-copilot.md`），即 URL `/blog/<slug>`。

### 4. 校验（写完每篇都要）
```bash
node -e 'const m=require("gray-matter"),fs=require("fs");
const t=new Set(require("./src/data/tools.json").map(x=>x.id));
const {data,content}=m(fs.readFileSync("src/content/blog/<slug>.md","utf8"));
console.log("author:",data.author,"| 字数:",content.replace(/\s/g,"").length,"| 表格:",/\|.*\|/.test(content));
(data.relatedTools||[]).forEach(id=>{if(!t.has(id))console.log("⚠️ 不存在的 relatedTool:",id)});
console.log("乱码:",/�/.test(content)?"⚠️有":"无");'
```
确认：author=老一、字数达标、relatedTools 都存在、无 U+FFFD 乱码。

### 5. 构建自检 + 发布
```bash
pnpm build          # 确认文章页能静态预渲染、无编译错误
make publish ARG="feat: 新增博客文章 <主题>"   # 一键发布到生产
```
`make publish` 会：本地构建自检 → 提交推送 GitHub → rsync 同步服务器 → Docker 重建 → 线上健康检查。详见 `DEPLOY.md` / `deploy/SERVER-TOPOLOGY.md`。

### 6. 验证上线
```bash
curl -s -o /dev/null -w "%{http_code}\n" --noproxy '*' https://superman.zhidun-ai.com/blog/<slug>
```

## 批量写作（多篇）
用 `Agent` 工具起多个并行子 agent，每个领 3-4 篇，prompt 里让它**先读 `_AUTHORING_SPEC.md` 和 `tools.json`**、用 WebSearch 调研、各写各的文件（slug 不冲突）、写完自校验。全部回来后由主 agent 统一 `pnpm build` + `make publish`。一次别超过约 5 个并行 agent。

## 注意
- 博客数据层在 `src/lib/blog.ts`（gray-matter + marked），列表页 `src/app/blog/page.tsx`，文章页 `src/app/blog/[slug]/page.tsx`。一般只需加 .md，**不用改这些代码**。
- 文章会自动进首页"老一的深度好文"、`/blog` 列表、`sitemap.xml`、相关文章推荐——靠 frontmatter 的 tags 关联。
- 改完只是加内容时，`make publish` 即可，不需要动其它。
