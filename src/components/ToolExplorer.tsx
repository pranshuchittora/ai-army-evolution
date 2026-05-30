"use client";

import { useMemo, useState } from "react";
import type { Category, Tool } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";

interface Props {
  tools: Tool[];
  categories: Category[];
  initialCat?: string;
}

type RegionFilter = "all" | "global" | "cn";
type PricingFilter = "all" | "free" | "freemium" | "paid";

export function ToolExplorer({ tools, categories, initialCat = "all" }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>(initialCat);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");

  const emojiOf = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => (map[c.slug] = c.emoji));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (activeCat !== "all" && t.category !== activeCat) return false;
      if (region !== "all" && t.region !== region) return false;
      if (pricing !== "all" && t.pricing !== pricing) return false;
      if (!q) return true;
      const hay =
        `${t.name} ${t.tagline} ${t.description} ${t.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tools, query, activeCat, region, pricing]);

  return (
    <div>
      {/* 搜索框 */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索工具名称、功能、标签…"
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-11 pr-4 text-base outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/30"
        />
      </div>

      {/* 分类筛选 */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterPill active={activeCat === "all"} onClick={() => setActiveCat("all")}>
          全部
        </FilterPill>
        {categories.map((c) => (
          <FilterPill
            key={c.slug}
            active={activeCat === c.slug}
            onClick={() => setActiveCat(c.slug)}
          >
            {c.emoji} {c.name}
          </FilterPill>
        ))}
      </div>

      {/* 次级筛选：地区 / 价格，各自成组，移动端整组换行不错位 */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">地区</span>
          {(["all", "global", "cn"] as RegionFilter[]).map((r) => (
            <FilterPill key={r} small active={region === r} onClick={() => setRegion(r)}>
              {r === "all" ? "不限" : r === "global" ? "🌍 国际" : "🇨🇳 国产"}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">价格</span>
          {(["all", "free", "freemium", "paid"] as PricingFilter[]).map((p) => (
            <FilterPill key={p} small active={pricing === p} onClick={() => setPricing(p)}>
              {p === "all"
                ? "不限"
                : p === "free"
                  ? "免费"
                  : p === "freemium"
                    ? "免费+付费"
                    : "付费"}
            </FilterPill>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-[var(--color-muted)]">
        共 <span className="font-semibold text-white">{filtered.length}</span> 个工具
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-[var(--color-muted)]">
          没有匹配的工具。换个关键词，或者{" "}
          <a href="/submit" className="brand-text font-semibold">
            提交一个你知道的
          </a>{" "}
          吧 👀
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} categoryEmoji={emojiOf[t.category]} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border font-medium transition ${
        small
          ? "min-h-9 px-3.5 py-1.5 text-xs"
          : "min-h-10 px-4 py-2 text-sm"
      } ${
        active
          ? "border-transparent bg-gradient-to-r from-[var(--color-brand)] to-[#5b8cff] text-white shadow-lg shadow-[var(--color-brand)]/30"
          : "border-[var(--color-border)] bg-white/[0.02] text-[var(--color-muted)] hover:border-[var(--color-brand)]/50 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
