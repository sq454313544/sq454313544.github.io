import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

const fixtureRoot = resolve(".agent-temp/rsc-prefetch-tests");
const temporaryDirectories: string[] = [];

function createExport(files: Record<string, string>): string {
  mkdirSync(fixtureRoot, { recursive: true });
  const directory = mkdtempSync(join(fixtureRoot, "export-"));
  temporaryDirectories.push(directory);
  for (const [filename, content] of Object.entries(files)) {
    const path = join(directory, filename);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
  }
  return directory;
}

function runFix(directory: string): { aliasCount: number; skippedEmpty: number } {
  const result = spawnSync(process.execPath, [resolve("scripts/fix-rsc-prefetch.mjs"), directory], {
    encoding: "utf-8",
  });
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    const path = relative(fixtureRoot, directory);
    if (!path || path.startsWith("..") || isAbsolute(path)) {
      throw new Error("Fixture cleanup escaped the test directory");
    }
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("static RSC prefetch files", () => {
  it("preserves native flat exports, including dynamic-route payloads, across repeated runs", () => {
    const files = {
      "about/__next.about.__PAGE__.txt": "关于页面的 RSC",
      "projects/example/__next.projects.$d$slug.txt": "dynamic layout",
      "projects/example/__next.projects.$d$slug.__PAGE__.txt": "dynamic page",
      "about/__next._tree.txt": "route tree",
      "about/index.txt": "full payload",
      "about/index.html": "<html>About</html>",
    };
    const directory = createExport(files);

    expect(runFix(directory).aliasCount).toBe(0);
    expect(runFix(directory).aliasCount).toBe(0);
    for (const [filename, content] of Object.entries(files)) {
      expect(readFileSync(join(directory, filename), "utf-8")).toBe(content);
    }
  });

  it("serves directory-style page and dynamic payloads at the browser's flat request paths", () => {
    const directory = createExport({
      "about/__next.about/__PAGE__.txt": "about page",
      "projects/example/__next.projects/$d$slug.txt": "project layout",
      "projects/example/__next.projects/$d$slug/__PAGE__.txt": "project page",
      "about/__next.about/unrelated.txt": "untouched",
    });

    expect(runFix(directory).aliasCount).toBe(3);
    expect(readFileSync(join(directory, "about/__next.about.__PAGE__.txt"), "utf-8")).toBe("about page");
    expect(readFileSync(join(directory, "projects/example/__next.projects.$d$slug.txt"), "utf-8")).toBe("project layout");
    expect(readFileSync(join(directory, "projects/example/__next.projects.$d$slug.__PAGE__.txt"), "utf-8")).toBe("project page");
    expect(existsSync(join(directory, "about/__next.about.unrelated.txt"))).toBe(false);
    expect(runFix(directory).aliasCount).toBe(0);
  });

  it("refreshes an existing alias when its source changes without deleting unrelated native files", () => {
    const directory = createExport({
      "about/__next.about/__PAGE__.txt": "current page",
      "about/__next.about.__PAGE__.txt": "old alias",
      "notes/__next.notes.__PAGE__.txt": "native notes",
    });

    expect(runFix(directory).aliasCount).toBe(1);
    expect(readFileSync(join(directory, "about/__next.about.__PAGE__.txt"), "utf-8")).toBe("current page");
    expect(readFileSync(join(directory, "notes/__next.notes.__PAGE__.txt"), "utf-8")).toBe("native notes");
    expect(runFix(directory).aliasCount).toBe(0);
  });

  it("does not create empty prefetch aliases", () => {
    const directory = createExport({ "about/__next.about/__PAGE__.txt": "" });

    expect(runFix(directory)).toMatchObject({ aliasCount: 0, skippedEmpty: 1 });
    expect(existsSync(join(directory, "about/__next.about.__PAGE__.txt"))).toBe(false);
  });
});
