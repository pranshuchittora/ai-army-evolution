#!/bin/bash
# ============================================================
#  AI 军团进化论 · 一键启动
#  用法：直接双击本文件即可。会自动打开浏览器看到网站。
#  关闭：把弹出的黑色终端窗口关掉，网站就停了。
#  下次想看：再双击本文件即可。
# ============================================================

# 切换到本脚本所在目录（项目根目录）
cd "$(dirname "$0")" || exit 1

# 让浏览器/工具访问本机时不要走代理（否则可能打不开）
export NO_PROXY="localhost,127.0.0.1"
export no_proxy="localhost,127.0.0.1"

# 补全常见的程序搜索路径（双击启动时环境较精简）
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$HOME/Library/pnpm:$HOME/.nvm/versions/node/*/bin"
# 尝试加载用户的 shell 配置，拿到 node/pnpm
[ -f "$HOME/.zprofile" ] && source "$HOME/.zprofile" >/dev/null 2>&1
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" >/dev/null 2>&1
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" >/dev/null 2>&1

PORT=3000
URL="http://localhost:$PORT"

clear
echo "=================================================="
echo "   🛡️  AI 军团进化论 · 正在启动网站…"
echo "=================================================="
echo ""

# 选择包管理器：优先 pnpm，没有就用 npm
if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
elif command -v npm >/dev/null 2>&1; then
  PM="npm run"
else
  echo "❌ 没找到 node/pnpm。请先安装 Node.js（https://nodejs.org），再双击本文件。"
  echo "（按回车键关闭本窗口）"
  read -r _
  exit 1
fi

# 首次运行自动安装依赖
if [ ! -d node_modules ]; then
  echo "🧩 第一次运行，正在准备运行环境（约 1-2 分钟，请稍候）…"
  echo ""
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install
  else
    npm install
  fi
  echo ""
fi

# 如果端口已被上次的进程占用，先关掉，避免冲突
OLD_PID=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN -t 2>/dev/null)
if [ -n "$OLD_PID" ]; then
  echo "♻️  关闭上一次还没退出的网站进程…"
  kill "$OLD_PID" >/dev/null 2>&1
  sleep 1
fi

echo "🚀 网站启动中…启动好后会自动打开浏览器。"
echo "   网址： $URL"
echo ""
echo "   ⚠️ 想关闭网站：直接关掉这个窗口即可。"
echo "=================================================="
echo ""

# 等服务器起来后自动打开浏览器
(
  for i in $(seq 1 60); do
    if curl -s --noproxy '*' -o /dev/null "$URL"; then
      open "$URL"
      break
    fi
    sleep 1
  done
) &

# 启动开发服务器（固定端口）
export PORT
if command -v pnpm >/dev/null 2>&1; then
  pnpm dev
else
  npm run dev
fi
