import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import matter from "gray-matter";
import {
  validateDashboardMeta,
  validateNoteMeta,
  validateProjectMeta,
} from "./schemas";

const CONTENT_TYPES = ["notes", "projects", "dashboards"] as const;

type ContentDirectory = (typeof CONTENT_TYPES)[number];

export interface ContentCheckResult {
  totalFiles: number;
  validFiles: number;
  errors: string[];
}

function isDirectoryMissing(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}

function validateFrontmatter(type: ContentDirectory, data: unknown): void {
  if (type === "notes") {
    validateNoteMeta(data);
  } else if (type === "projects") {
    validateProjectMeta(data);
  } else {
    validateDashboardMeta(data);
  }
}

export function checkContent(contentDir: string): ContentCheckResult {
  const result: ContentCheckResult = {
    totalFiles: 0,
    validFiles: 0,
    errors: [],
  };

  for (const type of CONTENT_TYPES) {
    const directory = join(contentDir, type);
    let files: string[];

    try {
      files = readdirSync(directory).filter((file) => extname(file) === ".mdx");
    } catch (error) {
      if (isDirectoryMissing(error)) {
        continue;
      }
      throw error;
    }

    for (const file of files) {
      result.totalFiles++;
      const filePath = join(directory, file);

      try {
        const { data } = matter(readFileSync(filePath, "utf-8"));
        validateFrontmatter(type, data);
        result.validFiles++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push(`${filePath}: ${message}`);
      }
    }
  }

  return result;
}
