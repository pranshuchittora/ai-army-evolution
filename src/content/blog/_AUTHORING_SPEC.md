# 博客文章写作规范（给写作 Agent，构建脚本会跳过下划线开头的文件）

每篇文章 = 一个 Markdown 文件，放在 `src/content/blog/<slug>.md`，开头是 YAML frontmatter，下面是正文。

## Frontmatter 字段（严格按此，键名不能错）

```yaml
---
title: "文章标题（含核心关键词，吸引点击，≤32字）"
description: "SEO 摘要，1-2 句，含关键词，120字内"
author: "老一"
date: "2026-05-30"
tags: ["标签1", "标签2", "标签3"]
emoji: "🤖"
gradient: "from-violet-500 to-indigo-500"
relatedTools: ["chatgpt", "claude"]
cover: "对比 / 指南 / 入门 / 盘点"
---
```

- `author` 一律写 `"老一"`。
- `date` 一律写 `"2026-05-30"`。
- `gradient` 从这些里选一个搭配主题：
  `from-violet-500 to-indigo-500`、`from-sky-500 to-cyan-500`、`from-pink-500 to-rose-500`、`from-orange-500 to-amber-500`、`from-emerald-500 to-teal-500`、`from-fuchsia-500 to-purple-500`、`from-blue-500 to-indigo-500`、`from-rose-500 to-pink-500`、`from-cyan-500 to-blue-500`。
- `relatedTools` 必须是站内真实存在的工具 **id**，从 `src/data/tools.json` 的 `id` 字段取（先读这个文件确认 id 准确，例如 chatgpt、claude、gemini、cursor、midjourney、kling、suno、dify、perplexity 等）。每篇 2-5 个相关工具。
- `cover` 填文章类型：对比 / 指南 / 入门 / 盘点。

## 正文要求（这是重点——必须真正有价值）

- **中文，全角标点。** 字数 **1600–2800 字**，深度、实用、不水。
- 写作前**用 WebSearch 做真实调研**（价格、功能、最新动态、真实优缺点、适用场景），确保信息准确、是 2026 年的现状，不要编造不存在的功能或价格。
- 结构清晰，用 Markdown：`##` 二级标题分章节、`###` 三级标题、有序/无序列表、**加粗**重点、必要时用 Markdown 表格做对比（对比类文章必须有至少一个对比表格）。
- 开头 1 段点题（这篇解决什么问题、读完能获得什么），结尾给**明确结论/选型建议**（“如果你是 X，选 Y”）。
- 对比类：维度要具体（能力、价格、速度、中文支持、生态、适用人群），给出场景化推荐，不要和稀泥。
- 指南/实战类：给可操作的步骤、技巧、避坑点，最好有示例。
- 入门科普类：用通俗类比讲清概念，再落到“怎么用、用哪些工具”。
- 文中自然提到 relatedTools 里的工具时，可用 Markdown 链接指向其官网或站内 `/tools`，但不要堆砌。
- 不要写“作为 AI”之类的口吻；以「老一」这个有经验的 AI 实践者的第一人称/中立专业口吻写。
- 不要包含 frontmatter 之外的 H1（标题由页面渲染），正文从 `##` 或正文段落开始。

## 质量底线

宁可少写不可注水。每篇都应是“别人搜这个关键词，点进来觉得真有用、愿意收藏”的水平。
