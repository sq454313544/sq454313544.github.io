import fs from "node:fs";
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, extname, join, normalize, resolve, sep } from "node:path";

/**
 * 生成独立 PDF 简历。
 *
 * 用法一（推荐，自带静态服务与无头 Chrome）：
 *   pnpm build:resume-pdf
 *
 * 用法二（复用已在运行的预览服务与 CDP 端口）：
 *   node scripts/build-resume-pdf.mjs <baseUrl> <outFile> <siteUrl>
 *
 * 为什么要自己起服务与浏览器：
 *  1. `pnpm build` 会重建 out/，而 PDF 是构建后才生成的独立产物，
 *     顺序漏一步就会得到「网页版已更新、PDF 还是旧版」的不一致。
 *  2. Next 会把站内链接渲染成带 origin 的绝对地址，直接打印会把
 *     http://localhost:... 写进 PDF。这里在返回文档时把 origin 改写成
 *     正式地址，链接注解随之正确，且不残留本机地址、也没有多余斜杠。
 */

const args = process.argv.slice(2);
const useExisting = args.length > 0;

const baseUrl = (args[0] ?? "http://127.0.0.1:4174").replace(/\/$/, "");
const outFile = args[1] ?? "public/resume/jin-zaiwei-resume.pdf";
const siteUrl = (args[2] ?? "https://sq454313544.github.io").replace(/\/$/, "");
const exportDir = resolve("out");
const printRoute = "/__resume-print__/";
const printHtml = resolve(".agent-temp", "resume-print", "index.html");

if (!existsSync(exportDir)) {
  console.error("Static export is missing. Run `pnpm build` first.");
  process.exit(1);
}

// 输出必须落在 public/ 下：这样才能同步刷新 out/ 里的副本
const publicDir = resolve("public");
const resolvedOut = resolve(outFile);
if (!resolvedOut.startsWith(`${publicDir}${sep}`)) {
  console.error(`输出路径必须位于 public/ 下，当前为：${resolvedOut}`);
  process.exit(1);
}

/* ---------------------------------------------------------------- 静态服务 */

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

function resolveFile(pathname) {
  const requested = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  const target = resolve(exportDir, requested);
  if (target !== exportDir && !target.startsWith(`${exportDir}${sep}`)) return null;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return join(target, "index.html");
  if (!extname(target) && fs.existsSync(join(target, "index.html"))) return join(target, "index.html");
  return target;
}

/**
 * 直接从 out/ 读文件喂给渲染器。
 *
 * 不经过任何中间静态服务：既没有端口、也就没有「服务起在旧目录」或
 * 缓存导致读到旧构建的可能。每个请求都按路径实时读盘。
 */
function readFromExport(pathname) {
  if (pathname === printRoute) {
    return { status: 200, contentType: "text/html; charset=utf-8", body: readFileSync(printHtml) };
  }
  const file = resolveFile(pathname);
  if (!file || !existsSync(file) || !fs.statSync(file).isFile()) {
    return { status: 404, contentType: "text/plain; charset=utf-8", body: Buffer.from("not found") };
  }
  return {
    status: 200,
    contentType: MIME[extname(file)] ?? "application/octet-stream",
    body: fs.readFileSync(file),
  };
}

/* ------------------------------------------------------------ 无头 Chrome */

/**
 * 定位可用的 Chrome/Chromium：
 * 1. `CHROME_PATH` 显式指定；
 * 2. 本机安装的 Google Chrome（Windows / macOS / Linux 常见路径）；
 * 3. PATH 上的 `google-chrome` / `chromium` 等命令名（Linux CI 常用）。
 * Ubuntu 的 GitHub Actions 运行器装有 google-chrome，走第 2、3 条即可。
 */
const CHROME_COMMANDS = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"];

function findOnPath(command) {
  const exts = process.platform === "win32" ? [".exe", ".cmd", ".bat", ""] : [""];
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const candidate = join(dir, `${command}${ext}`);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}

