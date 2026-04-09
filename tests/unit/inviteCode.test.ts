/**
 * Unit tests for Task 3 — invite code generation and validation.
 *
 * Covers Section 4.3 from Tests_v1.0.md:
 * - Code is 6 characters
 * - Code is alphanumeric uppercase
 * - 1000 generated codes have no duplicates
 *
 * Also covers join-side validation (isValidInviteCode).
 */

import { generateInviteCode, isValidInviteCode } from "@/lib/utils/inviteCode";

describe("generateInviteCode", () => {
  it("returns exactly 6 characters", () => {
    expect(generateInviteCode()).toHaveLength(6);
  });

  it("returns only uppercase alphanumeric characters", () => {
    // Run many times to cover the full character space
    for (let i = 0; i < 200; i++) {
      expect(generateInviteCode()).toMatch(/^[A-Z0-9]{6}$/);
    }
  });

  it("never includes visually ambiguous characters (I, O, 0, 1)", () => {
    for (let i = 0; i < 500; i++) {
      const code = generateInviteCode();
      expect(code).not.toMatch(/[IO01]/);
    }
  });

  it("generates no duplicates across 1000 codes", () => {
    const codes = Array.from({ length: 1000 }, () => generateInviteCode());
    const unique = new Set(codes);
    expect(unique.size).toBe(1000);
  });

  it("produces different codes on successive calls", () => {
    const a = generateInviteCode();
    const b = generateInviteCode();
    // Statistically this fails with probability 1/32^6 ≈ negligible
    expect(a).not.toBe(b);
  });
});

describe("isValidInviteCode", () => {
  describe("valid codes", () => {
    it.each([
      ["A4X9K2"],
      ["TESTA1"],
      ["TESTB2"],
      ["AAAAAA"],
      ["999999"],
      ["A1B2C3"],
    ])("accepts %s", (code) => {
      expect(isValidInviteCode(code)).toBe(true);
    });
  });

  describe("invalid — wrong length", () => {
    it("rejects empty string", () => {
      expect(isValidInviteCode("")).toBe(false);
    });

    it("rejects 5-character code", () => {
      expect(isValidInviteCode("ABCDE")).toBe(false);
    });

    it("rejects 7-character code", () => {
      expect(isValidInviteCode("ABCDEFG")).toBe(false);
    });
  });

  describe("invalid — wrong characters", () => {
    it("rejects lowercase letters", () => {
      expect(isValidInviteCode("abcdef")).toBe(false);
    });

    it("rejects mixed case", () => {
      expect(isValidInviteCode("Abc123")).toBe(false);
    });

    it("rejects special characters", () => {
      expect(isValidInviteCode("ABC!23")).toBe(false);
    });

    it("rejects spaces", () => {
      expect(isValidInviteCode("ABC 23")).toBe(false);
    });

    it("rejects code with leading/trailing spaces (untrimmed)", () => {
      // The page trims+uppercases before calling isValidInviteCode;
      // the function itself does not trim
      expect(isValidInviteCode(" A4X9K")).toBe(false);
    });
  });

  describe("ui contract — join flow normalisation", () => {
    it("would accept a lowercase input after trim+toUpperCase applied by the page", () => {
      // The league page does: joinCode.trim().toUpperCase() before validating
      const raw = "  a4x9k2  ";
      const normalised = raw.trim().toUpperCase();
      expect(isValidInviteCode(normalised)).toBe(true);
    });
  });
});
