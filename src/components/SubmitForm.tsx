"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";

export function SubmitForm({ categories }: { categories: Category[] }) {
  const [kind, setKind] = useState<"tool" | "resource">("tool");
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: categories[0]?.slug ?? "",
    description: "",
    submittedBy: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kind }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "提交失败");
      setStatus("ok");
      setMessage("提交成功！感谢你为军团贡献一份力量 🎉");
      setForm({ name: "", url: "", category: categories[0]?.slug ?? "", description: "", submittedBy: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "提交失败，请稍后再试");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      {/* 类型切换 */}
      <div className="mb-6 inline-flex rounded-xl border border-[var(--color-border)] bg-white/[0.02] p-1">
        {(["tool", "resource"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              kind === k
                ? "bg-gradient-to-r from-[var(--color-brand)] to-[#5b8cff] text-white"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {k === "tool" ? "🔧 推荐工具" : "📚 推荐资源"}
          </button>
        ))}
      </div>

      <div className="grid gap-5">
        <Field label="名称" required>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            placeholder={kind === "tool" ? "例如：Claude" : "例如：吴恩达 AI 课程"}
            className="input"
          />
        </Field>

        <Field label="链接" required>
          <input
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            required
            type="url"
            placeholder="https://"
            className="input"
          />
        </Field>

        {kind === "tool" && (
          <Field label="分类">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="input"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="bg-[var(--color-surface)]">
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="一句话简介" required>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
            rows={3}
            placeholder="它是什么？解决什么问题？为什么值得推荐？"
            className="input resize-none"
          />
        </Field>

        <Field label="你的昵称（选填）">
          <input
            value={form.submittedBy}
            onChange={(e) => update("submittedBy", e.target.value)}
            placeholder="留个名字，方便大家认识你"
            className="input"
          />
        </Field>
      </div>

      {message && (
        <p
          className={`mt-5 rounded-lg px-4 py-3 text-sm ${
            status === "ok"
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-rose-500/10 text-rose-300"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-6 w-full disabled:opacity-60"
      >
        {status === "loading" ? "提交中…" : "提交投稿"}
      </button>
      <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
        投稿会出现在「社群广场」，大家可以点赞支持。
      </p>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          padding: 0.7rem 0.9rem;
          /* 16px 防止 iOS Safari 聚焦时自动放大页面 */
          font-size: 16px;
          color: var(--color-foreground);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        :global(.input:focus) {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.25);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}
