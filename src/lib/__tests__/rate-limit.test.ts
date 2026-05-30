import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { rateLimit } from "@/lib/rate-limit";

// 用唯一 key 避免跨用例污染共享的 module-level store。
let counter = 0;
function freshKey(label: string): string {
  counter += 1;
  return `${label}-${counter}-${Math.random().toString(36).slice(2)}`;
}

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("允许限额内的请求，且 remaining 递减", () => {
    const key = freshKey("under-limit");
    const limit = 5;

    const first = rateLimit(key, { limit });
    expect(first.ok).toBe(true);
    expect(first.remaining).toBe(limit - 1);
    expect(first.retryAfter).toBe(0);

    const second = rateLimit(key, { limit });
    expect(second.ok).toBe(true);
    expect(second.remaining).toBe(limit - 2);
  });

  it("超过 limit 后 ok=false 且 retryAfter>0", () => {
    const key = freshKey("over-limit");
    const limit = 3;
    const windowMs = 10_000;

    for (let i = 0; i < limit; i++) {
      expect(rateLimit(key, { limit, windowMs }).ok).toBe(true);
    }

    const blocked = rateLimit(key, { limit, windowMs });
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("不同 key 相互隔离", () => {
    const a = freshKey("iso-a");
    const b = freshKey("iso-b");
    const limit = 2;

    rateLimit(a, { limit });
    rateLimit(a, { limit });
    expect(rateLimit(a, { limit }).ok).toBe(false);

    // b 是全新的 key，不受 a 影响。
    expect(rateLimit(b, { limit }).ok).toBe(true);
  });

  it("窗口过期后恢复放行", () => {
    const key = freshKey("window-expiry");
    const limit = 2;
    const windowMs = 5_000;

    expect(rateLimit(key, { limit, windowMs }).ok).toBe(true);
    expect(rateLimit(key, { limit, windowMs }).ok).toBe(true);
    expect(rateLimit(key, { limit, windowMs }).ok).toBe(false);

    // 推进时间，让此前的命中全部过期。
    vi.advanceTimersByTime(windowMs + 1);

    const after = rateLimit(key, { limit, windowMs });
    expect(after.ok).toBe(true);
    expect(after.remaining).toBe(limit - 1);
  });

  it("默认 limit 为 20", () => {
    const key = freshKey("default-limit");
    let lastOk = true;
    for (let i = 0; i < 20; i++) {
      lastOk = rateLimit(key).ok;
      expect(lastOk).toBe(true);
    }
    expect(rateLimit(key).ok).toBe(false);
  });
});
