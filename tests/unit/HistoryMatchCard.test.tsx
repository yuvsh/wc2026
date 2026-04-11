/**
 * @jest-environment jsdom
 *
 * Unit tests for HistoryMatchCard component (Task 7, Section 7.3).
 *
 * Covers:
 * - Team names rendered
 * - Actual result scores shown in dark boxes
 * - Points badge (bingo / correct / miss)
 * - User prediction text
 * - Right border accent colour per result type
 * - Date string rendered
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import HistoryMatchCard from "@/components/HistoryMatchCard";

type Props = React.ComponentProps<typeof HistoryMatchCard>;

// Fixed date so date-formatting tests are deterministic
const KICKOFF = new Date("2026-06-15T18:00:00.000Z");

function makeProps(overrides: Partial<Props> = {}): Props {
  return {
    teamA: "ישראל",
    teamB: "ברזיל",
    teamACode: "il",
    teamBCode: "br",
    scoreA: 2,
    scoreB: 1,
    predictedA: 2,
    predictedB: 1,
    pointsAwarded: 3,
    kickoffAt: KICKOFF,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Teams and scores
// ---------------------------------------------------------------------------
describe("teams and result", () => {
  it("renders team A name", () => {
    render(<HistoryMatchCard {...makeProps()} />);
    expect(screen.getByText("ישראל")).toBeInTheDocument();
  });

  it("renders team B name", () => {
    render(<HistoryMatchCard {...makeProps()} />);
    expect(screen.getByText("ברזיל")).toBeInTheDocument();
  });

  it("renders scoreA in the result", () => {
    render(<HistoryMatchCard {...makeProps({ scoreA: 3, scoreB: 0 })} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders scoreB in the result", () => {
    render(<HistoryMatchCard {...makeProps({ scoreA: 3, scoreB: 0 })} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Points badges
// ---------------------------------------------------------------------------
describe("points badge", () => {
  it("shows bingo badge for 3 points", () => {
    render(<HistoryMatchCard {...makeProps({ pointsAwarded: 3 })} />);
    expect(screen.getByText(/בינגו/)).toBeInTheDocument();
  });

  it("shows correct badge for 1 point", () => {
    render(<HistoryMatchCard {...makeProps({ pointsAwarded: 1 })} />);
    expect(screen.getByText(/תוצאה נכונה/)).toBeInTheDocument();
  });

  it("shows miss badge for 0 points", () => {
    render(<HistoryMatchCard {...makeProps({ pointsAwarded: 0 })} />);
    expect(screen.getByText(/פספוס/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Prediction text
// ---------------------------------------------------------------------------
describe("prediction text", () => {
  it("shows the user's prediction in 'ניחוש שלך: A–B' format", () => {
    render(<HistoryMatchCard {...makeProps({ predictedA: 2, predictedB: 1 })} />);
    expect(screen.getByText("ניחוש שלך: 2–1")).toBeInTheDocument();
  });

  it("shows prediction even when it differs from the result (miss)", () => {
    render(
      <HistoryMatchCard
        {...makeProps({ scoreA: 2, scoreB: 0, predictedA: 0, predictedB: 1, pointsAwarded: 0 })}
      />
    );
    expect(screen.getByText("ניחוש שלך: 0–1")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Border accent
// ---------------------------------------------------------------------------
describe("right border accent", () => {
  it("applies gold border for bingo", () => {
    const { container } = render(<HistoryMatchCard {...makeProps({ pointsAwarded: 3 })} />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "border-r-[#EF9F27]"
    );
  });

  it("applies green border for correct result", () => {
    const { container } = render(<HistoryMatchCard {...makeProps({ pointsAwarded: 1 })} />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "border-r-[#22C55E]"
    );
  });

  it("applies gray border for miss", () => {
    const { container } = render(<HistoryMatchCard {...makeProps({ pointsAwarded: 0 })} />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "border-r-[#6B7280]"
    );
  });
});

// ---------------------------------------------------------------------------
// Date
// ---------------------------------------------------------------------------
describe("date display", () => {
  it("renders a date string", () => {
    render(<HistoryMatchCard {...makeProps()} />);
    // The date is locale-formatted — just verify something date-like appears
    // (day and month digits separated by a dot or slash)
    // Target the date span specifically — it has both text-[13px] and text-[#9CA3AF]
    const dateEl = document.querySelector(".text-\\[13px\\].text-\\[\\#9CA3AF\\]");
    expect(dateEl).not.toBeNull();
    expect(dateEl!.textContent).toMatch(/\d/);
  });
});
