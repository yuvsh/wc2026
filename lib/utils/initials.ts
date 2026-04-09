/**
 * Derives a 2-character avatar initial from a display name.
 *
 * "Alice Smith"       → "AS"  (first letter of first + last word)
 * "Alice Mary Smith"  → "AS"  (first + last word only)
 * "Alice"             → "AL"  (single word → first 2 chars)
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  const parts = trimmed.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
