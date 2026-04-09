/**
 * E2E tests for Task 3 — Onboarding (Neighbourhood + League)
 *
 * Test IDs from Tests_v1.0.md:
 *   Section 6.2 — E2E-HOOD-01 through E2E-HOOD-04
 *   Section 6.3 — E2E-LEAGUE-01 through E2E-LEAGUE-06
 *
 * Tests that require an authenticated Supabase session are skipped here
 * and must be run against the staging environment after running the seed
 * script: `npx ts-node scripts/seed-staging.ts`
 *
 * What runs without real auth:
 * - Onboarding pages redirect unauthenticated visitors to /login
 */

import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Unauthenticated redirects — no Supabase session needed
// ---------------------------------------------------------------------------
test.describe("onboarding — unauthenticated redirect", () => {
  test("visiting /onboarding/neighbourhood redirects to /login", async ({
    page,
  }) => {
    await page.goto("/onboarding/neighbourhood");
    await expect(page).toHaveURL(/\/login/);
  });

  test("visiting /onboarding/league redirects to /login", async ({ page }) => {
    await page.goto("/onboarding/league");
    await expect(page).toHaveURL(/\/login/);
  });

  test("visiting /onboarding/create-league redirects to /login", async ({
    page,
  }) => {
    await page.goto("/onboarding/create-league");
    await expect(page).toHaveURL(/\/login/);
  });
});

// ---------------------------------------------------------------------------
// Neighbourhood selection — require authenticated session (staging only)
// ---------------------------------------------------------------------------
test.describe("E2E-HOOD-01 / E2E-HOOD-02 / E2E-HOOD-03 — neighbourhood selection", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session — run against staging with seed data"
  );

  test("E2E-HOOD-01: neighbourhood grid renders for a new user", async ({
    page,
  }) => {
    // Pre-condition: authenticated as a new user (no neighbourhood_id)
    await page.goto("/onboarding/neighbourhood");
    await expect(page.getByRole("heading", { name: "באיזו שכונה אתה גר?" })).toBeVisible();
    // Grid should contain at least one neighbourhood card
    const cards = page.getByRole("button").filter({ hasNotText: /המשך|דלג/ });
    await expect(cards.first()).toBeVisible();
  });

  test("E2E-HOOD-02: selecting a neighbourhood highlights the card and enables Continue", async ({
    page,
  }) => {
    await page.goto("/onboarding/neighbourhood");
    const continueBtn = page.getByRole("button", { name: "המשך" });

    // Continue is disabled before selection
    await expect(continueBtn).toBeDisabled();

    // Click the first neighbourhood card
    const firstCard = page.getByRole("button").filter({ hasNotText: /המשך|דלג/ }).first();
    await firstCard.click();

    // Continue should now be enabled
    await expect(continueBtn).toBeEnabled();

    // Selected card should have the teal border class
    await expect(firstCard).toHaveClass(/border-\[#0D9488\]/);
  });

  test("E2E-HOOD-03: skipping neighbourhood redirects to /onboarding/league without saving", async ({
    page,
  }) => {
    await page.goto("/onboarding/neighbourhood");
    await page.getByRole("button", { name: /דלג/ }).click();
    await expect(page).toHaveURL(/\/onboarding\/league/);
  });
});

// ---------------------------------------------------------------------------
// League creation — require authenticated session (staging only)
// ---------------------------------------------------------------------------
test.describe("E2E-LEAGUE-01 / E2E-LEAGUE-02 / E2E-LEAGUE-03 — create league", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session — run against staging with seed data"
  );

  test("E2E-LEAGUE-01: creating a league shows invite code screen with 6-char code", async ({
    page,
  }) => {
    await page.goto("/onboarding/create-league");
    await page.getByPlaceholder(/ליגת רביבים/i).fill("ליגת הבדיקה");
    await page.getByRole("button", { name: "צור ליגה" }).click();

    // Invite code screen should appear
    await expect(page.getByText("הליגה שלך נוצרה!")).toBeVisible();

    // The displayed code must be exactly 6 uppercase alphanumeric characters
    const codeEl = page.locator("p.font-mono");
    const code = await codeEl.textContent();
    expect(code?.trim()).toMatch(/^[A-Z0-9]{6}$/);
  });

  test("E2E-LEAGUE-02: WhatsApp share button opens wa.me deep link with invite code", async ({
    page,
  }) => {
    await page.goto("/onboarding/create-league");
    await page.getByPlaceholder(/ליגת רביבים/i).fill("ליגת הבדיקה");
    await page.getByRole("button", { name: "צור ליגה" }).click();
    await expect(page.getByText("הליגה שלך נוצרה!")).toBeVisible();

    const codeEl = page.locator("p.font-mono");
    const code = (await codeEl.textContent())?.trim() ?? "";

    // Intercept window.open to capture the WhatsApp URL
    let capturedUrl = "";
    await page.exposeFunction("captureOpen", (url: string) => {
      capturedUrl = url;
    });
    await page.evaluate(() => {
      window.open = (url: string | URL | undefined) => {
        if (typeof url === "string") (window as unknown as { captureOpen: (u: string) => void }).captureOpen(url);
        return null;
      };
    });

    await page.getByRole("button", { name: /שתף בוואטסאפ/ }).click();

    expect(capturedUrl).toContain("wa.me");
    expect(capturedUrl).toContain(code);
  });

  test("E2E-LEAGUE-03: copy button writes code to clipboard and shows confirmation", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/onboarding/create-league");
    await page.getByPlaceholder(/ליגת רביבים/i).fill("ליגת הבדיקה");
    await page.getByRole("button", { name: "צור ליגה" }).click();
    await expect(page.getByText("הליגה שלך נוצרה!")).toBeVisible();

    const codeEl = page.locator("p.font-mono");
    const code = (await codeEl.textContent())?.trim() ?? "";

    const copyBtn = page.getByRole("button", { name: "העתק קוד" });
    await copyBtn.click();

    // Button label changes to "הועתק!"
    await expect(page.getByRole("button", { name: "הועתק!" })).toBeVisible();

    // Clipboard contains the code
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toBe(code);
  });
});

// ---------------------------------------------------------------------------
// Joining a league — require authenticated session (staging only)
// ---------------------------------------------------------------------------
test.describe("E2E-LEAGUE-04 / E2E-LEAGUE-05 — join league", () => {
  test.skip(
    true,
    "Requires authenticated Supabase session and seeded leagues — run against staging"
  );

  test("E2E-LEAGUE-04: joining with valid code redirects to /dashboard", async ({
    page,
  }) => {
    await page.goto("/onboarding/league");
    // TESTA1 is a league created by the seed script
    await page.getByPlaceholder(/הכנס קוד/i).fill("TESTA1");
    await page.getByRole("button", { name: "הצטרף" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("E2E-LEAGUE-05: joining with invalid code shows Hebrew error", async ({
    page,
  }) => {
    await page.goto("/onboarding/league");

    // Too short — client-side validation fires before any DB call
    await page.getByPlaceholder(/הכנס קוד/i).fill("ABC");
    await page.getByRole("button", { name: "הצטרף" }).click();
    await expect(page.getByText("קוד לא תקין, נסה שוב")).toBeVisible();
  });

  test("E2E-LEAGUE-05b: joining with non-existent 6-char code shows Hebrew error", async ({
    page,
  }) => {
    await page.goto("/onboarding/league");
    await page.getByPlaceholder(/הכנס קוד/i).fill("ZZZZZZ");
    await page.getByRole("button", { name: "הצטרף" }).click();
    await expect(page.getByText("קוד לא תקין, נסה שוב")).toBeVisible();
  });
});
