# Mundial Master Predictor — Build Plan
**For Claude Code | Read this file first before writing any code.**

---

## How to use this file

Work through tasks in order. Each task ends with a working, runnable app — nothing should be broken between tasks. Before starting each task, read the referenced documents. After completing each task, run the checklist at the bottom of that task before moving on.

**Document references:**
- PRD: `docs/Mundial_Master_Predictor_PRD_v1.1.md`
- Tech Design: `docs/Mundial_Master_Predictor_Tech_Design_v1.0.md`
- Schema: `docs/Mundial_Master_Predictor_Schema_v1.0.sql`
- Seed Data: `docs/Mundial_Master_Predictor_Seed_Data_v1.0.sql`
- API Contract: `docs/Mundial_Master_Predictor_API_Contract_v1.0.md`
- UI/UX Guidelines: `docs/Mundial_Master_Predictor_UIUX_Guidelines_v1.0.md`
- UI Copy: `docs/Mundial_Master_Predictor_UI_Copy_v1.0.md`
- DevOps: `docs/Mundial_Master_Predictor_DevOps_v1.0.md`
- Tests: `docs/Mundial_Master_Predictor_Tests_v1.0.md`

**Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

**Design system:**
- Font: Heebo (Google Fonts)
- Primary color: `#0D9488` (teal)
- Gold: `#EF9F27`
- Direction: RTL (`dir="rtl"` on `<html>`)
- Flag library: `flag-icons` npm package

---

## Task 1 — Project Setup
**Goal:** A running Next.js app connected to Supabase, deployable to Vercel. Nothing visible yet — just the foundation.

### 1.1 Initialize Next.js project
- Create Next.js 14 app with TypeScript and App Router: `npx create-next-app@latest --typescript --app --tailwind`
- Set `dir="rtl"` and `lang="he"` on `<html>` in `app/layout.tsx`
- Install dependencies:
  ```
  npm install @supabase/supabase-js @supabase/ssr flag-icons
  ```
- Install dev dependencies:
  ```
  npm install -D @types/node
  ```

