import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_URL, SITE_NAME, BAIDU_ANALYTICS_ID } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · AI 工具导航与学习社群`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "AI 军团进化论是面向 AI 学习者与实践者的中文社群知识库：精选 AI 工具导航（对话、编程、绘画、视频、Agent 等），从新手到高级的 AI 学习路径，提示工程、大模型、Agent 开发优质资源，以及社群共创内容。一个地方，又快又爽地找到你想要的 AI 工具与学习资料。",
  applicationName: SITE_NAME,
  keywords: [
    "AI 工具",
    "AI 导航",
    "AI 工具导航",
    "AI 学习",
    "提示工程",
    "Prompt Engineering",
    "AI Agent",
    "智能体",
    "大模型",
    "LLM",
    "ChatGPT",
    "Claude",
    "AI 社群",
    "AI 工具大全",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · AI 工具导航与学习社群`,
    description:
      "精选 AI 工具导航 + 从新手到高级的 AI 学习路径 + 社群共创资源库。又快又爽找到你想要的 AI 工具与学习资料。",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · AI 工具导航与学习社群`,
    description:
      "精选 AI 工具导航 + 从新手到高级的 AI 学习路径 + 社群共创资源库。",
    images: ["/og.svg"],
  },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* 百度统计 —— 仅在配置了 NEXT_PUBLIC_BAIDU_ANALYTICS_ID 时注入 */}
        {BAIDU_ANALYTICS_ID && (
          <Script id="baidu-tongji" strategy="afterInteractive">
            {`
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_ANALYTICS_ID}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
