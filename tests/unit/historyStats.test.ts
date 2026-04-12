/**
 * Unit tests for history stats computation and filter logic (Task 7).
 *
 * Covers Task 7 checklist:
 * - Stats bar shows correct totals (Section 7.1)
 * - Filter pills work correctly (Section 7.2)
 */

import { computeHistoryStats, filterByResult } from "@/lib/utils/historyStats";

// ---------------------------------------------------------------------------
// computeHistoryStats
// ---------------------------------------------------------------------------
describe("computeHistoryStats", () => {
  it("returns all zeros for an empty array", () => {
    expect(computeHistoryStats([])).toEqual({
      totalMatches: 0,
      totalPoints: 0,
      bingoCount: 0,
      correctCount: 0,
      missCount: 0,
    });
  });

  it("counts total matches correctly", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 0 },
    ];
    expect(computeHistoryStats(entries).totalMatches).toBe(3);
  });

  it("sums total points correctly", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 0 },
      { points_awarded: 3 },
    ];
    expect(computeHistoryStats(entries).totalPoints).toBe(7);
  });

  it("counts bingo (3 pts) entries", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 0 },
    ];
    expect(computeHistoryStats(entries).bingoCount).toBe(2);
  });

  it("counts correct (1 pt) entries", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 1 },
      { points_awarded: 0 },
    ];
    expect(computeHistoryStats(entries).correctCount).toBe(2);
  });

  it("counts miss (0 pts) entries", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 0 },
      { points_awarded: 0 },
      { points_awarded: 0 },
    ];
    expect(computeHistoryStats(entries).missCount).toBe(3);
  });

  it("handles all-bingo dataset", () => {
    const entries = Array.from({ length: 5 }, () => ({ points_awarded: 3 }));
    const stats = computeHistoryStats(entries);
    expect(stats.totalMatches).toBe(5);
    expect(stats.totalPoints).toBe(15);
    expect(stats.bingoCount).toBe(5);
    expect(stats.correctCount).toBe(0);
    expect(stats.missCount).toBe(0);
  });

  it("bingo + correct + miss counts sum to totalMatches", () => {
    const entries = [
      { points_awarded: 3 },
      { points_awarded: 1 },
      { points_awarded: 0 },
      { points_awarded: 3 },
      { points_awarded: 0 },
    ];
    const { totalMatches, bingoCount, correctCount, missCount } =
      computeHistoryStats(entries);
    expect(bingoCount + correctCount + missCount).toBe(totalMatches);
  });
});

// ---------------------------------------------------------------------------
// filterByResult
// ---------------------------------------------------------------------------

const ENTRIES = [
  { points_awarded: 3, match_id: "a" },
  { points_awarded: 3, match_id: "b" },
  { points_awarded: 1, match_id: "c" },
  { points_awarded: 0, match_id: "d" },
  { points_awarded: 0, match_id: "e" },
];

describe("filterByResult", () => {
  it("'all' returns every entry unchanged", () => {
    expect(filterByResult(ENTRIES, "all")).toHaveLength(5);
    expect(filterByResult(ENTRIES, "all")).toEqual(ENTRIES);
  });

  it("'bingo' returns only entries with 3 points", () => {
    const result = filterByResult(ENTRIES, "bingo");
    expect(result).toHaveLength(2);
    result.forEach((e) => expect(e.points_awarded).toBe(3));
  });

  it("'correct' returns only entries with 1 point", () => {
    const result = filterByResult(ENTRIES, "correct");
    expect(result).toHaveLength(1);
    expect(result[0].match_id).toBe("c");
  });

  it("'miss' returns only entries with 0 points", () => {
    const result = filterByResult(ENTRIES, "miss");
    expect(result).toHaveLength(2);
    result.forEach((e) => expect(e.points_awarded).toBe(0));
  });

  it("returns empty array when no entries match the filter", () => {
    const allBingo = [{ points_awarded: 3, match_id: "x" }];
    expect(filterByResult(allBingo, "miss")).toHaveLength(0);
  });

  it("preserves the original array order", () => {
    const result = filterByResult(ENTRIES, "all");
    expect(result.map((e) => e.match_id)).toEqual(["a", "b", "c", "d", "e"]);
  });
});
