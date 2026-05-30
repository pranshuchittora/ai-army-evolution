# 更新日志 · Changelog

本项目的所有重要变更都会记录在本文件中。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

<!-- 下一个版本的改动记录在此累积。 -->

## [1.0.0] - 2026-05-30

🎉 首次正式发布 · Initial public release。

### Added · 新增

- **工具导航**：61+ 精选 AI 工具，十大分类，支持按分类 / 地区 / 价格筛选与关键词搜索。
- **博客系统**：21 篇深度好文，基于 Markdown（gray-matter + marked），文章页构建期静态预渲染。
- **学习中心**：新手 → 进阶 → 高级三阶段学习路线图，配 42+ 精选课程 / 文档 / 视频资源。
- **社群投稿**：无需登录的工具投稿与点赞，数据持久化到文件数据库。
- **飞书知识库直达**：社群沉淀的 7 大栏目一键跳转。
- **SEO / GEO**：动态 `robots` / `sitemap` / `manifest`，每页 metadata 与 JSON-LD 结构化数据，统一 canonical / OG。
- **安全加固**：全站安全响应头与 CSP，投稿 / 点赞按 IP 限流与输入校验净化。
- **Docker 部署**：`output: standalone` 构建，配套 Dockerfile、nginx 配置与一键发布脚本。
- **可复用 Skills**：`superman-write-blog`、`superman-add-content`、`superman-publish` 三个 Claude Code skill，沉淀高频内容与运维流程。

[Unreleased]: https://github.com/BillLucky/ai-army-evolution/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/BillLucky/ai-army-evolution/releases/tag/v1.0.0
