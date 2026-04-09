/**
 * Unit tests for getPointsType — the points classification function
 * used by MatchCard to derive the badge type (Task 5, Section 5.1).
 *
 * Maps backend-awarded points to a display category:
 *   null → null  (result not yet scored)
 *   3    → "bingo"   (exact score — see Tests doc Section 4.1)
 *   1    → "correct" (right outcome, wrong score)
 *   0    → "miss"    (wrong outcome)
 */

import { getPointsType } from "@/components/MatchCard";

describe("getPointsType", () => {
  it("returns null when points are null (pending result)", () => {
    expect(getPointsType(null)).toBeNull();
  });

  it("returns 'bingo' for 3 points (exact score prediction)", () => {
    expect(getPointsType(3)).toBe("bingo");
  });

  it("returns 'correct' for 1 point (correct outcome, wrong score)", () => {
    expect(getPointsType(1)).toBe("correct");
  });

  it("returns 'miss' for 0 points (wrong outcome)", () => {
    expect(getPointsType(0)).toBe("miss");
  });

  // Edge cases — any value that is not 3 or 1 is classified as "miss"
  it("returns 'miss' for any other positive number", () => {
    expect(getPointsType(2)).toBe("miss");
    expect(getPointsType(10)).toBe("miss");
  });

  it("returns 'miss' for negative numbers", () => {
    expect(getPointsType(-1)).toBe("miss");
  });
});
