import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import matter from "gray-matter";
import { validateNoteMeta, validateProjectMeta, validateDashboardMeta } from "./schemas";
import type { ContentItem, NoteItem, ProjectItem, DashboardItem, ContentType } from "./types";
import { generateSlug } from "./slugs";

const CONTENT_DIR = join(process.cwd(), "content");

function generateExcerpt(body: string, maxLength = 200): string {
  return body.replace(/[#*`>\[\]()]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function generateSearchText(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*>\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calcReadingTime(body: string, wordsPerMinute = 300): number {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "");
  return Math.max(1, Math.ceil(cleaned.length / wordsPerMinute));
}

function loadContentType(type: ContentType, dir: string): ContentItem[] {
  const items: ContentItem[] = [];
  try {
    const files = readdirSync(dir).filter((f) => extname(f) === ".mdx");
    for (const file of files) {
      const filePath = join(dir, file);
      const content = readFileSync(filePath, "utf-8");
      const { data, content: body } = matter(content);
      const slug = generateSlug(file);
      const excerpt = generateExcerpt(body);
      const searchText = generateSearchText(body);
      const readingTime = calcReadingTime(body);

      try {
        if (type === "note") {
          const meta = validateNoteMeta(data);
          items.push({ type: "note", slug, meta, body, excerpt, searchText, readingTime });
        } else if (type === "project") {
          const meta = validateProjectMeta(data);
          items.push({ type: "project", slug, meta, body, excerpt, searchText, readingTime });
        } else if (type === "dashboard") {
          const meta = validateDashboardMeta(data);
          items.push({ type: "dashboard", slug, meta, body, excerpt, searchText, readingTime });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${filePath}: ${message}`);
      }
    }
  } catch {
    // Directory does not exist — return empty
  }
  return items;
}

export function loadNotes(): NoteItem[] {
  return loadContentType("note", join(CONTENT_DIR, "notes")) as NoteItem[];
}

export function loadProjects(): ProjectItem[] {
  return loadContentType("project", join(CONTENT_DIR, "projects")) as ProjectItem[];
}

export function loadDashboards(): DashboardItem[] {
  return loadContentType("dashboard", join(CONTENT_DIR, "dashboards")) as DashboardItem[];
}

export function loadAllContent(): ContentItem[] {
  return [...loadNotes(), ...loadProjects(), ...loadDashboards()];
}
