/**
 * @jest-environment jsdom
 *
 * Unit tests for LeaderboardRow component (Task 6, Section 6.1).
 *
 * Covers:
 * - Position number rendered
 * - Position colours: gold (1), silver (2), bronze (3), gray (4+)
 * - Current user: teal background, teal avatar, "אתה" badge, teal points
 * - Other users: white background, gray avatar, no badge
 * - Avatar: shows Google profile photo when avatarUrl is provided; falls back to initials
 * - All tests below pass avatarUrl=null to exercise the initials fallback path
 * - Neighbourhood name shown/hidden
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import LeaderboardRow from "@/components/LeaderboardRow";

interface Props {
  position?: number;
  displayName?: string;
  neighbourhoodName?: string | null;
  totalPoints?: number;
  isCurrentUser?: boolean;
}

function renderRow(overrides: Props = {}): ReturnType<typeof render> {
  return render(
    <LeaderboardRow
      position={overrides.position ?? 1}
      displayName={overrides.displayName ?? "Alice Smith"}
      avatarUrl={null}
      neighbourhoodName={overrides.neighbourhoodName ?? null}
      totalPoints={overrides.totalPoints ?? 10}
      isCurrentUser={overrides.isCurrentUser ?? false}
    />
  );
}

// ---------------------------------------------------------------------------
// Core content
// ---------------------------------------------------------------------------
describe("content", () => {
  it("renders the position number", () => {
    renderRow({ position: 4 });
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders the display name", () => {
    renderRow({ displayName: "יובל כהן" });
    expect(screen.getByText("יובל כהן")).toBeInTheDocument();
  });

  it("renders total points", () => {
    renderRow({ totalPoints: 42 });
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders neighbourhood name when provided", () => {
    renderRow({ neighbourhoodName: "צפון" });
    expect(screen.getByText("צפון")).toBeInTheDocument();
  });

  it("omits neighbourhood row when null", () => {
    renderRow({ neighbourhoodName: null });
    expect(screen.queryByText("צפון")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Avatar initials
// ---------------------------------------------------------------------------
describe("avatar initials", () => {
  it("shows first + last initial for two-word names", () => {
    renderRow({ displayName: "Alice Smith" });
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("shows first 2 chars for single-word names", () => {
    renderRow({ displayName: "Alice" });
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Position colours
// ---------------------------------------------------------------------------
describe("position label colours", () => {
  it("applies gold class for position 1", () => {
    renderRow({ position: 1 });
    const posSpan = screen.getByText("1");
    expect(posSpan.className).toContain("text-[#EF9F27]");
  });

  it("applies silver class for position 2", () => {
    renderRow({ position: 2 });
    const posSpan = screen.getByText("2");
    expect(posSpan.className).toContain("text-[#9CA3AF]");
  });

  it("applies bronze class for position 3", () => {
    renderRow({ position: 3 });
    const posSpan = screen.getByText("3");
    expect(posSpan.className).toContain("text-[#BA7517]");
  });

  it("applies normal gray class for position 4", () => {
    renderRow({ position: 4, totalPoints: 99 });
    expect(screen.getByText("4").className).toContain("text-[#6B7280]");
  });

  it("applies normal gray class for position 10", () => {
    renderRow({ position: 10, totalPoints: 99 });
    expect(screen.getByText("10").className).toContain("text-[#6B7280]");
  });
});

// ---------------------------------------------------------------------------
// Current user
// ---------------------------------------------------------------------------
describe("current user row", () => {
  it("shows the 'אתה' badge", () => {
    renderRow({ isCurrentUser: true });
    expect(screen.getByText("אתה")).toBeInTheDocument();
  });

  it("does not show 'אתה' for other users", () => {
    renderRow({ isCurrentUser: false });
    expect(screen.queryByText("אתה")).toBeNull();
  });

  it("applies teal background class to current user row", () => {
    const { container } = renderRow({ isCurrentUser: true });
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("bg-[#F0FDFA]");
    expect(row.className).toContain("border-[#2DD4BF]");
  });

  it("applies white background to non-current user row", () => {
    const { container } = renderRow({ isCurrentUser: false });
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("bg-white");
    expect(row.className).toContain("border-[#E5E7EB]");
  });

  it("points are teal for current user", () => {
    renderRow({ isCurrentUser: true, totalPoints: 15 });
    const points = screen.getByText("15");
    expect(points.className).toContain("text-[#0D9488]");
  });

  it("points are dark for other users", () => {
    renderRow({ isCurrentUser: false, totalPoints: 15 });
    const points = screen.getByText("15");
    expect(points.className).toContain("text-[#111827]");
  });
});
