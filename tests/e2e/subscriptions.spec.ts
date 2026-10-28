import { expect, test, type Page } from "@playwright/test";

import { randomUUID } from "node:crypto";

const password = "E2eTestPassword!123";

function uniqueEmail(label: string): string {
  return `e2e-${label}-${randomUUID()}@example.com`;
}

async function registerAccount(page: Page, label: string): Promise<string> {
  const email = uniqueEmail(label);

  await page.goto("/register");

  await page.getByLabel("Full name").fill(`E2E ${label}`);

  await page.getByLabel("Email address").fill(email);

  await page.locator('input[name="password"]').fill(password);

  await page.getByLabel("Confirm password").fill(password);

  await page
    .getByRole("button", {
      name: "Create account",
    })
    .click();

  await expect(page).toHaveURL(/\/dashboard\/?$/);

  return email;
}

async function addSubscription(page: Page, name: string): Promise<void> {
  const nextWeek = new Date();

  nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);

  const renewalDate = nextWeek.toISOString().slice(0, 10);

  await page.goto("/subscriptions/new");

  await page.getByLabel("Subscription name").fill(name);

  await page.getByLabel("Price (CAD)").fill("12.99");

  await page.getByLabel("Billing cycle").selectOption("MONTHLY");

  await page.getByLabel("Category").selectOption("Entertainment");

  await page.getByLabel("Next renewal date").fill(renewalDate);

  await page.getByLabel("Status", { exact: true }).selectOption("ACTIVE");

  await page
    .getByRole("button", {
      name: "Add subscription",
      exact: true,
    })
    .click();

  await expect(page).toHaveURL(/\/subscriptions\?notice=created/);
}

test("registration, logout, login and route protection", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);

  const email = await registerAccount(page, "auth");

  await expect(
    page.getByRole("heading", {
      name: /Welcome,/,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel("Email address").fill(email);

  await page.getByLabel("Password").fill("wrong-password");

  await page
    .getByRole("button", {
      name: "Log in",
      exact: true,
    })
    .click();

  await expect(
    page.getByText("Invalid email or password.", {
      exact: true,
    }),
  ).toBeVisible();

  await page.getByLabel("Password").fill(password);

  await page
    .getByRole("button", {
      name: "Log in",
      exact: true,
    })
    .click();

  await expect(page).toHaveURL(/\/dashboard\/?$/);
});

test("create, dashboard, filter, edit, status and delete", async ({ page }) => {
  await registerAccount(page, "crud");

  const name = `E2E Netflix ${randomUUID().slice(0, 8)}`;

  await addSubscription(page, name);

  await expect(page.getByText(name, { exact: true })).toBeVisible();

  // Data must survive a page refresh.
  await page.reload();

  await expect(page.getByText(name, { exact: true })).toBeVisible();

  // Check the normalized monthly dashboard value.
  await page.goto("/dashboard");

  await expect(
    page
      .getByText("$12.99", {
        exact: true,
      })
      .first(),
  ).toBeVisible();

  // Search by name.
  await page.goto("/subscriptions");

  await page
    .getByRole("searchbox", {
      name: "Search by name",
    })
    .fill(name);

  await page
    .getByRole("button", {
      name: "Apply filters",
    })
    .click();

  await expect(page).toHaveURL(/q=/);

  await expect(page.getByText(name, { exact: true })).toBeVisible();

  // Check that filters remain after refresh.
  await page.reload();

  await expect(page.getByText(name, { exact: true })).toBeVisible();

  // Open edit page.
  await page
    .getByRole("link", {
      name: "Edit subscription",
    })
    .click();

  const updatedName = `${name} Updated`;

  await page.getByLabel("Subscription name").fill(updatedName);

  await page.getByLabel("Price (CAD)").fill("22.99");

  await page
    .getByRole("button", {
      name: "Save changes",
    })
    .click();

  await expect(page).toHaveURL(/\/subscriptions\?notice=updated/);

  await expect(
    page.getByText(updatedName, {
      exact: true,
    }),
  ).toBeVisible();

  // Change status.
  await page.getByLabel("Change status").selectOption("PAUSED");

  await page
    .getByRole("button", {
      name: "Apply",
      exact: true,
    })
    .click();

  await expect(page.getByText("PAUSED", { exact: true })).toBeVisible();

  // Paused subscriptions do not count toward spending.
  await page.goto("/dashboard");

  await expect(page.getByText("$0.00", { exact: true }).first()).toBeVisible();

  // Delete through explicit confirmation.
  await page.goto("/subscriptions");

  await page
    .locator("summary")
    .filter({ hasText: "Delete subscription" })
    .click();

  await page
    .getByRole("button", {
      name: "Yes, delete subscription",
    })
    .click();

  await expect(page).toHaveURL(/\/subscriptions\?notice=deleted/);

  await expect(
    page.getByText(updatedName, {
      exact: true,
    }),
  ).toHaveCount(0);
});

test("a second account cannot access another user's record", async ({
  page,
  browser,
}) => {
  await registerAccount(page, "owner-a");

  const privateName = `Private Subscription ${randomUUID().slice(0, 8)}`;

  await addSubscription(page, privateName);

  const editHref = await page
    .getByRole("link", {
      name: "Edit subscription",
    })
    .getAttribute("href");

  expect(editHref).toBeTruthy();

  const otherContext = await browser.newContext();

  try {
    const otherPage = await otherContext.newPage();

    await registerAccount(otherPage, "owner-b");

    await otherPage.goto(editHref!);

    await expect(
      otherPage.getByRole("heading", {
        name: "Page not found",
      }),
    ).toBeVisible();

    await otherPage.goto("/subscriptions");

    await expect(
      otherPage.getByText(privateName, {
        exact: true,
      }),
    ).toHaveCount(0);
  } finally {
    await otherContext.close();
  }
});
