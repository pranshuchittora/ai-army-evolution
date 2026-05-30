---
name: superman-add-content
description: 往「AI 军团进化论」(superman.zhidun-ai.com)的工具导航 / 学习资源 / 工具分类 / 飞书知识库链接里增删条目。当用户说"加个工具""收录 X""加几条学习资源""加个分类""更新飞书链接"时使用。纯数据维护，不用改代码。
---

# superman-add-content · 维护站点数据

本站的工具、资源、分类、学习路径、飞书链接全是**种子 JSON**，加内容 = 改 JSON，不用动代码。改完 `make publish` 发布。

## 数据文件（都在 `src/data/`）
| 想加什么 | 文件 | 关键字段 |
|---|---|---|
| AI 工具 | `tools.json` | 见下 |
| 学习资源 | `resources.json` | 见下 |
| 工具分类 | `categories.json` | slug/name/emoji/description/gradient |
| 学习路径 | `learning-paths.json` | slug/level/title/subtitle/steps/outcomes |
| 飞书知识库链接 | `feishu.json` | nodes[].{emoji,title,url,desc} |

类型定义见 `src/lib/types.ts`。数据访问层 `src/lib/db.ts`。

## 加工具（tools.json）
对象字段（严格）：
```json
{
  "id": "小写英文短横线唯一标识",
  "name": "工具名(中文用通用叫法)",
  "tagline": "一句话亮点(≤18字)",
  "description": "2-3句中文详述",
  "url": "https:// 官网真实链接",
  "category": "必须是 categories.json 里存在的 slug",
  "tags": ["2-3个中文标签"],
  "pricing": "free | freemium | paid",
  "region": "global | cn",
  "featured": true
}
```
- `category` 必须是这 10 个 slug 之一：chat / coding / image / video / audio / agent / productivity / writing / design / search。
- `featured` 可选，加了才会上首页"本期精选"。
- `id` 全局唯一。

## 加资源（resources.json）
```json
{
  "id": "唯一标识",
  "title": "标题",
  "description": "1-2句说明",
  "url": "https://真实链接",
  "type": "course | doc | video | article | community | newsletter",
  "level": "beginner | intermediate | advanced",
  "topic": "中文主题标签",
  "free": true
}
```

## 校验 + 发布
```bash
# 校验 JSON 合法 + 分类/枚举/唯一性
node -e 'const t=require("./src/data/tools.json");const c=new Set(require("./src/data/categories.json").map(x=>x.slug));
const ok=new Set(["free","freemium","paid"]),r=new Set(["global","cn"]),ids=new Set();let bad=[];
t.forEach(x=>{if(!c.has(x.category))bad.push(x.id+":分类 "+x.category);if(!ok.has(x.pricing))bad.push(x.id+":pricing");if(!r.has(x.region))bad.push(x.id+":region");if(ids.has(x.id))bad.push("重复 id "+x.id);ids.add(x.id);});
console.log(bad.length?("⚠️ "+bad.join("; ")):("✓ "+t.length+" 个工具全部合法"));'

pnpm build && make publish ARG="content: 新增工具/资源"
```

## 注意
- 全站中文文案，全角标点。
- 加完工具会自动出现在 `/tools`（可搜索筛选）、首页分类计数、热门标签云、sitemap，无需改代码。
- 写工具描述要客观、是 2026 现状，不确定的功能/价格别写死。
