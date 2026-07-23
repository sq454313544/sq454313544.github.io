/**
 * Content validation script.
 * Run with: pnpm content:check
 *
 * Validates all MDX content files have correct frontmatter.
 * Exits with code 1 if any content fails validation.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = join(import.meta.dirname, "..", "content");
const CONTENT_TYPES = ["notes", "projects", "dashboards"] as const;

let totalFiles = 0;
let validFiles = 0;
const errors: string[] = [];

for (const type of CONTENT_TYPES) {
  const dir = join(CONTENT_DIR, type);
  try {
    const files = readdirSync(dir).filter((f) => extname(f) === ".mdx");
    for (const file of files) {
      totalFiles++;
      const filePath = join(dir, file);
      try {
        const content = readFileSync(filePath, "utf-8");
        const { data } = matter(content);

        // Basic required field checks (full Zod validation in lib/content/schemas.ts)
        if (!data.title) {
          errors.push(`${filePath}: missing required field "title"`);
          continue;
        }
        validFiles++;
      } catch (err) {
        errors.push(`${filePath}: ${err}`);
      }
    }
  } catch {
    // Directory doesn't exist yet - skip
  }
}

console.log(`Content check: ${validFiles}/${totalFiles} files passed`);

if (errors.length > 0) {
  console.error("Validation errors:");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log("All content valid.");
