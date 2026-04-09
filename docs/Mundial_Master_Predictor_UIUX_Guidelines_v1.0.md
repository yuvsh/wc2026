# Mundial Master Predictor
## UI/UX Guidelines
**Version 1.0 | Status: Draft | 2025**

---

## 1. Design Principles

These four principles guide every decision in the app:

**פשטות (Simplicity)** — Less is more. Every element on screen must earn its place. No decoration for decoration's sake. If removing something doesn't break the flow, remove it.

**בהירות (Clarity)** — Hebrew RTL layout, large touch targets, clear hierarchy. No ambiguity about what is locked, what is open, and what you scored.

**קהילה (Community)** — This is a village app. The leaderboard and neighbourhood scores are the heart of the experience. Make them feel social and personal.

**מיקוד (Focus)** — One primary action per screen. Users open the app quickly to submit a prediction before kickoff. Remove everything that competes for attention with that goal.

---

## 2. Layout & Platform

### Primary Platform
Mobile-first PWA. All layouts and components are designed for a 390px wide viewport (iPhone 14 standard). Desktop scales up gracefully but is not the primary target.

### Direction
Full RTL (right-to-left) layout throughout. This applies to:
- Text alignment (right-aligned by default)
- Navigation flow (right = primary, left = back)
- Icons with directional meaning (arrows, chevrons) are mirrored
- CSS: `direction: rtl; text-align: right` on the root element

### Safe Areas
Respect iOS/Android safe areas:
- Top: 44px status bar clearance
- Bottom: 34px home indicator clearance (critical — bottom tab bar must clear this)

---

## 3. Navigation

**Pattern: Bottom Tab Bar**

4 tabs, fixed at the bottom, always visible:

| Tab | Icon | Hebrew Label |
| :--- | :--- | :--- |
| ניחושים | Pencil/edit icon | ניחושים (Predictions) |
| טבלה | List icon | טבלה (Leaderboard) |
| טורניר | Trophy/cup icon | טורניר (Tournament) |
| היסטוריה | Clock icon | היסטוריה (History) |
| פרופיל | Person icon | פרופיל (Profile) |

**Tab bar rules:**
- Active tab: Teal (`#0D9488`) icon + label
- Inactive tab: Gray (`#6B7280`) icon + label
- Background: white (light) / dark surface (dark mode)
- Top border: 0.5px Gray 200
- Height: 56px + safe area bottom padding
- No badge counters on tabs for MVP
- 5 tabs total — use smaller horizontal padding (12px) to fit comfortably

---

## 4. Color System

### Brand Palette

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#0D9488` | Primary buttons, active states, CTAs |
| `--color-primary-light` | `#2DD4BF` | Hover states, highlights, active tab |
| `--color-primary-bg` | `#F0FDFA` | Light teal backgrounds, tags |
| `--color-dark` | `#111827` | Page background (dark surfaces) |
| `--color-dark-card` | `#1F2937` | Card background on dark surfaces |
| `--color-gold` | `#EF9F27` | Golden Boot, 1st place, rewards |
| `--color-gold-light` | `#FAEEDA` | Gold card backgrounds |
| `--color-success` | `#22C55E` | Correct result, points earned |
| `--color-error` | `#E24B4A` | Errors, destructive actions only |
| `--color-locked` | `#6B7280` | Locked predictions, inactive states |
| `--color-surface` | `#FFFFFF` | Card backgrounds (light mode) |
| `--color-bg` | `#F8FAFC` | Page background (light mode) |

### Semantic Color Usage

| State | Color |
| :--- | :--- |
| Exact score (Bingo) | Gold (`#EF9F27`) |
| Correct result | Green (`#22C55E`) |
| Miss / 0 points | Gray (`#6B7280`) |
| Prediction open | Teal (`#0D9488`) |
| Prediction locked | Gray (`#6B7280`) |
| Error / destructive | Red (`#E24B4A`) |
| 1st place | Gold (`#EF9F27`) |
| 2nd place | Silver (`#9CA3AF`) |
| 3rd place | Bronze (`#BA7517`) |

### Dark Mode
All colors adapt automatically. Key dark mode overrides:
- Page background: `#111827`
- Card surface: `#1F2937`
- Primary teal stays `#0D9488` — do not lighten or darken in dark mode
- Text primary: `#F9FAFB`
- Text secondary: `#9CA3AF`

