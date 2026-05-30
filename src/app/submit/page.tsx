import type { Metadata } from "next";
import { categories } from "@/lib/db";
import { SubmitForm } from "@/components/SubmitForm";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "提交投稿",
  description:
    "无需注册，一分钟提交你常用的 AI 工具或优质学习资源，分享给整个 AI 军团。你推荐的好工具、好教程会进入社群广场，帮到更多正在学 AI 的人。",
  keywords: ["提交 AI 工具", "推荐 AI 工具", "AI 资源投稿", "AI 工具收录"],
  alternates: {
    canonical: `${SITE}/submit`,
  },
  openGraph: {
    title: "提交投稿 · AI 军团进化论",
    description:
      "无需注册，一分钟提交你常用的 AI 工具或优质学习资源，分享给整个 AI 军团。",
    url: `${SITE}/submit`,
    type: "website",
  },
};

export default function SubmitPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "提交投稿",
        item: `${SITE}/submit`,
      },
    ],
  };

  return (
    <div className="container-page pt-12 pb-8">
      <JsonLd data={breadcrumbLd} />
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            分享给<span className="brand-text">军团</span>
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">
            无需注册，一分钟提交。你推荐的好工具、好资源，会帮到很多人。
          </p>
        </header>
        <SubmitForm categories={categories} />
      </div>
    </div>
  );
}
