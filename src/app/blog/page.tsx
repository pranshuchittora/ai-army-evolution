import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMeta } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI 工具博客 · 深度对比与实战指南",
  description:
    "由「老一」撰写的 AI 工具深度文章：主流 AI 助手、AI 编程、AI 绘画、AI 视频、AI 搜索、智能体工具的深度对比、选型建议与实战指南。搜一个工具怎么选，这里有答案。",
  keywords: [
    "AI 工具对比",
    "AI 工具评测",
    "AI 工具怎么选",
    "AI 教程",
    "提示工程",
    "AI 绘画对比",
    "AI 编程工具",
  ],
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: "AI 工具博客 · 深度对比与实战指南 · AI 军团进化论",
    description:
      "AI 工具深度对比、选型建议与实战指南，帮你又快又准地选对、用好 AI 工具。",
    url: `${SITE}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostMeta();
  const featured = posts[0];
  const rest = posts.slice(1);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AI 军团进化论 · 博客",
    description: "AI 工具深度对比、选型建议与实战指南。",
    url: `${SITE}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      url: `${SITE}/blog/${p.slug}`,
      keywords: p.tags.join("，"),
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "博客", item: `${SITE}/blog` },
    ],
  };

  return (
    <div className="container-page pt-12 pb-8">
      <JsonLd data={[blogLd, breadcrumbLd]} />
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          AI 工具<span className="brand-text">博客</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          由「老一」撰写的深度对比与实战指南。每篇都经过全网调研，帮你又快又准地
          选对、用好 AI 工具。共 {posts.length} 篇。
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-[var(--color-muted)]">
          文章正在路上，敬请期待 ✍️
        </div>
      ) : (
        <>
          {/* 头条 */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="card group mb-6 block overflow-hidden p-0"
            >
              <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div
                  className={`relative flex min-h-44 items-center justify-center bg-gradient-to-br ${featured.gradient} p-8`}
                >
                  <span className="text-7xl drop-shadow-lg">{featured.emoji}</span>
                  <span className="absolute left-4 top-4 chip !border-white/30 !bg-black/20 !text-white">
                    {featured.cover}
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tags.slice(0, 3).map((t) => (
                      <span key={t} className="chip">#{t}</span>
                    ))}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold leading-snug group-hover:brand-text">
                    {featured.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[var(--color-muted)]">
                    {featured.description}
                  </p>
                  <p className="mt-4 text-sm text-[var(--color-muted)]">
                    ✍️ {featured.author} · {featured.readingMinutes} 分钟阅读
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* 其余 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card group flex flex-col overflow-hidden p-0"
              >
                <div
                  className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${p.gradient}`}
                >
                  <span className="text-5xl drop-shadow-lg">{p.emoji}</span>
                  <span className="absolute left-3 top-3 chip !border-white/30 !bg-black/20 !text-white">
                    {p.cover}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold leading-snug group-hover:brand-text">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--color-muted)]">
                    {p.description}
                  </p>
                  <p className="mt-3 text-xs text-[var(--color-muted)]">
                    ✍️ {p.author} · {p.readingMinutes} 分钟
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