const chromePath = [
  process.env.CHROME_PATH,
  process.env.ProgramFiles && `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  process.env["ProgramFiles(x86)"] &&
    `${process.env["ProgramFiles(x86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  process.env.LOCALAPPDATA &&
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/opt/google/chrome/chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]
  .filter(Boolean)
  .find((candidate) => fs.existsSync(candidate)) ?? CHROME_COMMANDS.map(findOnPath).find(Boolean);

async function launchChrome(port) {
  const profile = mkdtempSync(join(tmpdir(), "resume-pdf-profile-"));
  const child = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const cleanup = () => {
    try {
      child.kill();
    } catch {
      /* 已退出 */
    }
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
    } catch {
      /* Windows 上偶发占用，忽略 */
    }
  };
  for (let i = 0; i < 60; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const version = await new Promise((ok, fail) => {
        http
          .get(`http://127.0.0.1:${port}/json/version`, (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => ok(JSON.parse(data)));
          })
          .on("error", fail);
      });
      if (version.webSocketDebuggerUrl) return { child, cleanup, port };
    } catch {
      /* 还没起来 */
    }
  }
  cleanup();
  throw new Error("无头 Chrome 未能在超时时间内就绪");
}

/* ------------------------------------------------------------- CDP 客户端 */

async function connect(port) {
  const target = await new Promise((ok, fail) => {
    const req = http.request(
      { host: "127.0.0.1", port, path: "/json/new?about:blank", method: "PUT" },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => ok(JSON.parse(data)));
      },
    );
    req.on("error", fail);
    req.end();
  });

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok) => socket.addEventListener("open", ok));

  let nextId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Fetch.requestPaused") {
      handleRequest(message.params).catch(() => {
        send("Fetch.continueRequest", { requestId: message.params.requestId });
      });
      return;
    }
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });

  function send(method, params = {}) {
    return new Promise((ok) => {
      const id = ++nextId;
      pending.set(id, ok);
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  function fire(method, params = {}) {
    socket.send(JSON.stringify({ id: ++nextId, method, params }));
  }

  function fetchBinary(url, redirects = 0) {
    return new Promise((ok, fail) => {
      http
        .get(url, (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location &&
            redirects < 3
          ) {
            res.resume();
            ok(fetchBinary(new URL(res.headers.location, url).href, redirects + 1));
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            ok({
              status: res.statusCode ?? 500,
              contentType: res.headers["content-type"] ?? "application/octet-stream",
              body: Buffer.concat(chunks),
            }),
          );
        })
        .on("error", fail);
    });
  }

  async function handleRequest({ requestId, request }) {
    const url = new URL(request.url);
    const lastSegment = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const isDocument = !lastSegment.includes(".");
    const source = `${baseUrl}${url.pathname}${url.search}`;

    // 文档以正式地址呈现、资源实际来自磁盘，对浏览器而言是跨源请求。
    // 字体等资源受 CORS 约束，缺标头会被拦下，页面随即回退字体、
    // 排版变化导致页数变多，因此这里显式补齐。
    const corsHeaders = [
      { name: "Access-Control-Allow-Origin", value: "*" },
      { name: "Timing-Allow-Origin", value: "*" },
    ];

    // useExisting 模式下资源来自给定的预览服务，否则直接读 out/
    const asset = url.pathname === printRoute
      ? readFromExport(url.pathname)
      : useExisting ? await fetchBinary(source) : readFromExport(url.pathname);

    if (isDocument) {
      const html = asset.body.toString("utf-8").split(baseUrl).join(siteUrl);
      fire("Fetch.fulfillRequest", {
        requestId,
        responseCode: 200,
        responseHeaders: [
          { name: "Content-Type", value: "text/html; charset=utf-8" },
          { name: "Cache-Control", value: "no-store" },
          ...corsHeaders,
        ],
        body: Buffer.from(html, "utf-8").toString("base64"),
      });
      return;
    }

    fire("Fetch.fulfillRequest", {
      requestId,
      responseCode: asset.status,
      responseHeaders: [
        { name: "Content-Type", value: asset.contentType },
        { name: "Cache-Control", value: "no-store" },
        ...corsHeaders,
      ],
      body: asset.body.toString("base64"),
    });
  }

  return { send, socket };
}

/* ------------------------------------------------------------------ 主流程 */

let chrome = null;

// 打印文档只在构建目录生成，与公开的 /resume 兼容页分开。
const rendered = spawnSync(process.execPath, [
  "--import", "tsx", "scripts/render-resume-html.tsx", siteUrl,
], { encoding: "utf-8" });
if (rendered.status !== 0 || !existsSync(printHtml)) {
  console.error("生成简历打印文档失败：", rendered.stderr || rendered.error?.message || rendered.stdout);
  process.exit(1);
}
if (process.env.PDF_DEBUG === "1") {
  console.log(`[pdf] exportDir=${exportDir} printHtml=${readFileSync(printHtml).length}B`);
}

const cdpPort = Number(process.env.CDP_PORT ?? 9333);
if (!chromePath) {
  console.error("未找到 Google Chrome，可用 CHROME_PATH 指定可执行文件路径。");
  process.exit(1);
}
chrome = await launchChrome(cdpPort).catch((error) => {
  console.error(error.message);
  process.exit(1);
});

const renderUrl = `${siteUrl}${printRoute}`;
const { send, socket } = await connect(cdpPort);

await send("Page.enable");
await send("Fetch.enable", {
  patterns: [
    { urlPattern: `${siteUrl}/*`, requestStage: "Request" },
    { urlPattern: `${baseUrl}/*`, requestStage: "Request" },
  ],
});
await send("Emulation.setEmulatedMedia", { media: "print" });
await send("Emulation.setDeviceMetricsOverride", {
  width: 794,
  height: 1123,
  deviceScaleFactor: 2,
  mobile: false,
});
await send("Page.navigate", { url: renderUrl });

/**
 * 等页面真正渲染完成再打印。
 *
 * 只看固定延时不够，以下情况都会静默产出错版 PDF：
 *  - 样式未就绪：仍能打印，但排版不同、页数变多；
 *  - 字体请求失败：`document.fonts.status` 仍会变成 "loaded"，
 *    页面却已回退字体，行高变化同样让页数变多。
 * 因此就绪条件要求：卡片存在、打印媒体已生效、
 * 正文实际使用的字体是站点字体（而不是回退字体）、
 * 正文字号等于打印字号（9pt ≈ 12px）。
 */
const READY_EXPRESSION = `JSON.stringify((() => {
  const card = document.querySelector('.resume-card');
  const mmToPx = 96 / 25.4;
  const usablePagePx = (297 - 2 * 10) * mmToPx;
  const height = card?.scrollHeight ?? 0;
  const bodyStyle = getComputedStyle(document.body);
  const bodyFont = parseFloat(bodyStyle.fontSize);
  const fontFamily = bodyStyle.fontFamily;
  const usesSiteFont = /geist/i.test(fontFamily);
  const expectedPrintFontPx = 9 * 96 / 72;
  const fontSized = Math.abs(bodyFont - expectedPrintFontPx) < 0.6;
  return {
    ready: Boolean(card) && height > 1000 && usesSiteFont && fontSized,

    height,
    usablePagePx: Math.round(usablePagePx),
    estimatedPages: Number((height / usablePagePx).toFixed(2)),
    fontsStatus: document.fonts?.status ?? null,
    bodyFontSize: bodyStyle.fontSize,
    usesSiteFont,
    fontSized,
    fontFamily: fontFamily.slice(0, 70),
    printMedia: matchMedia("print").matches,
    summary: card?.querySelector('header p.leading-relaxed')?.textContent?.slice(0, 40) ?? null,
  };
})())`;

let ready = null;
for (let attempt = 0; attempt < 30; attempt += 1) {
  await new Promise((r) => setTimeout(r, 500));
  // 每次探测前重申打印媒体：否则量到的是屏幕排版，高度与页数都会偏大
  await send("Emulation.setEmulatedMedia", { media: "print" });
  const probe = await send("Runtime.evaluate", {
    expression: READY_EXPRESSION,
    returnByValue: true,
  });
  ready = probe.result?.result?.value ? JSON.parse(probe.result.result.value) : null;
  if (ready?.ready) break;
}

if (!ready?.ready) {
  console.error(
    "简历打印文档未在超时时间内渲染就绪（字体或打印样式未生效），已中止以免产出错版 PDF：",
    JSON.stringify(ready),
  );
  socket.close();
  chrome.cleanup();

  process.exit(1);
}

/**
 * 实测「两页 A4」的内容高度上限。
 *
 * 单页可用高度是硬边界，但内容并不会被精确切满：分页点落在板块之间时
 * 会留下页尾空白，所以真正的上限比「单页可用高度 × 2」更小，且随排版变化。
 * 这里往卡片尾部追加一个占位块，二分找到仍能保持两页的最大高度，
 * 让测试可以用真实阈值而不是估算值来拦截内容膨胀。
 */
async function findTwoPageLimit() {
  const probe = async (extraPx) => {
    await send("Runtime.evaluate", {
      expression: `(() => {
        const card = document.querySelector('.resume-card');
        if (!card) return 0;
        let spacer = document.getElementById('__pdf_probe_spacer');
        if (!spacer) {
          spacer = document.createElement('div');
          spacer.id = '__pdf_probe_spacer';
          card.appendChild(spacer);
        }
        spacer.style.height = '${extraPx}px';
        return card.scrollHeight;
      })()`,
      returnByValue: true,
    });
    const result = await send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.394,
      marginBottom: 0.394,
      marginLeft: 0.394,
      marginRight: 0.394,
    });
    const data = result.result?.data ?? "";
    const pages = Number(/\/Count\s+(\d+)/.exec(Buffer.from(data, "base64").toString("latin1"))?.[1] ?? 0);
    return { extraPx, pages };
  };

  const base = ready.height;
  let low = 0;
  let high = 200;
  let limit = base;
  for (let i = 0; i < 8 && high - low > 3; i += 1) {
    const mid = Math.round((low + high) / 2);
    const { pages } = await probe(mid);
    if (pages <= 2) {
      low = mid;
      limit = base + mid;
    } else {
      high = mid;
    }
  }

  await send("Runtime.evaluate", {
    expression: "document.getElementById('__pdf_probe_spacer')?.remove()",
    returnByValue: true,
  });
  return limit;
}

