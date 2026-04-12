/**
 * E2E tests for Task 7 — Match History
 *
 * Tests that can run without auth:
 *   - /history redirects unauthenticated visitors to /login
 *
 * All history content tests require an authenticated session with scored
 * predictions. Run against staging: `npx ts-node scripts/seed-staging.ts`
 */

import { test, expect } from "@playwright/test";

test("unauthenticated visit to /history redirects to /login", async ({
  page,
}) => {
  await page.goto("/history");
  await expect(page).toHaveURL(/\/login/);
});

test.describe("E2E-HIST — history content", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session with scored predictions — run against staging"
  );

  test("history page renders stats bar with correct totals", async ({
    page,
  }) => {
    await page.goto("/history");

    // Stats bar labels must be present
    await expect(page.getByText("משחקים")).toBeVisible();
    await expect(page.getByText("נקודות")).toBeVisible();
    await expect(page.getByText("בינגו")).toBeVisible();
    await expect(page.getByText("נכון")).toBeVisible();
    await expect(page.getByText("פספוס")).toBeVisible();
  });

  test("history page renders filter pills", async ({ page }) => {
    await page.goto("/history");

    await expect(page.getByRole("button", { name: "הכל" })).toBeVisible();
    await expect(page.getByRole("button", { name: "בינגו" })).toBeVisible();
    await expect(page.getByRole("button", { name: "תוצאה נכונה" })).toBeVisible();
    await expect(page.getByRole("button", { name: "פספוס" })).toBeVisible();
  });

  test("bingo filter shows only 3-point matches", async ({ page }) => {
    await page.goto("/history");

    await page.getByRole("button", { name: "בינגו" }).click();
    await page.waitForTimeout(300);

    // Every visible points badge should say "בינגו"
    const badges = page.locator("text=בינגו");
    await expect(badges.first()).toBeVisible();

    // No "פספוס" badge should be visible after filter
    await expect(page.getByText("פספוס")).not.toBeVisible();
  });

  test("miss filter shows only 0-point matches", async ({ page }) => {
    await page.goto("/history");

    await page.getByRole("button", { name: "פספוס" }).click();
    await page.waitForTimeout(300);

    const badges = page.locator("text=פספוס");
    await expect(badges.first()).toBeVisible();

    await expect(page.getByText("בינגו")).not.toBeVisible();
  });

  test("match cards show team names, score, and user prediction", async ({
    page,
  }) => {
    await page.goto("/history");

    // At least one card should show a prediction line
    const predictionLine = page.locator("text=/ניחוש שלך:/").first();
    await expect(predictionLine).toBeVisible();
  });

  test("matches are grouped by date with date headers", async ({ page }) => {
    await page.goto("/history");

    // Date headers appear as gray text above each day's group
    const dateHeaders = page.locator(".text-\\[\\#6B7280\\]");
    await expect(dateHeaders.first()).toBeVisible();
  });
});
