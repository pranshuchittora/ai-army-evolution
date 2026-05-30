// 极简文件数据库：种子数据来自 src/data/*.json（只读），
// 社群投稿持久化到项目根目录的 content/submissions.json（可读写）。
import fs from "node:fs";
import path from "node:path";

import categoriesData from "@/data/categories.json";
import toolsData from "@/data/tools.json";
import resourcesData from "@/data/resources.json";
import pathsData from "@/data/learning-paths.json";

import type {
  Category,
  Tool,
  Resource,
  LearningStage,
  Submission,
} from "@/lib/types";

export const categories = categoriesData as Category[];
export const tools = toolsData as Tool[];
export const resources = resourcesData as Resource[];
export const learningPaths = pathsData as LearningStage[];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function toolsByCategory(slug: string): Tool[] {
  return tools.filter((t) => t.category === slug);
}

export function featuredTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

// ---- 社群投稿：文件数据库 ----

const DATA_DIR = path.join(process.cwd(), "content");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, "[]", "utf8");
  }
}

export function readSubmissions(): Submission[] {
  ensureStore();
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf8");
    const list = JSON.parse(raw) as Submission[];
    // 最新在前
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

function writeSubmissions(list: Submission[]) {
  ensureStore();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), "utf8");
}

export interface NewSubmission {
  kind: Submission["kind"];
  name: string;
  url: string;
  category?: string;
  description: string;
  submittedBy?: string;
}

export function addSubmission(input: NewSubmission): Submission {
  const list = readSubmissions();
  const submission: Submission = {
    id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    kind: input.kind,
    name: input.name.trim(),
    url: input.url.trim(),
    category: input.category,
    description: input.description.trim(),
    submittedBy: input.submittedBy?.trim() || "匿名军团成员",
    createdAt: new Date().toISOString(),
    votes: 0,
    status: "pending",
  };
  list.unshift(submission);
  writeSubmissions(list);
  return submission;
}

export function voteSubmission(id: string): Submission | undefined {
  const list = readSubmissions();
  const target = list.find((s) => s.id === id);
  if (!target) return undefined;
  target.votes += 1;
  writeSubmissions(list);
  return target;
}
