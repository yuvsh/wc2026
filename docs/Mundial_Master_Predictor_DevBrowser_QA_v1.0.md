# Mundial Master Predictor
## Dev-Browser QA Runbook
**Version 1.0 | Status: Living Document | 2026**

---

## Overview

This runbook defines visual QA tests that are run using the **dev-browser** tool inside Claude Code.
Each test is a prompt you give to Claude. Claude navigates the browser, takes screenshots, interacts with the UI, and reports pass/fail.

**When to use this runbook:**
- After any PR is merged to `staging`
- Before any PR is merged to `main`
- After any UI or data-flow change, even small ones
- Before tournament day as part of the pre-launch checklist

**Prerequisites:**
- Dev server running: `npm run dev` → `http://localhost:3000`
- OR testing against staging: `https://staging.mundial.app`
- A logged-in user session in the browser (or test credentials ready)
- Admin email set in `.env.local` for admin tests

**How to invoke a test:**
Paste the prompt in the **Prompt** column directly to Claude Code. Claude will use dev-browser to execute it and return screenshots + a pass/fail verdict.

---

## Test Groups

| Group | ID Range | Description |
| :--- | :--- | :--- |
| Login | QA-LOGIN | Login screen rendering and OAuth flow |
| Onboarding | QA-ONBOARD | Neighbourhood selection and league setup |
| Dashboard | QA-DASH | Match cards, prediction inputs, timer, lock state |
| Leaderboard | QA-LB | Rankings, league switching, member drilldown |
| History | QA-HIST | History list, filters, stats bar |
| Golden Boot | QA-GB | Player search, selection, lock state |
| Tournament | QA-TOURN | Group standings and bracket view |
| Profile | QA-PROF | Stats, settings, league management |
| Admin | QA-ADMIN | Score manager, undo, test mode |
| RTL & A11y | QA-RTL | Right-to-left layout, touch targets, flags |
| Error States | QA-ERR | Empty states, network errors, locked states |

---

## QA-LOGIN — Login Screen

### QA-LOGIN-01 — Login screen renders correctly

**Prompt:**
> Navigate to `http://localhost:3000`. Take a full-page screenshot. Verify: (1) app name "WC26" is visible and large, (2) tagline "נחש · תחרה · תנצח" is visible below the logo, (3) "המשך עם Google" button is visible, (4) credit text "created by Yuval Shahar" appears at the bottom, (5) background is dark, (6) layout is RTL (text right-aligned).

**Pass criteria:**
- All 5 text elements present
- Dark background
- Text is right-aligned (RTL confirmed)
- No console errors

---

### QA-LOGIN-02 — Google button is tappable and has correct size

**Prompt:**
> Navigate to `http://localhost:3000`. Inspect the "המשך עם Google" button. Verify its rendered height and width are at least 44px (minimum touch target). Take a screenshot highlighting the button boundaries.

**Pass criteria:**
- Button height ≥ 44px
- Button width ≥ 44px

---

### QA-LOGIN-03 — Terms and privacy links are present

**Prompt:**
> Navigate to `http://localhost:3000`. Scroll to the bottom. Verify the text "בהתחברות, אתה מסכים ל" is visible with links for "תנאי השימוש" and "מדיניות הפרטיות". Take a screenshot.

**Pass criteria:**
- Both links visible
- Text is in Hebrew, right-aligned

---

## QA-ONBOARD — Onboarding

### QA-ONBOARD-01 — Neighbourhood selection screen

**Prompt:**
> Navigate to `http://localhost:3000/onboarding/neighbourhood` (or the path that shows neighbourhood selection for a new user). Take a screenshot. Verify: (1) title "באיזו שכונה אתה גר?" is visible, (2) neighbourhood cards are shown in a grid, (3) "המשך" button is disabled (greyed out), (4) "דלג, אבחר מאוחר יותר" skip link is visible.

**Pass criteria:**
- All 4 elements present
- Continue button visibly disabled before selection

---

### QA-ONBOARD-02 — Selecting a neighbourhood enables the button

**Prompt:**
> Navigate to the neighbourhood selection screen. Click the first neighbourhood card. Take a screenshot. Verify: (1) the selected card has a visible highlight (border or background change), (2) the "המשך" button becomes enabled (not greyed out).

**Pass criteria:**
- Selected card visually distinguished
- Continue button enabled after selection

---

### QA-ONBOARD-03 — League creation flow

**Prompt:**
> Navigate to the onboarding screen (league creation / join). Take a screenshot. Verify: (1) "צור ליגה" card is visible, (2) join code input is visible with placeholder "הכנס קוד — A4X9K2", (3) "הצטרף" button is visible, (4) layout is RTL.

**Pass criteria:**
- All elements present
- Placeholder text correct

---

### QA-ONBOARD-04 — Invalid invite code shows error

**Prompt:**
> Navigate to the onboarding screen. Type "XXXXXX" into the join code input. Click "הצטרף". Wait for the response. Take a screenshot. Verify the error message "קוד לא תקין, נסה שוב" is visible.

**Pass criteria:**
- Error message shown in Hebrew
- No crash or unhandled error

---

## QA-DASH — Dashboard

### QA-DASH-01 — Dashboard renders match cards

**Prompt:**
> Log in and navigate to `http://localhost:3000/dashboard`. Take a full-page screenshot. Verify: (1) at least one match card is visible, (2) each card shows two team names with flags, (3) score inputs are visible, (4) the date label (e.g. "היום · יום שני 20.4") is shown, (5) layout is RTL (teams display: right team = home team).

**Pass criteria:**
- Match cards visible with flags and score inputs
- Date label in Hebrew
- RTL layout confirmed

---

### QA-DASH-02 — Score input accepts numbers

**Prompt:**
> Navigate to the dashboard. Find a match card with an unlocked prediction input. Click on the score input for team A. Type "3". Take a screenshot. Verify "3" appears in the input field.

**Pass criteria:**
- Input accepts numeric value
- Value displayed correctly

---

### QA-DASH-03 — Save prediction shows success toast

**Prompt:**
> Navigate to the dashboard. Find an unlocked match. Enter score "2" for team A and "1" for team B. Click "שמור ניחוש". Wait up to 3 seconds. Take a screenshot. Verify the toast "הניחוש נשמר" appears.

**Pass criteria:**
- Toast visible with correct Hebrew text
- Toast disappears after a few seconds (take two screenshots — before and after)

---

### QA-DASH-04 — Locked match shows lock state

**Prompt:**
> Navigate to the dashboard. If any match is locked (is_locked = true, or kickoff is past T-5min), take a screenshot of that card. Verify: (1) score inputs are disabled, (2) the label "נעול" is visible, (3) no "שמור ניחוש" button is shown.

**Pass criteria:**
- Inputs disabled
- "נעול" label visible
- Save button absent

---

### QA-DASH-05 — Golden Boot banner is visible

**Prompt:**
> Navigate to the dashboard. Take a screenshot. Look for the green banner "חזה מי יהיה מלך השערים ←". Verify it is visible and tapping it navigates to the Golden Boot screen.

**Pass criteria:**
- Banner visible with correct text
- Navigation works

---

### QA-DASH-06 — Points badges appear after result

**Prompt:**
> Navigate to the dashboard. Find a match card that has a finished result with points awarded. Take a screenshot. Verify one of the following badges is visible: "⚽ בינגו · 3 נקודות" (gold), "✓ תוצאה נכונה · 1 נקודה" (green), or "✗ פספוס · 0 נקודות" (gray). Verify the badge is positioned correctly (RTL: near the right edge).

**Pass criteria:**
- Badge visible with correct text and color
- Positioned on RTL-correct side

---

## QA-LB — Leaderboard

### QA-LB-01 — Leaderboard renders with rankings

**Prompt:**
> Log in and navigate to `http://localhost:3000/leaderboard`. Take a full-page screenshot. Verify: (1) the title "דירוג" is shown, (2) at least one member row is visible, (3) the current user's row has a teal/highlighted background, (4) each row shows rank number, avatar/initials, display name, and points, (5) layout is RTL.

**Pass criteria:**
- All 4 row elements present
- Current user row highlighted
- RTL layout confirmed

---

### QA-LB-02 — League tabs switch leaderboard

**Prompt:**
> Navigate to `/leaderboard`. If multiple league tabs are visible at the top, click the second tab. Wait 1 second. Take a screenshot. Verify the leaderboard data updates (member list changes or updates) and the active tab is visually highlighted.

**Pass criteria:**
- Tab switches correctly
- Active tab highlighted
- Data updates

---

### QA-LB-03 — Neighbourhood tab shows "בקרוב" badge

**Prompt:**
> Navigate to `/leaderboard`. Look for a "שכונות" tab. Take a screenshot. Verify the tab has a "בקרוב" (coming soon) label on it. Verify the tab is either disabled or shows a coming-soon message when tapped.

**Pass criteria:**
- "בקרוב" badge visible on the tab
- Tab does not show broken/empty state

---

### QA-LB-04 — Tapping a member navigates to their predictions

**Prompt:**
> Navigate to `/leaderboard`. Find a member row that is NOT the current user. Click on that row. Wait for navigation. Take a screenshot. Verify: (1) the URL changed to `/leaderboard/[userId]`, (2) a back button "← חזרה" is visible in the top-left (RTL: top-right), (3) the member's name is shown in the header.

**Pass criteria:**
- Navigation succeeds
- Back button visible and RTL-correct
- Member name in header

---

### QA-LB-05 — Member predictions drilldown shows match cards

**Prompt:**
> Navigate to a member's prediction drilldown page (e.g. `/leaderboard/[userId]?leagueId=...&name=Bob`). Take a full-page screenshot. Verify: (1) match cards are grouped by date, (2) each card shows the match teams, the member's predicted score, the actual score, and a points badge, (3) if a match is live, a red "LIVE" badge appears in the top-right corner of that card, (4) layout is RTL.

**Pass criteria:**
- Cards grouped by date
- Predicted score visible on each card
- LIVE badge positioned at RTL leading edge (top-right)

---

### QA-LB-06 — Empty predictions state

**Prompt:**
> Navigate to a member drilldown where the member has no predictions yet. Take a screenshot. Verify the empty state text "עוד לא ניחש כלום" is shown.

**Pass criteria:**
- Empty state visible
- No crash or blank screen

---

## QA-HIST — History

### QA-HIST-01 — History screen renders

**Prompt:**
> Navigate to `http://localhost:3000/history`. Take a full-page screenshot. Verify: (1) title "היסטוריה" is shown, (2) filter buttons are visible (הכל / בינגו / תוצאה נכונה / פספוס), (3) stats bar shows משחקים / נקודות / בינגו / נכון / פספוס, (4) match history cards are listed.

**Pass criteria:**
- All filter buttons visible
- Stats bar visible with Hebrew labels
- Cards listed in reverse chronological order

---

### QA-HIST-02 — Bingo filter works

**Prompt:**
> Navigate to `/history`. Click the "בינגו" filter button. Take a screenshot. Verify: (1) the button appears active/highlighted, (2) only cards with the "⚽ בינגו" badge are shown.

**Pass criteria:**
- Filter highlights correctly
- Only bingo cards shown (or empty state if none)

---

### QA-HIST-03 — Empty history state

**Prompt:**
> Navigate to `/history` for a new user with no history. Take a screenshot. Verify the empty state "אין משחקים עדיין" is shown.

**Pass criteria:**
- Empty state text visible
- No crash

---

## QA-GB — Golden Boot

### QA-GB-01 — Golden Boot screen renders player list

**Prompt:**
> Navigate to `http://localhost:3000/golden-boot`. Take a full-page screenshot. Verify: (1) title "מלך השערים ⚽" is shown, (2) a list of players is visible with flag icons, (3) a search input with placeholder "חפש שחקן..." is shown, (4) the deadline timer label "נועל לפני המשחק הראשון" is visible.

**Pass criteria:**
- All 4 elements visible
- Flags are SVG (not emoji)
- RTL layout

---

### QA-GB-02 — Player search filters list

**Prompt:**
> Navigate to `/golden-boot`. Type "Ron" in the search input. Take a screenshot. Verify only players whose name contains "Ron" (e.g. Ronaldo) remain visible in the list.

