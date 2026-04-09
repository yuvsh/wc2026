# Mundial Master Predictor
## Test Specification
**Version 1.0 | Status: Draft | 2025**

---

## 1. Overview

This document defines the testing strategy for Mundial Master Predictor. The core challenge is that the app is time-dependent and data-dependent — predictions lock before kickoff, points are awarded after results come in, and the Golden Boot resolves at tournament end. All of this must be testable **before** the real tournament starts on June 11, 2026.

The solution is a **simulation layer** on the staging environment: fake matches with controllable kickoff times, a seed script for users and leagues, and a time-travel utility that lets the team fast-forward through a full tournament lifecycle in minutes.

**Testing environments:** Staging only — never run simulation scripts against production.

---

## 2. Testing Levels

| Level | Tool | When |
| :--- | :--- | :--- |
| Unit tests | Jest | On every PR (CI runs automatically) |
| Integration tests | Jest + Supabase local | On every PR (CI runs automatically) |
| End-to-end tests | Playwright | Before merging to `main` |
| Manual simulation | Seed script + time-travel | Staging, before tournament start |

---

## 3. Simulation Strategy

### 3.1 The Problem
Real matches happen at fixed times. Prediction locks happen 5 minutes before kickoff. Results arrive after 90+ minutes. Testing the full flow in real time is impractical.

### 3.2 The Solution — Controllable Time & Fake Matches

Two mechanisms work together:

**A) Seed Script** — populates the staging DB with:
- 5 fake users (with known credentials)
- 2 fake leagues
- 8 fake matches spread across the next 30 minutes (instead of 30 days)
- All 40 Golden Boot players

**B) Time-Travel Utility** — a staging-only admin endpoint that:
- Overrides the app's internal "current time" via an env variable `SIMULATION_TIME_OFFSET_MINUTES`
- Allows jumping forward by N minutes to trigger lock events and result ingestion
- Only active when `NEXT_PUBLIC_APP_ENV === 'staging'`

### 3.3 Simulation Match Schedule

When the seed script runs, it creates 8 matches with kickoff times relative to `now()`:

| Match | Kickoff offset | Stage | Notes |
| :--- | :--- | :--- | :--- |
| Match 1 | now + 10 min | Group | Locks in 5 min after seeding |
| Match 2 | now + 20 min | Group | Used for postponement test |
| Match 3 | now + 30 min | Group | |
| Match 4 | now + 40 min | Group | |
| Match 5 | now + 50 min | Group | Used for cancellation test |
| Match 6 | now + 60 min | Round of 32 | Knockout scoring test |
| Match 7 | now + 70 min | Semi-Final | Extra time / penalties test |
| Match 8 | now + 90 min | Final | Golden Boot resolves after this |

### 3.4 Seed Script

Location: `/scripts/seed-staging.ts`

Run with:
```bash
npx ts-node scripts/seed-staging.ts
```

**What it creates:**

```typescript
// 5 fake users — you'll log into each one in a separate browser profile/incognito window
const users = [
  { email: 'test1@mundial.test', display_name: 'Alice', neighbourhood: 'North' },
  { email: 'test2@mundial.test', display_name: 'Bob',   neighbourhood: 'South' },
  { email: 'test3@mundial.test', display_name: 'Carol', neighbourhood: 'North' },
  { email: 'test4@mundial.test', display_name: 'David', neighbourhood: 'Center' },
  { email: 'test5@mundial.test', display_name: 'Eve',   neighbourhood: 'South' },
];
// Tip: use Chrome profiles or different browsers for each user — no need for automation

// 2 fake leagues
const leagues = [
  { name: 'Test League Alpha', invite_code: 'TESTA1' },
  { name: 'Test League Beta',  invite_code: 'TESTB2' },
];

// 8 fake matches (kickoff times relative to now())
// All 40 Golden Boot players (pre-seeded from players table)
```

**Cleanup:** Running the seed script again resets all simulation data (idempotent).

### 3.5 Time-Travel Utility

A staging-only Supabase Edge Function: `POST /functions/v1/time-travel`

