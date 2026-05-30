import type { Metadata } from "next";
import { learningPaths, resources } from "@/lib/db";
import type { Level, Resource, ResourceType } from "@/lib/types";
import { JsonLd } from "@/components/JsonLd";

import { SITE_URL as SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "学习中心",
  description:
    "从新手到高级的 AI 学习路径：先认识大模型、再用 AI 工具提效、最后亲手构建 RAG 与 Agent 应用。配套 42+ 精选课程、文档、视频与社区资源，覆盖提示工程、大模型 API、AI Agent 等主题，绝大多数免费。",
  keywords: [
    "AI 学习",
    "AI 学习路径",
    "提示工程",
    "大模型",
    "AI Agent",
    "RAG",
    "新手学 AI",
    "AI 入门",
  ],
  alternates: {
    canonical: `${SITE}/learn`,
  },
  openGraph: {
    title: "AI 学习中心 · AI 军团进化论",
    description:
      "从新手到高级的 AI 学习路径 + 42+ 精选课程、文档、视频与社区资源，覆盖提示工程、大模型、AI Agent。",
    url: `${SITE}/learn`,
    type: "website",
  },
};

const faqs: { q: string; a: string }[] = [
  {
    q: "AI 新手应该从哪里开始学？",
    a: "从「认识 AI」阶段开始：先选一个主力对话助手（ChatGPT、Claude 或豆包任选其一），用「角色 + 任务 + 约束 + 示例」的结构描述需求，在写邮件、做总结、查资料等低风险场景练手，建立对大模型能力边界的认知。",
  },
  {
    q: "如何系统地学习 AI？",
    a: "按三阶段进化路线走：第一阶段建立认知、学会和大模型有效沟通；第二阶段把多个 AI 工具串成工作流、沉淀提示词库、尝试自动化；第三阶段学习大模型 API 与提示工程进阶，搭建 RAG 或 Agent 应用并部署上线。每个阶段都配有精选资源。",
  },
  {
    q: "学 AI 需要会编程吗？",
    a: "前两个阶段不需要编程，只要会和 AI 对话、组合工具即可显著提效。到第三阶段「构建 AI 应用」才需要掌握 API 调用与基础开发，用向量库 + 检索增强搭建知识问答应用，并用 Vercel 或 Docker 部署。",
  },
  {
    q: "什么是提示工程（Prompt Engineering）？",
    a: "提示工程是设计与优化输入提示词、让大模型稳定产出高质量结果的方法。基础是用「角色 + 任务 + 约束 + 示例」的结构清晰描述需求，进阶则把高频任务沉淀成可复用的提示词模板，并结合上下文与思维链等技巧。",
  },
  {
    q: "学习 AI 的资源都要付费吗？",
    a: "不需要。本站精选了 42+ 学习资源，按新手、进阶、高级三个难度分级，覆盖课程、文档、视频、文章、社区与周报，绝大多数完全免费。",
  },
];

const levelLabel: Record<Level, string> = {
  beginner: "新手",
  intermediate: "进阶",
  advanced: "高级",
};

const typeMeta: Record<ResourceType, { label: string; emoji: string }> = {
  course: { label: "课程", emoji: "🎓" },
  doc: { label: "文档", emoji: "📄" },
  video: { label: "视频", emoji: "🎥" },
  article: { label: "文章", emoji: "📝" },
  community: { label: "社区", emoji: "👥" },
  newsletter: { label: "周报", emoji: "📬" },
};

export default function LearnPage() {
  const levels: Level[] = ["beginner", "intermediate", "advanced"];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "学习中心",
        item: `${SITE}/learn`,
      },
    ],
  };

  const pathLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI 学习路径：从新手到高级",
    description:
      "AI 军团进化论的三阶段 AI 学习路径，帮助学习者从认识大模型成长为能构建 AI 应用的创造者。",
    numberOfItems: learningPaths.length,
    itemListElement: learningPaths.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: p.title,
        description: `${p.subtitle}。学完能：${p.outcomes.join("；")}。`,
        url: `${SITE}/learn#${p.slug}`,
        provider: {
          "@type": "Organization",
          name: "AI 军团进化论",
          url: SITE,
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT10H",
        },
        teaches: p.outcomes,
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="container-page pt-12 pb-8">
      <JsonLd data={[breadcrumbLd, pathLd, faqLd]} />
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          学习<span className="brand-text">中心</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          沿着这条进化路线走：先认识 AI，再用它提效，最后能亲手造出 AI 应用。
          每一阶段都配好了精选资源。
        </p>
      </header>

      {/* 学习路径 */}
      <div className="space-y-6">
        {learningPaths.map((p, i) => (
          <section
            key={p.slug}
            id={p.slug}
            className="card scroll-mt-24 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-3xl">
                {p.emoji}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="chip">阶段 0{i + 1}</span>
                  <span className="chip">{levelLabel[p.level]}</span>
                </div>
                <h2 className="mt-1.5 text-xl font-bold">{p.title}</h2>
                <p className="text-sm text-[var(--color-muted)]">{p.subtitle}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-muted)]">
                  学完你能做什么
                </h3>
                <ul className="mt-3 space-y-2">
                  {p.outcomes.map((o) => (
                    <li key={o} className="flex gap-2 text-sm">
                      <span className="text-[var(--color-brand-2)]">✓</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-muted)]">
                  三步走
                </h3>
                <ol className="mt-3 space-y-3">
                  {p.steps.map((s, idx) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{s.title}</p>
                        <p className="text-sm text-[var(--color-muted)]">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 资源库 */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          精选学习资源
        </h2>
        <p className="mt-2 text-[var(--color-muted)]">
          按难度分级，全部经过筛选。绝大多数免费。
        </p>

        {levels.map((lv) => {
          const list = resources.filter((r) => r.level === lv);
          if (list.length === 0) return null;
          return (
            <div key={lv} className="mt-10">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="chip">{levelLabel[lv]}</span>
                <span className="text-sm font-normal text-[var(--color-muted)]">
                  {list.length} 个资源
                </span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 常见问答 */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          关于学 AI 的常见问题
        </h2>
        <p className="mt-2 text-[var(--color-muted)]">
          新手最常问的几个问题，答案直接来自本站的学习路径。
        </p>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="card p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const meta = typeMeta[resource.type];
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col p-5"
    >
      <div className="flex items-center justify-between">
        <span className="chip">
          {meta.emoji} {meta.label}
        </span>
        {resource.free && (
          <span className="chip !text-emerald-400">免费</span>
        )}
      </div>
      <h4 className="mt-3 font-semibold group-hover:brand-text">
        {resource.title}
      </h4>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-[var(--color-muted)]">
        {resource.description}
      </p>
      <p className="mt-3 text-xs text-[var(--color-muted)]">
        # {resource.topic}
      </p>
    </a>
  );
}
