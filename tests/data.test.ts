import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import categories from "@/data/categories.json";
import tools from "@/data/tools.json";
import type { Category, Tool } from "@/lib/types";

const cats = categories as Category[];
const toolList = tools as Tool[];
const categorySlugs = new Set(cats.map((c) => c.slug));

const VALID_PRICING = new Set(["free", "freemium", "paid"]);
const VALID_REGION = new Set(["global", "cn"]);

describe("tools.json 数据完整性", () => {
  it("每个 tool 的 category 都在 categories 的 slug 集合里", () => {
    for (const tool of toolList) {
      expect(
        categorySlugs.has(tool.category),
        `工具 ${tool.id} 的分类 "${tool.category}" 不在 categories 中`,
      ).toBe(true);
    }
  });

  it("pricing 取值合法", () => {
    for (const tool of toolList) {
      expect(VALID_PRICING.has(tool.pricing), `${tool.id}: ${tool.pricing}`).toBe(
        true,
      );
    }
  });

  it("region 取值合法", () => {
    for (const tool of toolList) {
      expect(VALID_REGION.has(tool.region), `${tool.id}: ${tool.region}`).toBe(
        true,
      );
    }
  });

  it("id 全局唯一", () => {
    const ids = toolList.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("必填字段非空", () => {
    for (const tool of toolList) {
      expect(tool.id, "id").toBeTruthy();
      expect(tool.name, `${tool.id}.name`).toBeTruthy();
      expect(tool.tagline, `${tool.id}.tagline`).toBeTruthy();
      expect(tool.description, `${tool.id}.description`).toBeTruthy();
      expect(tool.url, `${tool.id}.url`).toBeTruthy();
      expect(tool.category, `${tool.id}.category`).toBeTruthy();
      expect(Array.isArray(tool.tags), `${tool.id}.tags`).toBe(true);
    }
  });
});

describe("categories.json 数据完整性", () => {
  it("slug 全局唯一", () => {
    const slugs = cats.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("必填字段非空", () => {
    for (const c of cats) {
      expect(c.slug, "slug").toBeTruthy();
      expect(c.name, `${c.slug}.name`).toBeTruthy();
      expect(c.description, `${c.slug}.description`).toBeTruthy();
    }
  });
});

describe("博客 frontmatter 数据完整性", () => {
  const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
  const toolIds = new Set(toolList.map((t) => t.id));

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  it("存在博客文章", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    describe(file, () => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);

      it("author 是「老一」", () => {
        expect(data.author).toBe("老一");
      });

      it("有 title 和 description", () => {
        expect(data.title, "title").toBeTruthy();
        expect(data.description, "description").toBeTruthy();
      });

      it("relatedTools 都是 tools.json 里存在的 id", () => {
        const related = Array.isArray(data.relatedTools)
          ? data.relatedTools
          : [];
        for (const id of related) {
          expect(toolIds.has(id), `${file}: relatedTool "${id}" 不存在`).toBe(
            true,
          );
        }
      });
    });
  }
});
