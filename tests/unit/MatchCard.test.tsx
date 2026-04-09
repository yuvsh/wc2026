/**
 * @jest-environment jsdom
 *
 * Unit tests for MatchCard component (Task 5, Section 5.1).
 *
 * Three states tested:
 *   open     — scheduled match, not locked, inputs enabled
 *   locked   — isLocked=true or timer expired, inputs disabled
 *   finished — status="finished", shows result + points badge
 *
 * useCountdown is mocked so rendering is deterministic.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchCard, { type MatchCardProps } from "@/components/MatchCard";

jest.mock("@/hooks/useCountdown", () => ({
  useCountdown: jest.fn(),
}));

import { useCountdown } from "@/hooks/useCountdown";

const mockUseCountdown = jest.mocked(useCountdown);

// Shared countdown return values
const OPEN_COUNTDOWN = { display: "00:25:00", isUnderOneHour: false, isLocked: false };
const LOCKED_COUNTDOWN = { display: "נעול", isUnderOneHour: true, isLocked: true };

function makeProps(overrides: Partial<MatchCardProps> = {}): MatchCardProps {
  return {
    matchId: "match-1",
    teamA: "ישראל",
    teamB: "ברזיל",
    teamACode: "il",
    teamBCode: "br",
    kickoffAt: new Date("2026-06-15T18:00:00Z"),
    status: "scheduled",
    scoreA: null,
    scoreB: null,
    predictedA: null,
    predictedB: null,
    pointsAwarded: null,
    isLocked: false,
    onSave: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

beforeEach(() => {
  mockUseCountdown.mockReturnValue(OPEN_COUNTDOWN);
});

// ---------------------------------------------------------------------------
// Open state
// ---------------------------------------------------------------------------
describe("open state (scheduled, not locked)", () => {
  it("renders both team names", () => {
    render(<MatchCard {...makeProps()} />);
    expect(screen.getByText("ישראל")).toBeInTheDocument();
    expect(screen.getByText("ברזיל")).toBeInTheDocument();
  });

  it("renders two enabled score inputs", () => {
    render(<MatchCard {...makeProps()} />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(input).toBeEnabled());
  });

  it("renders the save button disabled when inputs are empty", () => {
    render(<MatchCard {...makeProps()} />);
    expect(screen.getByRole("button", { name: "שמור ניחוש" })).toBeDisabled();
  });

  it("renders the save button enabled after both scores are entered", () => {
    render(<MatchCard {...makeProps()} />);
    const [inputA, inputB] = screen.getAllByRole("spinbutton");
    fireEvent.change(inputA, { target: { value: "2" } });
    fireEvent.change(inputB, { target: { value: "1" } });
    expect(screen.getByRole("button", { name: "שמור ניחוש" })).toBeEnabled();
  });

  it("pre-fills inputs with existing prediction values", () => {
    render(<MatchCard {...makeProps({ predictedA: 2, predictedB: 0 })} />);
    const [inputA, inputB] = screen.getAllByRole("spinbutton");
    expect(inputA).toHaveValue(2);
    expect(inputB).toHaveValue(0);
  });

  it("shows the countdown timer", () => {
    render(<MatchCard {...makeProps()} />);
    expect(screen.getByText(/00:25:00/)).toBeInTheDocument();
  });

  it("calls onSave with match id and scores when save button is clicked", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    render(<MatchCard {...makeProps({ onSave })} />);

    const [inputA, inputB] = screen.getAllByRole("spinbutton");
    fireEvent.change(inputA, { target: { value: "3" } });
    fireEvent.change(inputB, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "שמור ניחוש" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("match-1", 3, 1);
    });
  });
});

// ---------------------------------------------------------------------------
// Locked state — via isLocked prop
// ---------------------------------------------------------------------------
describe("locked state (isLocked prop)", () => {
  it("disables both score inputs", () => {
    render(<MatchCard {...makeProps({ isLocked: true })} />);
    const inputs = screen.getAllByRole("spinbutton");
    inputs.forEach((input) => expect(input).toBeDisabled());
  });

  it("hides the save button", () => {
    render(<MatchCard {...makeProps({ isLocked: true })} />);
    expect(screen.queryByRole("button", { name: "שמור ניחוש" })).toBeNull();
  });

  it("shows the lock indicator", () => {
    render(<MatchCard {...makeProps({ isLocked: true })} />);
    expect(screen.getByText("נעול")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Locked state — via countdown timer
// ---------------------------------------------------------------------------
describe("locked state (countdown timer expired)", () => {
  beforeEach(() => {
    mockUseCountdown.mockReturnValue(LOCKED_COUNTDOWN);
  });

  it("disables inputs and shows 'נעול' when timer is locked", () => {
    render(<MatchCard {...makeProps()} />);
    const inputs = screen.getAllByRole("spinbutton");
    inputs.forEach((input) => expect(input).toBeDisabled());
    expect(screen.getByText("נעול")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Finished state
// ---------------------------------------------------------------------------
describe("finished state", () => {
  const finishedProps = makeProps({
    status: "finished",
    scoreA: 2,
    scoreB: 1,
    predictedA: 2,
    predictedB: 1,
    pointsAwarded: 3,
  });

  it("shows the actual result score values", () => {
    render(<MatchCard {...finishedProps} />);
    // Score values are rendered in dark boxes (not inputs)
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not render score inputs", () => {
    render(<MatchCard {...finishedProps} />);
    expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);
  });

  it("shows the bingo badge for 3 points", () => {
    render(<MatchCard {...finishedProps} />);
    expect(screen.getByText(/בינגו/)).toBeInTheDocument();
  });

  it("shows the correct badge for 1 point", () => {
    render(<MatchCard {...makeProps({ status: "finished", scoreA: 2, scoreB: 1, predictedA: 3, predictedB: 1, pointsAwarded: 1 })} />);
    expect(screen.getByText(/תוצאה נכונה/)).toBeInTheDocument();
  });

  it("shows the miss badge for 0 points", () => {
    render(<MatchCard {...makeProps({ status: "finished", scoreA: 2, scoreB: 0, predictedA: 0, predictedB: 1, pointsAwarded: 0 })} />);
    expect(screen.getByText(/פספוס/)).toBeInTheDocument();
  });

  it("shows the user's prediction text", () => {
    render(<MatchCard {...finishedProps} />);
    expect(screen.getByText(/ניחוש שלך: 2–1/)).toBeInTheDocument();
  });

  it("shows pending label when points_awarded is null (not yet scored)", () => {
    render(<MatchCard {...makeProps({ status: "finished", scoreA: 2, scoreB: 1, pointsAwarded: null })} />);
    expect(screen.getByText("ממתין לתוצאה")).toBeInTheDocument();
  });

  it("does not show prediction text when user has no prediction", () => {
    render(<MatchCard {...makeProps({ status: "finished", scoreA: 2, scoreB: 1, predictedA: null, predictedB: null, pointsAwarded: 0 })} />);
    expect(screen.queryByText(/ניחוש שלך/)).toBeNull();
  });
});
