import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI 军团进化论",
    short_name: "AI 军团",
    description:
      "AI 工具导航 + 从新手到高级的 AI 学习路径 + 社群共创资源库，帮你进化成 AI 超级个体。",
    start_url: "/",
    display: "standalone",
    background_color: "#07080d",
    theme_color: "#07080d",
    lang: "zh-CN",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
