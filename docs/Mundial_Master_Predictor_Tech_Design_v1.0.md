# Mundial Master Predictor
## High Level Technical Design
**Version 1.0 | Status: Draft | 2025**

---

## 1. Stack Summary

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Frontend | Next.js + Tailwind CSS | PWA-ready, React-based, Vercel-native |
| Auth | Supabase Auth | Google / Apple OAuth built-in |
| Database | Supabase (Postgres) | Real-time, Row Level Security, 500MB free tier |
| Backend Logic | Supabase Edge Functions | Lock enforcement, scoring, cron jobs |
| Football Data | API-Football | 100 req/day free tier, covers full World Cup |
| Hosting | Vercel | Free tier, CDN, instant deploys |
| Notifications | Supabase Realtime | In-app only, no extra service needed |

**Total monthly cost at MVP scale: $0**

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Client Layer                          │
│     Next.js PWA — deployed on Vercel CDN        │
└────────────┬────────────────────────┬───────────┘
             │                        │
             ▼                        ▼
┌─────────────────────────────────────────────────┐
│                  Supabase                       │
│   Auth · Postgres DB · Realtime · Edge Fns      │
│                                                 │
│  ┌──────────┐  ┌────────────┐  ┌─────────────┐ │
│  │   Auth   │  │ Postgres   │  │  Realtime   │ │
│  │ Google / │  │ All data   │  │ Leaderboard │ │
│  │  Apple   │  │  + RLS     │  │  updates    │ │
│  └──────────┘  └────────────┘  └─────────────┘ │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │         Edge Functions (cron)            │   │
│  │  Poll API · write results · run scoring  │   │
│  └──────────────────┬───────────────────────┘   │
└─────────────────────│───────────────────────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Football Data   │
             │    API-Football │
             └─────────────────┘
```

---

## 3. Data Model

### 3.1 Entity Relationship Summary

| Entity | Description |
| :--- | :--- |
| `users` | Authenticated users via Google / Apple |
| `leagues` | Private groups identified by a 6-char invite code |
| `league_members` | Join table — user ↔ league, holds `total_points` |
| `matches` | World Cup fixtures from football API |
| `predictions` | User score predictions per match |
| `players` | Pre-seeded list of Top 40 Golden Boot candidates |
| `golden_boot_predictions` | One per user, locked before tournament start |

### 3.2 Key Tables

```sql
users
  id              uuid PK
  display_name    text
  avatar_url      text
  provider        text         -- 'google' | 'apple'
  created_at      timestamptz

leagues
  id              uuid PK
  name            text         -- unique (case-insensitive), enforced by unique index
  invite_code     text UNIQUE  -- 6-char, auto-generated
  created_by      uuid FK → users  -- NULLABLE: null for global league only
  created_at      timestamptz

league_members
  id              uuid PK
  league_id       uuid FK → leagues
  user_id         uuid FK → users
  total_points    int DEFAULT 0
  joined_at       timestamptz

matches
  id              uuid PK
  team_a          text
  team_b          text
  team_a_code     text         -- ISO 3166-1 alpha-2, e.g. 'fr' (for flag-icons)
  team_b_code     text         -- ISO 3166-1 alpha-2, e.g. 'br'
  team_a_flag_url text         -- API-Football SVG flag URL (for large display)
  team_b_flag_url text         -- API-Football SVG flag URL (for large display)
  kickoff_at      timestamptz
  stage           text         -- 'group' | 'r16' | 'qf' | 'sf' | 'final'
  status          text         -- 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled'
  score_a         int          -- null until finished
  score_b         int          -- null until finished
  prev_score_a    int          -- null unless admin overrode score (stores pre-override value for undo)
  prev_score_b    int          -- null unless admin overrode score (stores pre-override value for undo)

predictions
  id              uuid PK
  user_id         uuid FK → users
  match_id        uuid FK → matches
  predicted_a     int
  predicted_b     int
  points_awarded  int          -- null until match finished
  is_locked       boolean DEFAULT false
  created_at      timestamptz

