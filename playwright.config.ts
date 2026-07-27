import { defineConfig, devices } from "@playwright/test";

const useStaticExport = process.env.E2E_STATIC === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "Google Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
  webServer: {
    command: useStaticExport ? "node scripts/serve-static.mjs out" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI && !useStaticExport,
    timeout: 60000,
  },
});
