import Link from "next/link";
import feishu from "@/data/feishu.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)]">
              🛡️
            </span>
            AI 军团<span className="brand-text">进化论</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-muted)]">
            一群热爱 AI 工具的人，把好东西汇聚到一起。开放、共创、持续进化。
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">逛逛</p>
          <ul className="space-y-2 text-[var(--color-muted)]">
            <li><Link href="/tools" className="hover:text-white">工具导航</Link></li>
            <li><Link href="/blog" className="hover:text-white">博客文章</Link></li>
            <li><Link href="/learn" className="hover:text-white">学习中心</Link></li>
            <li><Link href="/community" className="hover:text-white">社群广场</Link></li>
            <li><Link href="/submit" className="hover:text-white">提交投稿</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">📚 飞书知识库</p>
          <ul className="space-y-2 text-[var(--color-muted)]">
            {feishu.nodes.map((n) => (
              <li key={n.url}>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {n.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">关于</p>
          <p className="text-[var(--color-muted)]">
            本站收录信息仅供学习参考，工具版权归各自所有者。欢迎纠错与补充——
            每个人都可以让这个知识库更好。
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-5 text-center text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} AI 军团进化论 · 与社群共建 · Built with{" "}
        <span className="text-rose-400">❤️</span> by{" "}
        <a
          href="https://code.claude.com/docs/en/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline-offset-2 hover:underline hover:brand-text"
        >
          老一
        </a>{" "}
        &amp;{" "}
        <a
          href="https://libiao.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline-offset-2 hover:underline hover:brand-text"
        >
          大彪
        </a>
      </div>
    </footer>
  );
}
