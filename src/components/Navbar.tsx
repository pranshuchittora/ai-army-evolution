"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import feishu from "@/data/feishu.json";

const links = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "工具导航" },
  { href: "/blog", label: "博客" },
  { href: "/learn", label: "学习中心" },
  { href: "/community", label: "社群广场" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--color-border)]">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-lg shadow-lg">
            🛡️
          </span>
          <span className="text-base tracking-tight">
            AI 军团<span className="brand-text">进化论</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-white/5 text-white"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={feishu.spaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-white"
          >
            知识库 ↗
          </a>
          <Link href="/submit" className="btn-primary ml-2 !px-4 !py-2 text-sm">
            ✨ 投稿
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="btn-ghost !px-3 !py-2 md:hidden"
          aria-label="菜单"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="container-page flex flex-col gap-1 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                isActive(l.href)
                  ? "bg-white/5 text-white"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={feishu.spaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-[var(--color-muted)]"
          >
            知识库 ↗
          </a>
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 text-sm"
          >
            ✨ 投稿
          </Link>
        </div>
      )}
    </header>
  );
}
