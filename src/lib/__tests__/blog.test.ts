import { describe, expect, it } from "vitest";

import {
  getAllPostMeta,
  getAllSlugs,
  getPost,
  getRelatedPosts,
} from "@/lib/blog";

describe("getAllPostMeta", () => {
  const meta = getAllPostMeta();

  it("返回非空列表", () => {
    expect(meta.length).toBeGreaterThan(0);
  });

  it("按 date 倒序排列", () => {
    for (let i = 1; i < meta.length; i++) {
      // 允许同日期（次级按 slug 排序），故用 >=。
      expect(meta[i - 1].date >= meta[i].date).toBe(true);
    }
  });

  it("每项含 slug / title / readingMinutes", () => {
    for (const m of meta) {
      expect(m.slug).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(typeof m.readingMinutes).toBe("number");
      expect(m.readingMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it("不含正文 html 字段", () => {
    expect(meta[0]).not.toHaveProperty("html");
  });
});

describe("getPost", () => {
  it("对真实存在的 slug 返回含 html 的对象", () => {
    const slug = getAllSlugs()[0];
    expect(slug).toBeTruthy();

    const post = getPost(slug);
    expect(post).toBeDefined();
    expect(post?.slug).toBe(slug);
    expect(typeof post?.html).toBe("string");
    expect(post?.html.length).toBeGreaterThan(0);
  });

  it("对不存在的 slug 返回 undefined", () => {
    expect(getPost("this-slug-does-not-exist-xyz")).toBeUndefined();
  });
});

describe("getRelatedPosts", () => {
  it("不包含自己且数量不超过限制", () => {
    const slug = getAllSlugs()[0];
    const limit = 3;
    const related = getRelatedPosts(slug, limit);

    expect(related.length).toBeLessThanOrEqual(limit);
    expect(related.some((p) => p.slug === slug)).toBe(false);
  });

  it("默认最多返回 3 篇", () => {
    const slug = getAllSlugs()[0];
    expect(getRelatedPosts(slug).length).toBeLessThanOrEqual(3);
  });
});
