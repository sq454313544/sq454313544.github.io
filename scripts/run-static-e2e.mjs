import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

if (!existsSync("out")) {
  console.error("Static export is missing. Run `pnpm build` before `pnpm test:e2e:static`.");
  process.exit(1);
}

/**
 * 导出完整性检查：public/ 下的静态资源必须逐个出现在 out/ 中且大小一致。
 * 这条检查能挡住“重新构建后独立生成的产物（例如简历 PDF）没进导出目录”
 * 这类只在部署后才暴露的问题。
 */
function collectFiles(root, base = root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, base));
    } else if (entry.isFile()) {
      files.push(relative(base, full).split(sep).join("/"));
    }
  }
  return files;
}

const publicDir = "public";
const missing = [];
const sizeMismatch = [];

if (existsSync(publicDir)) {
  for (const file of collectFiles(publicDir)) {
    const exported = join("out", file);
    if (!existsSync(exported)) {
      missing.push(file);
      continue;
    }
    if (statSync(join(publicDir, file)).size !== statSync(exported).size) {
      sizeMismatch.push(file);
    }
  }
}

if (missing.length > 0 || sizeMismatch.length > 0) {
  console.error("Static export integrity check failed.");
  for (const file of missing) console.error(`  missing in out/: ${file}`);
  for (const file of sizeMismatch) console.error(`  size differs: ${file}`);
  console.error(
    "Hint: 独立生成的产物（如简历 PDF）需在 `pnpm build` 之后重新生成：`pnpm build:export` 会一并完成。",
  );
  process.exit(1);
}

/**
 * RSC 预取路径检查：Next.js 静态导出会请求 `{route}/…/__next.{seg}.{name}.txt`，
 * 而产物位于 `{route}/…/__next.{seg}/{name}.txt`。构建末尾的
 * `scripts/fix-rsc-prefetch.mjs` 会补齐这些别名；这里验证补全结果确实存在，
 * 否则导航会退回整页 HTML 并产生资源 404。
 */
const RSC_NAMES = ["__PAGE__.txt", "$d$slug.txt", "$d$tag.txt", "$d$category.txt"];
const missingPrefetch = [];

function walkForPrefetch(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const inner of readdirSync(sub, { withFileTypes: true })) {
        const candidates = inner.isDirectory() && inner.name.startsWith("$d$")
          ? readdirSync(join(sub, inner.name), { withFileTypes: true }).map((f) => ({
              name: f.name,
              isFile: f.isFile(),
              dir: join(sub, inner.name),
              prefix: `${entry.name}.${inner.name}`,
            }))
          : [{ name: inner.name, isFile: inner.isFile(), dir: sub, prefix: entry.name }];
        for (const candidate of candidates) {
          if (!candidate.isFile || !RSC_NAMES.includes(candidate.name)) continue;
          const alias = join(dir, `${candidate.prefix}.${candidate.name}`);
          if (!existsSync(alias)) {
            missingPrefetch.push(alias.split(sep).join("/"));
          }
        }
      }
      continue;
    }
    walkForPrefetch(sub);
  }
}

walkForPrefetch("out");

if (missingPrefetch.length > 0) {
  console.error("RSC prefetch alias check failed. Run `pnpm build` to regenerate aliases.");
  for (const file of missingPrefetch.slice(0, 10)) console.error(`  missing prefetch alias: ${file}`);
  console.error(`  total missing: ${missingPrefetch.length}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ["./node_modules/@playwright/test/cli.js", "test"], {
  env: { ...process.env, E2E_STATIC: "1" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