---

## 5. Typography

### Font
**Heebo** — Google Font, excellent Hebrew + Latin support, clean and sporty.
- Import: `https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap`
- Fallback: `system-ui, -apple-system, sans-serif`

### Scale

| Token | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| `--text-xl` | 28px | 700 | Screen titles, score display |
| `--text-lg` | 22px | 700 | Section headers, team names |
| `--text-md` | 17px | 500 | Card titles, player names |
| `--text-base` | 15px | 400 | Body text, descriptions |
| `--text-sm` | 13px | 400 | Labels, meta info, timestamps |
| `--text-xs` | 11px | 500 | Tags, badges, caps |

### Rules
- Never go below 11px
- Use weight 700 for scores and key numbers — they need visual punch
- Use weight 400 for supporting text
- Line height: 1.4 for headings, 1.6 for body

---

## 6. Spacing & Layout

### Base Unit
8px grid. All spacing is a multiple of 8.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--space-xs` | 4px | Internal component gaps |
| `--space-sm` | 8px | Tight padding, icon gaps |
| `--space-md` | 16px | Card internal padding |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Screen-level vertical rhythm |

### Cards
- Padding: 16px
- Border radius: 12px
- Border: 0.5px solid Gray 100 (`#D3D1C7`)
- Background: white (light) / Gray 900 (dark)
- No drop shadows — use border only

### Touch Targets
All interactive elements minimum **44x44px**. Score input fields: minimum 48px height.

---

## 7. Key Components

### 7.1 Match Prediction Card

The core component of the app. Must communicate:
- Team names + flags
- Score input fields (or locked score)
- Countdown timer to lock
- Points earned (post-match)

**States:**
- **Open** — Score inputs active, red border on focus, countdown visible
- **Locked** — Inputs disabled, gray background, lock icon visible
- **Finished** — Shows actual result, user prediction, and points badge

**Layout (RTL):**
```
[Flag] שם קבוצה ב     [input] - [input]     שם קבוצה א [Flag]
                   ⏱ נועל בעוד 23:45
```

### 7.2 Leaderboard Row

Each row shows:
- Position number (large, left — note: in RTL this is visually on the right)
- Avatar circle (initials)
- Display name
- Points (large, prominent)
- Trend indicator (▲ red / ▼ gray / — neutral)

**Special treatment:**
- 1st place: gold left border accent + gold position number
- 2nd place: silver/gray accent
- 3rd place: bronze/amber accent
- Current user row: Red 50 background highlight

### 7.3 Points Badge

Used on match history cards to show points earned:

| Result | Badge style |
| :--- | :--- |
| Bingo (3pts) | Gold background (`#FAEEDA`), gold text (`#BA7517`), ⚽ icon |
| Correct (1pt) | Green background, green text |
| Miss (0pts) | Gray background, gray text |
| Pending | Gray outline, "ממתין" label |

### 7.4 Countdown Timer

- Displays: `HH:MM:SS` or `DD:HH:MM` for distant matches
- Color: Red 400 when under 1 hour, Gray 400 otherwise
- Font: Monospace or tabular-nums to prevent layout shift
- When locked: replaced by lock icon + "נעול" text in gray

### 7.5 Score Input Field

- Large, centered number input
- Min width: 48px, height: 48px
- Font size: 22px, weight 700
- Border: 1px Gray 200, radius 8px
- Focus: Teal (`#0D9488`) border
- Disabled (locked): Gray 50 background, Gray 400 text
- Placeholder: `0`
- Input type: `number`, min: `0`, max: `20`

### 7.6 Primary Button

- Background: Teal (`#0D9488`)
- Text: white, 15px, weight 500
- Height: 50px
- Border radius: 12px
- Press state: `#0F766E`, scale 0.98
- Full width by default on mobile
- Disabled: `#E5E7EB` background, `#9CA3AF` text

### 7.7 Invite Code Display

- Large monospace display of the 6-character code
- Font size: 32px, weight 700, letter-spacing: 0.15em
- Background: Gray 50
- Two action buttons below: "שתף בוואטסאפ" (WhatsApp green) and "העתק קוד" (gray)

---

## 7.1 Full User Flow

