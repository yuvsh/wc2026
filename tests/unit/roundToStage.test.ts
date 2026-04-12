/**
 * Unit tests for roundToStage — maps API-Football round strings to
 * internal stage values used in the matches table.
 * Duplicates the pure function from supabase/functions/sync-schedule/index.ts.
 */

function roundToStage(round: string): string {
  const r = round.toLowerCase();
  if (r.includes("group")) return "group";
  if (r.includes("round of 32")) return "r32";
  if (r.includes("round of 16")) return "r16";
  if (r.includes("quarter")) return "qf";
  if (r.includes("semi")) return "sf";
  if (r.includes("final")) return "final";
  return "group"; // fallback (unknown rounds logged as warning in edge function)
}

describe("roundToStage", () => {
  describe("group stage", () => {
    it("maps 'Group Stage - 1' to group", () => {
      expect(roundToStage("Group Stage - 1")).toBe("group");
    });

    it("is case-insensitive", () => {
      expect(roundToStage("group stage - 3")).toBe("group");
      expect(roundToStage("GROUP STAGE - 2")).toBe("group");
    });
  });

  describe("knockout rounds", () => {
    it("maps 'Round of 32' to r32", () => {
      expect(roundToStage("Round of 32")).toBe("r32");
    });

    it("maps 'Round of 16' to r16", () => {
      expect(roundToStage("Round of 16")).toBe("r16");
    });

    it("maps 'Quarter-finals' to qf", () => {
      expect(roundToStage("Quarter-finals")).toBe("qf");
      expect(roundToStage("Quarterfinal")).toBe("qf");
    });

    it("maps 'Semi-finals' to sf", () => {
      expect(roundToStage("Semi-finals")).toBe("sf");
      expect(roundToStage("Semifinal")).toBe("sf");
    });

    it("maps 'Final' to final", () => {
      expect(roundToStage("Final")).toBe("final");
      expect(roundToStage("World Cup Final")).toBe("final");
    });
  });

  describe("precedence — 'Round of 32' before 'Round of 16'", () => {
    it("does not confuse Round of 32 with Round of 16", () => {
      expect(roundToStage("Round of 32")).toBe("r32");
      expect(roundToStage("Round of 16")).toBe("r16");
    });
  });

  describe("unknown round strings", () => {
    it("falls back to group for unrecognised strings", () => {
      expect(roundToStage("3rd Place")).toBe("group");
      expect(roundToStage("Play-off")).toBe("group");
    });
  });
});
