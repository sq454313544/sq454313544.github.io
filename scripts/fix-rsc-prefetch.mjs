import { existsSync, readdirSync, statSync, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { join, resolve, sep } from "node:path";

/**
 * 静态导出 RSC 预取路径补全。
 *
 * 现象：Next.js 16 在静态导出下，部分 RSC 预取请求把 `__next.{segment}` 当成
 * 文件名前缀：`{route}/…/__next.{segment}.{name}.txt`，
 * 而实际产物是目录形式：`{route}/…/__next.{segment}/{name}.txt`。
 * 这些请求因此 404，浏览器退回整页 HTML 导航：功能正常，但产生大量无效请求与
 * 控制台报错，也增加导航开销。
 *
 * 规则：对导出目录里每一个 `__next.*` 目录，在其**父目录**补齐
 * `__next.{segment}.{name}.txt` 别名文件；其余目录继续递归。
 *
 * 不修改 Next 源码、不关闭预取、不屏蔽错误；复制的是同一份内容，不引入不一致。
 */

const outDir = resolve(process.argv[2] ?? "out");

if (!existsSync(outDir)) {
  console.error(`Static export not found: ${outDir}. Run \`pnpm build\` first.`);
  process.exit(1);
}

/** 浏览器确实会请求的 RSC 文件名；其余内容不在预取范围内，不做复制 */
const WANTED = new Set(["__PAGE__.txt", "$d$slug.txt", "$d$tag.txt", "$d$category.txt"]);

const created = [];
const removed = [];
const skipped = [];

/** 先清掉上一次运行留下的别名，保证脚本可重复执行且不残留旧路径 */
function removeStaleAliases(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      // 别名形态：__next.{segment}.{name}.txt
      if (/^__next\..+\..+\.txt$/.test(entry.name)) {
        unlinkSync(join(dir, entry.name));
        removed.push(entry.name);
      }
      continue;
    }
    if (entry.name.startsWith("__next.")) continue;
    removeStaleAliases(join(dir, entry.name));
  }
}

function aliasNextDirs(parent) {
  for (const entry of readdirSync(parent, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("__next.")) continue;
    const dir = join(parent, entry.name);
    for (const file of readdirSync(dir, { withFileTypes: true })) {
      if (!file.isFile() || !WANTED.has(file.name)) continue;
      const from = join(dir, file.name);
      if (statSync(from).size === 0) {
        skipped.push(from);
        continue;
      }
      const to = join(parent, `${entry.name}.${file.name}`);
      if (existsSync(to) && readFileSync(from).equals(readFileSync(to))) continue;
      writeFileSync(to, readFileSync(from));
      created.push(to.slice(outDir.length + 1).split(sep).join("/"));
    }
  }
}

function walk(dir) {
  aliasNextDirs(dir);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      // 动态路由的产物会在 __next.{seg} 下再嵌一层 $d$xxx，
      // 而请求路径没有这一层：{route}/__next.{seg}.$d$xxx.__PAGE__.txt
      for (const inner of readdirSync(sub, { withFileTypes: true })) {
        if (!inner.isDirectory() || !inner.name.startsWith("$d$")) continue;
        const innerDir = join(sub, inner.name);
        for (const file of readdirSync(innerDir, { withFileTypes: true })) {
          if (!file.isFile() || !WANTED.has(file.name)) continue;
          const from = join(innerDir, file.name);
          if (statSync(from).size === 0) {
            skipped.push(from);
            continue;
          }
          const to = join(dir, `${entry.name}.${inner.name}.${file.name}`);
          if (existsSync(to) && readFileSync(from).equals(readFileSync(to))) continue;
          writeFileSync(to, readFileSync(from));
          created.push(to.slice(outDir.length + 1).split(sep).join("/"));
        }
      }
      continue;
    }
    walk(sub);
  }
}

removeStaleAliases(outDir);
walk(outDir);

console.log(
  JSON.stringify(
    {
      outDir,
      removedStale: removed.length,
      aliasCount: created.length,
      skippedEmpty: skipped.length,
      sample: created.slice(0, 8),
    },
    null,
    2,
  ),
);
