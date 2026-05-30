import type { Tool } from "@/lib/types";

const pricingLabel: Record<Tool["pricing"], string> = {
  free: "免费",
  freemium: "免费+付费",
  paid: "付费",
};

const pricingColor: Record<Tool["pricing"], string> = {
  free: "text-emerald-400",
  freemium: "text-sky-400",
  paid: "text-amber-400",
};

export function ToolCard({ tool, categoryEmoji }: { tool: Tool; categoryEmoji?: string }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl">
            {categoryEmoji ?? "🔧"}
          </span>
          <div>
            <h3 className="font-semibold leading-tight group-hover:brand-text">
              {tool.name}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              {tool.region === "cn" ? "🇨🇳 国产" : "🌍 国际"}
              <span className="mx-1.5">·</span>
              <span className={pricingColor[tool.pricing]}>
                {pricingLabel[tool.pricing]}
              </span>
            </p>
          </div>
        </div>
        <span className="text-[var(--color-muted)] opacity-0 transition group-hover:opacity-100">
          ↗
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-[var(--color-foreground)]">
        {tool.tagline}
      </p>
      <p className="mt-1.5 line-clamp-3 text-sm text-[var(--color-muted)]">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
    </a>
  );
}
