// 站点级运行配置——全部来自环境变量，便于 fork 后改成自己的站点。
// 仅放「可公开」的配置（会进入客户端 bundle）。敏感的部署凭据走 deploy/.env，不在这里。

/** 站点基础 URL，用于 canonical / sitemap / OG / 结构化数据。 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** 站点名称。 */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AI 军团进化论";

/**
 * 百度统计 ID（hm.js?<id> 的 id）。
 * 未配置时不注入统计脚本——开源仓库默认不带任何站点的统计。
 */
export const BAIDU_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID ?? "";

/**
 * 社群入口配置——微信群二维码与个人微信兜底。
 * 二维码图片放 public/ 下；个人微信号用于群满/过期时引导添加。
 * 全部可空：留空则首页不展示对应入口，便于 fork 复用。
 */
export const COMMUNITY = {
  /** 微信群二维码图片路径（放 public/ 下），如 /wechat-group-qr.png */
  groupQrImage: process.env.NEXT_PUBLIC_COMMUNITY_QR ?? "",
  /** 二维码有效期/说明文案 */
  groupQrNote:
    process.env.NEXT_PUBLIC_COMMUNITY_QR_NOTE ?? "群二维码会定期更新",
  /** 群满或二维码过期时引导添加的个人微信号 */
  personalWechat: process.env.NEXT_PUBLIC_COMMUNITY_WECHAT ?? "",
};
