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
