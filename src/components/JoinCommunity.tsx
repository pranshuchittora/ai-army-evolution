"use client";

import Image from "next/image";
import { useState } from "react";
import { COMMUNITY } from "@/lib/config";

/**
 * 首页社群入口：微信群二维码（悬浮放大）+ 个人微信兜底。
 * 未配置二维码则整块不渲染。
 */
export function JoinCommunity() {
  const { groupQrImage, groupQrNote, personalWechat } = COMMUNITY;
  const [copied, setCopied] = useState(false);

  if (!groupQrImage) return null;

  async function copyWechat() {
    if (!personalWechat) return;
    try {
      await navigator.clipboard.writeText(personalWechat);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 忽略：部分浏览器无剪贴板权限 */
    }
  }

  return (
    <div className="mt-20">
      <div className="card relative overflow-hidden p-7 sm:p-10">
        {/* 背景光晕 */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[var(--color-brand-2)]/15 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          {/* 文案 */}
          <div>
            <span className="chip">🤝 加入军团</span>
            <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
              和一群每天用 AI 的人，
              <br className="hidden sm:block" />
              <span className="brand-text">一起深入研究与学习</span>
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-[var(--color-muted)]">
              这里聚集了一群热爱 AI、每天在实战中打磨的小伙伴。
              <span className="text-white">不打广告，只认真讨论</span>
              ——一起拆解工具、交流提示词、分享踩过的坑，把 AI 真正用进工作和生活。
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 text-sm">
              {["🚫 不发广告", "💬 积极讨论", "📈 一起进化", "🔥 实战分享"].map(
                (t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ),
              )}
            </ul>

            {/* 个人微信兜底 */}
            {personalWechat && (
              <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white/[0.02] p-4 text-sm">
                <p className="text-[var(--color-muted)]">
                  群满 200 人或二维码过期？加 Bill 个人微信，备注
                  <span className="text-white">「AI 军团进化论 + 你的来意」</span>
                  ，拉你进群 👇
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <code className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[var(--color-brand-2)]">
                    微信：{personalWechat}
                  </code>
                  <button
                    onClick={copyWechat}
                    className="btn-ghost !px-3 !py-1.5 text-xs"
                  >
                    {copied ? "✓ 已复制" : "复制"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 二维码：悬浮放大 */}
          <div className="group/qr mx-auto flex flex-col items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-xl transition-transform duration-300 ease-out group-hover/qr:scale-[1.04]">
                <Image
                  src={groupQrImage}
                  alt="AI 军团进化论 · 微信群二维码"
                  width={200}
                  height={200}
                  className="h-44 w-44 object-contain sm:h-52 sm:w-52"
                />
              </div>

              {/* 悬浮放大层（桌面端） */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 hidden -translate-x-1/2 opacity-0 transition-all duration-300 group-hover/qr:opacity-100 md:block">
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-2xl shadow-black/50">
                  <Image
                    src={groupQrImage}
                    alt="AI 军团进化论 · 微信群二维码（放大）"
                    width={320}
                    height={320}
                    className="h-72 w-72 object-contain"
                  />
                  <p className="mt-2 text-center text-xs text-neutral-500">
                    微信扫一扫，加入军团
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-sm font-medium">微信扫码进群</p>
            {groupQrNote && (
              <p className="mt-1 max-w-[13rem] text-center text-xs text-[var(--color-muted)]">
                {groupQrNote}
              </p>
            )}
            <p className="mt-1 text-center text-xs text-[var(--color-muted)] md:hidden">
              （长按二维码识别）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
