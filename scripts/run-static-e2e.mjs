import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (!existsSync("out")) {
  console.error("Static export is missing. Run `pnpm build` before `pnpm test:e2e:static`.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["./node_modules/@playwright/test/cli.js", "test"], {
  env: { ...process.env, E2E_STATIC: "1" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
