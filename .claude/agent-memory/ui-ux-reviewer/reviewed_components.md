---
name: Reviewed Components
description: Log of UI components reviewed, verdict, and key issues found
type: project
---

## ProfilePage — app/(app)/profile/page.tsx
**Reviewed:** 2026-04-11
**Verdict:** Approve with fixes (2 critical, 4 recommended)

**Critical issues found:**
1. `dir="rtl"` is on the page root div but the AppLayout `<main>` does not carry it — the BottomTabBar and loading spinner fallback (rendered outside the `dir="rtl"` div) are LTR. Loading state returns early before the `dir="rtl"` div is rendered.
2. Inline edit row flex direction is wrong for RTL: buttons are rendered first in DOM (`flex` row) and the input is second. Under `dir="rtl"` the buttons visually land on the right (leading) side, which is acceptable, BUT the cancel button is rendered before the save button in DOM — in RTL flex the save button (leftmost in DOM) appears on the LEFT (trailing) side. Expected RTL affordance is save on the right (leading), cancel on the left (trailing) — this is reversed.

**Recommended issues:**
- `SettingsRow` renders the `›` chevron on the LEFT side of the flex row (first child, `justify-between`). In RTL this chevron appears on the left (trailing) side — correct for navigation affordance in RTL. BUT the chevron is a raw Unicode character, not an SVG — it does not flip automatically and its directionality is ambiguous.
- No error state rendered when profile load fails (only `console.error` called).
- `window.location.href` navigation for neighbourhood selection bypasses Next.js router — should use `router.push`.
- Stats section has no background color distinguishing it from the page background `#F8FAFC` — the `bg-[#F9FAFB]` stat cards are nearly invisible against the page bg.

**Approved patterns (reference):**
- COPY constant pattern — all strings centralized, no hardcoded JSX text
- Toast implementation
- League invite code copy button (touch target, aria-label, teal muted bg)
- Logout button (destructive style, full width, min-h-[44px])
