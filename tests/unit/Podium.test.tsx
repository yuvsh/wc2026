/**
 * @jest-environment jsdom
 *
 * Unit tests for Podium component (Task 6, Section 6.2).
 *
 * Layout: DOM order is [2nd, 1st, 3rd] (2nd left, 1st centre, 3rd right).
 *
 * Covers:
 * - Names, points, and initials rendered for each podium position
 * - DOM order (2nd → 1st → 3rd)
 * - Current user avatar uses teal background
 * - Other users use dark background
 * - Null entries render a placeholder (no crash)
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import Podium from "@/components/Podium";

const ALICE = { displayName: "Alice Smith", avatarUrl: null, totalPoints: 30, isCurrentUser: false };
const BOB   = { displayName: "Bob Jones",   avatarUrl: null, totalPoints: 20, isCurrentUser: false };
const CAROL = { displayName: "Carol Lee",   avatarUrl: null, totalPoints: 10, isCurrentUser: false };
const ME    = { displayName: "יובל כהן",    avatarUrl: null, totalPoints: 25, isCurrentUser: true  };

// ---------------------------------------------------------------------------
// All three filled
// ---------------------------------------------------------------------------
describe("with all three entries", () => {
  it("renders all three display names", () => {
    render(<Podium first={ALICE} second={BOB} third={CAROL} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("Carol Lee")).toBeInTheDocument();
  });

  it("renders all three point totals", () => {
    render(<Podium first={ALICE} second={BOB} third={CAROL} />);
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders initials in avatar circles", () => {
    render(<Podium first={ALICE} second={BOB} third={CAROL} />);
    expect(screen.getByText("AS")).toBeInTheDocument(); // Alice Smith
    expect(screen.getByText("BJ")).toBeInTheDocument(); // Bob Jones
    expect(screen.getByText("CL")).toBeInTheDocument(); // Carol Lee
  });

  it("DOM order is second → first → third (2nd left, 1st centre, 3rd right)", () => {
    render(<Podium first={ALICE} second={BOB} third={CAROL} />);
    const names = screen
      .getAllByText(/Alice Smith|Bob Jones|Carol Lee/)
      .map((el) => el.textContent);
    // Bob (2nd) appears before Alice (1st) which appears before Carol (3rd)
    expect(names.indexOf("Bob Jones")).toBeLessThan(names.indexOf("Alice Smith"));
    expect(names.indexOf("Alice Smith")).toBeLessThan(names.indexOf("Carol Lee"));
  });
});

// ---------------------------------------------------------------------------
// Current user styling
// ---------------------------------------------------------------------------
describe("current user styling", () => {
  it("current user avatar has teal background", () => {
    render(<Podium first={ME} second={BOB} third={CAROL} />);
    // getByText returns the avatar div itself (initials are its direct text child)
    const avatarDiv = screen.getByText("יכ") as HTMLElement; // יובל כהן
    expect(avatarDiv.className).toContain("bg-[#0D9488]");
  });

  it("non-current user avatar has dark background", () => {
    render(<Podium first={ALICE} second={BOB} third={CAROL} />);
    const avatarDiv = screen.getByText("AS") as HTMLElement;
    expect(avatarDiv.className).toContain("bg-[#1F2937]");
  });
});

// ---------------------------------------------------------------------------
// Null entries
// ---------------------------------------------------------------------------
describe("null entries", () => {
  it("renders without crashing when all entries are null", () => {
    expect(() =>
      render(<Podium first={null} second={null} third={null} />)
    ).not.toThrow();
  });

  it("renders the non-null entry when others are null", () => {
    render(<Podium first={ALICE} second={null} third={null} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("does not render a name for a null entry", () => {
    render(<Podium first={ALICE} second={null} third={null} />);
    // Only Alice's name should be in the document
    expect(screen.queryByText("Bob Jones")).toBeNull();
  });
});