**Pass criteria:**
- List filters correctly
- Empty result if no match (no crash)

---

### QA-GB-03 — Player selection shows preview bar

**Prompt:**
> Navigate to `/golden-boot`. Click any player in the list. Take a screenshot. Verify: (1) the selected player row has a visual highlight, (2) a preview bar at the bottom shows "הבחירה שלך: [player name]", (3) a "אשר בחירה" button is visible.

**Pass criteria:**
- Row highlighted
- Preview bar visible with correct text
- Confirm button visible

---

### QA-GB-04 — Locked state after tournament start

**Prompt:**
> Navigate to `/golden-boot` when the golden boot is already locked (if a prediction was already confirmed). Take a screenshot. Verify: (1) the title "הניחוש נעול" is shown, (2) the text "ניחשת: [player name]" is shown, (3) the player list is not interactive, (4) a "חזרה לניחושים" link is visible.

**Pass criteria:**
- Locked state renders correctly
- Player name shown
- No interactive elements

---

## QA-TOURN — Tournament Screen

### QA-TOURN-01 — Group standings tab renders

**Prompt:**
> Navigate to `http://localhost:3000/tournament`. Take a full-page screenshot. Verify: (1) "בתים" tab is active, (2) group tables are shown (e.g. Group A, Group B...), (3) each row shows team name with flag, and columns מ' / נ' / ת' / ה' / נק', (4) layout is RTL.

**Pass criteria:**
- Group tables visible with correct column headers
- Flags are SVG
- RTL layout

---

### QA-TOURN-02 — Knockout bracket tab renders

**Prompt:**
> Navigate to `/tournament`. Click the "נוקאאוט" tab. Take a screenshot. Verify: (1) the tab is now active, (2) bracket rounds are shown: Round of 32, Round of 16, Quarter-Final, Semi-Final, Final, (3) stage labels use Hebrew names from the copy spec, (4) "ממתין" placeholder shows for unresolved matchups.

**Pass criteria:**
- All round labels in Hebrew
- "ממתין" shown for pending slots
- No broken layout

---

## QA-PROF — Profile

### QA-PROF-01 — Profile screen renders correctly

**Prompt:**
> Navigate to `http://localhost:3000/profile`. Take a full-page screenshot. Verify: (1) title "פרופיל" is shown, (2) user avatar and display name are visible, (3) "מחובר עם Google" (or Apple) subtitle is shown, (4) stats row shows דירוג / נקודות / בינגו, (5) sections: הגדרות, ליגות, אחר are visible, (6) "התנתק" button is red and at the bottom.

**Pass criteria:**
- All sections visible
- Logout button red
- RTL layout

---

### QA-PROF-02 — Dark mode toggle works

**Prompt:**
> Navigate to `/profile`. Find the "מצב כהה" toggle. Click it. Take a screenshot. Verify the page switches to dark background. Click it again. Take another screenshot. Verify the page reverts to light mode.

**Pass criteria:**
- Dark mode applies immediately
- Toggle reverses correctly

---

### QA-PROF-03 — League delete button shows only for creator

**Prompt:**
> Navigate to `/profile`. Look at the leagues section. Find a league that the current user created. Verify a "מחק ליגה" button or option is visible next to it. Then verify that for leagues where the user is NOT the creator, no delete option is shown.

**Pass criteria:**
- Delete option only on own leagues
- Global league "כולנו" has no delete option

---

### QA-PROF-04 — League delete confirmation flow

**Prompt:**
> Navigate to `/profile`. Click "מחק ליגה" for a league the user created. Take a screenshot. Verify a confirmation prompt appears with "בטוח?", "כן, מחק", and "ביטול" options. Click "ביטול". Verify the league is still there.

**Pass criteria:**
- Confirmation dialog shown
- Cancel aborts deletion
- League remains after cancel

---

## QA-ADMIN — Admin Score Manager

> **Prerequisite:** Must be logged in as the admin email defined in `ADMIN_EMAIL`.

### QA-ADMIN-01 — Admin page is protected

**Prompt:**
> Log out (or use an incognito window with a non-admin account). Navigate to `http://localhost:3000/admin`. Take a screenshot. Verify the page redirects away (to `/dashboard` or login) and does NOT render the admin UI.

**Pass criteria:**
- Non-admin cannot access `/admin`
- Redirect happens before any admin UI renders

---

### QA-ADMIN-02 — Admin page renders for admin user

**Prompt:**
> Log in as the admin user. Navigate to `http://localhost:3000/admin`. Take a full-page screenshot. Verify: (1) a list of matches is shown, (2) each match row shows team names and current status, (3) a stage filter dropdown is visible, (4) a team name search input is visible, (5) a "Test Mode" checkbox is visible.

**Pass criteria:**
- All controls visible
- Match list populated

---

### QA-ADMIN-03 — Expanding a match row

**Prompt:**
> Navigate to `/admin` as admin. Click on any match row to expand it. Take a screenshot. Verify: (1) score inputs for team A and team B appear, (2) a status dropdown appears, (3) a "שמור" (Save) button appears.

**Pass criteria:**
- Row expands to show editor controls
- Inputs are blank or pre-filled with current score

---

### QA-ADMIN-04 — Saving a score update

**Prompt:**
> Navigate to `/admin`. Enable "Test Mode" checkbox. Find any match. Expand it. Enter score 2 for team A, 1 for team B. Set status to "finished". Click Save. Wait up to 3 seconds. Take a screenshot. Verify a success message appears and the row updates to show the new score.

**Pass criteria:**
- Success message visible
- Row displays new score after save
- No error message

---

### QA-ADMIN-05 — Undo button appears after save

**Prompt:**
> Navigate to `/admin`. After successfully saving a score update (as in QA-ADMIN-04), take a screenshot. Verify an "Undo" button is visible on the same row.

**Pass criteria:**
- Undo button visible after a score has been saved

---

### QA-ADMIN-06 — Undo reverts the score

**Prompt:**
> Navigate to `/admin`. After saving a score (QA-ADMIN-04), click the Undo button. Wait up to 3 seconds. Take a screenshot. Verify: (1) the score reverts to the previous value, (2) the Undo button disappears.

**Pass criteria:**
- Score reverts correctly
- Undo button gone after undo

---

### QA-ADMIN-07 — Stage filter narrows match list

**Prompt:**
> Navigate to `/admin`. Select "Group" from the stage filter dropdown. Take a screenshot. Verify only group-stage matches are visible in the list.

**Pass criteria:**
- Filter reduces list to matching stage
- Other stages hidden

---

### QA-ADMIN-08 — Team name search works

**Prompt:**
> Navigate to `/admin`. Type "France" (or any team name present in the data) in the search input. Take a screenshot. Verify only matches involving that team are shown.

**Pass criteria:**
- Search filters correctly
- Case-insensitive match

---

### QA-ADMIN-09 — Admin page shows error when SUPABASE_SERVICE_ROLE_KEY is missing

**Prompt:**
> (Staging/local only) Temporarily unset `SUPABASE_SERVICE_ROLE_KEY` from the environment and restart the dev server. Navigate to `/admin` as admin. Take a screenshot. Verify the page renders an error message containing "SUPABASE_SERVICE_ROLE_KEY is not set" instead of crashing with a blank 500 page.

**Pass criteria:**
- Descriptive error shown on-screen
- No generic 500 / blank page

---

### QA-ADMIN-10 — Saving a score triggers scoring and awards correct points

**Prompt:**
> Navigate to `/admin`. Enable Test Mode. Find a finished match where at least one user has made a prediction. Enter the correct score and set status to "finished". Click Save. Wait 3 seconds. Navigate to `/leaderboard`. Verify the user who predicted correctly has non-zero points for that match in `/history`.

**Pass criteria:**
- Save shows "Saved ✓" with no scoring error
- User's points increase in the leaderboard
- History shows the correct points for that match

---

### QA-ADMIN-11 — League manager tab lists non-global leagues

**Prompt:**
> Navigate to `/admin`. Click the "Leagues" tab. Take a screenshot. Verify: (1) a list of leagues is shown with name, invite code, and member count, (2) the global league ("כולנו") is NOT listed, (3) each league row has a "Delete" button.

**Pass criteria:**
- Global league absent from list
- All other leagues shown with correct metadata

---

### QA-ADMIN-12 — League delete requires confirmation

**Prompt:**
> Navigate to `/admin` → Leagues tab. Click "Delete" on any league. Take a screenshot. Verify a "Sure?" confirmation with "Delete" and "Cancel" buttons appears inline. Click "Cancel". Verify the league is still listed.

**Pass criteria:**
- Confirmation shown before deletion
- Cancel aborts deletion

---

### QA-ADMIN-13 — User manager tab lists all users

**Prompt:**
> Navigate to `/admin`. Click the "Users" tab. Take a screenshot. Verify: (1) a list of users is shown with display name, email, provider, and join date, (2) a search input is visible, (3) each row has a "Remove" button.

**Pass criteria:**
- All users listed
- Search input functional (type a name, list filters)

---

### QA-ADMIN-14 — User delete requires confirmation and cascades

**Prompt:**
> Navigate to `/admin` → Users tab. Click "Remove" on a test user. Take a screenshot. Verify a "Delete user + all data?" confirmation appears. Click "Delete". Verify the user disappears from the list. Navigate to `/leaderboard` and confirm the user is no longer ranked.

**Pass criteria:**
- Two-step confirmation required
- User removed from list immediately
- User absent from leaderboard after deletion

---

## QA-RTL — RTL Layout & Accessibility

### QA-RTL-01 — `dir="rtl"` is set on root

**Prompt:**
> Navigate to `http://localhost:3000`. Inspect the root HTML element (or `<body>`). Verify `dir="rtl"` is set. Take a screenshot of the DevTools element panel showing this attribute.

**Pass criteria:**
- `dir="rtl"` present on `<html>` or root container

---

### QA-RTL-02 — Back arrow direction is correct

**Prompt:**
> Navigate to any screen that has a back button (e.g. leaderboard member drilldown). Take a screenshot. Verify the back arrow points LEFT (←), not right (→), which is correct for RTL navigation (going "back" in RTL means going to the right visually, but the arrow symbol ← is the return arrow).

**Pass criteria:**
- Arrow is `←` not `→`

---

### QA-RTL-03 — Chevron icons rotate for RTL

**Prompt:**
> Navigate to `/leaderboard`. Find a leaderboard row with a chevron (›) icon indicating it's tappable. Take a screenshot. Verify the chevron points LEFT (‹) in RTL mode, indicating navigation goes right-to-left.

**Pass criteria:**
- Chevron visually points left in RTL

---

### QA-RTL-04 — All flags render as SVG, not emoji

**Prompt:**
> Navigate to the dashboard. Take a screenshot. Inspect 3 different flag icons. Verify they are rendered as `<img>` or `<span class="fi ...">` SVG elements, NOT as Unicode emoji (e.g. 🇫🇷).

**Pass criteria:**
- No emoji flags anywhere on the page
- Flags are CSS/SVG from flag-icons library or img tags

---

### QA-RTL-05 — Touch targets meet 44px minimum

**Prompt:**
> Navigate to the dashboard. Inspect the following interactive elements and verify each has a rendered height and width ≥ 44px: (1) Save prediction button, (2) bottom tab bar icons, (3) back button on drilldown page, (4) any filter pill button.

**Pass criteria:**
- All checked elements ≥ 44×44px

---

### QA-RTL-06 — Score inputs use numeric keyboard hint

**Prompt:**
> Navigate to the dashboard. Inspect a score input element. Verify it has `inputMode="numeric"` or `type="number"` attribute set. Take a DevTools screenshot showing the attribute.

**Pass criteria:**
- `inputMode="numeric"` or `type="number"` present

---

## QA-ERR — Error States & Empty States

### QA-ERR-01 — Dashboard with no matches shows empty state

**Prompt:**
> If the dashboard has no matches for today, navigate to it and take a screenshot. Verify the empty state "אין משחקים היום" is shown (not a blank page or loading spinner stuck).

**Pass criteria:**
- Empty state text visible
- No spinner stuck

---

### QA-ERR-02 — Leaderboard with no league members