```json
// Request body
{ "offset_minutes": 15 }

// Effect: all time-based logic (lock checks, cron polling)
// behaves as if current time is now() + 15 minutes
```

This is controlled via `SIMULATION_TIME_OFFSET_MINUTES` env variable on staging. The cron jobs and lock function read this offset when present.

> **Safety:** This env variable does not exist in production. If accidentally set, the app ignores it unless `NEXT_PUBLIC_APP_ENV === 'staging'`.

---

## 4. Unit Tests

### 4.1 Scoring Logic

Location: `/lib/scoring.test.ts`

| Test | Input | Expected output |
| :--- | :--- | :--- |
| Exact score | Result 2-1, Predicted 2-1 | 3 points |
| Correct winner | Result 2-1, Predicted 3-1 | 1 point |
| Correct draw | Result 1-1, Predicted 0-0 | 1 point |
| Miss | Result 2-0, Predicted 0-1 | 0 points |
| Knockout draw (90 min) | Result 1-1 (went to pens), Predicted 1-1 | 3 points |
| Knockout — predicted winner advances | Result 1-1 (France wins on pens), Predicted 2-0 France | 0 points — scored on 90 min only |
| Cancelled match | status = 'cancelled' | 0 points, no error |

### 4.2 Lock Logic

Location: `/lib/lock.test.ts`

| Test | Scenario | Expected |
| :--- | :--- | :--- |
| Lock fires at T-5min | kickoff in 4 min | prediction locked |
| Lock does not fire early | kickoff in 6 min | prediction still open |
| Lock is idempotent | already locked match | no error, no duplicate lock |
| Post-lock prediction attempt | match is locked | error returned |

### 4.3 Invite Code Generation

| Test | Scenario | Expected |
| :--- | :--- | :--- |
| Code is 6 characters | generate code | length === 6 |
| Code is alphanumeric uppercase | generate code | matches /^[A-Z0-9]{6}$/ |
| Code is unique | generate 1000 codes | no duplicates |

### 4.4 Golden Boot

| Test | Scenario | Expected |
| :--- | :--- | :--- |
| Single winner | user predicted correct player | 10 points awarded |
| Tied winners | 2 players share boot, user predicted either | 10 points awarded |
| Miss | user predicted wrong player | 0 points |

---

## 5. Integration Tests

Location: `/tests/integration/`

These tests run against a local Supabase instance (`supabase start`).

### 5.1 Prediction Flow

```
1. Create user
2. Create league and join
3. Submit prediction for an open match
4. Verify prediction saved in DB
5. Trigger lock (advance time past T-5min)
6. Attempt to update prediction → expect error
7. Inject match result
8. Trigger scoring
9. Verify points_awarded on prediction row
10. Verify league_members.total_points updated
```

### 5.2 League Flow

```
1. User A creates league → invite code generated
2. User B joins with invite code → league_members row created
3. Verify both users appear in leaderboard query
4. User A submits prediction, User B does not
5. Run scoring
6. Verify User A has points, User B has 0
7. Verify leaderboard order is correct
```

### 5.3 Neighbourhood Score (Phase 2)

```
1. Seed users with different neighbourhoods
2. Award points to users in different neighbourhoods
3. Query neighbourhood_scores view
4. Verify totals match sum of individual scores
5. Verify neighbourhood ranking order
```

### 5.4 RLS Policies

```
1. User A attempts to read User B's unlocked predictions → denied
2. User A attempts to read User B's locked predictions → allowed
3. User A attempts to read a league they are not a member of → denied
4. User A attempts to write to another user's predictions → denied
5. Service role can write to matches table → allowed
6. Anon user attempts to write to matches table → denied
```

---

## 6. End-to-End Tests (Playwright)

Location: `/tests/e2e/`

Run with:
```bash
npx playwright test
```

> Since you're running tests solo, focus on the critical path tests first (AUTH, PRED, LB). The RTL and neighbourhood tests can run before the tournament starts.

### 6.1 Authentication

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-AUTH-01 | User opens app, sees login screen | Login screen renders with Google + Apple buttons |
| E2E-AUTH-02 | User logs in with Google (mock) | Redirected to neighbourhood selection |
| E2E-AUTH-03 | Returning user logs in | Redirected directly to dashboard (skips neighbourhood) |

