// 全站核心数据类型定义

export type Pricing = "free" | "freemium" | "paid";
export type Region = "global" | "cn";
export type Level = "beginner" | "intermediate" | "advanced";
export type ResourceType =
  | "course"
  | "doc"
  | "video"
  | "article"
  | "community"
  | "newsletter";

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  /** Tailwind 渐变类，用于卡片配色 */
  gradient: string;
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: string; // Category.slug
  tags: string[];
  pricing: Pricing;
  region: Region;
  featured?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  level: Level;
  topic: string;
  free: boolean;
}

export interface LearningStage {
  slug: string;
  level: Level;
  title: string;
  subtitle: string;
  emoji: string;
  outcomes: string[]; // 学完能做什么
  steps: { title: string; detail: string }[];
}

/** 博客文章（由 src/content/blog/*.md 编译而来） */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  emoji: string;
  gradient: string;
  relatedTools: string[];
  cover: string; // 类型：对比 / 指南 / 入门 / 盘点
  readingMinutes: number;
  html: string; // 预编译后的正文 HTML
}

/** 文章列表项（不含正文 HTML，列表页用，更轻量） */
export type BlogPostMeta = Omit<BlogPost, "html">;

/** 社群投稿，写入文件数据库 */
export interface Submission {
  id: string;
  kind: "tool" | "resource";
  name: string;
  url: string;
  category?: string;
  description: string;
  submittedBy?: string;
  createdAt: string; // ISO
  votes: number;
  status: "pending" | "approved";
}
