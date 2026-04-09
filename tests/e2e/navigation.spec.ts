/**
 * E2E tests for Task 4 — Bottom Navigation & Shell
 *
 * Task 4 checklist items:
 * - Tab bar renders on all screens
 * - Active tab highlights correctly on each screen
 * - Navigation between tabs works
 * - Layout does not break in RTL
 *
 * Tests that require an authenticated session are skipped.
 * Run against staging after: `npx ts-node scripts/seed-staging.ts`
 */

import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Unauthenticated — all app screens redirect to /login (no auth needed)
// ---------------------------------------------------------------------------
test.describe("app shell — unauthenticated redirect", () => {
  const APP_ROUTES = [
    "/dashboard",
    "/leaderboard",
    "/tournament",
    "/history",
    "/profile",
  ];

  for (const route of APP_ROUTES) {
    test(`${route} redirects unauthenticated visitors to /login`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

// ---------------------------------------------------------------------------
// Authenticated — tab bar and navigation (staging only)
// ---------------------------------------------------------------------------
test.describe("bottom tab bar — authenticated", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session — run against staging with seed data"
  );

  const TABS = [
    { href: "/dashboard", label: "ניחושים" },
    { href: "/leaderboard", label: "טבלה" },
    { href: "/tournament", label: "טורניר" },
    { href: "/history", label: "היסטוריה" },
    { href: "/profile", label: "פרופיל" },
  ];

  test("tab bar is visible on /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("navigation")).toBeVisible();
    for (const tab of TABS) {
      await expect(page.getByRole("link", { name: new RegExp(tab.label) })).toBeVisible();
    }
  });

  for (const { href, label } of TABS) {
    test(`navigating to ${href} highlights "${label}" tab in teal`, async ({
      page,
    }) => {
      await page.goto(href);
      const activeLink = page.getByRole("link", { name: new RegExp(label) });
      // Active tab label has teal color (via inline style)
      const color = await activeLink.locator("span").evaluate(
        (el) => getComputedStyle(el).color
      );
      // rgb(13, 148, 136) is #0D9488
      expect(color).toBe("rgb(13, 148, 136)");
    });
  }

  test("clicking each tab navigates to the correct URL", async ({ page }) => {
    await page.goto("/dashboard");

    for (const { href, label } of TABS) {
      await page.getByRole("link", { name: new RegExp(label) }).click();
      await expect(page).toHaveURL(new RegExp(href));
    }
  });

  test("tab bar has RTL-compatible layout (no horizontal overflow)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const nav = page.getByRole("navigation");
    const navBox = await nav.boundingBox();
    const viewport = page.viewportSize();

    // Tab bar spans the full viewport width with no overflow
    expect(navBox?.width).toBeCloseTo(viewport?.width ?? 0, -1);
  });

  test("content area clears tab bar (not hidden behind it)", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    const nav = page.getByRole("navigation");
    const main = page.locator("main");

    const navBox = await nav.boundingBox();
    const mainBox = await main.boundingBox();

    // Main content bottom edge should be at or above the tab bar top edge
    const mainBottom = (mainBox?.y ?? 0) + (mainBox?.height ?? 0);
    expect(mainBottom).toBeLessThanOrEqual((navBox?.y ?? 0) + 1);
  });
});
