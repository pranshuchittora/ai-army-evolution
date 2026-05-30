# 安全政策 · Security Policy

我们非常重视 **AI 军团进化论（AI Army Evolution）** 的安全。感谢你帮助我们让项目更安全。

> **English:** We take the security of **AI Army Evolution** seriously. Thank you for helping keep it safe.

---

## 📬 如何报告漏洞 · Reporting a Vulnerability

**请不要在公开的 GitHub Issue / PR / Discussion 中披露安全漏洞。** 公开披露会让漏洞在修复前被恶意利用。

请通过以下私下渠道报告：

- 发送邮件至 **security@example.com**
  （⚠️ 这是占位邮箱，项目维护者请替换为真实的安全联系邮箱后再开源。）
- 或使用 GitHub 的私密漏洞上报功能：仓库 **Security → Report a vulnerability**（Private Vulnerability Reporting）。

报告时请尽量包含：

- 漏洞类型与影响范围；
- 复现步骤或概念验证（PoC）；
- 受影响的版本 / 分支 / 文件；
- 你认为可行的修复建议（可选）。

我们会尽快确认收到，并在评估后与你协调修复与披露时间线。

> **English:** Do **not** open a public issue for security bugs. Email **security@example.com** (placeholder — replace before publishing) or use GitHub Private Vulnerability Reporting. Include impact, repro/PoC, and affected versions.

---

## 🔢 支持的版本 · Supported Versions

我们仅对最新的主版本提供安全更新：

| 版本 | 是否支持安全更新 |
|---|---|
| 1.0.x（最新） | ✅ 支持 |
| < 1.0 | ❌ 不再支持 |

请始终基于最新发布版本进行部署与二次开发。

---

## 🔐 凭据与密钥管理 · Secrets & Credentials

- **绝不在 issue、PR、commit、日志或代码中粘贴任何密钥、令牌、密码或真实部署凭据。**
- 本项目所有部署凭据与敏感配置一律通过**本地 `.env` 文件**管理，`.env` 已被 `.gitignore` 忽略，**绝不进入版本库**。
- 仓库内 `.env.example` 仅含**占位 / 默认值**，可安全提交；请勿把真实值写回模板。
- CI 中如需密钥，统一通过 **GitHub Actions Secrets**（`${{ secrets.XXX }}`）注入，绝不硬编码。
- 如果你不慎提交了密钥，请**立即轮换该密钥**，并通知维护者，仅靠删除提交历史不足以止损。

> **English:** Never commit secrets. All deployment credentials live in a local `.env` (gitignored). `.env.example` holds placeholders only. In CI, use GitHub Actions Secrets. If a secret leaks, rotate it immediately.

---

## 🙏 致谢 · Acknowledgements

负责任地披露漏洞的研究者，我们会在修复后（征得本人同意）在发布说明中致谢。感谢你的贡献！