players
  id              uuid PK
  name            text
  country         text
  country_code    text         -- ISO 3166-1 alpha-2, e.g. 'fr' (for flag-icons)
  flag_url        text         -- API-Football SVG flag URL (for large display)
  club            text

golden_boot_predictions
  id              uuid PK
  user_id         uuid FK → users UNIQUE  -- one prediction per user
  player_id       uuid FK → players
  points_awarded  int DEFAULT 0
  created_at      timestamptz
```

### 3.3 Special Entities

**Global League** — A fixed league with `id = 00000000-0000-0000-0000-000000000001` and `created_by = NULL`. Every new user is auto-joined via two mechanisms acting as belt-and-suspenders:
1. `handle_new_user()` trigger — inserts directly into `league_members` at signup.
2. `ensure_user_in_global_league()` RPC — called from `app/auth/callback/route.ts` after every successful OAuth code exchange as a safety net for any edge case where the trigger fired but the `league_members` insert was missed.
Both use `ON CONFLICT DO NOTHING`, making the double-write safe. Cannot be deleted (the `leagues_delete_own` policy requires `auth.uid() = created_by`, which is never true for null).

**Admin Score Override** — `matches.prev_score_a` / `prev_score_b` enable one-level undo. Before any admin score update, the current values are written to the `prev_*` columns. The undo action swaps them back and clears `prev_*`. These columns are otherwise null.

### 3.4 Design Decisions

- `league_members.total_points` is **denormalized** — updated on every scoring run for fast leaderboard queries without aggregation at read time.
- `predictions.is_locked` is **set server-side** by an Edge Function at T-5min before kickoff, regardless of client state.
- `matches.status` is the **single source of truth** for the entire match lifecycle and drives all automation.
- `golden_boot_predictions` has a **unique constraint on `user_id`** — enforces one prediction per user at DB level.
- `team_a_code` / `team_b_code` store the ISO 3166-1 alpha-2 country code (e.g. `fr`, `br`) — used directly as the `flag-icons` CSS class. Populated from API-Football response at ingestion time.
- `team_a_flag_url` / `team_b_flag_url` store the API-Football SVG URL — used for large flag display (48px+). Populated at ingestion time, no extra API call needed.

---

## 4. Core Logic

### 4.1 Prediction Lock (Edge Function — cron)

Runs every minute. Finds all matches where `kickoff_at <= now() + 5min` and `status = 'scheduled'`. Sets `predictions.is_locked = true` for all predictions on those matches.

Any prediction attempt on a locked match returns:
> *"This match is locked. Predictions are no longer accepted."*

### 4.2 Result Ingestion (Edge Function — cron)

Runs on a polling schedule (configurable frequency — see Section 6 for API quota strategy).

Flow:
1. Fetch finished matches from API-Football
2. Write `score_a`, `score_b`, set `status = 'finished'` on the `matches` row
3. Trigger scoring calculation (see 4.3)
4. For postponed matches: update `kickoff_at` to new date, reset lock timers
5. For cancelled matches: set `status = 'cancelled'`, void all predictions (no points awarded)

### 4.3 Scoring Logic (Edge Function)

Triggered after result ingestion for each finished match.

```
for each prediction on this match:
  if predicted_a == score_a AND predicted_b == score_b:
    points = 3  (Exact Score / Bingo)
  else if winner(predicted) == winner(actual):
    points = 1  (Correct Result)
  else:
    points = 0  (Miss)

  update predictions set points_awarded = points
  update league_members set total_points = total_points + points
    where user_id = prediction.user_id
