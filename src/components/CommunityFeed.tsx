"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Submission } from "@/lib/types";

export function CommunityFeed() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => setItems(d.submissions ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  async function vote(id: string) {
    if (voted.has(id)) return;
    setVoted((s) => new Set(s).add(id));
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, votes: it.votes + 1 } : it))
    );
    try {
      await fetch("/api/submissions/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // 失败就回滚乐观更新
      setItems((list) =>
        list.map((it) => (it.id === id ? { ...it, votes: it.votes - 1 } : it))
      );
      setVoted((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card h-36 animate-pulse bg-white/[0.03]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
        <p className="text-4xl">🌱</p>
        <p className="mt-4 text-[var(--color-muted)]">
          还没有人投稿。成为第一个为军团添砖加瓦的人！
        </p>
        <Link href="/submit" className="btn-primary mt-6">
          ✨ 去投稿
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.id} className="card flex gap-4 p-5">
          <button
            onClick={() => vote(it.id)}
            className={`flex h-fit flex-col items-center rounded-xl border px-3 py-2 text-sm transition ${
              voted.has(it.id)
                ? "border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-white"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brand)]/60 hover:text-white"
            }`}
            aria-label="点赞"
          >
            <span className="text-base leading-none">▲</span>
            <span className="mt-1 font-semibold">{it.votes}</span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="chip">
                {it.kind === "tool" ? "🔧 工具" : "📚 资源"}
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                {new Date(it.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>
            <a
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-semibold hover:brand-text"
            >
              {it.name} ↗
            </a>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
              {it.description}
            </p>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              由 {it.submittedBy} 推荐
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
