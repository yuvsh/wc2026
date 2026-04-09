// Characters chosen to avoid visual confusion (no I, O, 0, 1)
const INVITE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 6;

export function generateInviteCode(): string {
  return Array.from({ length: INVITE_CODE_LENGTH }, () =>
    INVITE_CODE_CHARS.charAt(Math.floor(Math.random() * INVITE_CODE_CHARS.length))
  ).join("");
}

// Accepts any 6-character uppercase alphanumeric code (join validation is
// intentionally more permissive than generation so users can enter any valid code)
export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
