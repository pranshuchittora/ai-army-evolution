#!/usr/bin/env bash
# ============================================================
#  一键发布脚本（本地执行：make publish）
#  全过程信息打印在本地终端，背后用 SSH 在服务器构建并滚动重启。
#  幂等可重复执行；只更新本应用，不影响服务器上其它站点/容器。
#
#  所有部署凭据从 deploy/.env 读取（该文件不入库）。
#  首次使用：cp deploy/.env.example deploy/.env 并填写真实值。
# ============================================================
set -uo pipefail

cd "$(dirname "$0")/.." || { echo "找不到项目目录"; exit 1; }

# ---- 加载部署配置 ----
ENV_FILE="deploy/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "✗ 缺少 $ENV_FILE。请先执行：cp deploy/.env.example deploy/.env 并填写真实值。"
  exit 1
fi
set -a
. "$ENV_FILE"
# 同时加载根目录 .env 里的站点公开配置（NEXT_PUBLIC_*），随构建带到服务器
[ -f ".env" ] && . "./.env"
set +a

# ---- 颜色 ----
B=$(printf '\033[1m'); G=$(printf '\033[32m'); Y=$(printf '\033[33m')
R=$(printf '\033[31m'); C=$(printf '\033[36m'); N=$(printf '\033[0m')
ok(){ echo "${G}✓${N} $*"; }
info(){ echo "${C}▶${N} $*"; }
warn(){ echo "${Y}!${N} $*"; }
die(){ echo "${R}✗ $*${N}"; exit 1; }

SERVER="${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}"
SSH_OPTS="-i ${DEPLOY_SSH_KEY} -o ConnectTimeout=30"
SITE="${SITE_URL}"
START=$(date +%s)

echo ""
echo "${B}════════════════════════════════════════════${N}"
echo "${B}  🚀 发布到生产${N}"
echo "${B}════════════════════════════════════════════${N}"
echo ""

# ---- 0. 前置检查 ----
info "0/6 环境检查"
[ -f "$DEPLOY_SSH_KEY" ] || die "找不到 SSH 密钥：$DEPLOY_SSH_KEY"
command -v pnpm >/dev/null || die "未安装 pnpm"
ssh $SSH_OPTS "$SERVER" 'echo ok' >/dev/null 2>&1 || die "无法 SSH 连接服务器 $SERVER"
ok "本地与服务器连通正常"

# ---- 1. 本地构建自检（避免把坏代码发上线）----
info "1/6 本地构建自检（确保代码能编译）"
if pnpm build > /tmp/publish-build.log 2>&1; then
  ok "本地构建通过"
else
  echo ""; tail -25 /tmp/publish-build.log
  die "本地构建失败，已中止发布。完整日志 /tmp/publish-build.log"
fi

# ---- 2. 提交 & 推送（有改动才提交）----
info "2/6 提交并推送到 Git 仓库"
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  git add -A
  MSG="${1:-chore: publish $(date '+%Y-%m-%d %H:%M')}"
  git -c user.name="${GIT_AUTHOR_NAME:-deploy}" -c user.email="${GIT_AUTHOR_EMAIL:-deploy@localhost}" \
    commit -m "$MSG" >/dev/null 2>&1 || true
  ok "已提交：$MSG"
else
  warn "没有新改动需要提交"
fi
if git push origin HEAD >/tmp/publish-push.log 2>&1; then
  ok "已推送到 origin"
else
  warn "推送失败（不影响部署）：$(tail -1 /tmp/publish-push.log)"
fi

# ---- 3. 同步源码到服务器 ----
info "3/6 同步源码到服务器（rsync）"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude '.env' --exclude 'deploy/.env' \
  --exclude '*.pem' --exclude '*.key' --exclude '.DS_Store' --exclude '*.command' \
  -e "ssh $SSH_OPTS" \
  ./ "$SERVER:$DEPLOY_REMOTE_DIR/" || die "rsync 同步失败"
ok "源码已同步到 $DEPLOY_REMOTE_DIR"

# ---- 4. 服务器上构建镜像并滚动重启容器 ----
info "4/6 服务器构建 Docker 镜像并重启容器（耐心等，约 1-3 分钟）"
# 把应用所需的公开环境变量随构建带上（写入服务器侧 .env 供 Docker 构建读取）
ssh $SSH_OPTS "$SERVER" "cd $DEPLOY_REMOTE_DIR && \
  printf 'NEXT_PUBLIC_SITE_URL=%s\nNEXT_PUBLIC_SITE_NAME=%s\nNEXT_PUBLIC_BAIDU_ANALYTICS_ID=%s\nNEXT_PUBLIC_COMMUNITY_QR=%s\nNEXT_PUBLIC_COMMUNITY_QR_NOTE=%s\nNEXT_PUBLIC_COMMUNITY_WECHAT=%s\n' \
    '${NEXT_PUBLIC_SITE_URL:-$SITE_URL}' '${NEXT_PUBLIC_SITE_NAME:-}' '${NEXT_PUBLIC_BAIDU_ANALYTICS_ID:-}' \
    '${NEXT_PUBLIC_COMMUNITY_QR:-}' '${NEXT_PUBLIC_COMMUNITY_QR_NOTE:-}' '${NEXT_PUBLIC_COMMUNITY_WECHAT:-}' > .env && \
  APP_NAME='$APP_NAME' APP_HOST_PORT='$APP_HOST_PORT' APP_CONTAINER_PORT='$APP_CONTAINER_PORT' \
  DEPLOY_REMOTE_DIR='$DEPLOY_REMOTE_DIR' bash deploy/deploy.sh" \
  || die "服务器部署脚本失败，查看上方日志"
ok "容器已更新并重启"

# ---- 5. 线上健康检查 ----
info "5/6 线上健康检查"
sleep 2
CODE=$(curl -s -o /dev/null -w "%{http_code}" --noproxy '*' "$SITE/" || echo 000)
[ "$CODE" = "200" ] && ok "首页 $SITE → HTTP 200" || warn "首页返回 $CODE（CDN/代理缓存可能稍后生效）"
for p in /tools /blog /learn /community; do
  c=$(curl -s -o /dev/null -w "%{http_code}" --noproxy '*' "$SITE$p" || echo 000)
  [ "$c" = "200" ] && ok "$p → 200" || warn "$p → $c"
done
SSLV=$(curl -s -o /dev/null -w "%{ssl_verify_result}" --noproxy '*' "$SITE/" || echo 1)
[ "$SSLV" = "0" ] && ok "HTTPS 证书有效（绿锁）" || warn "HTTPS 校验码 $SSLV"

# ---- 6. 完成 ----
END=$(date +%s)
echo ""
echo "${B}════════════════════════════════════════════${N}"
echo "${G}${B}  ✅ 发布完成！耗时 $((END-START)) 秒${N}"
echo "${B}  🌐 $SITE${N}"
echo "${B}════════════════════════════════════════════${N}"
echo ""
echo "  看日志：  make logs"
echo "  看状态：  make status"
echo ""
