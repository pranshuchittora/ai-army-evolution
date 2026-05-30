---
title: "Midjourney 出图实战：写好提示词，出图质量翻倍"
description: "Midjourney V7 时代，提示词怎么写决定了出图质量的上限。本文教你提示词结构、关键参数和风格控制的实用技巧。"
author: "老一"
date: "2026-05-30"
tags: ["Midjourney", "提示词", "AI 绘画", "文生图", "实战"]
emoji: "🎨"
gradient: "from-pink-500 to-rose-500"
relatedTools: ["midjourney"]
cover: "指南"
---

你是不是也有过这种经历：随手输几个词，出的图不是想要的感觉，就开始堆词、堆参数，越改越迷茫。[Midjourney](https://www.midjourney.com) 的出图质量在 AI 图像工具里长期领先，但它对提示词的敏感程度也更高——同样的创意，描述方式不同，出图质量可能差十万八千里。这篇文章会拆解提示词的结构逻辑、核心参数的作用，以及几个实际场景下的完整写法，读完应该能让你的出图质量明显上一个台阶。

## 2026 年的 Midjourney：你需要了解的现状

截至 2026 年，Midjourney 的默认版本是 **V7**。Niji 7（专门优化二次元/动漫风格）于 2026 年 1 月正式发布，在线条清晰度和风格一致性上相比 Niji 6 有显著提升。

**V7 和之前版本的重要变化：**

- 不再需要"词汇堆叠"式提示词。V6 之前很多人用的那种"masterpiece, best quality, ultra detailed, 8k, photorealistic, ..."的堆词写法，在 V7 里效果反而变差。V7 对自然语言描述的理解更好，直接说你想要什么就行。
- `--cref`（人物参考）在 V7 里建议改用 `--oref`（Omni Reference）。`--sref` 风格参考在 V7 里依然有效，且功能更强。
- V7 默认会生成"个性化"风格（基于你的历史喜好），如果想要中性输出，加 `--p 0` 关闭个性化。

**订阅费用参考（2026）：** Basic 约 10 美元/月（200 图），Standard 约 30 美元/月（无限慢速图 + 900 快速图），Pro 约 60 美元/月（更多快速图 + 隐私模式）。

## 提示词的基本结构

一条有效的 Midjourney 提示词，基本遵循这个结构：

```
[主体描述] + [环境/场景] + [光线] + [风格/媒介] + [构图/镜头] + [--参数]
```

不是每次都要填满所有部分，但越具体，AI 的"自由发挥"空间越小，出图越接近你预期。

### 主体描述：越具体越好

**不好的写法：** `a woman`
**好的写法：** `a woman in her 30s with short silver hair, wearing a dark green trench coat, standing in the rain`

区别在于：年龄、发色、服装颜色、动作状态。这些细节决定 AI 不会随机发挥。

### 环境/场景

描述画面发生在哪里：`in a neon-lit Tokyo alley at night`、`on a misty mountain peak at dawn`、`inside a library with floor-to-ceiling bookshelves`。

场景描述和主体描述组合，构成画面的空间感。

### 光线：影响氛围的关键

光线描述经常被新手忽略，但它对图片氛围的影响极大。几个常用的光线描述：

- `golden hour lighting`（黄金时刻，温暖柔和）
- `dramatic rim lighting`（轮廓光，戏剧感强）
- `soft diffused light`（柔光，适合人像）
- `neon glow`（霓虹光，赛博朋克感）
- `overcast flat lighting`（阴天平光，颜色准确）
- `cinematic lighting`（电影感灯光，泛用）

### 风格/媒介

告诉 AI 用什么"画法"或艺术风格：

- `oil painting`、`watercolor illustration`、`pencil sketch`（传统媒介）
- `digital art`、`concept art`（数字绘画）
- `photorealistic`、`documentary photography`（写实摄影）
- `Studio Ghibli style`、`in the style of Monet`（具体风格/艺术家，但注意版权敏感性）
- `flat design`、`isometric illustration`（现代设计风格）

### 构图/镜头

- `close-up portrait`（特写）
- `wide angle shot`（广角）
- `aerial view`（鸟瞰）
- `Dutch angle`（斜构图，增加紧张感）
- `rule of thirds composition`（三分构图）
- `bokeh background`（背景虚化）

## 核心参数详解

参数加在提示词末尾，用 `--` 开头。

### --ar：画面比例

最常用的参数，决定图片的宽高比。

| 参数 | 比例 | 适用场景 |
|------|------|----------|
| `--ar 1:1` | 正方形 | 社交媒体头像、产品图 |
| `--ar 16:9` | 横屏宽幅 | 壁纸、Banner、视频封面 |
| `--ar 9:16` | 竖屏 | 手机壁纸、故事封面 |
| `--ar 4:3` | 传统横幅 | 通用用途 |
| `--ar 3:4` | 竖向肖像 | 人像、书籍封面 |
| `--ar 2:1` | 超宽横幅 | 网站 Hero 图、横幅广告 |

### --stylize（--s）：风格化程度

取值范围 0–1000，默认 100。

- `--s 0`：极度贴近提示词，AI 不自我发挥，适合精确控制
- `--s 100`（默认）：平衡
- `--s 400–700`：AI 发挥更多想象力，画面更有"艺术感"，但可能偏离你的描述
- `--s 1000`：AI 完全"放飞自我"，出来的东西很难预测

**实用建议：** 第一次尝试一个新提示词，先用默认值跑。如果出来太"平淡"，加高 stylize；如果 AI 添加了很多你不想要的元素，降低 stylize。

### --chaos（--c）：随机变化程度

取值 0–100，默认 0。

- `--c 0`：四格图风格接近，适合对某张满意后微调
- `--c 30–50`：适度变化，探索不同可能性
- `--c 80–100`：四格图差异极大，适合头脑风暴、寻找灵感

**怎么用：** 一个新创意先用 `--c 50` 跑几次，在多样结果里找到你喜欢的方向，然后降低 chaos 细化。

### --no：负向提示词

告诉 AI 不要出现什么。语法：`--no text, extra limbs, blurry`。

常见用法：
- `--no text`（不要图里有文字，尤其是英文）
- `--no humans`（不要出现人物）
- `--no watermark, logo`
- `--no extra fingers`（减少手部畸变，虽然 V7 已改善很多）

### --sref：风格参考

这是 V7 里最强大的参数之一。把一张图的 URL 作为风格参考，AI 会模仿那张图的色调、纹理、艺术风格：

```
a mountain landscape --sref https://your-reference-image.jpg --sw 100
```

`--sw`（style weight）控制风格参考的权重，0–1000，默认 100。越高越像参考图的风格，但可能牺牲内容描述的准确性。

**实用场景：**
- 保持一个系列作品的视觉风格一致
- 看到一张你喜欢的图，想要类似风格的新内容
- 用自己的作品作为 sref，建立个人风格库

### --niji：切换到动漫模型

`--niji 7` 把模型切换到专门优化二次元风格的 Niji 7，线条更清晰，角色设计更精准。适合：插画、漫画、动漫风格的角色/场景图。

### --v：指定版本

`--v 6.1` 切回 V6.1（有时候特定风格在 V6.1 上效果更好）。不加默认 V7。

## 几个实战案例

### 案例一：科技感产品海报

```
minimalist product poster, a sleek black smartwatch floating in mid-air, 
surrounded by subtle holographic data streams, dark background with deep blue 
ambient glow, high-end commercial photography style, sharp focus, 
no text, no human hands --ar 9:16 --s 200 --no text
```

**关键点：** 指定了"商业摄影风格"而不是"油画"，用 `--no hands` 避免手持产品的常见问题，竖版比例适合手机屏。

### 案例二：赛博朋克城市夜景

```
cyberpunk cityscape at night, neon signs reflecting on wet streets, 
rain falling, a lone figure with an umbrella walking away, 
mix of Japanese and Chinese street signage, 
cinematic wide shot, anamorphic lens flare, high contrast, 
detailed and gritty atmosphere --ar 16:9 --s 400 --c 20
```

**关键点：** 高 stylize 让画面更有艺术感，低 chaos 保证四格图方向一致，明确指定了文字是"日文和中文标识"而不是随机英文。

### 案例三：书籍封面插画

```
watercolor illustration, a girl reading a glowing book under a tree at twilight, 
magical fireflies around her, soft pastel colors, Studio Ghibli aesthetic, 
dreamy and nostalgic mood, no text --ar 2:3 --s 300 --niji 7
```

**关键点：** 用 `--niji 7` 获得更细腻的动漫插画效果，2:3 比例符合书籍封面尺寸，"pastel colors"和"twilight"共同决定了色调。

### 案例四：人物肖像

```
professional headshot, a confident woman in her 40s, natural smile, 
wearing a tailored navy blazer, soft studio lighting, 
blurred light grey background, DSLR portrait photography, 
shallow depth of field --ar 4:5 --s 50 --no glasses, --no jewelry
```

**关键点：** 低 stylize 保证写实感，用 `--no` 去掉不想要的配饰，明确说"专业证件照风格"而不是"照片"。

## 提高出图效率的实用技巧

### Vary（变体）而不是重新生成

在你喜欢的图下面，点 "Vary (Subtle)" 或 "Vary (Strong)"，而不是重新输入提示词跑。Subtle 变体保留大部分构图，Strong 变体有更多变化。这样你不会丢失已经很好的图的整体感觉。

### Upscale 之前想清楚

别每张图都 Upscale，先看缩略图效果，4 张里选最满意的再放大，省 GPU 额度。

### 用 `/describe` 反向学习提示词

把一张你喜欢的图丢给 `/describe`，Midjourney 会给出 4 种可能的提示词描述。不一定完全准确，但能帮你学习如何描述类似风格。

### 保存你的"配方"

当你找到一个出图效果稳定的提示词公式，记下来。比如你发现某种光线描述配上某个风格关键词特别出彩，把这个组合存进你的笔记，以后可以复用到不同主体上。

### 避免版权敏感的写法

不要直接写"in the style of [具体在世艺术家名]"，改用描述风格特征代替。比如不写"in the style of Studio Ghibli"，改成"anime film aesthetic with hand-drawn background textures, warm earthy tones, detailed vegetation"。

## 结语

Midjourney 的出图质量在业内确实属于第一梯队，但它不会"读心术"——你描述得越清晰、结构越合理，它离你的预期越近。核心记住三件事：**主体要具体（不要泛泛而谈）、光线和风格要写（它们决定氛围）、参数要配合内容（不同创意配不同参数）**。

多实践，多保存好提示词，很快就能建立自己的出图方法论。
