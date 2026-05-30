import type { Metadata } from "next";
import Link from "next/link";
import { CommunityFeed } from "@/components/CommunityFeed";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "社群广场",
  description:
    "AI 军团成员共创的 AI 工具与学习资源投稿墙，发现社群正在使用的新 AI 工具、提示词与教程，为你喜欢的内容点赞，让好东西被更多人看到。",
  keywords: [
    "AI 社群",
    "AI 工具推荐",
    "AI 资源共创",
    "AI 学习社区",
    "AI 工具投稿",
  ],
  alternates: {
    canonical: `${SITE}/community`,
  },
  openGraph: {
    title: "社群广场 · AI 军团进化论",
    description:
      "AI 军团成员共创的工具与资源投稿墙，发现社群正在使用的新 AI 工具，为喜欢的内容点赞。",
    url: `${SITE}/community`,
    type: "website",
  },
};

export default function CommunityPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "社群广场",
        item: `${SITE}/community`,
      },
    ],
  };

  return (
    <div className="container-page pt-12 pb-8">
      <JsonLd data={breadcrumbLd} />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            社群<span className="brand-text">广场</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            这里是军团成员的投稿墙。看到好东西，点个赞顶上去；
            有想分享的，随时投稿。
          </p>
        </div>
        <Link href="/submit" className="btn-primary">
          ✨ 我也要投稿
        </Link>
      </header>

      <CommunityFeed />
    </div>
  );
}
