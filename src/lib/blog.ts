// 博客数据层：读取 src/content/blog/*.md，解析 frontmatter + 编译正文为 HTML。
// 在服务端（Server Component / 构建期）运行，文章页静态预渲染，运行时零额外开销。
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

import type { BlogPost, BlogPostMeta } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

marked.setOptions({ gfm: true, breaks: false });

function estimateReadingMinutes(markdown: string): number {
  // 中文按字符数估算，约 400 字/分钟
  const chars = markdown.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}

function listFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

function parseFile(file: string): BlogPost {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content) as string;
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    author: String(data.author ?? "老一"),
    date: String(data.date ?? "2026-05-30"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    emoji: String(data.emoji ?? "📝"),
    gradient: String(data.gradient ?? "from-violet-500 to-indigo-500"),
    relatedTools: Array.isArray(data.relatedTools)
      ? data.relatedTools.map(String)
      : [],
    cover: String(data.cover ?? "文章"),
    readingMinutes: estimateReadingMinutes(content),
    html,
  };
}

/** 全部文章（含正文）——按日期倒序。 */
export function getAllPosts(): BlogPost[] {
  return listFiles()
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

/** 列表用的轻量元信息（不含正文 HTML）。 */
export function getAllPostMeta(): BlogPostMeta[] {
  return getAllPosts().map(({ html: _html, ...meta }) => meta);
}

export function getPost(slug: string): BlogPost | undefined {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return undefined;
  return parseFile(file);
}

export function getAllSlugs(): string[] {
  return listFiles().map((f) => f.replace(/\.md$/, ""));
}

/** 取同标签的相关文章（排除自己），最多 n 篇。 */
export function getRelatedPosts(slug: string, n = 3): BlogPostMeta[] {
  const all = getAllPostMeta();
  const self = all.find((p) => p.slug === slug);
  if (!self) return all.filter((p) => p.slug !== slug).slice(0, n);
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => self.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.p);
}
