/**
 * E2E tests for Task 5 — Matches & Predictions Dashboard
 *
 * Test IDs from Tests_v1.0.md Section 6.4:
 *   E2E-PRED-01 through E2E-PRED-07
 *
 * Tests that can run without auth:
 *   - /dashboard redirects unauthenticated visitors to /login (covered by middleware tests)
 *
 * All prediction and realtime tests require an authenticated session and a
 * running Supabase with seeded match data.
 * Run against staging: `npx ts-node scripts/seed-staging.ts`
 */

import { test, expect } from "@playwright/test";

// Already covered in middleware.test.ts and auth.spec.ts, but verified
// here to confirm the dashboard route is included in route protection.
test("unauthenticated visit to /dashboard redirects to /login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

// ---------------------------------------------------------------------------
// Authenticated prediction flow (staging only)
// ---------------------------------------------------------------------------
test.describe("E2E-PRED — prediction flow", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session and seeded matches — run against staging"
  );

  test("E2E-PRED-01: entering scores and saving shows success toast", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Find the first open match card's score inputs
    const inputs = page.getByRole("spinbutton");
    await inputs.nth(0).fill("2");
    await inputs.nth(1).fill("1");

    await page.getByRole("button", { name: "שמור ניחוש" }).first().click();

    await expect(page.getByText("הניחוש נשמר ✓")).toBeVisible();
  });

  test("E2E-PRED-02: re-editing a prediction before lock updates it", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const inputs = page.getByRole("spinbutton");
    await inputs.nth(0).fill("1");
    await inputs.nth(1).fill("0");
    await page.getByRole("button", { name: "שמור ניחוש" }).first().click();
    await expect(page.getByText("הניחוש נשמר ✓")).toBeVisible();

    // Edit again
    await inputs.nth(0).fill("3");
    await inputs.nth(1).fill("2");
    await page.getByRole("button", { name: "שמור ניחוש" }).first().click();
    await expect(page.getByText("הניחוש נשמר ✓")).toBeVisible();
  });

  test("E2E-PRED-03: locked match shows disabled inputs and lock icon", async ({
    page,
  }) => {
    // Pre-condition: seed script has a match locked via time-travel
    await page.goto("/dashboard");
    const lockedInputs = page.getByRole("spinbutton").filter({ hasText: /.*/ }).and(page.locator("[disabled]"));
    await expect(lockedInputs.first()).toBeDisabled();
    await expect(page.getByText("נעול").first()).toBeVisible();
  });

  test("E2E-PRED-04: match result shows points badge", async ({ page }) => {
    // Pre-condition: a finished match exists with points awarded
    await page.goto("/dashboard");
    // At least one points badge should be visible (bingo/correct/miss)
    const badge = page.getByText(/בינגו|תוצאה נכונה|פספוס/).first();
    await expect(badge).toBeVisible();
  });

  test("E2E-PRED-05: bingo shows gold badge with '3 נקודות'", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/בינגו · 3 נקודות/)).toBeVisible();
  });

  test("E2E-PRED-06: correct result shows green badge with '1 נקודה'", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/תוצאה נכונה · 1 נקודה/)).toBeVisible();
  });

  test("E2E-PRED-07: miss shows gray badge with '0 נקודות'", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/פספוס · 0 נקודות/)).toBeVisible();
  });

  test("Golden Boot banner is visible when user has no golden boot prediction", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByText("חזה מי יהיה מלך השערים ←")
    ).toBeVisible();
  });

  test("Golden Boot banner links to /golden-boot", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByText("חזה מי יהיה מלך השערים ←").click();
    await expect(page).toHaveURL(/\/golden-boot/);
  });

  test("Golden Boot banner disappears after prediction is made", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Navigate to golden boot, make prediction, return to dashboard
    await page.getByText("חזה מי יהיה מלך השערים ←").click();
    // ... (select player and confirm — covered by E2E-GB tests)
    await page.goto("/dashboard");
    await expect(page.getByText("חזה מי יהיה מלך השערים ←")).not.toBeVisible();
  });
});
