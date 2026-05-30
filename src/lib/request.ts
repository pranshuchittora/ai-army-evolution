// API 请求工具：可信 IP 解析 + 限制大小的 JSON 解析。
// 用于无登录写入接口的纵深防御（防伪造 IP 绕过限流、防超大 body 内存 DoS）。
import { NextResponse } from "next/server";

/** 请求体大小硬上限（字节）。投稿/点赞内容很小，64KB 绰绰有余。 */
export const MAX_BODY_BYTES = 64 * 1024;

/**
 * 取客户端 IP 用于限流。
 *
 * 安全要点：`x-forwarded-for` 可被客户端任意伪造（每次换一个值即可绕过限流），
 * 因此**优先信任反向代理注入的 `x-real-ip`**（见 deploy/nginx-site.conf.example
 * 里的 `proxy_set_header X-Real-IP $remote_addr`）。仅当没有可信代理头时，
 * 才回退到 XFF 的**最后一段**（最接近本机的那一跳，比首段更难伪造）。
 */
export function getClientIp(request: Request): string {
  const real = request.headers.get("x-real-ip");
  if (real?.trim()) return real.trim();

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

/**
 * 安全解析 JSON 请求体：先按 Content-Length 预检大小，再读流并二次设限，
 * 避免攻击者用超大 body 撑爆内存。
 * 返回 { data } 或 { error }（error 是已构造好的 NextResponse，直接 return 即可）。
 */
export async function readJsonLimited<T = Record<string, unknown>>(
  request: Request,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  const tooLarge = () => ({
    data: null as null,
    error: NextResponse.json(
      { error: "请求体过大" },
      { status: 413 },
    ),
  });

  const len = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) return tooLarge();

  // 即便没有 Content-Length，也读流并累加设限，防 chunked 绕过。
  let raw: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) return tooLarge();
    } else {
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          total += value.byteLength;
          if (total > MAX_BODY_BYTES) {
            await reader.cancel();
            return tooLarge();
          }
          chunks.push(value);
        }
      }
      raw = Buffer.concat(chunks).toString("utf8");
    }
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "读取请求体失败" }, { status: 400 }),
    };
  }

  try {
    return { data: JSON.parse(raw) as T, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { error: "请求体不是合法 JSON" },
        { status: 400 },
      ),
    };
  }
}