### 6.2 Neighbourhood Selection

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-HOOD-01 | New user sees neighbourhood screen | Grid of neighbourhoods renders |
| E2E-HOOD-02 | User selects neighbourhood | Card highlights, Continue button enables |
| E2E-HOOD-03 | User skips neighbourhood | Redirected to onboarding, neighbourhood null |
| E2E-HOOD-04 | User returns to profile and changes neighbourhood | neighbourhood_id updated in DB |

### 6.3 League Management

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-LEAGUE-01 | User creates a league | Invite code screen shown with 6-char code |
| E2E-LEAGUE-02 | User shares via WhatsApp button | WhatsApp deep link triggered with correct code in message |
| E2E-LEAGUE-03 | User copies code | Clipboard contains 6-char code, toast shown |
| E2E-LEAGUE-04 | User joins with valid code | Added to league, redirected to dashboard |
| E2E-LEAGUE-05 | User joins with invalid code | Error message shown |
| E2E-LEAGUE-06 | User belongs to 2 leagues | Both visible in leaderboard tabs and profile |

### 6.4 Predictions

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-PRED-01 | User enters score and saves | Prediction saved, success toast shown |
| E2E-PRED-02 | User edits before lock | Prediction updated |
| E2E-PRED-03 | User tries to predict after lock | Input disabled, lock icon visible |
| E2E-PRED-04 | Match result arrives | Points badge appears on card |
| E2E-PRED-05 | Bingo — exact score | Gold badge "Bingo · 3 pts" |
| E2E-PRED-06 | Correct result — wrong score | Green badge "Correct · 1 pt" |
| E2E-PRED-07 | Miss | Gray badge "Miss · 0 pts" |

### 6.5 Leaderboard

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-LB-01 | User opens leaderboard | Rankings show all league members |
| E2E-LB-02 | Current user row highlighted | Teal background on own row |
| E2E-LB-03 | Switch between leagues via tabs | Leaderboard updates to selected league |
| E2E-LB-04 | Switch to neighbourhood tab | Neighbourhood scores shown correctly |

### 6.6 Golden Boot

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-GB-01 | User opens Golden Boot screen | Player list renders with flags |
| E2E-GB-02 | User searches for player | List filters correctly |
| E2E-GB-03 | User selects player and confirms | Selection saved, confirm bar shows name |
| E2E-GB-04 | After first match kicks off | Entire list disabled, selection shown read-only |
| E2E-GB-05 | At tournament end — correct prediction | 10 points awarded, visible in profile stats |

### 6.7 RTL & Hebrew

| Test ID | Scenario | Pass Criteria |
| :--- | :--- | :--- |
| E2E-RTL-01 | All screens render in RTL | Text right-aligned, layout flows right-to-left |
| E2E-RTL-02 | Score input layout | Team B on left, Team A on right |
| E2E-RTL-03 | Countdown timer uses tabular nums | No layout shift as timer ticks |

---

## 7. Manual Test Cases — Full Simulation Run

This is the pre-launch checklist. Run on staging with the seed script active.

**Setup:**
```bash
npx ts-node scripts/seed-staging.ts
```
Open 5 browser windows (Chrome profiles or incognito tabs) and log in as `test1@mundial.test` through `test5@mundial.test`. You'll be switching between them to simulate multiple users.

### Phase 1 — Before any match (T-0)

- [ ] All 5 users can log in
- [ ] All users can see the 8 simulation matches
- [ ] All users submit predictions for all 8 matches
- [ ] Golden Boot prediction submitted by all users (different players per user)
- [ ] Leaderboard shows all 5 users with 0 points
- [ ] Neighbourhood leaderboard shows correct groupings

### Phase 2 — Approach lock time (advance time by +6 min)

```bash
curl -X POST https://staging.mundial.app/functions/v1/time-travel \
  -d '{"offset_minutes": 6}'
```

