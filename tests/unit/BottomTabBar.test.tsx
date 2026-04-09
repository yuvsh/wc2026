/**
 * @jest-environment jsdom
 *
 * Unit tests for Task 4 — BottomTabBar component.
 *
 * Covers Task 4 checklist:
 * - Tab bar renders all 5 tabs with correct labels
 * - Each tab links to the correct href
 * - Active tab is highlighted in teal (#0D9488)
 * - Inactive tabs are in gray (#6B7280)
 * - Active detection works for sub-paths (startsWith semantics)
 * - No tab is active on an unrelated path
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import BottomTabBar from "@/components/BottomTabBar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = jest.mocked(usePathname);

const TEAL = "#0D9488";
const GRAY = "#6B7280";

const ALL_TABS = [
  { href: "/dashboard", label: "ניחושים" },
  { href: "/leaderboard", label: "טבלה" },
  { href: "/tournament", label: "טורניר" },
  { href: "/history", label: "היסטוריה" },
  { href: "/profile", label: "פרופיל" },
];

beforeEach(() => {
  mockUsePathname.mockReturnValue("/dashboard");
});

// ---------------------------------------------------------------------------
// Structure
// ---------------------------------------------------------------------------
describe("renders all tabs", () => {
  it("renders exactly 5 navigation links", () => {
    render(<BottomTabBar />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it.each(ALL_TABS)('renders the "$label" tab label', ({ label }) => {
    render(<BottomTabBar />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each(ALL_TABS)('$label tab links to "$href"', ({ href, label }) => {
    render(<BottomTabBar />);
    const link = screen.getByRole("link", { name: new RegExp(label) });
    expect(link).toHaveAttribute("href", href);
  });

  it("renders inside a <nav> element", () => {
    render(<BottomTabBar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Active tab — direct path match
// ---------------------------------------------------------------------------
describe("active tab highlighting", () => {
  it.each(ALL_TABS)(
    '$label tab label is teal when pathname is "$href"',
    ({ href, label }) => {
      mockUsePathname.mockReturnValue(href);
      render(<BottomTabBar />);
      expect(screen.getByText(label)).toHaveStyle({ color: TEAL });
    }
  );

  it.each(ALL_TABS)(
    'all other tab labels are gray when "$label" is active',
    ({ href }) => {
      mockUsePathname.mockReturnValue(href);
      render(<BottomTabBar />);
      const inactive = ALL_TABS.filter((t) => t.href !== href);
      for (const tab of inactive) {
        expect(screen.getByText(tab.label)).toHaveStyle({ color: GRAY });
      }
    }
  );
});

// ---------------------------------------------------------------------------
// Active tab — sub-path match (startsWith semantics)
// ---------------------------------------------------------------------------
describe("active tab on sub-paths", () => {
  it.each(ALL_TABS)(
    '$label tab stays teal on a sub-path of "$href"',
    ({ href, label }) => {
      mockUsePathname.mockReturnValue(`${href}/nested`);
      render(<BottomTabBar />);
      expect(screen.getByText(label)).toHaveStyle({ color: TEAL });
    }
  );
});

// ---------------------------------------------------------------------------
// No active tab on an unrelated path
// ---------------------------------------------------------------------------
describe("no active tab on unrelated path", () => {
  it("all tab labels are gray on an unknown path", () => {
    mockUsePathname.mockReturnValue("/some-unknown-route");
    render(<BottomTabBar />);
    for (const tab of ALL_TABS) {
      expect(screen.getByText(tab.label)).toHaveStyle({ color: GRAY });
    }
  });
});
