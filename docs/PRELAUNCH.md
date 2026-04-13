# Pre-Launch Checklist

Complete all items before the tournament opens for predictions.

---

## 1. Supabase — Migrations

- [ ] Apply all migrations in order via Supabase Dashboard → SQL Editor:
  1. `20250611000001_initial_schema.sql`
  2. `20250611000002_seed_data.sql`
  3. `20250611000003_fix_leagues_rls.sql`
  4. `20250611000004_fix_league_members_rls.sql`
  5. `20250611000005_fix_predictions_rls.sql`
  6. `20260412000001_cron_schedules.sql`
  7. `20260412000002_scoring_rpcs.sql`
  8. `20260412000003_seed_matches.sql`
  9. `20260412000004_seed_group_standings.sql`

---

## 2. Supabase — Cron Migration (inline credentials)

The cron migration (`20260412000001_cron_schedules.sql`) uses hardcoded URLs.
Before running it in SQL Editor, replace `__SERVICE_ROLE_KEY__` with your actual
service role key (Dashboard → Settings → API → service_role).

**Do not commit the file with the real key in it.**

---

## 3. Supabase — Edge Function Secrets

Set these in Dashboard → Edge Functions → Secrets:

| Secret | Value |
|---|---|
| `API_FOOTBALL_KEY` | Your API-Football key from api-football.com |

> **Confirmed:** `league=1` is "World Cup" in API-Football v3 (verified April 2026). No change needed in `sync-schedule/index.ts` or `poll-results/index.ts`.

---

## 4. Supabase — Deploy Edge Functions

Deploy all 5 functions via Supabase CLI:

```bash
supabase functions deploy lock-predictions
supabase functions deploy run-scoring
supabase functions deploy poll-results
supabase functions deploy sync-schedule
supabase functions deploy resolve-golden-boot
```

---

## 5. Populate Match Schedule

All 104 matches are seeded via `20260412000003_seed_matches.sql` (step 1.8 above).
Group stage and knockout TBD placeholders are included.

Verify via SQL: `SELECT COUNT(*) FROM matches;` — should return 104.

Once the tournament starts and API-Football has 2026 data, `sync-schedule` and `poll-results`
will update scores and resolve knockout TBDs automatically via cron.

---

## 6. Confirm Points Values

- [ ] Confirm `GOLDEN_BOOT_POINTS = 5` with product owner before running `resolve-golden-boot` in production.

---

## 7. Vercel — Environment Variables

Ensure these are set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

---

## 8. Smoke Test Checklist

Test end-to-end on a real device (mobile, Hebrew locale):

- [ ] Sign up with email → receive confirmation email → confirm → land on onboarding
- [ ] Create a league → share invite code → second user joins via code
- [ ] Submit a prediction for an upcoming match → see it saved on dashboard
- [ ] Verify prediction locks 5 min before kickoff (test with a near-future kickoff)
- [ ] Verify golden boot prediction can be submitted before tournament start
- [ ] Check leaderboard shows correct standings
- [ ] Check history tab shows past match results
- [ ] Install as PWA on iPhone → verify it opens as standalone app
- [ ] Kill network → verify offline page appears, retry button works

---

## 9. Accessibility / RTL Spot Check

- [ ] Open app on iPhone (Safari) — verify Hebrew text renders correctly with Heebo font
- [ ] Verify all tap targets are comfortably tappable (minimum 44×44px)
- [ ] Verify layout is correct in RTL (e.g. back arrows point right →, flags on correct sides)

---

## 10. After Tournament Ends

- [ ] Run `resolve-golden-boot` manually with the winning player's UUID:
  ```bash
  curl -X POST https://<your-project>.supabase.co/functions/v1/resolve-golden-boot \
    -H "Authorization: Bearer <your-service-role-key>" \
    -H "Content-Type: application/json" \
    -d '{"player_id": "<uuid>"}'
  ```
