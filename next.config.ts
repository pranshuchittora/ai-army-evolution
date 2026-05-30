import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 产出自包含的最小运行包，便于 Docker 部署
  output: "standalone",
  // 不暴露 X-Powered-By，减少指纹信息（基础安全）
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
