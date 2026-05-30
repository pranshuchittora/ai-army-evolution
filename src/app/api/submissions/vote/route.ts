import { NextResponse } from "next/server";
import { voteSubmission } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 从请求头取客户端 IP：优先 x-forwarded-for 第一个，回退 x-real-ip。
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

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

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }
  const updated = voteSubmission(id);
  if (!updated) {
    return NextResponse.json({ error: "未找到该投稿" }, { status: 404 });
  }
  return NextResponse.json({ submission: updated });
}
