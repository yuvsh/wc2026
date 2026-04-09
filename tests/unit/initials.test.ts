/**
 * Unit tests for getInitials — avatar initial derivation (Task 6).
 */

import { getInitials } from "@/lib/utils/initials";

describe("getInitials", () => {
  describe("two or more words — first + last initial", () => {
    it("returns initials from first and last word", () => {
      expect(getInitials("Alice Smith")).toBe("AS");
    });

    it("uses only first and last word for 3-word names", () => {
      expect(getInitials("Alice Mary Smith")).toBe("AS");
    });

    it("uppercases lowercase input", () => {
      expect(getInitials("alice smith")).toBe("AS");
    });

    it("handles mixed case", () => {
      expect(getInitials("david Cohen")).toBe("DC");
    });
  });

  describe("single word — first 2 characters", () => {
    it("returns first 2 chars uppercased", () => {
      expect(getInitials("Alice")).toBe("AL");
    });

    it("returns 1 char when name is 1 character long", () => {
      expect(getInitials("A")).toBe("A");
    });

    it("uppercases single-word lowercase input", () => {
      expect(getInitials("bob")).toBe("BO");
    });
  });

  describe("whitespace handling", () => {
    it("trims leading and trailing spaces before processing", () => {
      expect(getInitials("  Alice Smith  ")).toBe("AS");
    });

    it("treats a trimmed single-word name as single word", () => {
      expect(getInitials("  Alice  ")).toBe("AL");
    });
  });
});
