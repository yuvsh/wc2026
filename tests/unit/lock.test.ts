/**
 * Unit tests for prediction lock logic (Section 4.2 of test spec).
 *
 * Covers:
 * - Lock fires when kickoff is within 5 minutes (T-5)
 * - Lock does NOT fire when kickoff is more than 5 minutes away
 * - Lock is idempotent — already-locked predictions stay locked
 * - Post-lock: canSubmitPrediction returns false when locked
 */

import { shouldLockMatch, canSubmitPrediction } from "@/lib/utils/lock";

const MIN = 60 * 1000; // ms

function kickoffInMinutes(minutes: number): { kickoffAt: Date; now: Date } {
  const now = new Date("2026-06-11T18:00:00.000Z");
  const kickoffAt = new Date(now.getTime() + minutes * MIN);
  return { kickoffAt, now };
}

// ---------------------------------------------------------------------------
// shouldLockMatch
// ---------------------------------------------------------------------------
describe("shouldLockMatch — lock window boundary", () => {
  it("locks when kickoff is exactly 5 minutes away", () => {
    const { kickoffAt, now } = kickoffInMinutes(5);
    expect(shouldLockMatch(kickoffAt, now)).toBe(true);
  });

  it("locks when kickoff is 4 minutes away (inside window)", () => {
    const { kickoffAt, now } = kickoffInMinutes(4);
    expect(shouldLockMatch(kickoffAt, now)).toBe(true);
  });

  it("locks when kickoff is 1 minute away", () => {
    const { kickoffAt, now } = kickoffInMinutes(1);
    expect(shouldLockMatch(kickoffAt, now)).toBe(true);
  });

  it("locks when kickoff has already passed", () => {
    const { kickoffAt, now } = kickoffInMinutes(-10);
    expect(shouldLockMatch(kickoffAt, now)).toBe(true);
  });

  it("does NOT lock when kickoff is 6 minutes away (outside window)", () => {
    const { kickoffAt, now } = kickoffInMinutes(6);
    expect(shouldLockMatch(kickoffAt, now)).toBe(false);
  });

  it("does NOT lock when kickoff is 10 minutes away", () => {
    const { kickoffAt, now } = kickoffInMinutes(10);
    expect(shouldLockMatch(kickoffAt, now)).toBe(false);
  });

  it("does NOT lock when kickoff is 60 minutes away", () => {
    const { kickoffAt, now } = kickoffInMinutes(60);
    expect(shouldLockMatch(kickoffAt, now)).toBe(false);
  });
});

describe("shouldLockMatch — idempotency", () => {
  it("calling shouldLockMatch multiple times with same inputs returns the same result", () => {
    const { kickoffAt, now } = kickoffInMinutes(4);
    const first = shouldLockMatch(kickoffAt, now);
    const second = shouldLockMatch(kickoffAt, now);
    const third = shouldLockMatch(kickoffAt, now);
    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(third).toBe(true);
  });

  it("does not mutate inputs — calling twice is safe", () => {
    const now = new Date("2026-06-11T18:00:00.000Z");
    const kickoffAt = new Date(now.getTime() + 3 * MIN);
    const nowTimeBefore = now.getTime();
    const kickoffTimeBefore = kickoffAt.getTime();

    shouldLockMatch(kickoffAt, now);
    shouldLockMatch(kickoffAt, now);

    expect(now.getTime()).toBe(nowTimeBefore);
    expect(kickoffAt.getTime()).toBe(kickoffTimeBefore);
  });
});

// ---------------------------------------------------------------------------
// canSubmitPrediction
// ---------------------------------------------------------------------------
describe("canSubmitPrediction — post-lock prediction gate", () => {
  it("returns true when prediction is not locked", () => {
    expect(canSubmitPrediction(false)).toBe(true);
  });

  it("returns false when prediction is locked", () => {
    expect(canSubmitPrediction(true)).toBe(false);
  });

  it("a prediction that was open and then locked can no longer be submitted", () => {
    let isLocked = false;
    expect(canSubmitPrediction(isLocked)).toBe(true);

    // Simulate lock event
    isLocked = true;
    expect(canSubmitPrediction(isLocked)).toBe(false);
  });
});
