import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost, getRelatedPosts } from "@/lib/blog";
import { tools as allTools } from "@/lib/db";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `${SITE}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE}/blog/${slug}`,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const relatedTools = post.relatedTools
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "AI 军团进化论",
      url: SITE,
    },
    mainEntityOfPage: `${SITE}/blog/${slug}`,
    keywords: post.tags.join("，"),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "博客", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE}/blog/${slug}` },
    ],
  };

  return (
    <article className="container-page pt-10 pb-8">
      <JsonLd data={[articleLd, breadcrumbLd]} />

      <nav className="mb-6 text-sm text-[var(--color-muted)]">
        <Link href="/" className="hover:text-white">首页</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-white">博客</Link>
      </nav>

      <div className="mx-auto max-w-3xl">
        {/* 头图 */}
        <div
          className={`relative mb-8 flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br ${post.gradient}`}
        >
          <span className="text-6xl drop-shadow-lg">{post.emoji}</span>
          <span className="absolute left-4 top-4 chip !border-white/30 !bg-black/20 !text-white">
            {post.cover}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="chip">#{t}</span>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-xs">
            老
          </span>
          {post.author}
          <span>·</span>
          {post.date}
          <span>·</span>
          {post.readingMinutes} 分钟阅读
        </p>

        {/* 正文 */}
        <div
          className="prose-blog mt-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* 相关工具 */}
        {relatedTools.length > 0 && (
          <div className="mt-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.02] p-6">
            <h2 className="text-lg font-bold">🔧 本文提到的工具</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedTools.map((t) => (
                <a
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center gap-3 p-4"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-lg">
                    🔧
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">{t.name}</p>
                    <p className="truncate text-xs text-[var(--color-muted)]">
                      {t.tagline}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <Link
              href="/tools"
              className="mt-4 inline-block text-sm text-[var(--color-muted)] hover:brand-text"
            >
              到工具导航看更多 →
            </Link>
          </div>
        )}

        {/* 署名卡 */}
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white/[0.02] p-6 text-sm text-[var(--color-muted)]">
          本文由 <span className="font-semibold text-white">老一</span>（AI 军团进化论的 AI 写手）
          全网调研后撰写，与 <span className="font-semibold text-white">大彪</span> 一起，用 ❤️ 创作。
          内容仅供参考，工具功能与价格以官方为准，欢迎到
          <Link href="/submit" className="brand-text"> 投稿 </Link>
          指正或补充。
        </div>

        {/* 相关文章 */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold">📚 相关阅读</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card group p-5">
                  <span className="text-3xl">{p.emoji}</span>
                  <h3 className="mt-3 font-semibold leading-snug group-hover:brand-text">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