const twoPageLimitPx = await findTwoPageLimit();
const printBudgetPx = twoPageLimitPx - 8;

console.log(
  JSON.stringify(
    {
      measured: { ...ready, twoPageLimitPx, printBudgetPx },
    },
    null,
    2,
  ),
);

if (ready.height > printBudgetPx) {
  console.error(
    `简历内容高度 ${ready.height}px 超过两页预算 ${printBudgetPx}px（实测上限 ${twoPageLimitPx}px），` +
      "请收敛内容后再生成 PDF。",
  );
  socket.close();
  chrome.cleanup();

  process.exit(1);
}

const printedFinal = await send("Page.printToPDF", {
  printBackground: true,
  preferCSSPageSize: false,
  displayHeaderFooter: false,
  paperWidth: 8.27,
  paperHeight: 11.69,
  marginTop: 0.394,
  marginBottom: 0.394,
  marginLeft: 0.394,
  marginRight: 0.394,
});

if (!printedFinal.result?.data) {
  console.error("打印失败:", JSON.stringify(printedFinal).slice(0, 300));
  socket.close();
  chrome.cleanup();

  process.exit(1);
}

const buffer = Buffer.from(printedFinal.result.data, "base64");
fs.mkdirSync(outFile.slice(0, outFile.lastIndexOf("/")) || ".", { recursive: true });
fs.writeFileSync(outFile, buffer);

