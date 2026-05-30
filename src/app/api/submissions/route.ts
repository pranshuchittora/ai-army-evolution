import { NextResponse } from "next/server";
import { addSubmission, readSubmissions } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// 文件数据库需要 Node 运行时，避免 Edge
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 字段长度上限
const MAX_NAME = 60;
const MAX_DESCRIPTION = 300;
const MAX_SUBMITTED_BY = 30;
const MAX_CATEGORY = 40;

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

// 基础净化：去除尖括号，防御存储型 XSS（纵深防御，React 渲染本身也会转义）。
function sanitize(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export async function GET() {
  return NextResponse.json({ submissions: readSubmissions() });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`submit:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "操作过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const name = sanitize(String(body.name ?? ""));
  const url = String(body.url ?? "").trim();
  const description = sanitize(String(body.description ?? ""));
  const kind = body.kind === "resource" ? "resource" : "tool";
  const rawCategory = body.category ? String(body.category).trim() : "";
  const rawSubmittedBy = body.submittedBy
    ? sanitize(String(body.submittedBy))
    : "";

  if (!name || !url || !description) {
    return NextResponse.json(
      { error: "名称、链接、简介都是必填项" },
      { status: 400 },
    );
  }

  // 长度校验
  if (name.length > MAX_NAME) {
    return NextResponse.json(
      { error: `名称不能超过 ${MAX_NAME} 个字` },
      { status: 400 },
    );
  }
  if (description.length > MAX_DESCRIPTION) {
    return NextResponse.json(
      { error: `简介不能超过 ${MAX_DESCRIPTION} 个字` },
      { status: 400 },
    );
  }
  if (rawSubmittedBy.length > MAX_SUBMITTED_BY) {
    return NextResponse.json(
      { error: `昵称不能超过 ${MAX_SUBMITTED_BY} 个字` },
      { status: 400 },
    );
  }

  // URL 校验：必须能被解析，且只允许 http/https，拒绝 javascript:/data: 等危险 scheme。
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "链接格式不合法" }, { status: 400 });
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "链接需要以 http:// 或 https:// 开头" },
      { status: 400 },
    );
  }

  // category 校验：可选；若提供必须是合法 slug（小写字母/数字/连字符/下划线）且限长。
  let category: string | undefined;
  if (rawCategory) {
    if (rawCategory.length > MAX_CATEGORY || !/^[a-z0-9_-]+$/i.test(rawCategory)) {
      return NextResponse.json({ error: "分类格式不合法" }, { status: 400 });
    }
    category = rawCategory;
  }

  const submittedBy = rawSubmittedBy || undefined;

  const submission = addSubmission({
    kind,
    name,
    url: parsedUrl.toString(),
    description,
    category,
    submittedBy,
  });
  return NextResponse.json({ submission }, { status: 201 });
}
