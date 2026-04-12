/**
 * Unit tests for the match prediction scoring logic used by run-scoring edge function.
 * Rules: exact score = 3 pts (bingo), correct outcome = 1 pt, wrong outcome = 0 pts.
 *
 * These duplicate the pure functions from supabase/functions/run-scoring/index.ts.
 * If those functions change, update these tests to match.
 */

type Outcome = "home" | "draw" | "away";

function calcOutcome(a: number, b: number): Outcome {
  if (a > b) return "home";
  if (a < b) return "away";
  return "draw";
}

function calcPoints(
  scoreA: number,
  scoreB: number,
  predA: number,
  predB: number
): number {
  if (predA === scoreA && predB === scoreB) return 3;
  if (calcOutcome(predA, predB) === calcOutcome(scoreA, scoreB)) return 1;
  return 0;
}

describe("calcOutcome", () => {
  it("returns 'home' when home score is higher", () => {
    expect(calcOutcome(2, 1)).toBe("home");
    expect(calcOutcome(1, 0)).toBe("home");
  });

  it("returns 'away' when away score is higher", () => {
    expect(calcOutcome(0, 1)).toBe("away");
    expect(calcOutcome(1, 3)).toBe("away");
  });

  it("returns 'draw' when scores are equal", () => {
    expect(calcOutcome(0, 0)).toBe("draw");
    expect(calcOutcome(2, 2)).toBe("draw");
  });
});

describe("calcPoints", () => {
  describe("exact score (bingo) — 3 points", () => {
    it("awards 3 points for predicting the exact score", () => {
      expect(calcPoints(2, 1, 2, 1)).toBe(3);
    });

    it("awards 3 points for a 0-0 prediction that lands", () => {
      expect(calcPoints(0, 0, 0, 0)).toBe(3);
    });

    it("awards 3 points for a high-scoring exact match", () => {
      expect(calcPoints(4, 3, 4, 3)).toBe(3);
    });
  });

  describe("correct outcome — 1 point", () => {
    it("awards 1 point when predicting home win with wrong score", () => {
      expect(calcPoints(2, 0, 1, 0)).toBe(1);
      expect(calcPoints(3, 1, 2, 0)).toBe(1);
    });

    it("awards 1 point when predicting away win with wrong score", () => {
      expect(calcPoints(0, 2, 0, 1)).toBe(1);
      expect(calcPoints(1, 3, 0, 2)).toBe(1);
    });

    it("awards 1 point when predicting draw with wrong score", () => {
      expect(calcPoints(1, 1, 2, 2)).toBe(1);
      expect(calcPoints(0, 0, 3, 3)).toBe(1);
    });
  });

  describe("wrong outcome (miss) — 0 points", () => {
    it("awards 0 points when predicting home win but it was away win", () => {
      expect(calcPoints(0, 2, 2, 0)).toBe(0);
    });

    it("awards 0 points when predicting draw but it was a home win", () => {
      expect(calcPoints(2, 0, 1, 1)).toBe(0);
    });

    it("awards 0 points when predicting away win but it was a draw", () => {
      expect(calcPoints(1, 1, 0, 2)).toBe(0);
    });

    it("awards 0 points when predicting home win but it was a draw", () => {
      expect(calcPoints(0, 0, 2, 1)).toBe(0);
    });
  });

  describe("boundary cases", () => {
    it("distinguishes exact score from same-outcome different score", () => {
      // Same home win, different score → 1 not 3
      expect(calcPoints(2, 1, 3, 0)).toBe(1);
    });

    it("a correct score always beats a correct outcome check", () => {
      // 1-0 predicted, 1-0 actual → 3, not 1
      expect(calcPoints(1, 0, 1, 0)).toBe(3);
    });
  });
});
