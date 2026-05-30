# ============================================================
#  AI 军团进化论 · 多阶段构建（Next.js standalone 输出，镜像精简）
#  pnpm 版本由 package.json 的 packageManager 字段锁定（corepack 读取），
#  与本地及 lockfile 一致，避免新版 pnpm 把忽略原生构建脚本当作硬错误。
# ============================================================

# ---- 依赖层 ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN corepack install
RUN pnpm install --frozen-lockfile

# ---- 构建层 ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN corepack install
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- 运行层 ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone 运行所需的最小文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 文件数据库种子（生产环境用 bind mount 覆盖以持久化）
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