- [ ] Match 1 is now locked (kickoff in 4 min → T-5 lock has fired)
- [ ] Score input for Match 1 is disabled
- [ ] Lock icon visible on Match 1 card
- [ ] Attempt to submit prediction for Match 1 → error shown
- [ ] Match 2 still open (kickoff in 14 min)

### Phase 3 — Match 1 finishes (advance time by +20 min total)

```bash
curl -X POST https://staging.mundial.app/functions/v1/time-travel \
  -d '{"offset_minutes": 20}'
```

Manually inject result for Match 1 via Supabase dashboard (score_a=2, score_b=1, status='finished').

- [ ] Points appear on Match 1 card for all users
- [ ] User with exact score (2-1) gets 3 points
- [ ] User with correct winner but wrong score gets 1 point
- [ ] User with wrong result gets 0 points
- [ ] Leaderboard updates and shows correct ranking
- [ ] total_points in league_members matches sum of prediction points

### Phase 4 — Test postponement (Match 2)

Set Match 2 status to 'postponed', new kickoff = now + 60 min.

- [ ] Match 2 shows "postponed" state on dashboard
- [ ] Original predictions for Match 2 are preserved
- [ ] Lock timer resets to new kickoff time
- [ ] Users can still edit predictions for Match 2

### Phase 5 — Test cancellation (Match 5)

Set Match 5 status to 'cancelled'.

- [ ] Match 5 disappears from upcoming list
- [ ] Any existing predictions for Match 5 are voided (0 points)
- [ ] No points awarded for Match 5

### Phase 6 — Knockout stage scoring (Match 6)

Inject result: score_a=1, score_b=1, status='finished' (draw at 90 min — went to penalties in "real life").

- [ ] User who predicted 1-1 gets 3 points (Bingo — scored on 90 min)
- [ ] User who predicted the "correct" penalty winner gets 0 points
- [ ] User who predicted a draw (any score draw) gets 1 point minimum

### Phase 7 — Golden Boot resolution (after Match 8)

Set Match 8 status to 'finished'. Manually mark Golden Boot winner in DB.

- [ ] Users who predicted the correct player get 10 points
- [ ] If 2 players tied, users who predicted either get 10 points
- [ ] Points appear in profile stats
- [ ] Leaderboard final order is correct

### Phase 8 — Dark mode & RTL

- [ ] Toggle dark mode in profile — all screens update correctly
- [ ] No white text on white background, no black text on black background
- [ ] All flags render as SVGs (not emoji) across all screens
- [ ] Hebrew text is right-aligned throughout
- [ ] Score inputs accept numbers only, mobile keyboard is numeric

---

## 8. Edge Cases to Verify

| Case | How to test | Expected |
| :--- | :--- | :--- |
| User with no league visits dashboard | Log in as new user, skip league creation | Empty state shown with CTA |
| User joins league after some matches played | Join mid-tournament | Past matches show 0 points, future matches open |
| Two users same exact score prediction | Both predict 2-1, result is 2-1 | Both get 3 points |
| User never submits Golden Boot | Leave it blank until lock | 0 points, no error |
| Match with no predictions | All users skipped a match | Scoring runs without error, no points affected |
| Rapid re-rank | 3 users tied on points | Leaderboard stable, no flicker |
| API-Football returns no data | Simulate empty API response | Cron job fails gracefully, no DB corruption |

---

## 9. Performance Baseline (Staging)

Before launch, verify these benchmarks on staging:

| Metric | Target | How to measure |
| :--- | :--- | :--- |
| Dashboard initial load | < 2s | Lighthouse / Chrome DevTools |
| Leaderboard query (50 members) | < 300ms | Supabase query analyzer |
| Prediction save | < 500ms | Network tab |
| Lock Edge Function execution | < 200ms | Supabase Function logs |
| Scoring Edge Function (50 predictions) | < 1s | Supabase Function logs |

---

## 10. Test Data Reset

To reset all simulation data on staging and start fresh:

```bash
npx ts-node scripts/seed-staging.ts --reset
```

This truncates all simulation tables and re-seeds from scratch. Safe to run multiple times.

> **Never run this against production.** The script checks `NEXT_PUBLIC_APP_ENV` and will throw if it is not `'staging'`.
