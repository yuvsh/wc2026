/**
 * E2E tests for Task 6 — Leaderboard
 *
 * Test IDs from Tests_v1.0.md Section 6.5:
 *   E2E-LB-01 through E2E-LB-04
 *
 * Tests that can run without auth:
 *   - /leaderboard redirects unauthenticated visitors to /login
 *
 * All leaderboard content tests require an authenticated session and seeded
 * league data. Run against staging: `npx ts-node scripts/seed-staging.ts`
 */

import { test, expect } from "@playwright/test";

test("unauthenticated visit to /leaderboard redirects to /login", async ({
  page,
}) => {
  await page.goto("/leaderboard");
  await expect(page).toHaveURL(/\/login/);
});

test.describe("E2E-LB — leaderboard content", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session and seeded leagues — run against staging"
  );

  test("E2E-LB-01: leaderboard shows all league members ranked by points", async ({
    page,
  }) => {
    await page.goto("/leaderboard");

    // All 5 seed users should appear
    await expect(page.getByText("Alice")).toBeVisible();
    await expect(page.getByText("Bob")).toBeVisible();
    await expect(page.getByText("Carol")).toBeVisible();

    // Rows should be ordered by points descending
    const rows = page.locator("[data-testid='leaderboard-row']");
    const pointValues = await rows.evaluateAll((els) =>
      els.map((el) => Number(el.querySelector(".points")?.textContent ?? 0))
    );
    for (let i = 1; i < pointValues.length; i++) {
      expect(pointValues[i]).toBeLessThanOrEqual(pointValues[i - 1]);
    }
  });

  test("E2E-LB-02: current user row has teal highlight", async ({ page }) => {
    await page.goto("/leaderboard");
    // The row for the logged-in user should have teal background
    const currentRow = page.locator(".bg-\\[\\#F0FDFA\\]");
    await expect(currentRow).toBeVisible();
    await expect(currentRow.getByText("אתה")).toBeVisible();
  });

  test("E2E-LB-03: switching league tabs updates the leaderboard", async ({
    page,
  }) => {
    await page.goto("/leaderboard");

    // Two seed leagues exist — both tabs should be visible
    const alphaTab = page.getByRole("button", { name: "Test League Alpha" });
    const betaTab = page.getByRole("button", { name: "Test League Beta" });

    await expect(alphaTab).toBeVisible();
    await expect(betaTab).toBeVisible();

    // Switch to second league and verify members update
    await betaTab.click();
    // Beta league has different membership — wait for re-render
    await page.waitForTimeout(500);
    // The active tab should now be Beta
    await expect(betaTab).toHaveClass(/bg-\[#0D9488\]/);
  });

  test("E2E-LB-04: neighbourhood tab is visible but disabled with 'בקרוב' label", async ({
    page,
  }) => {
    await page.goto("/leaderboard");
    const hoodTab = page.getByRole("button", { name: /שכונות/ });
    await expect(hoodTab).toBeVisible();
    await expect(hoodTab).toBeDisabled();
    await expect(page.getByText("בקרוב")).toBeVisible();
  });

  test("podium renders for leagues with 3 or more members", async ({
    page,
  }) => {
    await page.goto("/leaderboard");
    // Podium renders medal emojis for top 3
    await expect(page.getByText("🥇")).toBeVisible();
    await expect(page.getByText("🥈")).toBeVisible();
    await expect(page.getByText("🥉")).toBeVisible();
  });
});
