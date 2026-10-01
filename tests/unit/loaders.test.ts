import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadContentType } from "@/lib/content/loaders";

const temporaryDirectories: string[] = [];

function createTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "personal-tech-site-loader-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("loadContentType", () => {
  it("returns an empty array when the content directory does not exist", () => {
    const missingDirectory = join(tmpdir(), "personal-tech-site-missing-content-directory");

    expect(loadContentType("note", missingDirectory)).toEqual([]);
  });

  it("indexes the title and description for full-text search", () => {
    const directory = createTemporaryDirectory();
    writeFileSync(
      join(directory, "searchable-note.mdx"),
      `---
title: "批量数据同步的生命周期"
description: "关于往期数据的处理方式"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
category: "warehouse"
tags: ["sync"]
---

正文只提到某个实现细节。`,
      "utf-8",
    );

    const [note] = loadContentType("note", directory);
    // 标题与描述里的词必须能被检索到，否则搜索只在正文里找
    expect(note.searchText).toContain("批量数据同步的生命周期");
    expect(note.searchText).toContain("关于往期数据的处理方式");
    expect(note.searchText).toContain("正文只提到某个实现细节");
  });

  it("throws a file-specific error when frontmatter is invalid", () => {
    const directory = createTemporaryDirectory();
    const filePath = join(directory, "invalid-note.mdx");
    writeFileSync(
      filePath,
      `---
description: "Missing title"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
category: "test"
tags: ["test"]
---

Body`,
      "utf-8",
    );

    expect(() => loadContentType("note", directory)).toThrow(filePath);
    expect(() => loadContentType("note", directory)).toThrow(/title/);
  });
});
