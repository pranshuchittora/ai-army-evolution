import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 全站安全响应头加固。
// CSP 说明：刻意允许 script/style 的 'unsafe-inline'，因为站点存在
// 百度统计内联脚本、JSON-LD 结构化数据以及 Next.js 注入的内联脚本/样式；
// 若不允许会导致页面白屏。这是安全性与可用性之间的合理取舍（不使用 nonce）。
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://hm.baidu.com",
  "connect-src 'self' https://hm.baidu.com",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
].join("; ");

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("Content-Security-Policy", CSP);

  return response;
}

export const config = {
  // 对全站生效，但排除静态资源与构建产物，避免给图片/字体等加无谓的头。
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};
