import type { Metadata } from "next";
import { categories, tools } from "@/lib/db";
import { ToolExplorer } from "@/components/ToolExplorer";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI 工具导航",
  description:
    "精选 61+ AI 工具导航，覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent、知识管理等 10 大分类，支持按分类、地区（国际 / 国产）、价格筛选与全文搜索，国际国产大模型工具一网打尽，点开即用。",
  keywords: [
    "AI 工具",
    "AI 工具导航",
    "AI 导航",
    "AI Agent",
    "AI 绘画",
    "AI 编程",
    "大模型工具",
    "提示工程",
  ],
  alternates: {
    canonical: `${SITE}/tools`,
  },
  openGraph: {
    title: "AI 工具导航 · AI 军团进化论",
    description:
      "精选 61+ AI 工具导航，覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent 等 10 大分类，支持筛选与搜索，国际国产一网打尽。",
    url: `${SITE}/tools`,
    type: "website",
  },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const initialCat =
    cat && categories.some((c) => c.slug === cat) ? cat : "all";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: `${SITE}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI 工具导航",
        item: `${SITE}/tools`,
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI 工具导航",
    description:
      "AI 军团进化论精选的 AI 工具清单，覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent 等分类。",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        url: tool.url,
        applicationCategory: "AIApplication",
        keywords: tool.tags.join("，"),
        offers: {
          "@type": "Offer",
          price: tool.pricing === "paid" ? undefined : "0",
          priceCurrency: "CNY",
          description:
            tool.pricing === "free"
              ? "免费"
              : tool.pricing === "freemium"
                ? "免费 + 付费"
                : "付费",
        },
      },
    })),
  };

  return (
    <div className="container-page pt-12 pb-8">
      <JsonLd data={[breadcrumbLd, itemListLd]} />
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          AI 工具<span className="brand-text">导航</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          国际国产一网打尽，覆盖对话助手、AI 绘画、AI 视频、AI 编程、AI Agent
          等 10 大分类。按需求筛选、按关键词搜索，点开就能用。
          缺了好工具？欢迎到「投稿」补充。
        </p>
      </header>
      <ToolExplorer tools={tools} categories={categories} initialCat={initialCat} />
    </div>
  );
}
