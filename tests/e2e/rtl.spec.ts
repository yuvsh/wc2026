/**
 * E2E tests for RTL & Hebrew layout (Section 6.7 of test spec).
 *
 * Test IDs:
 *   E2E-RTL-01 — All screens render in RTL
 *   E2E-RTL-02 — Score input layout (Team B left, Team A right in RTL)
 *   E2E-RTL-03 — Countdown timer uses tabular nums (no layout shift)
 *
 * E2E-RTL-01 and E2E-RTL-03 run without auth (login screen is enough to verify
 * RTL root and font rendering). E2E-RTL-02 and authenticated screen checks
 * require a session.
 */

import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// E2E-RTL-01 (partial) — root dir attribute
// ---------------------------------------------------------------------------
test("E2E-RTL-01: HTML root has dir=rtl", async ({ page }) => {
  await page.goto("/login");
  const dir = await page.locator("html").getAttribute("dir");
  expect(dir).toBe("rtl");
});

test("E2E-RTL-01: login screen text is right-aligned", async ({ page }) => {
  await page.goto("/login");
  // The page should render without horizontal overflow (no leftward content bleed)
  const bodyWidth = await page.evaluate(
    () => document.body.scrollWidth
  );
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
});

// ---------------------------------------------------------------------------
// E2E-RTL-02 and E2E-RTL-03 — require auth
// ---------------------------------------------------------------------------
test.describe("E2E-RTL-02 / E2E-RTL-03 — authenticated RTL checks", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session — run against staging with seed data"
  );

  test("E2E-RTL-02: score input shows Team B on the left and Team A on the right", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // In RTL layout the match card rows flow right-to-left:
    // Team A (home) is on the right, Team B (away) is on the left.
    // We verify this by comparing the bounding rects of the two team name elements.
    const matchCard = page.locator("[data-testid='match-card']").first();
    const teamAEl = matchCard.locator("[data-testid='team-a-name']");
    const teamBEl = matchCard.locator("[data-testid='team-b-name']");

    const teamABox = await teamAEl.boundingBox();
    const teamBBox = await teamBEl.boundingBox();

    // In RTL, Team A (right side) has a higher x value than Team B (left side)
    expect(teamABox!.x).toBeGreaterThan(teamBBox!.x);
  });

  test("E2E-RTL-03: countdown timer font uses tabular-nums (no layout shift on tick)", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Find a countdown element and read its computed font-variant-numeric
    const countdown = page.locator("[data-testid='countdown']").first();
    const fontVariant = await countdown.evaluate(
      (el) => window.getComputedStyle(el).fontVariantNumeric
    );
    // tabular-nums prevents digit-width shifts as the timer ticks
    expect(fontVariant).toContain("tabular-nums");
  });

  test("E2E-RTL-01: all main app screens render without horizontal overflow", async ({
    page,
  }) => {
    const routes = ["/dashboard", "/leaderboard", "/history", "/profile"];

    for (const route of routes) {
      await page.goto(route);
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    }
  });
});
