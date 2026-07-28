/**
 * Content validation script.
 * Run with: pnpm content:check
 *
 * Validates all MDX content files have correct frontmatter.
 * Exits with code 1 if any content fails validation.
 */
import { join } from "node:path";
import { checkContent } from "../lib/content/content-check";

const CONTENT_DIR = join(import.meta.dirname, "..", "content");
const result = checkContent(CONTENT_DIR);

console.log(`Content check: ${result.validFiles}/${result.totalFiles} files passed`);

if (result.errors.length > 0) {
  console.error("Validation errors:");
  result.errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log("All content valid.");
