import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:4321",
    trace: "on-first-retry",
    ...(process.env.CI ? {} : { channel: "chrome" }),
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run dev -- --host 127.0.0.1",
        url: "http://127.0.0.1:4321",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