### 1.2 Configure Supabase client
- Create `lib/supabase/client.ts` — browser client using `createBrowserClient`
- Create `lib/supabase/server.ts` — server client using `createServerClient`
- Create `lib/supabase/middleware.ts` — session refresh middleware
- Create `middleware.ts` at root — runs Supabase session refresh on every request
- Add environment variables to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  ```

### 1.3 Set up Supabase project
- Create two Supabase projects: `mundial-prod` and `mundial-staging`
- Install Supabase CLI: `npm install -D supabase`
- Run `npx supabase init` to create the `/supabase` folder
- Copy `Schema_v1.0.sql` content into `supabase/migrations/20250611000001_initial_schema.sql`
- Copy `Seed_Data_v1.0.sql` content into `supabase/migrations/20250611000002_seed_data.sql`
- Run migrations against staging: `npx supabase db push`

### 1.4 Set up GitHub repository
- Create GitHub repo with `main` and `staging` branches
- Protect both branches (require PR + CI pass)
- Add all secrets from the DevOps doc to GitHub Actions Secrets
- Add all env variables to Vercel for both environments

### 1.5 Set up CI/CD
- Create `.github/workflows/ci.yml` — runs on every PR
- Create `.github/workflows/deploy-staging.yml` — deploys on push to `staging`
- Create `.github/workflows/deploy-prod.yml` — deploys on push to `main`
- Use the exact YAML from `DevOps_v1.0.md` Section 4

### 1.6 Configure fonts and global styles
- Add Heebo font import to `app/layout.tsx`
- Set global CSS variables in `app/globals.css`:
  ```css
  :root {
    --color-primary: #0D9488;
    --color-primary-light: #2DD4BF;
    --color-primary-bg: #F0FDFA;
    --color-gold: #EF9F27;
    --color-gold-light: #FAEEDA;
    --color-success: #22C55E;
    --color-error: #E24B4A;
    --color-locked: #6B7280;
    --color-bg: #F8FAFC;
    --color-dark: #111827;
    --color-dark-card: #1F2937;
  }
  ```
- Import `flag-icons/css/flag-icons.min.css` in `app/layout.tsx`

### ✅ Task 1 Checklist
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors
- [ ] Supabase migrations ran successfully on staging
- [ ] CI pipeline runs on a test PR
- [ ] App deploys to Vercel staging URL

---

## Task 2 — Authentication
**Goal:** Users can log in with Google or Apple and land on a blank page after login. Logout works.

### 2.1 Login screen UI
- Create `app/(auth)/login/page.tsx`
- Build the login screen exactly as shown in the UI/UX mockup:
  - White background, 4px teal top accent bar
  - Football SVG logo mark (circle with lines) in dark rounded square
  - App name "Mundial" 26px bold
  - Tagline "נחש · תחרה · תנצח" in secondary gray
  - Google button (white bg, border, Google SVG icon) — text from `UI_Copy`: `login.btn_google`
  - Apple button (black bg, Apple SVG icon) — text from `UI_Copy`: `login.btn_apple`
  - Terms text at bottom — text from `UI_Copy`: `login.terms`
- No navigation — full screen centered layout

### 2.2 Google & Apple OAuth
- Configure Google OAuth in Supabase dashboard
- Configure Apple OAuth in Supabase dashboard
- Wire up buttons: `supabase.auth.signInWithOAuth({ provider: 'google' | 'apple' })`
- Set redirect URL to `/auth/callback`

### 2.3 Auth callback handler
- Create `app/auth/callback/route.ts` — exchanges code for session
- After successful auth, redirect to `/` (home)

### 2.4 Session middleware & route protection
- Update `middleware.ts` to redirect unauthenticated users to `/login`
- Allow `/login` and `/auth/callback` without auth
- On successful login, check `users.neighbourhood_id`:
  - If `null` → redirect to `/onboarding/neighbourhood`
  - If set → redirect to `/dashboard`

### 2.5 Logout
- Create a logout action that calls `supabase.auth.signOut()`
- After logout, redirect to `/login`

### ✅ Task 2 Checklist
- [ ] Login screen renders correctly in RTL
- [ ] Google login flow completes and redirects to correct page
- [ ] New user (no neighbourhood) → redirected to neighbourhood screen (blank page OK for now)
- [ ] Returning user (neighbourhood set) → redirected to dashboard (blank page OK for now)
- [ ] Logout clears session and redirects to login
- [ ] Unauthenticated visit to `/dashboard` redirects to `/login`

---

## Task 3 — Onboarding
**Goal:** New users can select their neighbourhood and create or join a league.

### 3.1 Neighbourhood selection screen
- Create `app/(app)/onboarding/neighbourhood/page.tsx`
- Fetch neighbourhoods from Supabase: `supabase.from('neighbourhoods').select('*').order('display_order')`
- Build the screen as shown in the mockup:
  - Step dots at top (3 dots, middle one active and wider)
  - Title: `hood.title` from UI Copy
  - Subtitle: `hood.subtitle` from UI Copy
  - 2-column grid of neighbourhood cards
  - Selected card: teal background + teal border + checkmark
  - "המשך" button disabled until selection made
  - "דלג" skip link below button
- On confirm: `supabase.from('users').update({ neighbourhood_id })` then redirect to `/onboarding/league`
- On skip: redirect to `/onboarding/league` with `neighbourhood_id` still null

### 3.2 League hub screen
- Create `app/(app)/onboarding/league/page.tsx`
- Fetch user's existing leagues
- Build the screen as shown in the mockup:
  - Greeting: `onboard.greeting` with user's display name
  - "צור ליגה" primary CTA card (teal border, teal bg)
  - "או" divider
  - Code input field + "הצטרף" button
  - Existing leagues list (if user already has leagues)

### 3.3 Create league flow
- Generate 6-char invite code client-side
- Insert into `leagues` table, then insert creator into `league_members`
- On success: show invite code screen with:
  - Large code display (monospace, teal, letter-spacing)
  - WhatsApp share button — opens `https://wa.me/?text=...` with message from `UI_Copy`: `invite.whatsapp_msg`
  - Copy button — copies code to clipboard, shows "הועתק!" toast
  - "התחל לנחש" button → redirect to `/dashboard`

### 3.4 Join league flow
- On code input submit: look up league by invite code
- If found: insert into `league_members`, redirect to `/dashboard`
- If not found: show error `onboard.join_error` from UI Copy
- Validate: code must be exactly 6 characters, uppercase alphanumeric

