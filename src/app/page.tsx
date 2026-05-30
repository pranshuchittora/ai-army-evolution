import Link from "next/link";
import {
  featuredTools,
  learningPaths,
  tools,
  categories,
  resources,
  readSubmissions,
} from "@/lib/db";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { JoinCommunity } from "@/components/JoinCommunity";
import { getAllPostMeta } from "@/lib/blog";

import { SITE_URL as SITE } from "@/lib/config";

// 统计「为什么选我们 / 数据看板」用到的事实数据
function buildStats() {
  return [
    { value: tools.length, label: "精选 AI 工具", emoji: "🧰" },
    { value: categories.length, label: "工具分类", emoji: "🗂️" },
    { value: resources.length, label: "学习资源", emoji: "📚" },
    { value: learningPaths.length, label: "进化阶段", emoji: "🪜" },
  ];
}

// 热门标签云：统计所有工具 tags 出现频次，取前若干
function buildTagCloud(limit = 16) {
  const counts = new Map<string, number>();
  for (const t of tools) {
    for (const tag of t.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

const reasons: { emoji: string; title: string; detail: string }[] = [
  {
    emoji: "🎯",
    title: "精选不堆量",
    detail:
      "每个 AI 工具都经过实际试用筛选，覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent 等核心场景，国际国产一网打尽。",
  },
  {
    emoji: "🧭",
    title: "有路径不迷路",
    detail:
      "从认识大模型，到用 AI 工具提效，再到亲手构建 RAG 与 Agent 应用——三阶段学习路径让新手也能稳步进化。",
  },
  {
    emoji: "🤝",
    title: "社群共创",
    detail:
      "工具与资源由军团成员持续投稿、点赞共建，让你第一时间发现真正在被使用的新工具与提示词。",
  },
];

export default function Home() {
  const featured = featuredTools();
  const stats = buildStats();
  const tagCloud = buildTagCloud();
  const latest = readSubmissions().slice(0, 4);
  const latestPosts = getAllPostMeta().slice(0, 3);

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI 军团进化论",
    alternateName: "AI 工具导航与学习社群",
    url: SITE,
    description:
      "AI 军团进化论是面向 AI 学习者与实践者的社群知识库：精选 AI 工具导航、从新手到高级的学习路径、优质资源与社群共创内容。",
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/tools?cat={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI 军团进化论",
    url: SITE,
    logo: `${SITE}/icon.svg`,
    description:
      "面向 AI 学习者与实践者的社群知识库，提供 AI 工具导航、AI 学习路径与社群共创资源。",
    sameAs: [SITE],
  };

  const featuredLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "本期精选 AI 工具",
    description: "AI 军团进化论本期重点推荐的 AI 工具。",
    numberOfItems: featured.length,
    itemListElement: featured.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        url: tool.url,
        applicationCategory: "AIApplication",
        keywords: tool.tags.join("，"),
      },
    })),
  };

  return (
    <section className="container-page py-16 sm:py-24">
      <JsonLd data={[websiteLd, organizationLd, featuredLd]} />

      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip">🚀 AI 军团进化论</span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          和我们一起，<span className="brand-text">进化成 AI 超级个体</span>
        </h1>
        <p className="mt-5 text-lg text-[var(--color-muted)]">
          精选 AI 工具导航 · 从新手到高级的学习路径 · 社群共创资源库。
          覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent、提示工程与大模型应用，
          帮你又快又爽地找到想要的一切。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/tools" className="btn-primary">
            探索 AI 工具
          </Link>
          <Link href="/learn" className="btn-ghost">
            开始学习
          </Link>
        </div>
      </div>

      {/* 数据看板 */}
      <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center sm:p-6">
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-2 text-3xl font-extrabold brand-text">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-[var(--color-muted)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* 为什么选我们 */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold">✨ 为什么选我们</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="card p-6">
              <div className="text-3xl">{r.emoji}</div>
              <h3 className="mt-3 font-semibold">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                {r.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 本期精选工具 */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">🔥 本期精选工具</h2>
          <Link
            href="/tools"
            className="text-sm text-[var(--color-muted)] hover:text-white"
          >
            查看全部 →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* 按分类浏览 */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">🗂️ 按分类浏览</h2>
          <Link
            href="/tools"
            className="text-sm text-[var(--color-muted)] hover:text-white"
          >
            全部工具 →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/tools?cat=${c.slug}`}
              className="card flex flex-col items-center gap-2 p-5 text-center"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-[var(--color-muted)]">
                {c.description}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 热门标签云 */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold">🏷️ 热门标签</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          从精选工具里提炼的高频能力标签，看看大家都在用 AI 做什么。
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {tagCloud.map(([tag, count]) => (
            <Link
              key={tag}
              href="/tools"
              className="chip hover:border-[var(--color-brand)]"
            >
              {tag}
              <span className="text-[var(--color-brand-2)]">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 学习路径 */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">🧭 学习路径</h2>
          <Link
            href="/learn"
            className="text-sm text-[var(--color-muted)] hover:text-white"
          >
            查看全部 →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {learningPaths.map((stage) => (
            <Link
              key={stage.slug}
              href={`/learn#${stage.slug}`}
              className="card block p-6"
            >
              <div className="text-3xl">{stage.emoji}</div>
              <h3 className="mt-3 font-semibold">{stage.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {stage.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新博客 */}
      {latestPosts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">✍️ 老一的深度好文</h2>
              <p className="mt-1.5 text-sm text-[var(--color-muted)]">
                全网调研后写成的工具对比与实战指南，选型不再纠结
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 text-sm text-[var(--color-muted)] hover:text-white"
            >
              全部文章 →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {latestPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card group flex flex-col overflow-hidden p-0"
              >
                <div
                  className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${p.gradient}`}
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
        </div>
      )}

      {/* 最新社群动态 */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">📣 最新社群动态</h2>
          <Link
            href="/community"
            className="text-sm text-[var(--color-muted)] hover:text-white"
          >
            进入广场 →
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {latest.map((s) => (
              <div key={s.id} className="card p-5">
                <div className="flex items-center gap-2">
                  <span className="chip">
                    {s.kind === "tool" ? "🧰 工具" : "📚 资源"}
                  </span>
                  <span className="chip">👍 {s.votes}</span>
                </div>
                <h3 className="mt-3 font-semibold">{s.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-muted)]">
                  {s.description}
                </p>
                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  by {s.submittedBy}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card mt-6 flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-[var(--color-muted)]">
              还没有投稿，来当第一个分享好工具的人吧。
            </p>
            <Link href="/submit" className="btn-primary">
              ✨ 我要投稿
            </Link>
          </div>
        )}
      </div>

      {/* 加入社群 */}
      <JoinCommunity />
    </section>
  );
}