```

**Knockout stage rule:** `winner()` uses the 90-minute result only. If `score_a == score_b`, result is a draw — regardless of extra time or penalties outcome.

### 4.4 Golden Boot Resolution (Edge Function — triggered at tournament end)

1. Fetch official top scorer(s) from API-Football
2. Find all `golden_boot_predictions` where `player_id` matches any official winner
3. Award 10 points, update `league_members.total_points` for each matching user
4. Handles ties: if multiple players share the Golden Boot, all users who predicted any of them receive the bonus

---

## 5. Security — Row Level Security (RLS)

All tables have RLS enabled. Key policies:

| Table | Policy |
| :--- | :--- |
| `leagues` | Read: members only, OR any authenticated user (for invite-code lookup before joining). Delete: creator only (`created_by = auth.uid()`). Insert: authenticated users. |
| `league_members` | Read: members of the same league only. |
| `predictions` | Read: own predictions always. Others' predictions visible only after match is `finished`/`cancelled`/`postponed`, or if caller also has a locked prediction for the same match. |
| `golden_boot_predictions` | Read: own only (until tournament ends, then all). |
| `matches` / `players` | Public read. Write: service role only (Edge Functions + admin actions). |

### 5.1 SECURITY DEFINER Functions

Some queries need data from tables whose RLS policies block cross-user access (e.g. the `users` table has a "read own row only" policy). These use `SECURITY DEFINER` PostgreSQL functions that run as the DB owner — but always verify caller membership before returning data.

| Function | Purpose | Caller check |
| :--- | :--- | :--- |
| `get_league_members(league_id)` | Returns all members of a league with points, display names, and `avatar_url` | Caller must be a member of the league |
| `get_user_predictions(user_id, league_id)` | Returns a member's predictions for started matches | Caller and target must both be members of the league |
| `ensure_user_in_global_league()` | Inserts the calling user into the global league if not already a member; no-op if already present | Uses `auth.uid()` — can only affect the caller's own row |

Rules for all SECURITY DEFINER functions:
- Always set `search_path = ''` to prevent search-path injection
- Always verify membership inside the function body — never rely on the caller to enforce access
- Always `GRANT EXECUTE ... TO authenticated` (not `public`)
- When changing a function's return type, use `DROP FUNCTION` before `CREATE FUNCTION` — PostgreSQL does not allow `CREATE OR REPLACE` when the return type changes (this was required for the `avatar_url` addition to `get_league_members`).

### 5.2 Admin Access Pattern

The admin page uses a service-role Supabase client (`lib/supabase/admin.ts`) that bypasses RLS entirely. This is only used in Server Actions (`app/actions/admin.ts`).

Admin authorization is enforced at two levels:
1. **Page level**: Server Component checks `user.email === process.env.ADMIN_EMAIL` and redirects non-admins.
2. **Action level**: Every Server Action re-verifies the same email check — page-level guards alone are insufficient since actions can be called directly.

`ADMIN_EMAIL` and `SUPABASE_SERVICE_ROLE_KEY` are server-only env vars (no `NEXT_PUBLIC_` prefix).

---

## 6. API Quota Strategy (API-Football Free Tier)

Free tier limit: **100 requests/day**.

World Cup 2026 has 104 matches over 39 days. Maximum matches on any single day is **4** (common in group stage and Round of 32).

**Worst case with 5-minute polling:**
4 matches x 2h active window x 12 polls/hour = 96 requests + ~4 schedule syncs = **~100 requests -- exactly at the limit, no buffer.**

**Chosen strategy: poll every 10 minutes during active windows.**

| Window | Interval | Peak day usage |
| :--- | :--- | :--- |
| Active match window (kickoff to FT) | Every 10 min | 4 matches x 12 polls = **48 requests** |
| Outside active windows | Every 60 min | ~4 requests |
| No-match days | Once/day | 1 request |
| **Peak day total** | | **~52 requests -- 48% of quota used** |

This gives comfortable headroom for retries, edge cases, and postponement checks while keeping results delay to a maximum of 10 minutes after final whistle -- fully acceptable for a prediction game.

Additional rules:
- Cache last API response in Postgres -- skip scoring if `status` unchanged since last poll
- Active window defined as: kickoff time to kickoff + 2h (group stage) or kickoff + 2.5h (knockout)
- On postponement detection: immediately re-sync schedule (1 extra request), then resume normal cadence

---

## 7. Key Constraints & Risks

| Item | Risk | Mitigation |
| :--- | :--- | :--- |
| API-Football free quota | 100 req/day limit | 10-min polling keeps peak usage at ~52 req/day (see Section 6) |
| Supabase free tier | 500MB DB, 500K Edge Function invocations/month | Sufficient for MVP scale; monitor usage |
| Clock drift on lock | Client clocks may differ from server | Lock enforced server-side only -- client UI is indicative |
| Timezone display | Fixed to Israel time (Asia/Jerusalem) | Store all times in UTC; display in Asia/Jerusalem timezone for all users |
| Realtime fan-out | Leaderboard updates on peak moments | Supabase Realtime handles this; no action needed at MVP scale |
| Results delay | Up to 10 min after FT | Acceptable for a prediction game -- not a live scores app |

---

## 8. Open Technical Questions

| # | Question |
| :--- | :--- |
| **T1** | Confirm API-Football plan and API key setup before development starts |

---

## 9. Admin Architecture

### 9.1 Route Structure

Admin pages live in `app/(admin)/` — a dedicated Next.js route group with its own layout. This ensures no user-facing chrome (BottomTabBar, PWA shell) is inherited.

```
app/
  (admin)/
    layout.tsx              — minimal wrapper, plain <main>
    admin/
      page.tsx              — server component: auth guard + data fetch
