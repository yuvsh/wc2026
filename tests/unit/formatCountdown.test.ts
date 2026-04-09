/**
 * Unit tests for formatCountdown — the pure time-formatting function
 * used by the useCountdown hook (Task 5, Section 5.2).
 *
 * Format rules:
 *   days > 0  →  "${days}ד HH:MM"      (no seconds column)
 *   else      →  "HH:MM:SS"
 */

import { formatCountdown } from "@/hooks/useCountdown";

describe("formatCountdown — sub-day (HH:MM:SS)", () => {
  it("formats zero ms as 00:00:00", () => {
    expect(formatCountdown(0)).toBe("00:00:00");
  });

  it("formats 1 second", () => {
    expect(formatCountdown(1_000)).toBe("00:00:01");
  });

  it("formats 59 seconds", () => {
    expect(formatCountdown(59_000)).toBe("00:00:59");
  });

  it("formats exactly 1 minute", () => {
    expect(formatCountdown(60_000)).toBe("00:01:00");
  });

  it("formats 1 minute 30 seconds", () => {
    expect(formatCountdown(90_000)).toBe("00:01:30");
  });

  it("formats 59 minutes 59 seconds", () => {
    expect(formatCountdown(3_599_000)).toBe("00:59:59");
  });

  it("formats exactly 1 hour", () => {
    expect(formatCountdown(3_600_000)).toBe("01:00:00");
  });

  it("formats 1 hour 1 minute 1 second", () => {
    expect(formatCountdown(3_661_000)).toBe("01:01:01");
  });

  it("formats 23 hours 59 minutes 59 seconds (max sub-day)", () => {
    expect(formatCountdown(86_399_000)).toBe("23:59:59");
  });

  it("zero-pads single-digit hours, minutes, seconds", () => {
    // 1h 2m 3s
    const ms = 1 * 3_600_000 + 2 * 60_000 + 3 * 1_000;
    expect(formatCountdown(ms)).toBe("01:02:03");
  });

  it("sub-millisecond input (999 ms) rounds down to 00:00:00", () => {
    expect(formatCountdown(999)).toBe("00:00:00");
  });
});

describe("formatCountdown — multi-day (${days}ד HH:MM)", () => {
  it("formats exactly 1 day as '1ד 00:00'", () => {
    expect(formatCountdown(86_400_000)).toBe("1ד 00:00");
  });

  it("formats 1 day 1 hour", () => {
    expect(formatCountdown(86_400_000 + 3_600_000)).toBe("1ד 01:00");
  });

  it("formats 2 days 3 hours 45 minutes", () => {
    const ms = 2 * 86_400_000 + 3 * 3_600_000 + 45 * 60_000;
    expect(formatCountdown(ms)).toBe("2ד 03:45");
  });

  it("does not include seconds in the multi-day format", () => {
    // 1 day + 59 seconds — seconds should not appear
    const ms = 86_400_000 + 59_000;
    expect(formatCountdown(ms)).toBe("1ד 00:00");
  });

  it("zero-pads hours and minutes in multi-day format", () => {
    // 3 days 1 hour 2 minutes
    const ms = 3 * 86_400_000 + 1 * 3_600_000 + 2 * 60_000;
    expect(formatCountdown(ms)).toBe("3ד 01:02");
  });

  it("handles 7 days correctly", () => {
    const ms = 7 * 86_400_000;
    expect(formatCountdown(ms)).toBe("7ד 00:00");
  });
});