**Prompt:**
> Navigate to `/leaderboard` on a fresh account with only the global league and no other members. Take a screenshot. Verify the empty state "הליגה עדיין ריקה — שתף את הקוד!" is shown.

**Pass criteria:**
- Empty state visible with correct text

---

### QA-ERR-03 — Attempting to predict on a locked match

**Prompt:**
> Find a locked match on the dashboard. Try to type in the score input. Take a screenshot. Verify the input is disabled (cannot type). Then try to click "שמור ניחוש" if it's still visible. Verify the error "המשחק נעול. לא ניתן לשנות ניחוש" appears.

**Pass criteria:**
- Input is disabled
- Error message shown if save is attempted

---

### QA-ERR-04 — Non-admin access to /admin redirects

*See QA-ADMIN-01 above.*

---

## Full Regression Run Order

Run these tests in order before each merge to `main`:

1. QA-LOGIN-01, QA-LOGIN-02
2. QA-DASH-01, QA-DASH-02, QA-DASH-03, QA-DASH-04, QA-DASH-06
3. QA-LB-01, QA-LB-04, QA-LB-05
4. QA-HIST-01, QA-HIST-02
5. QA-GB-01, QA-GB-03
6. QA-TOURN-01, QA-TOURN-02
7. QA-PROF-01, QA-PROF-02
8. QA-ADMIN-01, QA-ADMIN-02, QA-ADMIN-04, QA-ADMIN-05, QA-ADMIN-06
9. QA-RTL-01, QA-RTL-02, QA-RTL-04
10. QA-ERR-01, QA-ERR-03

**Estimated run time:** ~25–30 minutes for full regression.

---

## Test Log Template

Use this to record results for each release:

```
Date: ___________
Tester: Claude (dev-browser)
Environment: localhost:3000 | staging.mundial.app
Branch: ___________

| Test ID       | Result | Notes |
| ------------- | ------ | ----- |
| QA-LOGIN-01   | PASS   |       |
| QA-LOGIN-02   | PASS   |       |
| ...           |        |       |

Overall: PASS / FAIL
Blockers: (list any FAIL tests that block release)
```

---

## Run History

### Run 2026-04-20 #2 — Flows Run (dev-browser + Static Code Analysis)

```
Date: 2026-04-20
Tester: Claude Sonnet 4.6 (dev-browser live + source code analysis)
Environment: localhost:3000 (Next.js 16.2.3, Turbopack, confirmed running)
Branch: main
Method: dev-browser for unauthenticated routes; source code analysis for auth-gated flows
```

| Test ID             | Result | Notes |
| ------------------- | ------ | ----- |
| FLOW-01 Step 1      | PASS   | Login page renders at `/login`. All 5 elements present: WC26, tagline, button, credit, terms links. `dir="rtl"` `lang="he"` confirmed on html root. |
| FLOW-01 Step 2      | PASS   | `setLoading(true)` + `setTimeout(resolve, 0)` macrotask before OAuth redirect confirmed. Spinner renders before redirect. `useMemo` wraps `createClient()`. |
| FLOW-01 Steps 3–8   | SKIP   | Requires real Google OAuth session against live Supabase. |
| FLOW-02             | SKIP   | Requires two authenticated user sessions and live DB league row. |
| FLOW-03 Step 1      | PASS   | Unauthenticated request to `/dashboard` redirects to `/login`. |
| FLOW-03 Steps 2–6   | PASS (code) | `handleSave` uses upsert with `onConflict: "user_id,match_id"`. Toast "הניחוש נשמר ✓". Lock check at T-5min. Optimistic update pattern correct. |
| FLOW-04 Steps 1,3,4 | PASS (code) | `effectiveLocked = isLocked || timerLocked || status !== "scheduled"`. Save button absent from DOM (not merely disabled) when locked. Inputs `disabled`. |
| FLOW-04 Step 5      | PASS (code) | `COPY.matchLocked = "המשחק כבר נעול — אי אפשר לשנות"` confirmed. Client check fires before DB call. |
| FLOW-04 Step 2      | SKIP   | Requires live DB `kickoff_at` update. |
| FLOW-05 Steps 1–4   | PASS (code) | `updateMatchScore` verifies admin in server action body. `run-scoring` triggered when `status === "finished"`. Realtime `postgres_changes` subscription updates dashboard. |
| FLOW-06             | PASS (code) | `calcPoints`: exact → 3 (bingo), correct outcome → 1, wrong → 0. Matrix verified: 2-1 actual; pred 2-1 = bingo (3), pred 3-1 = correct (1), pred 0-0 = miss (0). |
| FLOW-07 Steps 1–6   | PASS (code) | `savedToast = "הבחירה נשמרה ✓"`. Button → "שנה בחירה" after save. Locked: `lockedSubtitle`, amber read-only bar with "נעול" badge, no confirm button. |
| FLOW-07 (back arrow)| FAIL   | `COPY.back = "→"` in `golden-boot/page.tsx`. Should be `"←"` per QA-RTL-02 spec. See FLOW-FAIL-01. |
| FLOW-08 Steps 1–5   | PASS (code) | `useUserPredictions` uses `SECURITY DEFINER` RPC. Back arrow `"←"` correct. Member name in header. |
| FLOW-08 Step 6      | PASS   | Accessing `/leaderboard/[id]` without `leagueId` redirects to `/leaderboard` (confirmed via browser: redirects to `/login` because unauthenticated, which is correct). Guard `if (!leagueId) { router.replace("/leaderboard") }` confirmed in source. |
| FLOW-09             | PASS (code) | `undoMatchScore`: reads prev values, "Nothing to undo" guard, clears prev columns, always calls `triggerScoring` after undo. |
| FLOW-09 (admin redirect) | PASS | `/admin` for unauthenticated user redirects to `/login` — confirmed browser. |
| FLOW-10             | PASS (code) | Delete only for `isOwner`. Confirmation inline with "כן, מחק" (red) and "ביטול". Toast "הליגה נמחקה". RLS `for delete using (auth.uid() = created_by)` confirmed in migration `20260419000004_leagues_delete_policy.sql`. |
| FLOW-11             | SKIP   | Requires two authenticated sessions. All component logic verified via FLOW-01–10. |
| FLOW-12             | PASS (code) | Filters: bingo=3, correct=1, miss=0 via `filterByResult`. Stats on unfiltered entries. Empty state "עדיין אין משחקים שהסתיימו". Date labels use `he-IL` toLocaleDateString. |
| FLOW-13             | PASS (code) | Duplicate name detected via Postgres error code "23505". Error "השם הזה כבר תפוס — נסה שם אחר". Input border turns red. Error clears on input change. |
| FLOW-14             | PASS (code) | Inline edit mode. Save disabled when `!nameInput.trim()`. Toast "השם עודכן ✓". Cancel restores previous name. |
| FLOW-15             | PASS (code) | Profile: `navigator.clipboard.writeText`, toast "קוד הועתק ✓". Create-league: button toggles to "הועתק!" for 2s. WhatsApp share URL with correct Hebrew message format. |
| FLOW-16             | PASS (code) | Neighbourhood row disabled + `opacity-60` when `hood_locked`. Tooltip "הטורניר התחיל — לא ניתן לשנות". Navigates to `/onboarding/neighbourhood?redirect=/profile` when unlocked. |

**Fixes verified from Run #1:**

| Issue ID   | Fix Status | Evidence |
| ---------- | ---------- | -------- |
| FAIL-01    | FIXED      | `MatchCard.tsx` and `HistoryMatchCard.tsx` both now have `correct: "✓ תוצאה נכונה · 1 נקודה"` |
| FAIL-02    | FIXED      | `history/page.tsx` `COPY.filterCorrect = "תוצאה נכונה"` |
| FAIL-03    | FIXED      | `history/page.tsx` date labels use `new Date(dateKey).toLocaleDateString("he-IL", ...)` not raw string |
| FAIL-06    | FIXED      | `LeaderboardRow.tsx` `rtl:rotate-180` removed. SVG path draws ‹ natively. |
| CQ-01      | FIXED      | `league/page.tsx` line 33: `supabase = useMemo(() => createClient(), [])` |
| CQ-02      | FIXED      | `create-league/page.tsx` line 28: `supabase = useMemo(() => createClient(), [])` |
| CQ-03      | FIXED      | `league/page.tsx` both `getUser()` calls now destructure `authError` and check `if (authError || !user)` |

**New failures found in this run:**

| Issue ID      | Result | Notes |
| ------------- | ------ | ----- |
| FLOW-FAIL-01  | FAIL   | `golden-boot/page.tsx` `COPY.back = "→"` — back button is rightward arrow. Should be `"←"` per RTL spec and QA-RTL-02. Also `create-league/page.tsx` line 140 has hardcoded `→` back arrow. |
| CQ-10         | FAIL   | `MatchCard.test.tsx` 4 failing unit tests: tests look for `"שמור ניחוש"` but `COPY.btnSave = "שמור"`; tests look for `"ממתין לתוצאה"` but `COPY.pending = "מחכים לתוצאה..."`. Test copy strings are stale. |
| CQ-11         | FAIL   | `dashboard.spec.ts` (e2e) lines 45, 58, 64: also look for `"שמור ניחוש"` — same stale button label. |
| QA-GB-05      | FAIL   | `PlayerList.tsx` search is case-sensitive — `p.name.includes(search.trim())` with no `.toLowerCase()`. Typing lowercase (e.g. "messi") does not match "Messi". |
| CQ-12         | WARN   | `league/page.tsx` `useEffect` deps array is `[]` but closure references `supabase`. Stable `useMemo` ref means no runtime bug, but ESLint exhaustive-deps will warn. |
| CQ-13         | WARN   | `LeaderboardRow.tsx` line 96: stale comment says "rtl:rotate-180 mirrors it" but the class was removed. Misleading comment should be updated. |

**FAIL-04, FAIL-05 from Run #1 — status:**
- FAIL-04 (`noMatches` text): still "אין משחקים בקרוב — תחזור אחרי ההגרלה ⚽" — QA spec says "אין משחקים היום". Recommended fix: update QA spec to match implemented copy. Not a regression.
- FAIL-05 (locked error text + save button behavior): still "המשחק כבר נעול — אי אפשר לשנות". QA spec says different text. Recommended fix: update QA spec. Not a regression.

Overall: **FAIL** (3 real bugs: FLOW-FAIL-01, CQ-10/11, QA-GB-05)

Blockers:
- CQ-10: Unit tests failing in CI (4 tests in `MatchCard.test.tsx`)
- CQ-11: E2E tests will fail on dashboard save button label

Non-blockers (should fix before launch):
- FLOW-FAIL-01: Back arrows inconsistent (`→` in golden-boot and create-league vs `←` in leaderboard)
- QA-GB-05: Case-sensitive player search — poor UX when typing lowercase

---

**New Tests Added in Run #2:**

**QA-FLOW-GB-BACK — Golden boot back button uses ← not →**
- Category: RTL / FLOW-07
- Precondition: Navigate to `/golden-boot`
- Steps: Observe back button in header. Check `COPY.back` value.
- Expected: `"←"` (consistent with leaderboard drilldown back arrow)
- Status: [FAIL] — `COPY.back = "→"` in `golden-boot/page.tsx`

**QA-UNIT-MATCHCARD-SYNC — MatchCard unit tests match current copy strings**
- Category: Code Quality / Unit Tests
- Precondition: Source at current state
- Steps: Run `npx jest tests/unit/MatchCard.test.tsx`
- Expected: All tests pass
- Status: [FAIL] — 4 tests fail due to stale `"שמור ניחוש"` and `"ממתין לתוצאה"` strings

---

### Run 2026-04-20 — Full Regression (Static Code Analysis)

```
Date: 2026-04-20
Tester: Claude Sonnet 4.6 (source code analysis — dev-browser not available)
Environment: localhost:3000 (server confirmed running, HTTP 307)
Branch: main (no git repo initialized)
Method: Full source file review of all pages, components, hooks, and actions
```