```
Login → Neighbourhood Selection (first time only) → Onboarding Hub
     → Predictions Dashboard (main loop)
     → Leaderboard (league tabs → personal/neighbourhood toggle)
     → Match History (filter by result type)
     → Profile (stats, settings, dark mode toggle)
     → Golden Boot (from sticky banner, locks before first match)
```

---

## 8. Screens Summary

### Screen 1 — Login
- Full screen, centered vertically
- App logo (wordmark only, no heavy illustration) at top third
- Google button + Apple button stacked, clean outline style
- Tagline: "נחש. תחרה. תנצח." in small secondary text
- Background: white only -- no decorative elements

### Screen 2 — Onboarding (Empty State)
- Shown when user has no league
- Illustration area (football/pitch themed SVG)
- Title: "ברוך הבא לניחושים!"
- Two large CTA cards: "צור ליגה" and "הצטרף לליגה"
- Each card has icon, title, and one-line description

### Screen 3 — Predictions Dashboard
- Sticky top bar: league name + personal rank + points
- Golden Boot sticky banner (if still open): red background, white text
- Match cards list, grouped by date
- Finished matches collapsed/dimmed at bottom

### Screen 4 — Leaderboard
- Toggle between "אישי" (individual) and "שכונה" (neighbourhood) — Phase 2
- Top 3 podium display for phase 2
- Scrollable list below
- Current user row always visible (sticky at bottom if off-screen)

### Screen 5 — Match History
- List of all past matches
- Each row: teams, result, user prediction, points badge
- Filter by: הכל / ניצחתי / פספסתי

### Screen 6 — Golden Boot
- Player list, searchable
- Each player: flag, name, club, country
- Selected player: red checkmark, highlighted row
- Lock state: shows selection read-only with lock icon

---

## 9. Football Visual Elements

### Usage Rules
Football themed elements are used sparingly. The UI is clean first, football-themed second:
- Team flags: shown as small (20x15px) inline images next to team names only
- Football icon: used in the app logo and predictions tab icon only
- Pitch/grass texture: not used — too decorative for a clean aesthetic
- World Cup trophy: not used as decoration — reserved for the Golden Boot section label only
- No confetti, no animated celebrations, no decorative backgrounds on functional screens

### Animations
Keep animations fast and purposeful:
- Score reveal: short scale-up animation (150ms) when points are awarded
- Leaderboard position change: slide up/down on re-rank (200ms)
- Countdown timer: no animation — ticking numbers cause layout shift
- Lock transition: input to locked state — 100ms opacity fade

---

## 10. Accessibility

- All text meets WCAG AA contrast ratio (4.5:1 minimum)
- Touch targets minimum 44x44px
- Inputs have visible focus states
- Score inputs use `inputmode="numeric"` for mobile keyboard
- All icons have `aria-label` in Hebrew
- Color is never the only differentiator (always paired with text or icon)

---

## 11. Dark Mode

Triggered by system preference + manual toggle in Profile screen.

| Element | Light | Dark |
| :--- | :--- | :--- |
| Page background | `#F8FAFC` | `#111827` |
| Card surface | `#FFFFFF` | `#1F2937` |
| Primary text | `#111827` | `#F9FAFB` |
| Secondary text | `#6B7280` | `#9CA3AF` |
| Primary color | `#0D9488` | `#0D9488` (unchanged) |
| Primary light | `#2DD4BF` | `#2DD4BF` (unchanged) |
| Gold | `#EF9F27` | `#EF9F27` (unchanged) |
| Border | `#E5E7EB` | `#374151` |

---

## 12. RTL Checklist for Developers

Before shipping any screen, verify:

- [ ] `dir="rtl"` on root `<html>` element
- [ ] Text is right-aligned by default
- [ ] Flex rows use `flex-direction: row` (RTL handles visual reversal)
- [ ] Icons with direction (arrows, chevrons) are CSS-mirrored: `transform: scaleX(-1)`
- [ ] Input fields: text right-aligned, placeholder right-aligned
- [ ] Tab bar: reading order right-to-left (first tab on the right)
- [ ] Score input layout: Team B on left, Team A on right (natural RTL reading)
- [ ] Back navigation: swipe from left edge (standard on iOS RTL)
- [ ] Number formatting: use `Intl.NumberFormat('he-IL')` for points display
- [ ] Date/time: use `he-IL` locale, Israel timezone (`Asia/Jerusalem`)