### ✅ Task 3 Checklist
- [ ] Neighbourhood screen shows all seeded neighbourhoods
- [ ] Selecting a neighbourhood and confirming saves to DB and redirects
- [ ] Skip saves nothing and redirects
- [ ] Create league generates unique 6-char code
- [ ] Invite code screen shows correct code with working share/copy buttons
- [ ] Join with valid code adds user to league and redirects to dashboard
- [ ] Join with invalid code shows Hebrew error message
- [ ] After joining, user is not redirected to onboarding again on next login

---

## Task 4 — Bottom Navigation & Shell
**Goal:** The app shell with bottom tab bar is in place. All 4 tabs navigate to placeholder screens.

### 4.1 App shell layout
- Create `app/(app)/layout.tsx` — wraps all authenticated screens
- Include bottom tab bar component
- Add padding-bottom to content area to clear tab bar (56px + safe area)

### 4.2 Bottom tab bar component
- Create `components/BottomTabBar.tsx`
- 5 tabs as defined in UI Copy `nav.*`:
  - ניחושים → `/dashboard` (pencil/edit SVG icon)
  - טבלה → `/leaderboard` (list SVG icon)
  - טורניר → `/tournament` (trophy/cup SVG icon)
  - היסטוריה → `/history` (clock SVG icon)
  - פרופיל → `/profile` (person SVG icon)
- Active tab: `#0D9488` teal icon + label
- Inactive tab: `#9CA3AF` gray icon + label
- Use SVG icons inline — no emoji, no icon library
- Horizontal padding: 12px per tab (tighter than usual to fit 5 tabs)
- Bottom safe area: add `padding-bottom: env(safe-area-inset-bottom)` to tab bar

### 4.3 Placeholder screens
- Create `app/(app)/dashboard/page.tsx` — empty, title "ניחושים"
- Create `app/(app)/leaderboard/page.tsx` — empty, title "טבלה"
- Create `app/(app)/history/page.tsx` — empty, title "היסטוריה"
- Create `app/(app)/profile/page.tsx` — empty, title "פרופיל"

### ✅ Task 4 Checklist
- [ ] Tab bar renders on all 4 screens
- [ ] Active tab highlights correctly on each screen
- [ ] Navigation between tabs works
- [ ] Tab bar clears safe area on iOS (test in browser with mobile viewport)
- [ ] Layout does not break in RTL

---

## Task 5 — Matches & Predictions Dashboard
**Goal:** The core screen of the app. Users can see matches and submit predictions.

### 5.1 Match card component
- Create `components/MatchCard.tsx`
- Three states: `open`, `locked`, `finished`
- **Open state:**
  - Team A flag (20x14px `flag-icons`) + name on right
  - Score input boxes (38x38px, number input, `inputmode="numeric"`)
  - Team B flag + name on left
  - Countdown timer below teams (teal, tabular-nums)
  - "שמור ניחוש" teal button
- **Locked state:**
  - Same layout but inputs disabled and gray
  - Lock icon + "נעול" instead of timer
- **Finished state:**
  - Score boxes show actual result (dark background, white text)
  - Points badge below (Bingo/Correct/Miss — see UI Copy `result.*`)
  - User's prediction shown in small text below badge
- Right border accent: gold for Bingo, teal for Correct, gray for Miss

### 5.2 Countdown timer logic
- Create `hooks/useCountdown.ts`
- Accepts `kickoffAt: Date`
- Returns formatted string `HH:MM:SS` or `DD:HH:MM`
- Turns teal when under 1 hour
- Shows "נעול" when match is locked
- Uses `Asia/Jerusalem` timezone for display

### 5.3 Dashboard page
- Fetch matches from Supabase (all statuses except cancelled)
- Fetch user's predictions for all matches
- Group matches by date, show today's matches first
- Show Golden Boot sticky banner at top if `golden_boot_predictions` row doesn't exist yet for this user
- Banner text: `dash.golden_boot_banner` from UI Copy
- Personal rank pill in top bar: fetch from `league_members` (use first league if multiple)

### 5.4 Save prediction
- On "שמור ניחוש": upsert to `predictions` table
- Show success toast: `toast.saved` from UI Copy
- Handle locked error: show `error.match_locked` from UI Copy

### 5.5 Realtime match lock
- Subscribe to `matches` table changes via Supabase Realtime
- When a match `is_locked` changes to `true`, update the card state immediately without page refresh

