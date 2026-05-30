#!/usr/bin/env bash
# ============================================================
#  服务器部署脚本（在服务器上执行，通常由 publish.sh 远程触发）
#  作用：构建镜像 → 启动/更新容器
#  幂等：可重复执行。
#  参数从环境变量读取（publish.sh 会传入；本地直跑可自行 export）：
#    APP_NAME / APP_HOST_PORT / APP_CONTAINER_PORT / DEPLOY_REMOTE_DIR
#  说明：本脚本只管理本应用容器，【不触碰任何 nginx 配置与其它容器】。
#        反向代理与 HTTPS 由前置 nginx 处理（见 DEPLOY.md）。
# ============================================================
set -euo pipefail

APP_NAME="${APP_NAME:-ai-army-evolution}"
IMAGE_TAG="${APP_NAME}:local"
HOST_PORT="${APP_HOST_PORT:-8090}"
CONTAINER_PORT="${APP_CONTAINER_PORT:-3000}"
SRC_DIR="${DEPLOY_REMOTE_DIR:-$(pwd)}"
DATA_DIR="${SRC_DIR}-data/content"   # 持久化投稿数据（容器外，重建不丢）

echo "▶ 1/4 准备持久化数据目录"
mkdir -p "$DATA_DIR"
if [ ! -f "$DATA_DIR/submissions.json" ]; then
  if [ -f "$SRC_DIR/content/submissions.json" ]; then
    cp "$SRC_DIR/content/submissions.json" "$DATA_DIR/submissions.json"
  else
    echo "[]" > "$DATA_DIR/submissions.json"
  fi
fi

echo "▶ 2/4 构建镜像（multi-stage standalone）"
cd "$SRC_DIR"
docker build -t "$IMAGE_TAG" .

echo "▶ 3/4 重启容器（端口 ${HOST_PORT}）"
docker rm -f "$APP_NAME" 2>/dev/null || true
docker run -d \
  --name "$APP_NAME" \
  --restart unless-stopped \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  -v "${DATA_DIR}:/app/content" \
  "$IMAGE_TAG"

echo "▶ 4/4 等待容器就绪"
ok=0
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${HOST_PORT}/" -o /dev/null; then
    echo "  ✓ 容器已响应 (127.0.0.1:${HOST_PORT})"
    ok=1
    break
  fi
  sleep 2
done

docker ps --filter "name=${APP_NAME}" --format "  {{.Names}} | {{.Status}} | {{.Ports}}"
if [ "$ok" = "1" ]; then
  echo "✅ 部署完成。前置 nginx 反代到本容器（127.0.0.1:${HOST_PORT}）。"
else
  echo "⚠️ 容器未在预期时间内响应，请查看：docker logs --tail 100 ${APP_NAME}"
  exit 1
fi
