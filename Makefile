# ============================================================
#  一键运维（部署凭据从 deploy/.env 读取，不入库）
#  常用：
#    make dev       本地开发预览（http://localhost:3000）
#    make build     本地构建自检（推送前确认能编译）
#    make test      跑单元测试
#    make publish   一键发布到生产
#    make logs      看线上应用日志
#    make status    看线上运行状态
#    make ssl       检查线上 HTTPS 证书
# ============================================================

.PHONY: dev build test publish logs status ssl help
.DEFAULT_GOAL := help

# 从 deploy/.env 读取部署变量（存在才读）
ifneq (,$(wildcard deploy/.env))
include deploy/.env
export
endif

SSH := ssh -i $(DEPLOY_SSH_KEY) $(DEPLOY_SSH_USER)@$(DEPLOY_SSH_HOST)

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

publish:
	@bash deploy/publish.sh

logs:
	@$(SSH) 'docker logs --tail 120 $(APP_NAME)'

status:
	@$(SSH) 'docker ps --filter name=$(APP_NAME) --format "容器：{{.Names}}\n状态：{{.Status}}\n端口：{{.Ports}}"'

ssl:
	@echo | openssl s_client -servername $(SITE_DOMAIN) \
		-connect $(SITE_DOMAIN):443 2>/dev/null \
		| openssl x509 -noout -subject -dates

help:
	@echo "一键运维命令（先 cp deploy/.env.example deploy/.env 并填写）"
	@echo "  make dev       本地开发预览"
	@echo "  make build     本地构建自检"
	@echo "  make test      跑单元测试"
	@echo "  make publish   一键发布到生产"
	@echo "  make logs      看线上应用日志"
	@echo "  make status    看线上运行状态"
	@echo "  make ssl       检查线上 HTTPS 证书"