### 5.6 Realtime points
- Subscribe to `predictions` table changes for current user
- When `points_awarded` updates, show the points badge on the card

### ✅ Task 5 Checklist
- [ ] Matches load and display with correct flags
- [ ] Score inputs accept numbers only, mobile keyboard is numeric
- [ ] Saving a prediction stores correct values in DB
- [ ] Countdown timer ticks correctly
- [ ] Locked match shows disabled inputs
- [ ] Finished match shows result + points badge
- [ ] Golden Boot banner appears when user hasn't predicted yet
- [ ] Realtime: locking a match in the DB immediately disables the input (test by manually updating DB)
- [ ] Realtime: awarding points in the DB immediately shows badge (test by manually updating DB)

---

## Task 6 — Leaderboard
**Goal:** Users can see their league ranking and switch between leagues.

### 6.1 Leaderboard row component
- Create `components/LeaderboardRow.tsx`
- Shows: position number, avatar circle (initials), display name, neighbourhood name, total points, trend indicator
- Current user row: teal background `#F0FDFA`, teal border `#2DD4BF`
- Position colors: gold for 1st, gray for 2nd, bronze `#BA7517` for 3rd
- Trend: ▲ teal for up, ▼ red for down, — gray for same

### 6.2 Podium component
- Create `components/Podium.tsx`
- Shows top 3 players: 2nd left, 1st center (tallest), 3rd right
- Each podium block shows: points, avatar, name, rank number
- Colors: gold for 1st, teal for current user, dark gray for others

### 6.3 Leaderboard page
- Fetch user's leagues
- Render one tab per league below the screen title (scrollable horizontal tabs)
- Active tab: teal underline + teal text
- Fetch leaderboard for active league: ordered by `total_points desc`
- Toggle between "אישי" and "שכונות" (Phase 2 — render neighbourhood tab as disabled/coming soon for now)
- Current user row always visible — if off-screen, pin to bottom above tab bar

### ✅ Task 6 Checklist
- [ ] Leaderboard shows all league members ranked by points
- [ ] Current user row highlighted in teal
- [ ] League tabs switch leaderboard data correctly
- [ ] Podium renders correctly for top 3
- [ ] Neighbourhood tab is visible but marked as "בקרוב" (coming soon)

---

## Task 7 — Match History
**Goal:** Users can see all past matches, their predictions, and points earned.

### 7.1 History stats bar component
- Create `components/HistoryStatsBar.tsx`
- Shows 5 stats in a row: matches played, total points, bingo count, correct count, miss count
- Calculated client-side from the predictions data

### 7.2 History filter
- 4 filter pills: הכל / בינגו / תוצאה נכונה / פספוס
- Filter is client-side — all data already loaded

### 7.3 History match card component
- Create `components/HistoryMatchCard.tsx`
- Shows: team flags, actual result (dark boxes), user prediction text, points badge
- Right border accent: gold for Bingo, teal for Correct, gray for Miss
- Grouped by date, newest first

### 7.4 History page
- Fetch all `finished` matches
- Fetch user's predictions joined with match data
- Only show matches the user has a prediction for

### ✅ Task 7 Checklist
- [ ] History shows all finished matches with correct results
- [ ] Points badges show correct type (Bingo/Correct/Miss)
- [ ] Filter pills work correctly
- [ ] Stats bar shows correct totals
- [ ] Empty state shows when no history yet

---

## Task 8 — Golden Boot Screen
**Goal:** Users can predict the tournament top scorer before the first match.

### 8.1 Player list component
- Create `components/PlayerList.tsx`
- Fetch all players ordered by `display_order`
- Each row: flag (28x20px `fi-md` class) + player name only — no club, no avatar circle
- Selected row: gold background `#FAEEDA`, gold border, gold checkmark
- Search: filter by name client-side (Hebrew-aware)

### 8.2 Golden Boot page
- Create `app/(app)/golden-boot/page.tsx`
- Accessible from the sticky banner on dashboard
- Countdown timer to first match kickoff (lock deadline)
- Player list with search
- Confirm bar at bottom: selected player name + gold "אשר בחירה" button
- On confirm: upsert to `golden_boot_predictions`
- Locked state: entire list disabled, shows read-only selection

