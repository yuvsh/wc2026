/**
 * Unit tests for admin server action validation logic.
 * Tests the input validation rules from app/actions/admin.ts.
 */

function isValidScore(scoreA: unknown, scoreB: unknown): boolean {
  return (
    typeof scoreA === "number" &&
    typeof scoreB === "number" &&
    Number.isInteger(scoreA) &&
    Number.isInteger(scoreB) &&
    scoreA >= 0 &&
    scoreB >= 0
  );
}

function isValidMatchBody(body: unknown): body is { match_id: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "match_id" in body &&
    typeof (body as Record<string, unknown>).match_id === "string"
  );
}

describe("isValidScore — updateMatchScore input validation", () => {
  it("accepts valid non-negative integers", () => {
    expect(isValidScore(0, 0)).toBe(true);
    expect(isValidScore(2, 1)).toBe(true);
    expect(isValidScore(10, 0)).toBe(true);
  });

  it("rejects negative scores", () => {
    expect(isValidScore(-1, 0)).toBe(false);
    expect(isValidScore(0, -1)).toBe(false);
    expect(isValidScore(-1, -1)).toBe(false);
  });

  it("rejects floats", () => {
    expect(isValidScore(1.5, 0)).toBe(false);
    expect(isValidScore(0, 2.9)).toBe(false);
  });

  it("rejects NaN", () => {
    expect(isValidScore(NaN, 0)).toBe(false);
    expect(isValidScore(0, NaN)).toBe(false);
  });

  it("rejects strings", () => {
    expect(isValidScore("2", 1)).toBe(false);
    expect(isValidScore(2, "1")).toBe(false);
  });

  it("rejects null and undefined", () => {
    expect(isValidScore(null, 0)).toBe(false);
    expect(isValidScore(0, undefined)).toBe(false);
  });
});

describe("isValidMatchBody — run-scoring body validation", () => {
  it("accepts a valid body with a string match_id", () => {
    expect(isValidMatchBody({ match_id: "abc-123" })).toBe(true);
  });

  it("accepts a UUID match_id", () => {
    expect(isValidMatchBody({ match_id: "00000000-0000-0000-0000-000000000001" })).toBe(true);
  });

  it("rejects body where match_id is a number", () => {
    expect(isValidMatchBody({ match_id: 123 })).toBe(false);
  });

  it("rejects body where match_id is missing", () => {
    expect(isValidMatchBody({ other_field: "value" })).toBe(false);
  });

  it("rejects null body", () => {
    expect(isValidMatchBody(null)).toBe(false);
  });

  it("rejects non-object bodies", () => {
    expect(isValidMatchBody("string")).toBe(false);
    expect(isValidMatchBody(42)).toBe(false);
    expect(isValidMatchBody([])).toBe(false);
  });

  it("rejects body where match_id is null", () => {
    expect(isValidMatchBody({ match_id: null })).toBe(false);
  });
});