// 同时刷新导出目录里的副本，保证 out/ 与 public/ 一致
const relativeToPublic = outFile.replace(/^\.?[/\\]?public[/\\]/, "");
const exportedCopy = join(exportDir, relativeToPublic);
fs.mkdirSync(exportedCopy.slice(0, exportedCopy.lastIndexOf(sep)), { recursive: true });
fs.writeFileSync(exportedCopy, buffer);

const text = buffer.toString("latin1");
const pageCount = Number(/\/Count\s+(\d+)/.exec(text)?.[1] ?? 0);
const leakedHosts = ["localhost", "127.0.0.1"].filter((host) => text.includes(host));
const links = [...text.matchAll(/\/URI \(([^)]*)\)/g)].map((m) => m[1]);
const unexpectedLinks = links.filter(
  (uri) =>
    !uri.startsWith(siteUrl) && !uri.startsWith("mailto:") && !uri.startsWith("https://github.com/"),
);

console.log(
  JSON.stringify(
    {
      outFile,
      exportedCopy,
      bytes: buffer.length,
      pageCount,
      measured: ready,
      twoPageLimitPx,
      printBudgetPx,
      links,
      leakedHosts,
      unexpectedLinks,
    },
    null,
    2,
  ),
);

socket.close();
chrome.cleanup();

const ok = pageCount === 2 && leakedHosts.length === 0 && unexpectedLinks.length === 0;
process.exit(ok ? 0 : 1);