### ✅ Task 8 Checklist
- [ ] All 40 players load with correct flags
- [ ] Search filters correctly (Hebrew text)
- [ ] Selecting a player highlights the row
- [ ] Confirming saves to DB
- [ ] After tournament starts, list is disabled and shows locked state
- [ ] Golden Boot banner disappears from dashboard after prediction is made

---

## Task 8.5 — Tournament Standings Screen
**Goal:** Users can see live group tables and the knockout bracket.

### 8.5.1 Group standings component
- Create `components/GroupTable.tsx`
- Fetches from `group_standings` table
- Dark header with group name and team list
- 6-column grid: team (flag + name), P, W, D, L, Pts
- Top 2 rows: teal background (`#F0FDFA`) — qualified
- Leading points: teal color
- No legend needed

### 8.5.2 Knockout bracket component
- Create `components/KnockoutBracket.tsx`
- Uses existing `matches` table filtered by stage (`r32`, `r16`, `qf`, `sf`, `final`)
- Rounds listed top to bottom, labeled in Hebrew + English
- Finished match: winner score teal, eliminated team grayed out + faded flag
- Upcoming match: gray "-" placeholder
- Final match card: gold border (`#EF9F27`)

### 8.5.3 Tournament page
- Create `app/(app)/tournament/page.tsx`
- Two tabs: "בתים" and "סבב פלאיאוף" — toggle between components
- Read-only — no user interaction beyond tab switch and scroll
- Data refreshes on page focus (re-fetch from Supabase)

### ✅ Task 8.5 Checklist
- [ ] All 12 group tables render with correct flags
- [ ] Top 2 in each group highlighted in teal
- [ ] Bracket shows all completed rounds with results
- [ ] Upcoming matches show "-" placeholder
- [ ] Final card has gold border
- [ ] Tab toggle works correctly
- [ ] Screen is read-only — no accidental taps trigger anything

---

## Task 9 — Profile Screen
**Goal:** Users can view their stats, change their display name, neighbourhood, and toggle dark mode.

### 9.1 Profile page
- Create `app/(app)/profile/page.tsx`
- Avatar circle with initials (first letter of first + last name)
- Display name + "מחובר עם Google/Apple"
- 3 stat cards: league rank, total points, bingo count
- Settings rows: display name (editable), neighbourhood (editable if not locked), dark mode toggle
- Leagues section: list of user's leagues with invite codes + "הצטרף או צור ליגה חדשה" link
- Version number from `package.json`
- Logout button (red, bottom of screen)

### 9.2 Dark mode toggle
- Store preference in `localStorage` key `theme`
- Apply `dark` class to `<html>` element
- CSS variables for dark mode in `globals.css`:
  ```css
  .dark {
    --color-bg: #111827;
    --color-surface: #1F2937;
    /* ... all tokens from UIUX Guidelines Section 11 */
  }
  ```
- Preference persists across sessions

### 9.3 Edit display name
- Inline edit — tap the row to show input
- On save: `supabase.from('users').update({ display_name })`

### 9.4 Edit neighbourhood
- Show neighbourhood selection sheet (same grid as onboarding screen)
- Disabled if `hood_locked = true` — show tooltip "לא ניתן לשנות לאחר תחילת הטורניר"

### ✅ Task 9 Checklist
- [ ] Stats show correct values
- [ ] Dark mode toggle works and persists on refresh
- [ ] Display name edit saves to DB
- [ ] Neighbourhood change works before tournament start
- [ ] Neighbourhood row is disabled after tournament start
- [ ] Logout clears session and redirects to login
- [ ] Leagues list shows all user's leagues with correct invite codes

---

## Task 10 — Edge Functions (Automation)
**Goal:** The three cron jobs that power the app's automation are deployed and running on staging.

### 10.1 `lock-predictions` Edge Function
- Create `supabase/functions/lock-predictions/index.ts`
- Logic from API Contract Section 10.2:
  1. Find matches where `kickoff_at <= now() + 5 min` and `status = 'scheduled'`
  2. Set `is_locked = true` on all predictions for those matches
  3. If this is the first match: set `golden_boot_predictions.is_locked = true` for all, set `users.hood_locked = true` for all
- Deploy: `npx supabase functions deploy lock-predictions`
- Schedule: every 1 minute via Supabase cron

