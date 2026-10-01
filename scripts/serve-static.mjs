import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const directory = resolve(process.argv[2] ?? "out");
const port = Number(process.env.PORT ?? 3000);
/**
 * 默认双栈监听。
 *
 * 只绑 `127.0.0.1` 时，把地址写成 `localhost` 的浏览器可能先解析到 `::1`
 * 而连不上；只绑 `::1`（`HOST=localhost` 在 Windows 上的解析结果）时，
 * 走 IPv4 的 `127.0.0.1` 同样连不上，看起来就像页面 404。
 * 因此默认绑 `::` 同时覆盖 IPv4 与 IPv6，需要单栈时用 HOST 覆盖。
 */
const host = process.env.HOST ?? "::";
const mimeTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".map": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".pdf": "application/pdf" };

if (!existsSync(directory)) {
  throw new Error(`Static export directory does not exist: ${directory}`);
}

function getFilePath(pathname) {
  const requested = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  const target = resolve(directory, requested);
  if (target !== directory && !target.startsWith(`${directory}${sep}`)) return null;
  if (existsSync(target) && statSync(target).isDirectory()) return join(target, "index.html");
  if (!extname(target) && existsSync(join(target, "index.html"))) return join(target, "index.html");
  return target;
}

createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`).pathname;
  const filePath = getFilePath(pathname);
  const exists = filePath && existsSync(filePath) && statSync(filePath).isFile();
  const fallback = join(directory, "404.html");
  const resolvedPath = exists ? filePath : fallback;
  const status = exists ? 200 : 404;
  response.writeHead(status, { "Content-Type": mimeTypes[extname(resolvedPath)] ?? "application/octet-stream" });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(resolvedPath).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving static export from ${directory} at http://${host}:${port}`);
});
