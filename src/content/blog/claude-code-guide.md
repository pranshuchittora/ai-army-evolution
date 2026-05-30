---
title: "Claude Code 上手实战：让 AI 在终端里帮你写完整项目"
description: "Claude Code 是 Anthropic 官方 CLI，能读写整个代码库、跑测试、提交代码。本文手把手带你从安装到用 AI 完成真实项目。"
author: "老一"
date: "2026-05-30"
tags: ["Claude Code", "AI 编程", "CLI", "终端", "实战"]
emoji: "💻"
gradient: "from-violet-500 to-indigo-500"
relatedTools: ["claude-code", "claude"]
cover: "指南"
---

如果你用过 ChatGPT 或 Claude 网页版来辅助写代码，你一定遇到过这个痛点：把代码粘过去、改完再粘回来，来回折腾，上下文断掉，跨文件的改动更是噩梦。[Claude Code](https://claude.com/claude-code) 就是为了解决这个问题而生的——它是 Anthropic 官方推出的命令行工具（CLI），让 Claude 直接在你的终端里读写代码库、运行命令、提交 Git，真正像一个坐在旁边的工程师搭档。

这篇文章会带你完成从安装配置到实际用它做完整项目的全流程，包括几个新手最容易踩的坑。

## 安装与初始化

### 环境要求

Claude Code 基于 Node.js，需要 **Node.js 18+**。确认版本：

```bash
node -v
```

### 安装

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后在终端里跑 `claude` 就能启动。首次运行会引导你登录 Anthropic 账号（或输入 API Key）。

**关于费用：** Claude Code 调用的是 Claude API，按 token 计费。日常使用一个中等复杂度的功能，大概消耗 1–5 美元不等。如果你有 Claude Pro 订阅，从 2025 年底开始已可以用订阅额度使用 Claude Code，省去单独充 API 的麻烦——但要注意高峰期有速率限制。

### 进入项目目录

```bash
cd your-project
claude
```

Claude Code 启动后会自动扫描当前目录的文件结构，并初始化上下文。你会看到一个交互式终端界面，可以开始对话。

## 核心工作流：告别复制粘贴

### 直接描述任务，不要只问问题

新手最常见的错误是把 Claude Code 当成聊天机器人用，问"怎么实现 JWT 鉴权？"然后自己去改。正确方式是直接下指令：

> "在 `src/auth/` 下实现 JWT 登录和刷新 token 的逻辑，使用 `jsonwebtoken` 库，配合现有的 User 模型。"

Claude Code 会读取你项目里的 User 模型、已有的路由结构，然后生成符合你项目风格的代码，直接写到文件里。

### 多文件协同修改

这是 Claude Code 相比网页版最大的优势。你可以说：

> "把项目里所有的 `console.log` 改成 `logger.info`，logger 从 `src/utils/logger.ts` 引入。"

它会扫描所有文件，批量替换，不会遗漏。

### 运行测试直到通过

```
请为 src/utils/dateHelper.ts 里的 formatDate 函数写单元测试，
写完后跑 npm test，如果有报错自己修复直到全部通过。
```

Claude Code 可以执行 shell 命令，看测试输出，然后根据错误信息自行调整代码。这个闭环非常省心。

## CLAUDE.md：让 AI 记住你的项目规矩

在项目根目录创建一个 `CLAUDE.md` 文件，是最值得做的一步配置。每次启动 Claude Code，它都会先读这个文件，相当于给 AI 发的"入职说明书"。

一份好的 `CLAUDE.md` 应该包含：

```markdown
## 项目概述
这是一个基于 Next.js 14 + TypeScript 的电商后台，使用 Prisma + PostgreSQL。

## 编码规范
- 所有组件使用函数式写法，禁止 class 组件
- 状态管理使用 Zustand，不用 Redux
- 样式只用 Tailwind CSS，不写内联 style
- 所有接口要有 TypeScript 类型，不能用 any

## 常用命令
- 启动开发服务器：npm run dev
- 跑测试：npm test
- 数据库迁移：npx prisma migrate dev

## 注意事项
- .env 文件里的变量不要打印到日志
- 改 prisma schema 后必须运行 migrate
```

**关键建议：** CLAUDE.md 保持在 200 行以内。太长反而稀释重要信息，AI 会"忽视"后面的内容。如果规范很多，用 `@import ./docs/conventions.md` 拆分到子文件，按需引入。

## Plan Mode：先想清楚再动手

对于复杂任务，直接让 Claude Code 开干可能会走偏。这时候用 **Plan Mode**（按 `Shift+Tab` 切换）。

在 Plan Mode 下，Claude Code 只会读文件、分析代码、提出方案，不会真正修改任何内容。你先看它的分析对不对、方向是否符合预期，确认后再切回正常模式执行。

这个工作流特别适合以下场景：
- 重构一个复杂模块，不确定影响范围
- 添加一个涉及多个文件的新功能
- 处理你不熟悉的代码区域

## Hooks：把规则变成强制执行

Claude Code 支持 Hooks，可以在特定操作前后自动触发脚本。这比 CLAUDE.md 里的文字规范更可靠——文字规范 AI 偶尔会"忘记"，Hooks 是硬性拦截。

典型用法：在每次 AI 写完文件后自动跑 lint：

在项目的 `.claude/settings.json` 里配置：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix"
          }
        ]
      }
    ]
  }
}
```

这样每次 AI 写完代码，lint 会自动跑一遍，保证代码风格一致，不用你手动检查。

## 上下文管理：长任务不翻车

Claude Code 的上下文窗口是有限的。做一个大功能时，对话越来越长，AI 开始"失忆"是常见的坑。

**几个实用技巧：**

1. **`/compact`** 命令：压缩当前对话历史，保留要点，释放上下文空间。长任务每隔几十轮就跑一次。

2. **新任务用 `/clear`**：开始一个完全不相关的任务时，用 `/clear` 清空上下文，避免旧信息干扰。

3. **`/context` 查看用量**：能看到当前上下文已用多少，快满时提前压缩。

4. **任务分段**：不要一次性丢一个"做一个完整的用户管理系统"这样的大需求。拆成"先做用户模型和增删改查接口"、"再做前端页面"、"最后加权限控制"，分段完成，每段结束后用 `/compact`。

## 实战：从零搭一个 REST API

下面是一个实际工作流示例，用 Claude Code 在 20 分钟内搭起一个 Express + TypeScript 的待办事项 API。

**第一步：初始化项目**

```
帮我初始化一个 Express + TypeScript + Jest 的项目，
包括 tsconfig.json、eslint 配置、基本的目录结构（src/routes、src/controllers、src/models），
以及一个 Hello World 的 /health 端点。
```

**第二步：建模型**

```
在 src/models/Todo.ts 创建待办事项的数据模型，
字段有：id(UUID)、title(string)、done(boolean)、createdAt(Date)，
使用内存数组模拟存储（后面会换成数据库）。
```

**第三步：实现接口**

```
基于 Todo 模型，实现标准 CRUD REST 接口：
GET /todos、POST /todos、PUT /todos/:id、DELETE /todos/:id，
带请求体验证，缺少必填字段返回 400。
写完后跑一下 npm run build 确认没有编译错误。
```

**第四步：补测试**

```
为所有 Todo 接口写集成测试，覆盖正常路径和边界情况，
跑 npm test，有失败的修复到全绿。
```

整个过程你主要在做的事：确认方向、检查 AI 的输出、提出修正意见。真正写代码的时间占比不到 10%。

## 几个高频避坑点

**坑 1：不给足够上下文就期待完美结果。** "帮我优化这个函数"这种描述太模糊。告诉 AI 优化目标：是性能、可读性、还是要适配某种调用模式？

**坑 2：一次性任务太大。** Claude Code 做一件事时间越长，越容易跑偏。超过 30 分钟的任务必须拆分。

**坑 3：不检查 AI 提交的代码就直接跑。** 尤其是涉及数据库操作、外部 API 调用的代码，要看一眼再执行，特别是生产环境。

**坑 4：忽略 CLAUDE.md 的价值。** 没有 CLAUDE.md 时，每次都要重新解释项目背景，AI 还容易用"错误"的技术栈。花 10 分钟写一份好的 CLAUDE.md，能省后面无数次重复说明。

**坑 5：在有未提交改动的仓库里大范围让 AI 改文件。** 出了问题很难回退。养成习惯：用 Claude Code 之前先 `git commit`，有了干净的基线才好操作。

## 结语

Claude Code 是目前最接近"AI 工程师搭档"体验的工具之一——它真正理解整个代码库，而不是只看你粘进去的一段代码。上手门槛不高，但用好的关键在于：**写好 CLAUDE.md、拆分任务、用 Plan Mode 确认方向、用 Hooks 保障质量**。

如果你是独立开发者或小团队，Claude Code 可以让你一个人的产出效率接近两三个人的水平。如果你是刚学编程的新手，它更是可以带你快速了解一个完整项目的结构和各模块的职责。从今天起，让 Claude Code 在你的终端里常驻吧。