### 10.2 `poll-results` Edge Function
- Create `supabase/functions/poll-results/index.ts`
- Logic from API Contract Section 10.1:
  1. Call API-Football `/fixtures` for today
  2. For each `FT` match not yet `finished` in our DB: update scores and status
  3. For `PST` matches: update kickoff_at
  4. For `CANC` matches: update status
  5. Call `run-scoring` for each newly finished match
- Deploy: `npx supabase functions deploy poll-results`
- Schedule: every 10 minutes

### 10.3 `run-scoring` Edge Function
- Create `supabase/functions/run-scoring/index.ts`
- Logic from API Contract Section 10.3:
  1. Accept `match_id` in request body
  2. Fetch all predictions for the match
  3. Calculate points per prediction (3/1/0)
  4. Update `predictions.points_awarded`
  5. Update `league_members.total_points` for all leagues each user belongs to
- Deploy: `npx supabase functions deploy run-scoring`
- Not on cron — called by `poll-results`

### 10.4 `sync-schedule` Edge Function
- Create `supabase/functions/sync-schedule/index.ts`
- Logic from API Contract Section 10.5:
  1. Call API-Football `/fixtures?season=2026&league=1`
  2. Upsert all matches using `api_football_id` as conflict key
- Deploy: `npx supabase functions deploy sync-schedule`
- Schedule: every 60 minutes
- Run manually once after deploy to populate all 104 matches

### 10.5 `resolve-golden-boot` Edge Function
- Create `supabase/functions/resolve-golden-boot/index.ts`
- Logic from API Contract Section 10.4
- Deploy: `npx supabase functions deploy resolve-golden-boot`
- No cron — called manually once at tournament end

### ✅ Task 10 Checklist
- [ ] All 4 deployed functions appear in Supabase dashboard
- [ ] `sync-schedule` run manually — 104 matches appear in `matches` table
- [ ] `lock-predictions` manually triggered — locks predictions for a test match
- [ ] `poll-results` manually triggered — processes a test result correctly
- [ ] `run-scoring` manually triggered — awards correct points for a test match
- [ ] Cron schedules are active in Supabase dashboard

---

## Task 11 — PWA Setup
**Goal:** The app is installable as a PWA on iOS and Android.

### 11.1 Web app manifest
- Create `public/manifest.json`:
  ```json
  {
    "name": "Mundial Master Predictor",
    "short_name": "Mundial",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#111827",
    "theme_color": "#0D9488",
    "dir": "rtl",
    "lang": "he",
    "icons": [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
- Add `<link rel="manifest">` to `app/layout.tsx`

### 11.2 App icons
- Create app icon: football SVG logo mark on dark background
- Export as `icon-192.png` and `icon-512.png` in `/public`
- Add Apple touch icon: `apple-touch-icon.png` (180x180)

### 11.3 Meta tags
- Add to `app/layout.tsx`:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="theme-color" content="#111827" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  ```

### ✅ Task 11 Checklist
- [ ] "Add to Home Screen" prompt appears on mobile Chrome
- [ ] App installs and opens in standalone mode (no browser chrome)
- [ ] App icon appears correctly on home screen
- [ ] Status bar is dark on iOS

---

## Task 12 — Pre-Launch Testing & Simulation
**Goal:** Run the full simulation on staging to verify the app works end-to-end before the real tournament.

### 12.1 Seed script
- Create `scripts/seed-staging.ts`
- Creates 5 test users, 2 test leagues, 8 fake matches (kickoffs relative to now())
- All from Tests doc Section 3.4
- Add `--reset` flag that truncates simulation data
- Add guard: throws error if `NEXT_PUBLIC_APP_ENV !== 'staging'`

### 12.2 Time-travel Edge Function
- Create `supabase/functions/time-travel/index.ts`
- Accepts `{ offset_minutes: number }`
- Sets `SIMULATION_TIME_OFFSET_MINUTES` env variable
- Only active when `NEXT_PUBLIC_APP_ENV === 'staging'`
- Deploy to staging only — never to production

### 12.3 Run full simulation
- Follow all 8 phases from Tests doc Section 7 exactly
- Check every item in every phase checklist
- Fix any failures before proceeding to Task 13

### ✅ Task 12 Checklist
- [ ] Seed script runs without errors and resets cleanly
- [ ] All 8 simulation phases pass
- [ ] All edge cases from Tests doc Section 8 verified
- [ ] Performance benchmarks from Tests doc Section 9 met

