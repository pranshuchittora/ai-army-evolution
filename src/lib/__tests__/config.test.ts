import { afterEach, describe, expect, it, vi } from "vitest";

// config.ts 在模块顶层读取 env，所以改 env 后必须 resetModules + 动态 import。
describe("config 默认值兜底", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("未配置 SITE_URL（undefined）时回退到 localhost:3000", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined as unknown as string);
    vi.resetModules();
    const { SITE_URL } = await import("@/lib/config");
    expect(SITE_URL).toBe("http://localhost:3000");
  });

  it("BAIDU_ANALYTICS_ID 未配置时为空串", async () => {
    vi.stubEnv("NEXT_PUBLIC_BAIDU_ANALYTICS_ID", undefined as unknown as string);
    vi.resetModules();
    const { BAIDU_ANALYTICS_ID } = await import("@/lib/config");
    expect(BAIDU_ANALYTICS_ID).toBe("");
  });

  it("SITE_NAME 未配置时回退到默认站名", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_NAME", undefined as unknown as string);
    vi.resetModules();
    const { SITE_NAME } = await import("@/lib/config");
    expect(SITE_NAME).toBe("AI 军团进化论");
  });

  it("SITE_URL 去除尾部斜杠", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    vi.resetModules();
    const { SITE_URL } = await import("@/lib/config");
    expect(SITE_URL).toBe("https://example.com");
  });
});