components/
  AdminPanel.tsx            — tab switcher (Scores | Leagues | Users)
  AdminScoreManager.tsx     — client component: match score editor, undo
  AdminLeagueManager.tsx    — client component: list + delete leagues
  AdminUserManager.tsx      — client component: list + delete users
app/actions/
  admin.ts                  — server actions: updateMatchScore, undoMatchScore,
                              deleteLeague, deleteAllLeagues, deleteUser
lib/supabase/
  admin.ts                  — service-role client factory (server-only)
```

### 9.2 Data Flow

```
User taps Save
      │
      ▼
AdminScoreManager (client)
  → calls updateMatchScore() server action
      │
      ▼
app/actions/admin.ts
  1. verifyAdmin() — checks SUPABASE_SERVICE_ROLE_KEY set + user.email === ADMIN_EMAIL
  2. Reads current score_a/b → writes to prev_score_a/b
  3. Writes new score_a/b + status via admin client (bypasses RLS)
  4. reset_match_scoring(match_id) RPC — subtracts previously awarded points from
     league_members.total_points, nulls out predictions.points_awarded so the
     idempotency guard in score_prediction is cleared
  5. adminClient.functions.invoke("run-scoring", { match_id })
      │
      ▼
Supabase run-scoring Edge Function
  — verifies JWT role claim is "service_role" (403 otherwise)
  — inserts locked 0-0 default predictions for users who never submitted one
  — awards points to all unscored predictions for that match
  — updates league_members.total_points via score_prediction RPC
```

### 9.3 Undo Flow

```
prev_score_a / prev_score_b are non-null
      │
User taps Undo
      │
      ▼
undoMatchScore() server action
  1. verifyAdmin()
  2. Reads prev_score_a/b
  3. Writes prev values back to score_a/b
  4. Clears prev_score_a/b (set to null)
  5. reset_match_scoring(match_id) — clears previously awarded points
  6. adminClient.functions.invoke("run-scoring") — re-scores with reverted values
```

Undo fully re-scores: `reset_match_scoring` wipes previous point awards before re-scoring, so the undo correctly recalculates points from scratch with the reverted score.

---

## 10. Phase 2 -- Neighbourhood Feature (Data Model)

### New Table

```sql
neighbourhoods
  id            uuid PK
  name          text        -- e.g. 'Shikun Dalet', 'Merkaz'
  display_order int         -- for consistent UI ordering
```

### Schema Changes

```sql
-- Add to users table
neighbourhood_id  uuid FK -> neighbourhoods   -- null until user selects
is_locked         boolean DEFAULT false        -- locked once tournament starts

-- New view / materialised score per league
neighbourhood_scores (view)
  league_id         uuid
  neighbourhood_id  uuid
  neighbourhood_name text
  total_points      int    -- sum of league_members.total_points for members of this neighbourhood
  member_count      int
```

### Design Notes
- `neighbourhood_id` on `users` is nullable -- user may not have selected one yet.
- Neighbourhood score is derived from existing `league_members.total_points` -- no new scoring logic needed.
- Neighbourhood list is predefined and seeded at deploy time; no admin UI required.
- Lock neighbourhood selection when `matches` table has any row with `status != 'scheduled'` (tournament has started).