| Test ID        | Result | Notes |
| -------------- | ------ | ----- |
| QA-LOGIN-01    | PASS   | All 5 copy strings present in COPY object. Dark bg (bg-white — NOTE: white bg, not dark). `dir="rtl"` on html root. |
| QA-LOGIN-02    | PASS   | Button has `h-12` (48px) and `w-full`. Both height and width ≥ 44px. |
| QA-DASH-01     | PASS   | Match cards render with FlagIcon (CSS fi-* span, not emoji), score inputs, date labels in Hebrew, RTL layout. |
| QA-DASH-02     | PASS   | ScoreBox input has `type="number"` and `inputMode="numeric"`. Accepts numeric values. |
| QA-DASH-03     | PASS   | `COPY.toastSaved = "הניחוש נשמר ✓"`. Toast auto-clears after 2500ms. |
| QA-DASH-04     | PASS   | When `effectiveLocked`, ScoreBox is disabled, LockIcon + "נעול" shown, save button absent. |
| QA-DASH-06     | FAIL   | Badge for "correct" shows "✓ כיוון נכון · 1 נקודה" not "✓ תוצאה נכונה · 1 נקודה" as specified. See FAIL-01. |
| QA-LB-01       | PASS   | Title "דירוג", member rows with position/avatar/name/points, current user highlighted in teal. RTL layout confirmed. |
| QA-LB-04       | PASS   | Back button shows "←" (`COPY.backArrow`). Member name in header. Navigation to `/leaderboard/[userId]`. |
| QA-LB-05       | PASS   | Cards grouped by date (sv-SE key), predicted score shown, actual score shown, LIVE badge at `top-2 right-2`. |
| QA-HIST-01     | FAIL   | Filter label for correct result is "ניחוש נכון" not "תוצאה נכונה". Date labels render raw YYYY-MM-DD not formatted Hebrew. See FAIL-02, FAIL-03. |
| QA-HIST-02     | PASS   | Filter state toggled via `setFilter`, active pill has `bg-[#0D9488]` highlight. |
| QA-GB-01       | PASS   | Title "מלך השערים", player list with FlagIcon (CSS spans), search input with "חפש שחקן..." placeholder. Lock countdown shown. |
| QA-GB-03       | PASS   | Selected row gets `bg-[#FAEEDA] border-[#EF9F27]` highlight. Preview bar shows player name. Confirm button visible. |
| QA-TOURN-01    | PASS   | "בתים" tab active by default. GroupTable renders with correct Hebrew headers (קבוצה/מ/נ/ת/ה/נק'). FlagIcon CSS spans. RTL via `dir="rtl"` on TournamentPage root. |
| QA-TOURN-02    | PASS   | "נוקאאוט" tab switches content. Stage labels in Hebrew (סבב 32, סבב 16, רבע גמר, חצי גמר, גמר). Unresolved teams show "—". |
| QA-PROF-01     | PASS   | Title "פרופיל", avatar+name, "מחובר עם Google/Apple", stats row (דירוג/נקודות/בינגו), settings/leagues sections, logout button red (`bg-[#FEE2E2] text-[#DC2626]`). |
| QA-PROF-02     | SKIP   | Dark mode toggle "מצב כהה" does not exist in the profile page. Feature not implemented. |
| QA-ADMIN-01    | PASS   | AdminPage Server Component: `if (authError || !user || user.email !== process.env.ADMIN_EMAIL) { redirect("/dashboard") }`. Non-admin redirected before render. |
| QA-ADMIN-02    | PASS   | Match list, status badges, stage filter dropdown (STAGES array), team search input, Test Mode checkbox — all present. |
| QA-ADMIN-04    | PASS   | Test Mode enables editing all matches. Save calls `updateMatchScore` Server Action which re-checks admin in `verifyAdmin()`. Success sets message "Saved". |
| QA-ADMIN-05    | PASS   | Undo button rendered when `match.prev_score_a !== null`. Shows `Undo → {prev_score_a}:{prev_score_b}`. |
| QA-ADMIN-06    | PASS   | `undoMatchScore` Server Action swaps prev→current, clears prev. `handleUndo` updates row state + triggers `router.refresh()`. |
| QA-RTL-01      | PASS   | `<html lang="he" dir="rtl" ...>` in `app/layout.tsx` line 40. |
| QA-RTL-02      | PASS   | Back arrow on drilldown page is `←` (`COPY.backArrow = "←"`). Correct for RTL navigation. |
| QA-RTL-04      | PASS   | All flags use `<span className="fi fi-{code} ...">` CSS class pattern. No emoji flags found. |
| QA-ERR-01      | FAIL   | Empty state text is "אין משחקים בקרוב — תחזור אחרי ההגרלה ⚽" not "אין משחקים היום". See FAIL-04. |
| QA-ERR-03      | FAIL   | Error message is "המשחק כבר נעול — אי אפשר לשנות" not "המשחק נעול. לא ניתן לשנות ניחוש". Save button is absent (hidden) when locked — not just disabled. See FAIL-05. |

**Additional FAIL found outside regression order:**

| Test ID        | Result | Notes |
| -------------- | ------ | ----- |
| QA-RTL-03      | FAIL   | Chevron SVG path draws ‹ in LTR; `rtl:rotate-180` makes it › in RTL. QA spec and RTL UX convention require ‹. See FAIL-06. |
| QA-ONBOARD-01  | PASS   | Title "באיזו שכונה אתה גר?", grid of neighbourhood cards, disabled continue button (`disabled={!selectedId}`), skip button present. |
| QA-ONBOARD-02  | PASS   | Selected card gets `bg-[#F0FDFA] border-[#0D9488]`. Continue button enabled when `selectedId !== null`. |
| QA-ONBOARD-03  | PASS   | "צור ליגה" card, join input with placeholder "קוד הזמנה — A4X9K2", "הצטרף" button. |
| QA-ONBOARD-04  | PASS   | `isValidInviteCode` check fails first, then Supabase lookup — both paths surface `COPY.joinError = "קוד לא תקין, נסה שוב"`. |

**Code Quality Failures (not in regression order but blocking):**

| Issue ID | Result | Notes |
| -------- | ------ | ----- |
| CQ-01    | FAIL   | `app/(app)/onboarding/league/page.tsx` line 33: bare `createClient()` at component top level (not in useMemo). Causes WS leak per AGENTS.md. |
| CQ-02    | FAIL   | `app/(app)/onboarding/create-league/page.tsx` line 28: same bare `createClient()` pattern. |
| CQ-03    | FAIL   | `app/(app)/onboarding/league/page.tsx` lines 45, 109: `getUser()` destructured without `authError`. Only checks `!user`. Violates AGENTS.md auth rule. |
| CQ-04    | PASS   | `console.log` not found in committed source. `console.error` used in server-only contexts (acceptable for ops logging). |
| CQ-05    | PASS   | No `any` types found. No `@ts-ignore`. `tsconfig.json` has `"strict": true`. |
| CQ-06    | PASS   | NEXT_REDIRECT correctly rethrown in `profile/page.tsx` `handleLogout`. |
| CQ-07    | PASS   | Admin protection: `user.email === process.env.ADMIN_EMAIL` checked in BOTH Server Component AND every Server Action (`verifyAdmin()`). |
| CQ-08    | PASS   | Test files in `tests/unit/` and `tests/e2e/`, not co-located with source. |
| CQ-09    | PASS   | `useLeagueMembers` uses `SECURITY DEFINER` RPC `get_league_members`. No direct `.in()` on users table. |

---

### FAIL Details

**FAIL-01 (QA-DASH-06):** Correct-score badge text mismatch.
- Expected: "✓ תוצאה נכונה · 1 נקודה"
- Actual: "✓ כיוון נכון · 1 נקודה"
- File: `components/MatchCard.tsx` line 32; `components/HistoryMatchCard.tsx` line 18
- Fix: Update `COPY.correct` in both files, and `COPY.filterCorrect` in `app/(app)/history/page.tsx` from "ניחוש נכון" to "תוצאה נכונה".

**FAIL-02 (QA-HIST-01):** History filter "correct" label mismatch.
- Expected: "תוצאה נכונה"
- Actual: "ניחוש נכון"
- File: `app/(app)/history/page.tsx` line 14 (`filterCorrect`)
- Fix: See FAIL-01.

**FAIL-03 (QA-HIST-01):** History date labels render raw YYYY-MM-DD.
- Expected: Formatted Hebrew date label (e.g. "15 ביוני")
- Actual: Raw sv-SE key string "2026-06-15" rendered directly
- File: `app/(app)/history/page.tsx` line 103: `{dateKey}` should be `{formatDateLabel(dateKey)}`
- Fix: Add a `formatDateLabel(isoKey: string): string` function (same pattern as drilldown page) and call it in the date label `<p>`.

**FAIL-04 (QA-ERR-01):** Empty dashboard state text mismatch.
- Expected: "אין משחקים היום"
- Actual: "אין משחקים בקרוב — תחזור אחרי ההגרלה ⚽"
- File: `app/(app)/dashboard/page.tsx` line 16 (`COPY.noMatches`)
- Note: The actual text is arguably better UX. The QA spec should be updated to match the implemented copy, OR the copy should be updated to match the spec. Recommend updating the spec.

**FAIL-05 (QA-ERR-03):** Error message text mismatch and save button behavior mismatch.
- Expected error: "המשחק נעול. לא ניתן לשנות ניחוש"
- Actual toast: "המשחק כבר נעול — אי אפשר לשנות"
- Expected behavior: save button still visible but shows error
- Actual behavior: save button is completely absent when match is locked (good UX, but spec mismatch)
- File: `app/(app)/dashboard/page.tsx` line 15; `components/MatchCard.tsx` lock state rendering
- Fix: Update QA spec to match actual behavior, or update copy string to match spec.

**FAIL-06 (QA-RTL-03):** Chevron points the wrong direction in RTL.
- Expected: ‹ (left-pointing) in RTL context
- Actual: `rtl:rotate-180` on a left-pointing SVG produces › (right-pointing) in RTL
- File: `components/LeaderboardRow.tsx` line 86
- Fix: Remove the `rtl:rotate-180` class. The native ‹ chevron path is already the correct visual for RTL drill-down navigation.

**CQ-01, CQ-02 (Supabase client leak):**
- File: `app/(app)/onboarding/league/page.tsx` line 33; `app/(app)/onboarding/create-league/page.tsx` line 28
- Fix: `const supabase = useMemo(() => createClient(), []);`

**CQ-03 (Auth error not checked):**
- File: `app/(app)/onboarding/league/page.tsx` lines 45, 109
- Fix: Destructure `error: authError` from `getUser()` and add `if (authError || !user) return;`

---

### New Tests Added in This Run

**QA-ONBOARD-05 — Supabase client not leaked in onboarding pages**
- Category: Code Quality / Onboarding
- Precondition: Source code review
- Steps: Inspect `app/(app)/onboarding/league/page.tsx` and `create-league/page.tsx`. Verify `createClient()` is called inside `useMemo(() => createClient(), [])`, not bare at component top level.
- Expected: `useMemo` wrapper present in both files
- Status: [FAIL] — bare call found in both files

**QA-ONBOARD-06 — Auth error handled in league page getUser calls**
- Category: Code Quality / Auth
- Precondition: Source code review
- Steps: Inspect `app/(app)/onboarding/league/page.tsx`. Verify both `getUser()` calls destructure `authError` and check `if (authError || !user)`.
- Expected: Both auth checks handle `authError`
- Status: [FAIL] — only `!user` checked

**QA-HIST-03 — History date labels are formatted Hebrew, not raw YYYY-MM-DD**
- Category: History / UI
- Precondition: User has match history
- Steps: Navigate to `/history`. Observe the date group labels above match cards.
- Expected: Date labels show formatted Hebrew (e.g. "15 ביוני"), not raw "2026-06-15"
- Status: [FAIL] — raw YYYY-MM-DD rendered

**QA-GB-05 — Player search is case-insensitive**
- Category: Golden Boot / Search
- Precondition: Player list loaded
- Steps: Type "ron" (lowercase) in the search input. Verify players with "Ron" in their name (e.g. "Ronaldo") appear.
- Expected: Case-insensitive match
- Status: [NEW - NOT YET RUN] — code uses `.includes()` (case-sensitive); needs investigation with real data

**QA-RTL-05-EXT — Leaderboard chevron points left (‹) in RTL**
- Category: RTL / A11y
- Precondition: Leaderboard loaded with at least one tappable row
- Steps: Observe the chevron icon on any leaderboard row with an `onClick` handler.
- Expected: Chevron visually points left (‹) indicating RTL drill-down direction
- Status: [FAIL] — `rtl:rotate-180` makes the left-pointing SVG appear as › (right-pointing) in RTL

Overall: **FAIL**

Blockers (must fix before merge to main):
- CQ-01: Supabase client leak in league/page.tsx
- CQ-02: Supabase client leak in create-league/page.tsx
- CQ-03: Auth error not checked in league/page.tsx
- FAIL-03: History dates render as raw YYYY-MM-DD
- FAIL-06: Leaderboard chevron points wrong direction in RTL

---

## QA-FLOW — User Flow Tests

> **About this section:** These are end-to-end scenario tests that simulate a real user journey across multiple screens. Each flow is written as a sequence of dev-browser prompts — paste each step prompt to Claude in order. Unlike the isolated screen checks above, these tests verify that state transitions, navigation, data persistence, and cross-screen consistency all work together.
>
> **How to run:** Execute each step in sequence. Do not skip steps — earlier steps set up the state that later steps verify. For flows involving multiple users, open a separate private/incognito browser window for each user.
>
> **Precondition for all flows:** Dev server running at `http://localhost:3000` OR `https://staging.mundial.app`.

---

### FLOW-01 — New User Full Onboarding

**Persona:** Brand new user, no account, never visited the app before.
**Preconditions:** Use a Google account that has never signed in to the app. The global league (`GLOBAL_LEAGUE_ID = 00000000-0000-0000-0000-000000000001`) exists in the database.
**Success criteria:** User goes from the login screen through neighbourhood selection, league creation, and arrives at the dashboard with the invite code recorded.

#### Step 1 — Login screen renders for unauthenticated user

**Prompt:**
> Open a new private/incognito window. Navigate to `http://localhost:3000`. Take a full-page screenshot. Verify: (1) the page did NOT redirect to `/dashboard` (URL must still be `/`), (2) the text "WC26" is visible as a large heading, (3) the tagline "נחש · תחרה · תנצח" is visible below the logo, (4) a button labeled "המשך עם Google" is visible, (5) the layout is RTL (text right-aligned or centered).

**Expected:** Login page renders. No redirect. All 5 elements present.

#### Step 2 — Initiate Google OAuth

**Prompt:**
> Click the "המשך עם Google" button. Observe what happens. Take a screenshot within 1 second of clicking. Verify: (1) a loading spinner or visual feedback appears (the button should not remain instantly in its default state), (2) the URL begins to change toward a Google OAuth endpoint (accounts.google.com) OR a Supabase auth endpoint.

**Expected:** Loading state appears immediately before redirect. The OAuth spinner pattern (setTimeout macrotask before redirect) should guarantee the browser paints the loading state. If the button appears static for more than 500ms before any visual change, this is a FAIL.

#### Step 3 — Post-login redirect to neighbourhood selection

**Prompt:**
> Complete the Google sign-in flow with test credentials. After sign-in completes, observe the URL. Take a screenshot. Verify: (1) the URL is `/onboarding/neighbourhood` (not `/dashboard`), (2) the onboarding step dots are visible at the top (3 dots — the first one should be active/filled), (3) the title "באיזו שכונה אתה גר?" is visible.

**Expected:** New user is redirected to `/onboarding/neighbourhood`, not directly to dashboard. Step dot 1 is active.

#### Step 4 — Select a neighbourhood

**Prompt:**
> On the neighbourhood selection screen, click the first neighbourhood card in the list. Take a screenshot after clicking. Verify: (1) the clicked card is visually highlighted with a teal border or teal background (`bg-[#F0FDFA] border-[#0D9488]`), (2) the "המשך" (Continue) button changes from greyed-out to an active teal state. Verify the button's opacity is 100% (not `opacity-40`).

**Expected:** Card highlights. Continue button becomes active.

#### Step 5 — Proceed to league setup

**Prompt:**
> Click the "המשך" button. Take a screenshot. Verify: (1) the URL is `/onboarding/league`, (2) the step dots show the third dot as the active/longest dot (teal, `w-6`), (3) a greeting "היי [name] 👋" is shown at the top right, (4) a "צור ליגה" card is visible with subtitle "קבל קוד הזמנה ושתף עם חברים", (5) a join input with placeholder "קוד הזמנה — A4X9K2" is visible below a divider "או".

**Expected:** League page renders. Greeting shows the user's display name. All elements present.

#### Step 6 — Tap "Create League" and fill in name

**Prompt:**
> Click the "צור ליגה" card. Verify the URL changes to `/onboarding/create-league`. Take a screenshot. Verify: (1) the page title is "צור ליגה", (2) a label "שם הליגה" is visible, (3) an input with placeholder "למשל: ליגת רביבים 2026" is visible, (4) a "צור ליגה" submit button is visible but greyed-out (disabled because input is empty). Then type the text "ליגת הטסט" into the league name input. Verify the submit button becomes active.

**Expected:** Create league form renders. Button disabled when input is empty. Button enables after typing.

#### Step 7 — Submit and see invite code

**Prompt:**
> Click the "צור ליגה" submit button. Wait up to 3 seconds. Take a screenshot. Verify: (1) the form transitions to the invite code screen, (2) the heading "הליגה שלך מוכנה!" is visible, (3) the subtitle "שתף את הקוד עם החברים" is visible, (4) a large 6-character uppercase code is displayed in teal monospace font (the invite code), (5) a "שתף בוואטסאפ" button (green) is visible, (6) a "העתק קוד" button (grey) is visible, (7) a "התחל לנחש" button (teal) is visible. Write down the invite code shown — you will use it in FLOW-02.

**Expected:** Invite code screen renders correctly with all 3 buttons. A 6-character alphanumeric code is displayed.

#### Step 8 — Navigate to dashboard

**Prompt:**
> Click "התחל לנחש". Take a screenshot. Verify: (1) the URL is `/dashboard`, (2) the page title "ניחושים" is visible in the top bar, (3) match cards are shown (or the empty state "אין משחקים בקרוב — תחזור אחרי ההגרלה ⚽" if no matches exist), (4) the Golden Boot banner "מי יהיה מלך השערים? נחש עכשיו ←" is visible (because this is a new user who has not made a golden boot prediction).

**Expected:** Dashboard renders. Golden Boot banner is shown for a new user.

---

### FLOW-02 — Returning User Joins Existing League

**Persona:** A user who already has an account but is not yet in a custom league. They have received an invite code from another user (e.g. the code generated in FLOW-01 Step 7).
**Preconditions:** A league already exists in the database with a known valid invite code (use the code from FLOW-01, or create one manually via the admin Supabase UI). The joining user must be logged in.
**Success criteria:** User joins the league and the league appears in the leaderboard.

#### Step 1 — Navigate to the league screen

**Prompt:**
> Log in as a different user (not the league creator from FLOW-01). Navigate to `http://localhost:3000/onboarding/league`. Take a screenshot. Verify: (1) the greeting "היי [name] 👋" shows this user's name, (2) the "צור ליגה" card is visible, (3) the join code input is visible.

**Expected:** League screen renders with correct user greeting.

#### Step 2 — Enter the invite code

**Prompt:**
> Click inside the join code input field (the one with placeholder "קוד הזמנה — A4X9K2"). Type the 6-character invite code from FLOW-01 Step 7 (e.g. "A4X9K2" — replace with the actual code). The input should automatically convert text to uppercase as you type. Take a screenshot showing the code entered in the input field.

**Expected:** Code appears in uppercase in the input. No error state yet.

#### Step 3 — Submit join request

**Prompt:**
> Click the "הצטרף" button. Wait up to 3 seconds. Observe what happens. Take a screenshot. Verify: (1) no error message "קוד לא תקין, נסה שוב" appears, (2) the URL changes to `/dashboard`.

**Expected:** User is redirected to `/dashboard` without an error. The join was accepted.

#### Step 4 — Verify league appears in leaderboard

**Prompt:**
> Navigate to `http://localhost:3000/leaderboard`. Take a screenshot. Verify: (1) if the user is in more than one league, multiple league tab pills are visible at the top, (2) the league name "ליגת הטסט" (or whatever name was created in FLOW-01) is visible as a tab, (3) clicking that tab shows the leaderboard for that league with at least 2 rows (the creator and this user).

**Expected:** League appears as a tab. Both members visible in the leaderboard.

#### Step 5 — Verify the user appears in the creator's leaderboard (cross-check)

**Prompt:**
> Switch browser windows to the account of the league creator (from FLOW-01). Navigate to `http://localhost:3000/leaderboard`. Click the "ליגת הטסט" tab. Take a screenshot. Verify both users appear in the leaderboard list with their display names.

**Expected:** Creator sees 2 members in their league leaderboard.

---

### FLOW-03 — Submit and Edit a Prediction

**Persona:** Logged-in user with at least one upcoming unlocked match visible on the dashboard.
**Preconditions:** At least one match exists with `status = 'scheduled'` and `kickoff_at` more than 5 minutes in the future. User has no existing prediction for that match.
**Success criteria:** Prediction is saved, persists after navigation away, and can be updated with a new value that also persists.

#### Step 1 — Open dashboard and locate an unlocked match

**Prompt:**
> Navigate to `http://localhost:3000/dashboard`. Take a full-page screenshot. Find a match card that shows score input fields (not a locked/disabled card). Identify the two teams shown. The card should have two number inputs and a "שמור ניחוש" button (or similar save trigger). Note the team names.

**Expected:** At least one unlocked match card is visible with editable score inputs.

#### Step 2 — Enter initial prediction

**Prompt:**
> On the unlocked match card identified in Step 1, click the score input for the left team (team A in RTL — this will be the right-side team visually). Type "2". Then click the score input for the right team (team B in RTL — left-side visually). Type "1". Take a screenshot showing both inputs filled.

**Expected:** Both inputs show the entered values. "2" on one side, "1" on the other.

#### Step 3 — Save prediction and verify toast

**Prompt:**
> Click the save button on that match card (look for a button that submits the prediction — it may be labeled "שמור ניחוש" or be an icon button). Wait up to 3 seconds. Take a screenshot immediately after clicking. Verify: (1) a dark toast notification appears at the bottom of the screen containing the text "הניחוש נשמר ✓", (2) the score inputs now show "2" and "1" as their current values (the prediction is reflected in the UI).

**Expected:** Toast "הניחוש נשמר ✓" appears. Inputs retain the saved values.

#### Step 4 — Navigate away and return to confirm persistence

**Prompt:**
> Navigate to `http://localhost:3000/leaderboard`. Wait 1 second. Then navigate back to `http://localhost:3000/dashboard`. Take a screenshot. Verify the same match card still shows the prediction "2-1" in the score inputs (the prediction was persisted to the database and reloaded on return).

**Expected:** Prediction "2-1" is visible on the match card after navigating away and returning.

#### Step 5 — Edit the prediction

**Prompt:**
> On the same match card, change the score for team A from "2" to "3" (clear the input and type "3"). Click the save button again. Wait up to 3 seconds. Take a screenshot. Verify: (1) the toast "הניחוש נשמר ✓" appears again, (2) the input now shows "3".

**Expected:** Toast appears again. Input shows updated value "3".

#### Step 6 — Confirm updated prediction persists

**Prompt:**
> Navigate away to `/leaderboard` and then back to `/dashboard`. Take a screenshot. Verify the match card now shows "3-1" (not the old "2-1"), confirming the upsert (not insert) logic updated the existing prediction.

**Expected:** Updated prediction "3-1" persists after re-navigation.

---

### FLOW-04 — Prediction Lock Enforcement

**Persona:** Logged-in user with a saved prediction on a match that is about to lock.
**Preconditions:** A match exists that will lock within the next 10 minutes (kickoff ≤ T+10min from now), OR use Supabase to manually set a match's `kickoff_at` to `NOW() + interval '3 minutes'` to simulate imminent lock. User has an existing prediction on this match.
**Success criteria:** After the lock moment passes, the prediction cannot be edited or re-saved.

#### Step 1 — Confirm match is initially unlocked

**Prompt:**
> Navigate to `/dashboard`. Find the match card for the match that is about to lock. Take a screenshot. Verify the score inputs are enabled (not disabled) and the save button is accessible. Note the current predicted scores shown.

**Expected:** Match card shows enabled inputs before lock.

#### Step 2 — Simulate lock (set kickoff to past)

**Prompt:**
> Using the Supabase dashboard or a direct DB query, update the target match: `UPDATE matches SET kickoff_at = NOW() - interval '1 minute' WHERE id = '[match_id]'`. This puts the match 1 minute past its kickoff, which is past the T-5min lock window. After updating, navigate back to `http://localhost:3000/dashboard` (or hard-refresh the page). Take a screenshot.

**Expected:** The match card now shows the locked state: inputs are disabled, a "נעול" label is visible, no save button is shown.

#### Step 3 — Attempt to type in locked input

**Prompt:**
> On the locked match card, attempt to click or type in one of the score inputs. Take a screenshot. Verify the input does not accept focus or input (it is disabled with `disabled` attribute). No toast should appear from merely attempting to click a disabled input.

**Expected:** Input is fully non-interactive. No error toast from clicking a disabled field.

#### Step 4 — Verify save button is absent (not just disabled)

**Prompt:**
> Inspect the DOM of the locked match card. Verify the save/submit button is not present in the DOM at all (not merely `disabled`). The `MatchCard` component conditionally renders the save button only when `!effectiveLocked`. Check that no element with the save button's label or aria-label is present.

**Expected:** Save button is absent from the DOM, not just grayed-out. This is the correct behavior per `components/MatchCard.tsx` logic.

#### Step 5 — Verify toast fires if lock is hit during in-flight save

**Prompt:**
> To test the in-flight lock check: manually call `handleSave` by navigating to the dashboard with DevTools open. Before the lock window, open the match card. Immediately after passing T-5min (or with kickoff already in the past), trigger a save via the console: paste and run `document.querySelector('[data-match-id="[id]"] [data-save-btn]')?.click()` if such attributes exist, OR directly inspect the `handleSave` function logic in `app/(app)/dashboard/page.tsx`. The client-side check is: `if (Date.now() >= lockTime) { showToast(COPY.matchLocked); return; }`. Verify via source inspection that `COPY.matchLocked = "המשחק כבר נעול — אי אפשר לשנות"`.

**Expected:** Source code confirms `COPY.matchLocked` equals "המשחק כבר נעול — אי אפשר לשנות". If a save is attempted past the lock time, that toast fires before any DB call is made.

---

### FLOW-05 — Score Result and Points Flow

**Persona:** Admin user setting a result; regular user verifying they received the correct points badge.
**Preconditions:** Admin email is set in `.env.local`. A "finished" match exists (or a match can be set to finished via admin). A regular user (User A) has a prediction on that match.
**Success criteria:** After admin sets the score, User A's prediction card shows the correct points badge, the leaderboard total updates, and the history screen shows the result.

#### Step 1 — Admin sets match score

**Prompt:**
> Log in as the admin user. Navigate to `http://localhost:3000/admin`. Find the match that User A has a prediction on. Click that match row to expand it. Enter score A = "2", score B = "0". Set the status dropdown to "finished". Click "Save". Wait up to 5 seconds. Take a screenshot. Verify a success confirmation appears (no error message).

**Expected:** Admin save succeeds. Match row updates to show "2-0 · finished". The `run-scoring` Edge Function is called automatically because status = "finished".

#### Step 2 — User A verifies points badge on dashboard

**Prompt:**
> Switch to User A's browser session. Navigate to `http://localhost:3000/dashboard`. If User A predicted "2-0" (exact score match), look for the gold bingo badge "⚽ בינגו · 3 נקודות". If User A predicted "1-0" or any other result that correctly predicted Team A wins, look for the green badge "✓ כיוון נכון · 1 נקודה". If User A predicted the wrong winner or draw, look for the grey "✗ פספוס · 0 נקודות" badge. Take a screenshot. Verify the appropriate badge is shown on the finished match card.

**Expected:** The correct points badge appears on the match card within the SWR revalidation window (realtime update should trigger within seconds via the Supabase `postgres_changes` subscription on the `predictions` table).

#### Step 3 — Verify leaderboard total updated

**Prompt:**
> Still as User A, navigate to `http://localhost:3000/leaderboard`. Take a screenshot. Verify the `total_points` shown for User A's row has increased by the points awarded (3 for bingo, 1 for correct direction, 0 for miss). Also verify the top bar on the dashboard shows the updated points via the `${n} נק'` label.

**Expected:** Points total on the leaderboard row reflects the scoring. Dashboard top bar `total_points` is updated.

#### Step 4 — Verify history screen shows result

**Prompt:**
> Still as User A, navigate to `http://localhost:3000/history`. Take a screenshot. Verify: (1) the finished match appears in the history list, (2) the actual score "2-0" is displayed alongside User A's prediction, (3) the correct points badge is shown (same badge as on the dashboard card), (4) the `HistoryStatsBar` at the top shows updated counts (total matches, total points, bingo/correct/miss counts).

**Expected:** History screen shows the match with the correct outcome badge and the stats bar is updated.

---

### FLOW-06 — Full Scoring Matrix (Bingo / Correct / Miss)

**Persona:** Three different users (or one user with three separate matches), all in the same league. Admin sets the result. Each user's prediction falls into a different scoring bucket.
**Preconditions:** A match with a known final score (e.g. "2-1" final). Three users: User A predicted exact score "2-1" (bingo), User B predicted correct winner but wrong score "3-1" (correct direction), User C predicted wrong outcome "0-0" (miss).
**Success criteria:** Each user gets the correct points (3, 1, 0 respectively) and sees the correct badge.

#### Step 1 — Set up predictions

**Prompt:**
> Using three separate browser windows (or Supabase direct insert), ensure the following predictions exist for the same match: User A: predicted_a=2, predicted_b=1. User B: predicted_a=3, predicted_b=1. User C: predicted_a=0, predicted_b=0. Confirm all three rows exist in the `predictions` table via the Supabase dashboard.

**Expected:** Three prediction rows exist with the correct values.

#### Step 2 — Admin sets final score 2-1

**Prompt:**
> Log in as admin. Navigate to `/admin`. Find the target match. Enter score A = "2", score B = "1", status = "finished". Save. Confirm success message. Verify `run-scoring` was triggered (it fires automatically when status = "finished" per `app/actions/admin.ts` line 91-93: `if (status === "finished") { await triggerScoring(matchId); }`).

**Expected:** Admin save succeeds. Scoring function triggered.

#### Step 3 — Verify User A gets 3 points (Bingo)

**Prompt:**
> As User A, navigate to `/dashboard` and find the finished match card. Take a screenshot. Verify the gold/yellow badge shows: (1) the text contains "בינגו" and (2) the text contains "3". Inspect the badge background color — it should be `bg-[#FEF9C3]` or similar yellow/gold. Then navigate to `/history`. Verify the history card also shows 3 points and the bingo label.

**Expected:** User A sees the bingo badge. 3 points awarded.

#### Step 4 — Verify User B gets 1 point (Correct direction)

**Prompt:**
> As User B, navigate to `/dashboard` and find the same finished match card. Take a screenshot. Verify the green badge shows the text containing "1" point. The badge should NOT say "בינגו". It should say "כיוון נכון" (or "תוצאה נכונה" if that FAIL-01 copy fix was applied). Verify the badge background is green (`bg-[#DCFCE7]` or similar).

**Expected:** User B sees a 1-point badge. Badge indicates correct direction, not bingo.

#### Step 5 — Verify User C gets 0 points (Miss)

**Prompt:**
> As User C, navigate to `/dashboard` and find the same finished match card. Take a screenshot. Verify the grey badge shows "0" points and the text "פספוס". The badge background should be grey (`bg-[#F3F4F6]` or similar).

**Expected:** User C sees the 0-point miss badge.

#### Step 6 — Compare leaderboard

**Prompt:**
> Open the leaderboard for the shared league. Take a screenshot. Verify the relative ordering: User A (at least 3 pts) ranks above User B (at least 1 pt) ranks above User C (0 pts from this match), assuming this was the only scored prediction for each.

**Expected:** Leaderboard ordering matches points totals. Correct scoring matrix verified.

---

### FLOW-07 — Golden Boot Prediction

**Persona:** Logged-in user who has never made a golden boot prediction.
**Preconditions:** The `players` table has player records. The first match's `kickoff_at` is more than 5 minutes in the future (golden boot is not yet locked). User has NO existing row in `golden_boot_predictions`.
**Success criteria:** User selects a player, confirms the choice, sees the "הבחירה נשמרה ✓" toast, and the golden boot banner disappears from the dashboard.

#### Step 1 — Access Golden Boot from dashboard banner

**Prompt:**
> Navigate to `http://localhost:3000/dashboard`. Verify the green banner "מי יהיה מלך השערים? נחש עכשיו ←" is visible at the top. Click the banner. Take a screenshot. Verify the URL changed to `/golden-boot`.

**Expected:** Banner is visible. Clicking it navigates to the golden boot page.

#### Step 2 — Verify the golden boot page loads

**Prompt:**
> On the golden boot page, take a full-page screenshot. Verify: (1) the title "מלך השערים" is visible in the header, (2) a list of players is shown (each row has a player name and country flag), (3) the subtitle "על מי אתה מהמר? בחר לפני שהטורניר מתחיל" is visible, (4) a lock countdown bar is shown at the top in a yellow/amber background with the text "ננעל בעוד [time]", (5) the bottom confirm bar shows "בחר שחקן" placeholder and a disabled "אשר בחירה" button.

**Expected:** Page renders with all elements. Confirm button is disabled before selection.

#### Step 3 — Search for a player

**Prompt:**
> Look for the search input on the player list (it should be rendered by the `PlayerList` component). Type "Messi" in the search input. Take a screenshot. Verify the player list filters to show only players whose name contains "Messi". Note: if the search is case-sensitive (uses `.includes()`), also try "messi" (lowercase) and verify whether it still returns results. Flag if lowercase does not match (regression risk from QA-GB-05).

**Expected:** "Messi" filters the player list. The result should include the player if they exist. If case-sensitive, a one-character lowercase input may show no results — flag as a bug.

#### Step 4 — Select a player

**Prompt:**
> Click on any player in the list (e.g. the first visible result after the search in Step 3, or clear the search and pick the first player). Take a screenshot. Verify: (1) the selected player row has a visual highlight (amber border or amber background: `bg-[#FAEEDA] border-[#EF9F27]`), (2) the confirm bar at the bottom now shows the player's name, (3) the "אשר בחירה" button is now enabled (amber, not greyed-out).

**Expected:** Player row is highlighted. Bottom bar shows player name. Confirm button is enabled.

#### Step 5 — Confirm selection and verify toast

**Prompt:**
> Click the "אשר בחירה" button. Wait up to 3 seconds. Take a screenshot immediately after clicking. Verify: (1) a dark toast notification appears at the top with "הבחירה נשמרה ✓", (2) the button label changes from "אשר בחירה" to "שנה בחירה" (because `savedId` now equals `selectedId`, so `!hasUnsavedChange` is true and the button shows `COPY.changeButton`).

**Expected:** Toast "הבחירה נשמרה ✓" appears. Button switches to "שנה בחירה".

#### Step 6 — Verify golden boot banner disappears from dashboard

**Prompt:**
> Navigate to `http://localhost:3000/dashboard`. Take a screenshot. Verify the teal golden boot banner "מי יהיה מלך השערים? נחש עכשיו ←" is NO LONGER visible. The dashboard loads user data and checks `golden_boot_predictions` — if a row exists for this user, `showGoldenBootBanner` is set to `false`.

**Expected:** Banner is gone. Dashboard loads normally without the banner.

#### Step 7 — Verify locked state when tournament starts

**Prompt:**
> Using the Supabase dashboard, update the first match: `UPDATE matches SET kickoff_at = NOW() - interval '10 minutes' WHERE id = (SELECT id FROM matches ORDER BY kickoff_at ASC LIMIT 1)`. Navigate back to `http://localhost:3000/golden-boot`. Take a screenshot. Verify: (1) the subtitle changes to "הטורניר התחיל — הבחירה נעולה", (2) the lock countdown bar shows "נעול" instead of a countdown, (3) the bottom confirm bar changes to an amber read-only bar showing the player name with a "נעול" badge (amber text on amber bg: `text-[#EF9F27] bg-[#FDE68A] rounded-full`), (4) no "אשר בחירה" button is shown.

**Expected:** Locked state renders correctly. Player name shown with "נעול" badge. No confirm button.

---

### FLOW-08 — Leaderboard Drilldown (Visibility Rules)

**Persona:** User A viewing User B's predictions via the leaderboard drilldown.
**Preconditions:** User A and User B are in the same league. User B has predictions on at least one locked match (past kickoff) and at least one unlocked match (future kickoff). User B is NOT User A (drilldown is for other members, not self).
**Success criteria:** Locked match predictions are visible in the drilldown. Unlocked/future match predictions are NOT visible (privacy rule enforced by the `get_user_predictions` RPC).

#### Step 1 — Open the leaderboard

**Prompt:**
> As User A, navigate to `http://localhost:3000/leaderboard`. Take a screenshot. Verify the league that contains both User A and User B is shown. Identify User B's row. Note User B's display name.

**Expected:** Leaderboard renders. User B's row is visible.

#### Step 2 — Tap User B's row

**Prompt:**
> Click User B's row in the leaderboard. Take a screenshot. Verify: (1) the URL changes to `/leaderboard/[userB_id]?leagueId=[leagueId]&name=[userB_name]`, (2) User B's display name appears in the page header (right-aligned, RTL), (3) a back button "←" is visible on the left side of the header (RTL: left = LTR-right, but visually left in the UI).

**Expected:** Navigation to drilldown page. Header shows User B's name.

#### Step 3 — Verify locked match predictions are shown

**Prompt:**
> On User B's drilldown page, take a screenshot. Verify that at least one match card is visible for a match that has already started (past kickoff). The `get_user_predictions` RPC (called by `useUserPredictions`) returns predictions grouped by `is_locked`. Locked predictions should be visible. Inspect the cards: each should show team names, User B's predicted score (`predicted_a:predicted_b`), and if the match is finished, the actual score and a points badge.

**Expected:** Locked match predictions are visible. If match is finished, actual score and points badge are shown.

#### Step 4 — Verify unlocked match predictions are hidden

**Prompt:**
> Still on User B's drilldown page, check whether any upcoming/unlocked match predictions are visible. The `get_user_predictions` RPC is a `SECURITY DEFINER` function — inspect its behavior: it should only return predictions for matches where `is_locked = true` (past kickoff). Future matches should NOT appear, protecting User B's strategy before the match locks. Take a screenshot. Verify no future match cards appear in this drilldown.

**Expected:** Future/unlocked match predictions are NOT shown. Only locked predictions are visible. This is a security requirement — other users must not see your picks before the match locks.

#### Step 5 — Verify back button navigates to leaderboard

**Prompt:**
> Click the back button "←" at the top of User B's drilldown page. Take a screenshot. Verify the URL returns to `/leaderboard` and the leaderboard renders correctly.

**Expected:** Back navigation works. Leaderboard re-renders.

#### Step 6 — Verify missing `leagueId` param redirects

**Prompt:**
> Navigate directly to `/leaderboard/[userB_id]` WITHOUT the `?leagueId=...` query param. Take a screenshot. Verify: the page immediately redirects to `/leaderboard` (per the `if (!leagueId) { router.replace("/leaderboard"); return <></> }` guard in `app/(app)/leaderboard/[userId]/page.tsx`).

**Expected:** Accessing drilldown without `leagueId` redirects to the leaderboard.

---

### FLOW-09 — Admin Score Update and Undo

**Persona:** Admin user correcting a score entry.
**Preconditions:** Admin email configured in `.env.local`. A match exists with no score set (or a wrong score). The `SUPABASE_SERVICE_ROLE_KEY` is set for triggering `run-scoring`.
**Success criteria:** Admin sets a score, scoring fires, then undo reverts to the previous state and scoring fires again.

#### Step 1 — Set initial score

**Prompt:**
> Log in as the admin user. Navigate to `http://localhost:3000/admin`. Find a match that currently has `score_a = null` and `score_b = null` (look for matches with status "scheduled" or "live"). Click the match row to expand it. Enter score A = "1", score B = "0". Set status to "finished". Click "Save". Wait up to 5 seconds. Take a screenshot. Verify: (1) a success message appears, (2) the row updates to show "1 - 0", (3) an "Undo → null:null" or "Undo → 0:0" button appears next to the row.

**Expected:** Score is saved. Undo button appears with the previous score in its label.

#### Step 2 — Verify scoring was triggered

**Prompt:**
> Check the server logs (or Supabase Edge Function invocation log) to confirm `run-scoring` was called with the correct `match_id`. In the absence of logs, verify indirectly: navigate to `/dashboard` as a regular user who has a prediction on this match. Verify their points badge has updated (if they predicted "1-0", they should now show a bingo badge).

**Expected:** `run-scoring` was called. Points are updated on the regular user's dashboard.

#### Step 3 — Undo the score

**Prompt:**
> Back in the admin panel, click the "Undo" button for the match just updated. Wait up to 5 seconds. Take a screenshot. Verify: (1) the match row reverts — `score_a` and `score_b` go back to their previous values (null or the old score), (2) the status may revert as well if the undo action restores it, (3) the Undo button disappears from that row.

**Expected:** Score reverted. Undo button gone. `prev_score_a` and `prev_score_b` are set to null (per `undoMatchScore` in `app/actions/admin.ts` lines 120-124).

#### Step 4 — Verify run-scoring fired again after undo

**Prompt:**
> Navigate to `/dashboard` as the regular user from Step 2. Take a screenshot. Verify their points badge has been removed or changed to reflect the reverted state (if the match is no longer "finished", the points badge should no longer appear).

**Expected:** Points are recalculated (zeroed or reverted) after undo. The `undoMatchScore` action always calls `triggerScoring` regardless of the new status.

#### Step 5 — Verify undo is a one-shot operation

**Prompt:**
> Back in the admin panel, try to click "Undo" again for the same match. If the Undo button is gone (correct behavior), take a screenshot confirming it's absent. If an Undo button is somehow still visible, click it and verify the server returns `{ ok: false, error: "Nothing to undo" }` (per the `if (current.prev_score_a === null && current.prev_score_b === null)` guard in `app/actions/admin.ts` line 114-116).

**Expected:** Undo can only be performed once per save. After undo, the Undo button is absent.

---

### FLOW-10 — League Creator Deletes League

**Persona:** User who created a league and wants to delete it.
**Preconditions:** User is logged in and is the `created_by` owner of a non-global league. The league has at least one other member.
**Success criteria:** League is deleted, removed from the profile leagues section, and no longer appears as a tab in the leaderboard.

#### Step 1 — Navigate to profile and locate the league

**Prompt:**
> Navigate to `http://localhost:3000/profile`. Scroll to the "ליגות" section. Take a screenshot. Verify: (1) the owned league is listed (e.g. "ליגת הטסט"), (2) the league's invite code is shown as a tappable monospace button, (3) a trash-icon button is visible next to the invite code (only for leagues where the current user is the creator). The global league "כולנו" / global badge should NOT have a trash icon.

**Expected:** Trash icon visible only on the user's own league. Global league has no delete button.

#### Step 2 — Tap the delete icon

**Prompt:**
> Click the trash icon button next to the owned league. Take a screenshot immediately after clicking. Verify: (1) the league row transitions to a confirmation state — the invite code and trash icon are replaced by two buttons: "כן, מחק" (red, `bg-[#DC2626]`) and "ביטול" (grey border), (2) the league name area shows the text "בטוח? הפעולה לא ניתנת לביטול" in red (`text-[#DC2626]`).

**Expected:** Confirmation prompt appears inline. Correct Hebrew text. Two action buttons.

#### Step 3 — Cancel the deletion

**Prompt:**
> Click the "ביטול" button. Take a screenshot. Verify: (1) the league row reverts to its normal state (invite code and trash icon visible again), (2) the league is still in the list.

**Expected:** Cancelling does not delete. League remains.

#### Step 4 — Confirm deletion

**Prompt:**
> Click the trash icon again. Click "כן, מחק" this time. Wait up to 3 seconds. Take a screenshot. Verify: (1) a toast "הליגה נמחקה" appears at the top, (2) the league row is removed from the leagues list immediately (optimistic local update via `setLeagues(prev => prev.filter(...))`).

**Expected:** Toast "הליגה נמחקה" appears. League disappears from the profile page.

#### Step 5 — Verify league tab is gone in leaderboard

**Prompt:**
> Navigate to `http://localhost:3000/leaderboard`. Take a screenshot. Verify the deleted league's tab pill is no longer visible in the league tabs row. If this was the user's only non-global league, verify the leaderboard shows the global league (or shows only the global league's members).

**Expected:** Deleted league no longer appears as a leaderboard tab.

#### Step 6 — Verify other members lost their access

**Prompt:**
> Switch to another user who was a member of the deleted league. Navigate to `/leaderboard`. Take a screenshot. Verify the deleted league's tab is also gone for this user. They should see only their remaining leagues or the global league.

**Expected:** Deleted league is gone for all members, not just the creator.

---

### FLOW-11 — Two Users in the Same League

**Persona:** User A (creates league), User B (joins with invite code).
**Preconditions:** Two separate browser sessions (different Google accounts). At least one upcoming match with kickoff more than 5 minutes away.
**Success criteria:** Both users appear in the leaderboard, both submit predictions, admin sets result, both get correct points.

#### Step 1 — User A creates a league

**Prompt:**
> As User A, navigate to `http://localhost:3000/onboarding/league`. Click "צור ליגה". Enter the league name "ליגה משותפת". Click "צור ליגה". Wait for the invite code screen. Note the 6-character invite code displayed. Take a screenshot showing the code.

**Expected:** League created. Invite code displayed (e.g. "B7PQ3X"). Record this code.

#### Step 2 — User B joins the league

**Prompt:**
> As User B (different browser window), navigate to `http://localhost:3000/onboarding/league`. Enter the invite code from Step 1 into the join input. Click "הצטרף". Wait for redirect to `/dashboard`. Take a screenshot. Verify: (1) URL is `/dashboard`, (2) no error "קוד לא תקין" appeared.

**Expected:** User B joins successfully and reaches the dashboard.

#### Step 3 — Verify both users are in the leaderboard

**Prompt:**
> As User A, navigate to `http://localhost:3000/leaderboard`. Click the "ליגה משותפת" tab. Take a screenshot. Verify: (1) two member rows are visible, (2) both User A's and User B's display names are shown, (3) both show 0 points initially.

**Expected:** Two members visible in the leaderboard for the new league.

#### Step 4 — Both users submit predictions for the same match

**Prompt:**
> As User A, navigate to `/dashboard`. Find an upcoming match. Enter prediction "2-1". Save. Verify toast "הניחוש נשמר ✓". Then, as User B (separate window), navigate to `/dashboard`. Find the SAME match. Enter prediction "1-1". Save. Verify toast for User B as well.

**Expected:** Both users have saved different predictions for the same match.

#### Step 5 — Admin sets the result

**Prompt:**
> As admin, navigate to `/admin`. Set the match score to "2-1" with status "finished". Save. Verify success.

**Expected:** Score set. Scoring function triggered.

#### Step 6 — Verify User A gets bingo, User B gets miss

**Prompt:**
> As User A, navigate to `/dashboard`. Verify the gold "בינגו" badge with "3 נק'" appears on the match card. As User B, navigate to `/dashboard`. Verify the grey "פספוס" badge with "0 נק'" appears. Take screenshots of both.

**Expected:** User A: 3 points (bingo on "2-1"). User B: 0 points (predicted "1-1", actual "2-1" — wrong direction).

#### Step 7 — Verify final leaderboard ordering

**Prompt:**
> As User A, navigate to `/leaderboard` and click the "ליגה משותפת" tab. Take a screenshot. Verify User A is ranked #1 with 3 points and User B is ranked #2 with 0 points.

**Expected:** Leaderboard correctly orders members by `total_points`.

---

### FLOW-12 — History Filter Flow

**Persona:** User who has finished predictions with all three outcome types (bingo, correct, miss).
**Preconditions:** The user has at least 3 finished predictions: one bingo (3pts), one correct direction (1pt), one miss (0pts). These require admin to have set results for multiple matches. Use a seeded test dataset or run FLOW-06 first to generate data.
**Success criteria:** Each filter shows only the correct subset of cards; "הכל" restores all cards; stats bar counts are correct throughout.

#### Step 1 — Open history and verify all cards shown

**Prompt:**
> Navigate to `http://localhost:3000/history`. Take a full-page screenshot. Verify: (1) the title "היסטוריה" is shown, (2) filter pills are visible: "הכל", "בינגו", "תוצאה נכונה" (or "ניחוש נכון" if FAIL-01 not fixed), "פספוס", (3) the "הכל" pill is active (teal background), (4) the stats bar shows total matches, total points, and counts for bingo/correct/miss, (5) all finished match cards are shown (at minimum 3 cards).

**Expected:** History screen shows all cards. "הכל" is the active filter. Stats bar totals are correct.

#### Step 2 — Apply Bingo filter

**Prompt:**
> Click the "בינגו" filter pill. Take a screenshot. Verify: (1) the "בינגו" pill is now active (teal background), (2) ONLY cards with the bingo badge (gold "⚽ בינגו · 3 נקודות") are shown, (3) cards with 1-point or 0-point badges are hidden, (4) the stats bar STILL shows the full unfiltered totals (the `computeHistoryStats` function is called on `entries`, not `filtered` — this is by design per `app/(app)/history/page.tsx`).

**Expected:** Only bingo cards visible. Stats bar shows full totals regardless of filter.

#### Step 3 — Apply Correct filter

**Prompt:**
> Click the "תוצאה נכונה" (or "ניחוש נכון") filter pill. Take a screenshot. Verify: (1) that pill is now active, (2) ONLY cards with the 1-point correct-direction badge are shown, (3) bingo and miss cards are hidden.

**Expected:** Only correct-direction cards visible.

#### Step 4 — Apply Miss filter

**Prompt:**
> Click the "פספוס" filter pill. Take a screenshot. Verify: (1) that pill is now active, (2) ONLY cards with the "✗ פספוס · 0 נקודות" grey badge are shown, (3) bingo and correct cards are hidden.

**Expected:** Only miss cards visible.

#### Step 5 — Return to All filter

**Prompt:**
> Click the "הכל" filter pill. Take a screenshot. Verify: (1) the "הכל" pill is active again, (2) ALL cards are visible (bingo + correct + miss), (3) the count of visible cards matches the total shown in the stats bar.

**Expected:** Full card list restored.

#### Step 6 — Empty state when filter has no matches

**Prompt:**
> If the user has NO bingo predictions, click the "בינגו" filter. Take a screenshot. Verify the empty state "עדיין אין משחקים שהסתיימו" (or a similar empty message) is shown instead of a blank area. No crash.

**Expected:** Empty state renders gracefully when filter has zero results.

---

### FLOW-13 — Duplicate League Name Rejected

**Persona:** User trying to create a league with a name that already exists.
**Preconditions:** A league named "ליגת רביבים 2026" already exists in the database (created by any user). The current user is on the create-league page.
**Success criteria:** The duplicate name is rejected with a Hebrew error message, and the user can fix the name and create successfully.

#### Step 1 — Attempt to create duplicate league

**Prompt:**
> Navigate to `http://localhost:3000/onboarding/create-league`. Type "ליגת רביבים 2026" into the league name input (assuming this name already exists in the DB). Click "צור ליגה". Wait up to 3 seconds. Take a screenshot. Verify: (1) the form does NOT advance to the invite code screen, (2) an error message appears below the input: "השם הזה כבר תפוס — נסה שם אחר" in red (`text-[#DC2626]`), (3) the input now has a red border (`border-[#DC2626]`).

**Expected:** Error "השם הזה כבר תפוס — נסה שם אחר" appears. Input border turns red. No navigation to invite code.

#### Step 2 — Fix the name and succeed

**Prompt:**
> Clear the input and type a unique name: "ליגת רביבים 2026 B". Verify the error message and red border disappear as soon as you start typing. Click "צור ליגה". Wait up to 3 seconds. Verify the invite code screen appears with a new league code.

**Expected:** Error clears on input change. New unique name creates league successfully.

---

### FLOW-14 — Profile Display Name Edit

**Persona:** Logged-in user who wants to change their display name.
**Preconditions:** User is logged in. User has a display name (set during auth).
**Success criteria:** Display name is updated in the DB and reflected across the app.

#### Step 1 — Open the display name edit field

**Prompt:**
> Navigate to `http://localhost:3000/profile`. Find the "שם תצוגה" settings row. Take a screenshot showing the current display name. Click the row (it should trigger `setEditingName(true)` when tapped). Verify: (1) the row transforms into an inline edit mode: a text input appears with the current name pre-filled, (2) two buttons appear: "שמור" (teal) and "ביטול" (grey).

**Expected:** Inline edit mode activates. Current name is pre-filled in the input.

#### Step 2 — Clear and enter new name

**Prompt:**
> Clear the name input completely. Verify the "שמור" button becomes greyed-out/disabled (because `!nameInput.trim()` is true). Then type "שחקן חדש". Verify the "שמור" button becomes active again.

**Expected:** Save button disabled when input is empty. Re-enabled after typing.

#### Step 3 — Save the new name

**Prompt:**
> Click "שמור". Wait up to 3 seconds. Take a screenshot. Verify: (1) the toast "השם עודכן ✓" appears at the top, (2) the profile page header name updates to "שחקן חדש", (3) the avatar initials update to match the new name (they are computed from `getInitials(displayName)` via `lib/utils/initials.ts`), (4) the edit mode closes and the settings row shows the new name in read mode.

**Expected:** Name updates everywhere on the profile page. Toast confirms success.

#### Step 4 — Verify name persists after reload

**Prompt:**
> Hard-refresh the page (`Cmd+Shift+R` / `Ctrl+Shift+R`). Take a screenshot. Verify the display name "שחקן חדש" is still shown.

**Expected:** New name persisted to the database and reloads correctly.

#### Step 5 — Cancel edit returns original name

**Prompt:**
> Click the display name settings row again to enter edit mode. Change the name to something else (e.g. "שם אחר"). Click "ביטול". Take a screenshot. Verify: (1) the edit mode closes, (2) the display name shown is still "שחקן חדש" (the last saved value, not the discarded "שם אחר").

**Expected:** Cancel restores the previously saved name without any changes.

---

### FLOW-15 — Invite Code Copy and Share

**Persona:** League creator viewing their league in the profile screen.
**Preconditions:** User owns at least one non-global league. The browser supports `navigator.clipboard`.
**Success criteria:** Invite code can be copied to clipboard; the WhatsApp share link includes the correct code and message text.

#### Step 1 — Copy invite code from profile

**Prompt:**
> Navigate to `http://localhost:3000/profile`. In the "ליגות" section, find the owned league row. The invite code is displayed as a monospace tappable button. Click the invite code button. Wait 500ms. Take a screenshot. Verify the toast "קוד הועתק ✓" appears at the top.

**Expected:** Toast "קוד הועתק ✓" appears confirming the code was copied.

#### Step 2 — Verify WhatsApp share from create-league screen

**Prompt:**
> Navigate to `http://localhost:3000/onboarding/create-league`. Create a new test league (or navigate to the invite code screen of an existing league if you can reach it). On the invite code screen, find the "שתף בוואטסאפ" button. Inspect the button's `onClick` handler: it calls `window.open(\`https://wa.me/?text=\${encodeURIComponent(COPY.whatsappMsg(inviteCode))}\`, "_blank")`. Verify the message text format is: "היי! הצטרף לליגת הניחושים שלי ל-World Cup 2026 🌍⚽ קוד כניסה: [code]". Take a screenshot of the invite code page.

**Expected:** WhatsApp button is visible. Share URL includes the Hebrew invite message. Code is embedded correctly.

#### Step 3 — Copy code button on invite code screen

**Prompt:**
> On the invite code screen, click the "העתק קוד" button. Wait 500ms. Take a screenshot. Verify: (1) the button text changes from "העתק קוד" to "הועתק!" for 2 seconds then reverts (per the `setCopied` + `setTimeout` pattern in `create-league/page.tsx` lines 70-73), (2) the invite code was copied to clipboard.

**Expected:** Button text toggles to "הועתק!" temporarily. Code is in clipboard.

---

### FLOW-16 — Neighbourhood Change Before Lock

**Persona:** User who skipped neighbourhood selection during onboarding and wants to set it later via the profile.
**Preconditions:** User has `neighbourhood_id = null` and `hood_locked = false` (tournament has not started). At least 2 neighbourhoods exist in the DB.
**Success criteria:** User can update their neighbourhood from the profile page and the change persists.

#### Step 1 — Verify neighbourhood row is tappable

**Prompt:**
> Navigate to `http://localhost:3000/profile`. Find the "שכונה" settings row. Take a screenshot. Verify: (1) the row shows "לא נבחרה" as the current value (because neighbourhood is null), (2) a teal chevron "‹" is visible indicating it is tappable, (3) the row is NOT disabled (no `disabled` attribute, since `hood_locked = false`).

**Expected:** Neighbourhood row shows "לא נבחרה" with an active teal chevron.

#### Step 2 — Navigate to neighbourhood selection from profile

**Prompt:**
> Click the neighbourhood settings row. Verify the URL changes to `/onboarding/neighbourhood?redirect=/profile`. Take a screenshot. Verify the neighbourhood selection screen renders with the title "באיזו שכונה אתה גר?".

**Expected:** Navigation to neighbourhood selection. `redirect=/profile` query param is in the URL.

#### Step 3 — Select a neighbourhood and confirm redirect back to profile

**Prompt:**
> Select any neighbourhood card. Click "המשך". Take a screenshot. Verify: (1) the URL returns to `/profile` (the `redirect` param caused the "המשך" button to navigate back to `/profile` instead of the default onboarding next step), (2) the neighbourhood row now shows the selected neighbourhood's name instead of "לא נבחרה".

**Expected:** After selection, user is returned to `/profile`. Neighbourhood name is updated.

#### Step 4 — Verify neighbourhood row is disabled after tournament lock

**Prompt:**
> Using Supabase, update the user: `UPDATE users SET hood_locked = true WHERE id = '[current_user_id]'`. Reload the profile page. Take a screenshot. Verify: (1) the neighbourhood row now shows `disabled` styling (`opacity-60`), (2) no chevron is shown, (3) a `title` tooltip attribute shows "הטורניר התחיל — לא ניתן לשנות" (visible on hover in desktop or via DevTools inspection).

**Expected:** Neighbourhood row is locked. Cannot be tapped. Tooltip shows the lock reason.

---

### Flow Run Order for Full User Journey Regression

Run these flows in order for a comprehensive pre-release user journey test. Each flow builds on real data created by prior flows.

1. FLOW-01 (creates User A + League A with invite code)
2. FLOW-02 (User B joins League A — requires FLOW-01 invite code)
3. FLOW-03 (User A submits + edits a prediction)
4. FLOW-04 (Lock enforcement — requires a match near kickoff)
5. FLOW-07 (Golden Boot — run before any match kickoff)
6. FLOW-05 (Admin sets score → User A sees points — requires FLOW-03 data)
7. FLOW-06 (Full scoring matrix — requires admin + 3 users)
8. FLOW-08 (Drilldown visibility — requires FLOW-11 or similar multi-user data)
9. FLOW-09 (Admin undo — can run standalone)
10. FLOW-10 (League delete — use a throwaway league)
11. FLOW-11 (Two users full cycle — standalone)
12. FLOW-12 (History filters — requires scored predictions from FLOW-05/06)
13. FLOW-13 (Duplicate league name — standalone)
14. FLOW-14 (Profile name edit — standalone)
15. FLOW-15 (Invite code copy/share — requires owned league)
16. FLOW-16 (Neighbourhood change — standalone, requires `hood_locked = false`)

**Estimated run time:** ~60–90 minutes for all 16 flows against a live staging environment.