---

## Task 13 — Production Deploy
**Goal:** The app is live on production and ready for real users.

### 13.1 Production database
- Run migrations against production Supabase project
- Run seed data against production (neighbourhoods + players only — NOT test matches)
- Run `sync-schedule` function manually to populate all 104 real matches
- Verify all 104 matches appear with correct kickoff times in `Asia/Jerusalem`

### 13.2 Production environment
- Set all production env variables in Vercel
- Verify Vercel production domain is configured
- Merge `staging` → `main` via PR
- Verify production deploy succeeds

### 13.3 Pre-launch checklist
- Work through every item in the Pre-Tournament Checklist from DevOps doc Section 10
- Pay special attention to: API-Football quota, cron job schedules, Golden Boot lock time

### 13.4 Smoke test on production
- Log in with real Google account
- Select neighbourhood
- Create a league and share the invite code
- Join the league from a second account
- Submit a prediction
- Verify leaderboard shows both users

### ✅ Task 13 Checklist
- [ ] All items in DevOps Pre-Tournament Checklist are checked
- [ ] Real matches load with correct times in Hebrew/Israel timezone
- [ ] Login works with real Google account on mobile
- [ ] App installs as PWA on iPhone and Android
- [ ] Invite code sharing opens WhatsApp correctly on mobile

---

---

## Task 14 — League Management Improvements
**Goal:** Leagues are more robust — no duplicate names, creators can delete leagues, and all users share a global league automatically.

### 14.1 Global league
- Insert global league row: `id = 00000000-0000-0000-0000-000000000001`, `name = 'כולנו'`, `created_by = NULL`
- Create trigger `on_user_created_join_global` on `public.users` — auto-inserts into `league_members` on every new user
- Backfill: insert all existing users into global league (`ON CONFLICT DO NOTHING`)
- Profile page: show global league sublabel "כולנו" without invite code or delete button

### 14.2 Unique league names
- Create unique index: `leagues_name_unique` on `lower(trim(name))` where `id <> global-league-id`
- On league creation: catch `error.code === "23505"` and surface Hebrew error: "ליגה עם שם זה כבר קיימת"

### 14.3 League deletion
- Add migration: `leagues_delete_own` RLS policy — `for delete using (auth.uid() = created_by)`
- Profile page: show trash icon on leagues the current user created
- Inline confirm/cancel UI (no modal): tap trash → "בטוח?" with "כן, מחק" + "ביטול"
- On confirm: call Supabase `.delete()` and remove league from local state via SWR mutate

### 14.4 Invite code lookup RLS fix
- Add migration: `leagues_read_by_invite_code` policy — `for select using (auth.uid() is not null)`
- Fixes 406 error when joining league (unauthenticated lookup was previously blocked)
- Change `.single()` → `.maybeSingle()` in join-league flow to avoid 406 on zero rows

### ✅ Task 14 Checklist
- [ ] All new users auto-join global league on account creation
- [ ] Existing users are backfilled into global league
- [ ] Two leagues with same name (case-insensitive) cannot be created — Hebrew error shown
- [ ] League creator sees delete button; non-creator does not
- [ ] Deleting a league removes it from leaderboard and profile for all members
- [ ] Joining with a valid invite code no longer throws 406

---

## Task 15 — View Member Predictions (Leaderboard Drilldown)
**Goal:** Tapping any member in a league leaderboard shows their predictions for matches already started.

### 15.1 SECURITY DEFINER function
- Create migration `get_user_predictions(p_user_id uuid, p_league_id uuid)`
- Verifies both caller and target are members of the league before returning data
- Returns predictions joined with match data for matches with status `live`, `finished`, `postponed`, or `cancelled`
- `GRANT EXECUTE ON FUNCTION get_user_predictions(uuid, uuid) TO authenticated`

### 15.2 Hook
- Create `hooks/useUserPredictions.ts` — SWR hook wrapping `supabase.rpc("get_user_predictions", ...)`
- SWR key as array: `["user-predictions", userId, leagueId]`
- Returns `{ predictions, isLoading, error }`
- Explicit null coercion for `score_a/score_b` to survive Supabase type-gen non-nullable inference

