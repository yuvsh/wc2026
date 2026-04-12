/**
 * @jest-environment jsdom
 *
 * Unit tests for HistoryStatsBar component (Task 7, Section 7.1).
 *
 * Covers: all 5 stat values and labels render correctly.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import HistoryStatsBar from "@/components/HistoryStatsBar";

function renderBar(overrides: Partial<React.ComponentProps<typeof HistoryStatsBar>> = {}): void {
  render(
    <HistoryStatsBar
      matches={overrides.matches ?? 0}
      points={overrides.points ?? 0}
      bingo={overrides.bingo ?? 0}
      correct={overrides.correct ?? 0}
      miss={overrides.miss ?? 0}
    />
  );
}

describe("HistoryStatsBar — labels", () => {
  it("renders the 'משחקים' label", () => {
    renderBar();
    expect(screen.getByText("משחקים")).toBeInTheDocument();
  });

  it("renders the 'נקודות' label", () => {
    renderBar();
    expect(screen.getByText("נקודות")).toBeInTheDocument();
  });

  it("renders the 'בינגו' label", () => {
    renderBar();
    expect(screen.getByText("בינגו")).toBeInTheDocument();
  });

  it("renders the 'נכון' label", () => {
    renderBar();
    expect(screen.getByText("נכון")).toBeInTheDocument();
  });

  it("renders the 'פספוס' label", () => {
    renderBar();
    expect(screen.getByText("פספוס")).toBeInTheDocument();
  });
});

describe("HistoryStatsBar — values", () => {
  it("displays the matches count", () => {
    renderBar({ matches: 8 });
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("displays the total points", () => {
    renderBar({ points: 17 });
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("displays the bingo count", () => {
    renderBar({ bingo: 3 });
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays correct count", () => {
    renderBar({ correct: 2 });
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays miss count", () => {
    renderBar({ miss: 4 });
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("all five values render with realistic data", () => {
    renderBar({ matches: 8, points: 15, bingo: 4, correct: 3, miss: 1 });
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
