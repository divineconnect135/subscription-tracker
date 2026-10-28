import { defineConfig, devices } from "@playwright/test";

import { existsSync, readFileSync } from "node:fs";

import { parse } from "dotenv";

const baseURL = "http://127.0.0.1:3100";

if (!existsSync(".env.e2e")) {
  throw new Error("Missing .env.e2e. Configure the separate Neon test branch.");
}

const e2eEnv = parse(readFileSync(".env.e2e", "utf8"));

const required = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "BETTER_AUTH_SECRET",
] as const;

for (const key of required) {
  if (!e2eEnv[key]) {
    throw new Error(`Missing ${key} in .env.e2e`);
  }
}

if (
  e2eEnv.E2E_TEST_DATABASE !== "true" ||
  e2eEnv.BETTER_AUTH_URL !== baseURL ||
  e2eEnv.BETTER_AUTH_SECRET.length < 32
) {
  throw new Error("Invalid E2E safety configuration.");
}

function normalizedNeonHost(value: string): string {
  const hostname = new URL(value).hostname;

  if (!hostname.endsWith(".neon.tech")) {
    throw new Error("E2E tests require a dedicated Neon database endpoint.");
  }

  return hostname.replace("-pooler.", ".");
}

const testHost = normalizedNeonHost(e2eEnv.DATABASE_URL);

const testDirectHost = normalizedNeonHost(e2eEnv.DATABASE_URL_UNPOOLED);

if (testHost !== testDirectHost) {
  throw new Error("E2E pooled and direct URLs must target the same branch.");
}

if (!existsSync(".env")) {
  throw new Error(
    "Development .env is missing. Cannot verify database isolation.",
  );
}

const developmentEnv = parse(readFileSync(".env", "utf8"));

if (!developmentEnv.DATABASE_URL) {
  throw new Error("Development DATABASE_URL is missing.");
}

const developmentHost = normalizedNeonHost(developmentEnv.DATABASE_URL);

if (testHost === developmentHost) {
  throw new Error(
    "E2E database matches development. Use a separate Neon branch.",
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",

  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,

  expect: {
    timeout: 15_000,
  },

  reporter: "list",

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",

    url: `${baseURL}/login`,

    reuseExistingServer: false,
    timeout: 120_000,

    env: {
      ...e2eEnv,
    },
  },
});
