import { describe, expect, it } from "vitest";

import {
  categories,
  featuredTools,
  getCategory,
  toolsByCategory,
} from "@/lib/db";

describe("getCategory", () => {
  it("对存在的 slug 返回对应分类", () => {
    const known = categories[0];
    const found = getCategory(known.slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(known.slug);
  });

  it("对不存在的 slug 返回 undefined", () => {
    expect(getCategory("__no_such_category__")).toBeUndefined();
  });
});

describe("toolsByCategory", () => {
  it("返回的工具都属于该分类", () => {
    for (const cat of categories) {
      const result = toolsByCategory(cat.slug);
      for (const tool of result) {
        expect(tool.category).toBe(cat.slug);
      }
    }
  });

  it("至少有一个分类能命中工具", () => {
    const total = categories.reduce(
      (sum, c) => sum + toolsByCategory(c.slug).length,
      0,
    );
    expect(total).toBeGreaterThan(0);
  });

  it("对不存在的分类返回空数组", () => {
    expect(toolsByCategory("__no_such_category__")).toEqual([]);
  });
});

describe("featuredTools", () => {
  it("返回的工具 featured 全为 true", () => {
    const featured = featuredTools();
    expect(featured.length).toBeGreaterThan(0);
    for (const tool of featured) {
      expect(tool.featured).toBe(true);
    }
  });
});
