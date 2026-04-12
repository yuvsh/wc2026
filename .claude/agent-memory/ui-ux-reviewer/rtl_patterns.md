---
name: RTL Patterns
description: RTL conventions, known gotchas, and layout decisions specific to the WC2026 Hebrew UI
type: project
---

## How RTL is Applied
- `dir="rtl"` is set at the **page root div level**, not at the layout level. Each page is responsible for its own `dir`.
- The `<html>` or `<body>` element does NOT appear to carry `dir="rtl"` globally — this is a per-page pattern.

## Known Gotchas
- The `›` chevron used as a trailing affordance in SettingsRow and the leagues "join" link is a raw Unicode right-angle quotation mark. In RTL context, a chevron pointing right (`›`) correctly signals "navigate" — however this can visually read wrong if the browser does not apply bidi correctly or if the element is inside a flex row that is not itself RTL-aware. Monitor this.
- The inline edit row in ProfilePage places the input AFTER the buttons in DOM order (buttons are rendered left/first in the flex row, input is right/second). In `dir="rtl"` flex, this means buttons appear on the RIGHT side of the row — which is the visually leading side in RTL. This is correct for Hebrew but must be verified any time the edit row is modified.
- `text-right` is used for explicit text alignment on section labels and the page header. This is redundant under `dir="rtl"` but serves as a defensive fallback.
- The toast uses `left-1/2 -translate-x-1/2` for horizontal centering — this works correctly regardless of RTL direction and does not need `rtl:` variants.

## Directional Icons
- MatchCard uses a `border-r-4` accent stripe for bingo/correct/miss — in RTL this correctly appears on the right (leading) edge of the card.
- No `rtl:` Tailwind variants observed yet; the project relies on `dir="rtl"` HTML attribute + flex/grid reflow rather than explicit `rtl:` utility overrides.

**Why:** RTL correctness is non-negotiable for this Hebrew app. These notes prevent re-discovering the same layout decisions.
**How to apply:** Check these patterns whenever reviewing layout, directional icons, or flex ordering in new components.
