/**
 * E2E tests for Task 2 — Authentication
 *
 * Test IDs from Tests_v1.0.md Section 6.1:
 * - E2E-AUTH-01: Login screen renders with Google button
 * - E2E-AUTH-02: New user → neighbourhood selection (requires real auth, skipped)
 * - E2E-AUTH-03: Returning user → dashboard (requires real auth, skipped)
 *
 * Also covers Task 2 checklist items:
 * - RTL layout on login screen
 * - Unauthenticated visit to /dashboard redirects to /login
 * - Auth callback with missing/invalid code redirects to /login?error=auth_failed
 *
 * Note: E2E-AUTH-02 and E2E-AUTH-03 require a real Supabase instance with OAuth
 * configured. Run the seed script first: `npx ts-node scripts/seed-staging.ts`
 */

import { test, expect } from "@playwright/test";

test.describe("E2E-AUTH-01 — login screen", () => {
  test("renders the app name and Google sign-in button", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Mundial" })).toBeVisible();
    await expect(page.getByRole("button", { name: /המשך עם Google/i })).toBeVisible();
  });

  test("renders the tagline", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("נחש · תחרה · תנצח")).toBeVisible();
  });

  test("renders the terms of service text", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText(/בהתחברות אתה מסכים/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "תנאי השימוש" })).toBeVisible();
    await expect(page.getByRole("link", { name: "מדיניות הפרטיות" })).toBeVisible();
  });

  test("renders with RTL direction on the html element", async ({ page }) => {
    await page.goto("/login");

    const dir = await page.evaluate(() =>
      document.documentElement.getAttribute("dir")
    );
    expect(dir).toBe("rtl");
  });

  test("has the teal accent bar at the top", async ({ page }) => {
    await page.goto("/login");

    // The accent bar is a fixed div with bg-[#0D9488]
    const accentBar = page.locator("div.fixed.top-0");
    await expect(accentBar).toBeVisible();
  });
});

test.describe("unauthenticated redirect", () => {
  test("visiting /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("visiting / redirects to /login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("visiting /profile redirects to /login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("auth callback route", () => {
  test("missing code param redirects to /login with error", async ({
    page,
  }) => {
    // No ?code= param → callback returns error redirect
    await page.goto("/auth/callback");
    await expect(page).toHaveURL(/\/login\?error=auth_failed/);
  });

  test("invalid code redirects to /login with error", async ({ page }) => {
    // Invalid code → Supabase exchange fails → error redirect
    await page.goto("/auth/callback?code=invalid-code-xyz");
    await expect(page).toHaveURL(/\/login\?error=auth_failed/);
  });
});

// These tests require a real Supabase instance with OAuth configured.
// Run against staging with seed data: `npx ts-node scripts/seed-staging.ts`
test.describe("E2E-AUTH-02 / E2E-AUTH-03 — OAuth redirects", () => {
  test.skip(
    true,
    "Requires real Supabase OAuth — run against staging environment"
  );

  test("E2E-AUTH-02: new user (no neighbourhood) is redirected to /onboarding/neighbourhood after login", async ({
    page,
  }) => {
    // Simulate a fresh OAuth callback for a user with no neighbourhood_id
    // This requires a real OAuth token exchange with Supabase
    await page.goto("/auth/callback?code=REAL_OAUTH_CODE_HERE");
    await expect(page).toHaveURL(/\/onboarding\/neighbourhood/);
  });

  test("E2E-AUTH-03: returning user (has neighbourhood) is redirected to /dashboard after login", async ({
    page,
  }) => {
    // Simulate a returning user's OAuth callback
    await page.goto("/auth/callback?code=REAL_OAUTH_CODE_HERE");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