### 15.3 Leaderboard row update
- Add `onClick?: () => void` prop to `LeaderboardRow`
- When `onClick` provided: `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter + Space), `cursor-pointer active:opacity-70 hover:bg-[#F9FAFB]`
- Chevron SVG with `rtl:rotate-180` to mirror in RTL
- `aria-label` → `"הצג ניחושים של {displayName}"`

### 15.4 User predictions page
- Create `app/(app)/leaderboard/[userId]/page.tsx`
- `leagueId` and `name` passed as search params — if `leagueId` missing, redirect to `/leaderboard`
- Header: RTL back button (`←`) with 44×44px touch target
- Date group labels: formatted `he-IL` (e.g. "14 ביוני"), not raw ISO string
- Live match badge: `"LIVE"` in red, positioned `right-2` (RTL leading edge)
- Reuses existing `HistoryMatchCard` component
- Error state and empty state both show `"עוד לא ניחש כלום"`

### ✅ Task 15 Checklist
- [ ] Tapping any league member navigates to their predictions page
- [ ] Predictions only show for matches that have started (not scheduled)
- [ ] Live match shows LIVE badge
- [ ] Back button returns to leaderboard
- [ ] Empty state shown when no started predictions exist
- [ ] Keyboard accessible (Enter/Space on row)
- [ ] Works in RTL — chevron direction, badge position, back arrow all correct

---

## Task 16 — Admin Score Management Page
**Goal:** A protected `/admin` page for manually updating match scores when the API cron fails, with test mode and one-level undo.

### 16.1 Migration
- Add `prev_score_a int` and `prev_score_b int` nullable columns to `matches` table (undo support)

### 16.2 Service-role client
- Create `lib/supabase/admin.ts` — `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY`
- Server-only — never imported by client components

### 16.3 Server actions
- Create `app/actions/admin.ts`:
  - `updateMatchScore(matchId, scoreA, scoreB, status)` — verify admin email, save prev scores, write new scores, trigger `run-scoring`
  - `undoMatchScore(matchId)` — verify admin email, swap score ↔ prev, clear prev, trigger `run-scoring`
- Both return `{ ok: boolean; error?: string }`
- Admin verification runs inside every action (double guard — page level is not sufficient)

### 16.4 Admin layout + page
- Create `app/(admin)/layout.tsx` — minimal wrapper, no BottomTabBar, no PWA chrome
- Create `app/(admin)/admin/page.tsx` — Server Component that:
  - Checks `user.email === process.env.ADMIN_EMAIL`, redirects non-admins to `/dashboard`
  - Fetches all 104 matches via admin client (bypasses RLS)
  - Passes matches to `<AdminScoreManager />`

### 16.5 AdminScoreManager component
- Create `components/AdminScoreManager.tsx` (client component):
  - Test Mode checkbox (red label) — when off, only `live`/`finished` matches show edit controls; when on, all matches editable
  - Stage filter + team name search
  - Collapsible match rows — tap to expand; shows kickoff time, teams, status badge, current score
  - Expanded row: score_a / score_b inputs, status selector (`scheduled`/`live`/`finished`/`postponed`/`cancelled`), Save button
  - Undo button visible only when `prev_score_a !== null` — shows previous score in label
  - Inline success/error feedback; `router.refresh()` after each action

### ✅ Task 16 Checklist
- [ ] `/admin` redirects non-admin users to `/dashboard`
- [ ] Admin can view all 104 matches
- [ ] Admin can update score + status; points are awarded automatically
- [ ] Undo restores previous score correctly
- [ ] Test mode allows editing future matches
- [ ] `ADMIN_EMAIL` and `SUPABASE_SERVICE_ROLE_KEY` documented in env vars

---

## Important Rules for Claude Code

1. **Never skip a task checklist** — if any item fails, fix it before moving to the next task.
2. **Always write TypeScript** — no `any` types.
3. **Always handle errors** — every Supabase call must have error handling.
4. **Never hardcode strings** — all UI text comes from the UI Copy doc constants.
5. **Always use RTL** — test every new component in RTL layout before marking done.
6. **Never push directly to `main`** — always go through `staging` first.
7. **Never run seed or simulation scripts against production** — always check `APP_ENV` first.
8. **Flags are always SVG** — use `flag-icons` CSS classes, never emoji flags.
9. **Scoring is always based on 90-minute result** — extra time and penalties do not affect predictions.
10. **All times are stored in UTC, displayed in Asia/Jerusalem** — never store local time.
