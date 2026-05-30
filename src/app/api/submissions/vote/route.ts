import { NextResponse } from "next/server";
import { voteSubmission } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, readJsonLimited } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // 点赞限流相对宽松：60s 内 30 次。
  const limited = rateLimit(`vote:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "操作过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  const parsed = await readJsonLimited<{ id?: string }>(request);
  if (parsed.error) return parsed.error;
  const id = String(parsed.data.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }
  const updated = voteSubmission(id);
  if (!updated) {
    return NextResponse.json({ error: "未找到该投稿" }, { status: 404 });
  }
  return NextResponse.json({ submission: updated });
}
