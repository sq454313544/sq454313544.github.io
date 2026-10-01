/* eslint-disable @next/next/no-head-element -- This build script renders standalone print HTML outside Next.js. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "../components/resume/ResumeDocument";
import { profileData } from "../data/profile";

const siteUrl = new URL(process.argv[2] ?? "https://sq454313544.github.io").origin;
const pageHtml = readFileSync(resolve("out", "about", "index.html"), "utf-8");
const htmlClass = /<html\b[^>]*\bclass="([^"]*)"/.exec(pageHtml)?.[1];
const bodyClass = /<body\b[^>]*\bclass="([^"]*)"/.exec(pageHtml)?.[1];
const stylesheets = [...pageHtml.matchAll(/<link\b[^>]*>/g)]
  .map(([tag]) => /\brel="stylesheet"/.test(tag) ? /\bhref="([^"]*)"/.exec(tag)?.[1] : undefined)
  .filter((href): href is string => Boolean(href));

if (!htmlClass || !bodyClass || stylesheets.length === 0) {
  throw new Error("静态页面缺少字体、正文或样式表信息，请先完成站点构建。");
}

const html = renderToStaticMarkup(
  <html lang="zh-CN" className={htmlClass}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex,nofollow" />
      <title>{profileData.profile.name} · 个人简历</title>
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={new URL(href, siteUrl).href} />
      ))}
    </head>
    <body className={bodyClass}>
      <ResumeDocument siteUrl={siteUrl} />
    </body>
  </html>,
);

const output = resolve(".agent-temp", "resume-print", "index.html");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `<!DOCTYPE html>${html}`, "utf-8");
console.log("Resume print document generated in the temporary build directory.");
