/**
 * @jest-environment jsdom
 *
 * Unit tests for the useCountdown hook (Task 5, Section 5.2).
 *
 * The hook computes `remaining = kickoff - 5min - now`.
 * When remaining ≤ 0 the prediction window is locked.
 *
 * All tests use fake timers so Date.now() is fully deterministic.
 */

import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "@/hooks/useCountdown";

// Fixed reference point: 2026-06-11T10:00:00 UTC
const NOW = new Date("2026-06-11T10:00:00.000Z");

// 5-minute lock window in ms
const LOCK_WINDOW_MS = 5 * 60 * 1000;

function kickoffIn(minutes: number): Date {
  return new Date(NOW.getTime() + minutes * 60 * 1000);
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW.getTime());
});

afterEach(() => {
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// Lock detection
// ---------------------------------------------------------------------------
describe("lock detection", () => {
  it("is locked when kickoff is exactly 5 min away (lock fires at T-5)", () => {
    // remaining = 5min - 5min = 0 → locked
    const { result } = renderHook(() => useCountdown(kickoffIn(5)));
    expect(result.current.isLocked).toBe(true);
    expect(result.current.display).toBe("נעול");
  });

  it("is locked when kickoff is less than 5 min away", () => {
    const { result } = renderHook(() => useCountdown(kickoffIn(4)));
    expect(result.current.isLocked).toBe(true);
  });

  it("is locked when kickoff is in the past", () => {
    const { result } = renderHook(() => useCountdown(kickoffIn(-30)));
    expect(result.current.isLocked).toBe(true);
  });

  it("is NOT locked when kickoff is more than 5 min away", () => {
    // remaining = 30min - 5min = 25min > 0
    const { result } = renderHook(() => useCountdown(kickoffIn(30)));
    expect(result.current.isLocked).toBe(false);
  });

  it("becomes locked exactly when the lock window opens (T-5)", () => {
    // Start 6 minutes before kickoff → still open
    const { result } = renderHook(() => useCountdown(kickoffIn(6)));
    expect(result.current.isLocked).toBe(false);

    // Advance 60 seconds → now 5 min before kickoff → locked
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(result.current.isLocked).toBe(true);
    expect(result.current.display).toBe("נעול");
  });
});

// ---------------------------------------------------------------------------
// Display format
// ---------------------------------------------------------------------------
describe("display format", () => {
  it("shows HH:MM:SS for a kickoff 30 min away (25 min remaining)", () => {
    // remaining = 30min - 5min = 25min
    const { result } = renderHook(() => useCountdown(kickoffIn(30)));
    expect(result.current.display).toBe("00:25:00");
  });

  it("shows 'נעול' when locked", () => {
    const { result } = renderHook(() => useCountdown(kickoffIn(3)));
    expect(result.current.display).toBe("נעול");
  });

  it("ticks down by 1 second every interval", () => {
    // kickoff in 10 min → 5 min remaining
    const { result } = renderHook(() => useCountdown(kickoffIn(10)));
    expect(result.current.display).toBe("00:05:00");

    act(() => { jest.advanceTimersByTime(1_000); });
    expect(result.current.display).toBe("00:04:59");

    act(() => { jest.advanceTimersByTime(1_000); });
    expect(result.current.display).toBe("00:04:58");
  });

  it("shows multi-day format for kickoffs more than 24h away", () => {
    // kickoff in 2 days + 5 min → 2 days remaining (2d * 86400s)
    const { result } = renderHook(() => useCountdown(kickoffIn(2 * 24 * 60 + 5)));
    expect(result.current.display).toMatch(/^\dד \d{2}:\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// isUnderOneHour
// ---------------------------------------------------------------------------
describe("isUnderOneHour", () => {
  it("is false when remaining > 1 hour", () => {
    // kickoff in 2 hours + 5 min → remaining = 2 hours
    const { result } = renderHook(() => useCountdown(kickoffIn(2 * 60 + 5)));
    expect(result.current.isUnderOneHour).toBe(false);
  });

  it("is true when remaining is exactly 59 minutes", () => {
    // kickoff in 64 min → remaining = 59 min
    const { result } = renderHook(() => useCountdown(kickoffIn(64)));
    expect(result.current.isUnderOneHour).toBe(true);
  });

  it("is true when locked (locked state implies under one hour)", () => {
    const { result } = renderHook(() => useCountdown(kickoffIn(3)));
    expect(result.current.isUnderOneHour).toBe(true);
  });

  it("transitions to true as 1-hour threshold is crossed", () => {
    // kickoff in 66 min → remaining = 61 min → still over 1h
    const { result } = renderHook(() => useCountdown(kickoffIn(66)));
    expect(result.current.isUnderOneHour).toBe(false);

    // Advance 2 minutes → remaining = 59 min → under 1h
    act(() => { jest.advanceTimersByTime(2 * 60_000); });
    expect(result.current.isUnderOneHour).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------
describe("cleanup", () => {
  it("clears the interval when the component unmounts", () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useCountdown(kickoffIn(30)));
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
