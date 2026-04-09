# Mundial Master Predictor
## API Contract
**Version 1.0 | Status: Draft | 2025**

---

## 1. Overview

This document defines every API endpoint the frontend consumes. The app uses two types of APIs:

- **Supabase REST API** — auto-generated from the database schema. Used for all CRUD operations via the Supabase JS client.
- **Supabase Edge Functions** — custom serverside logic that cannot be expressed as simple DB queries (lock enforcement, scoring, result ingestion).

All requests require a valid Supabase JWT in the `Authorization` header unless marked as **public**.
All timestamps are returned in **UTC ISO 8601** format. The frontend converts to `Asia/Jerusalem` for display.
All responses follow the Supabase envelope format unless otherwise noted.

---

## 2. Authentication

Authentication is handled entirely by Supabase Auth. The frontend uses the Supabase JS client — no custom auth endpoints needed.

### 2.1 Login

```
Provider: Google OAuth / Apple OAuth
Client call: supabase.auth.signInWithOAuth({ provider: 'google' | 'apple' })
```

**On success:** Supabase returns a session with `access_token` and `refresh_token`. The JS client stores these automatically.

**Side effect:** Triggers `on_auth_user_created` → creates row in `public.users`.

### 2.2 Logout

```
Client call: supabase.auth.signOut()
```

### 2.3 Session Check (on app load)

```
Client call: supabase.auth.getSession()
```

Used to determine whether to show the login screen or the dashboard.

---

## 3. Users

### 3.1 Get Current User Profile

```
Client call: supabase.from('users').select('*, neighbourhoods(name)').eq('id', uid).single()
```

**Response:**
```json
{
  "id": "uuid",
  "display_name": "יובל כהן",
  "avatar_url": "https://...",
  "provider": "google",
  "neighbourhood_id": "uuid | null",
  "hood_locked": false,
  "created_at": "2026-06-01T10:00:00Z",
  "neighbourhoods": {
    "name": "מרכז"
  }
}
```

### 3.2 Update Neighbourhood

```
Client call: supabase.from('users').update({ neighbourhood_id: '<uuid>' }).eq('id', uid)
```

**Constraint:** Only allowed when `hood_locked = false`. Once the first match kicks off, the Edge Function `lock-predictions` sets `hood_locked = true` for all users.

**Error if locked:**
```json
{ "code": "HOOD_LOCKED", "message": "Neighbourhood cannot be changed after the tournament has started." }
```

### 3.3 Update Display Name

```
Client call: supabase.from('users').update({ display_name: '<string>' }).eq('id', uid)
```

---

## 4. Neighbourhoods

### 4.1 List All Neighbourhoods

**Public — no auth required.**

```
Client call: supabase.from('neighbourhoods').select('*').order('display_order')
```

**Response:**
```json
[
  { "id": "uuid", "name": "מרכז", "display_order": 1 },
  { "id": "uuid", "name": "צפון", "display_order": 2 }
]
```

---

## 5. Leagues

### 5.1 Create League

```
Client call: supabase.from('leagues').insert({ name, invite_code, created_by: uid })
```

**Invite code generation:** Done client-side before insert.

```typescript
// Generate a random 6-character alphanumeric code
function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
```

**Side effect:** After insert, automatically add creator as a member:
```
supabase.from('league_members').insert({ league_id, user_id: uid })
```

**Error — duplicate code:**
```json
{ "code": "23505", "message": "Invite code already exists." }
```
Retry with a new code if this occurs.

### 5.2 Join League by Invite Code

```
Client call:
  1. supabase.from('leagues').select('id').eq('invite_code', code).single()
  2. supabase.from('league_members').insert({ league_id, user_id: uid })
```

**Error — invalid code:**
```json
{ "code": "PGRST116", "message": "No league found with this invite code." }
```

**Error — already a member:**
```json
{ "code": "23505", "message": "User is already a member of this league." }
```

### 5.3 Get User's Leagues

```
Client call:
  supabase.from('league_members')
    .select('league_id, total_points, leagues(id, name, invite_code)')
    .eq('user_id', uid)
```

**Response:**
```json
[
  {
    "league_id": "uuid",
    "total_points": 43,
    "leagues": {
      "id": "uuid",
      "name": "ליגת רביבים",
      "invite_code": "A4X9K2"
    }
  }
]
```

---

## 6. Leaderboard

### 6.1 Individual Leaderboard for a League

```
Client call:
  supabase.from('league_members')
    .select('total_points, users(id, display_name, avatar_url, neighbourhoods(name))')
    .eq('league_id', leagueId)
    .order('total_points', { ascending: false })
```

**Response:**
```json
[
  {
    "total_points": 47,
    "users": {
      "id": "uuid",
      "display_name": "דני כהן",
      "avatar_url": "https://...",
      "neighbourhoods": { "name": "מרכז" }
    }
  }
]
```

### 6.2 Neighbourhood Leaderboard for a League (Phase 2)

```
Client call:
  supabase.from('neighbourhood_scores')
    .select('*')
    .eq('league_id', leagueId)
    .order('total_points', { ascending: false })
```

**Response:**
```json
[
  {
    "league_id": "uuid",
    "neighbourhood_id": "uuid",
    "neighbourhood_name": "מרכז",
    "total_points": 171,
    "member_count": 7
  }
]
```

---

## 7. Matches

### 7.1 Get All Matches (Dashboard)

```
Client call:
  supabase.from('matches')
    .select('*')
    .in('status', ['scheduled', 'live', 'finished'])
    .order('kickoff_at', { ascending: true })
```

**Response:**
```json
[
  {
    "id": "uuid",
    "team_a": "צרפת",
    "team_b": "ברזיל",
    "team_a_code": "fr",
    "team_b_code": "br",
    "team_a_flag_url": "https://media.api-sports.io/flags/fr.svg",
    "team_b_flag_url": "https://media.api-sports.io/flags/br.svg",
    "kickoff_at": "2026-06-14T18:00:00Z",
    "stage": "group",
    "status": "scheduled",
    "score_a": null,
    "score_b": null
  }
]
```

---

## 8. Predictions

### 8.1 Get User's Predictions

```
Client call:
  supabase.from('predictions')
    .select('*')
    .eq('user_id', uid)
```

### 8.2 Submit or Update Prediction

```
Client call:
  supabase.from('predictions')
    .upsert({
      user_id: uid,
      match_id: matchId,
      predicted_a: scoreA,
      predicted_b: scoreB
    }, { onConflict: 'user_id,match_id' })
```

**Constraint:** RLS policy blocks updates where `is_locked = true`. If a user tries to submit after lock:

**Error:**
```json
{
  "code": "PRED_LOCKED",
  "message": "המשחק נעול. לא ניתן לשנות ניחוש."
}
```

### 8.3 Get Predictions for a Finished Match (all users in league)

Used for Match History — shows what everyone predicted after the match is over.

```
Client call:
  supabase.from('predictions')
    .select('predicted_a, predicted_b, points_awarded, users(display_name)')
    .eq('match_id', matchId)
```

**Note:** RLS only returns other users' predictions when the match `is_locked = true` or `status = 'finished'`.

---

## 9. Golden Boot

### 9.1 Get All Players

**Public — no auth required.**

```
Client call:
  supabase.from('players')
    .select('*')
    .order('display_order', { ascending: true })
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "קיליאן מבאפה",
    "country": "צרפת",
    "country_code": "fr",
    "flag_url": "https://media.api-sports.io/flags/fr.svg",
    "display_order": 1
  }
]
```

### 9.2 Submit Golden Boot Prediction

```
Client call:
  supabase.from('golden_boot_predictions')
    .upsert({
      user_id: uid,
      player_id: playerId
    }, { onConflict: 'user_id' })
```

**Constraint:** RLS blocks updates where `is_locked = true`.

**Error if locked:**
```json
{
  "code": "GB_LOCKED",
  "message": "הניחוש נעול. לא ניתן לשנות את הבחירה."
}
```

### 9.3 Get Current User's Golden Boot Prediction

```
Client call:
  supabase.from('golden_boot_predictions')
    .select('*, players(name, country_code)')
    .eq('user_id', uid)
    .single()
```

---

## 10. Edge Functions

These are custom serverside functions that run on Supabase Edge. They are called by cron jobs — **not by the frontend directly**.

### 10.1 `poll-results`

**Trigger:** Cron — every 10 minutes during active match windows.
**Auth:** Service role key (internal only).

**What it does:**
1. Calls API-Football `/fixtures` endpoint for today's matches
2. For each match returned with `status = 'FT'`:
   - If our DB still has `status = 'scheduled'` or `'live'` → update `score_a`, `score_b`, `status = 'finished'`, `last_synced_at = now()`
   - If already `'finished'` → skip
3. For postponed matches (`status = 'PST'`): update `status = 'postponed'`, update `kickoff_at` to new date
4. For cancelled matches (`status = 'CANC'`): update `status = 'cancelled'`
5. Calls `run-scoring` for each newly finished match

**Response:**
```json
{
  "processed": 3,
  "finished": 1,
  "postponed": 1,
  "cancelled": 0,
  "skipped": 1
}
```

### 10.2 `lock-predictions`

**Trigger:** Cron — every 1 minute.
**Auth:** Service role key (internal only).

**What it does:**
1. Finds all matches where `kickoff_at <= now() + 5 minutes` and `status = 'scheduled'`
2. Sets `is_locked = true` on all predictions for those matches
3. Sets `is_locked = true` on `golden_boot_predictions` if this is the first match of the tournament
4. Sets `hood_locked = true` on all users if this is the first match of the tournament

**Response:**
```json
{
  "matches_locked": 2,
  "predictions_locked": 34,
  "golden_boot_locked": false,
  "hood_locked": false
}
```

### 10.3 `run-scoring`

**Trigger:** Called internally by `poll-results` after a match finishes. Not on a cron schedule.
**Auth:** Service role key (internal only).

**Input:**
```json
{ "match_id": "uuid" }
```

**What it does:**
1. Fetches all predictions for the match
2. For each prediction:
   - Exact score → 3 points
   - Correct result (90 min) → 1 point
   - Miss → 0 points
3. Updates `predictions.points_awarded`
4. Updates `league_members.total_points` for every league the user belongs to

**Response:**
```json
{
  "match_id": "uuid",
  "predictions_scored": 12,
  "total_points_awarded": 18
}
```

### 10.4 `resolve-golden-boot`

**Trigger:** Called manually once at tournament end.
**Auth:** Service role key (internal only).

**Input:**
```json
{ "winning_player_ids": ["uuid", "uuid"] }
```

Accepts an array to handle the case where two players share the Golden Boot.

**What it does:**
1. Finds all `golden_boot_predictions` where `player_id` is in `winning_player_ids`
2. Sets `points_awarded = 10` on each matching prediction
3. Updates `league_members.total_points` for each winning user across all their leagues

**Response:**
```json
{
  "winners_found": 3,
  "points_awarded": 30
}
```

### 10.5 `sync-schedule`

**Trigger:** Cron — every 60 minutes.
**Auth:** Service role key (internal only).

**What it does:**
1. Calls API-Football `/fixtures?season=2026&league=1` (World Cup league ID)
2. Upserts all matches into the `matches` table using `api_football_id` as the conflict key
3. Skips matches already marked as `finished` or `cancelled`

**Response:**
```json
{
  "upserted": 104,
  "skipped": 12
}
```

---

## 11. Error Codes Reference

| Code | Source | Meaning | User-facing message |
| :--- | :--- | :--- | :--- |
| `PRED_LOCKED` | RLS / Edge Fn | Prediction attempted after lock | "המשחק נעול. לא ניתן לשנות ניחוש." |
| `GB_LOCKED` | RLS | Golden Boot change attempted after lock | "הניחוש נעול. לא ניתן לשנות את הבחירה." |
| `HOOD_LOCKED` | RLS | Neighbourhood change after tournament start | "לא ניתן לשנות שכונה לאחר תחילת הטורניר." |
| `23505` | Postgres | Unique constraint violation (duplicate) | Depends on context — see Section 5 |
| `PGRST116` | Supabase | Row not found (e.g. invalid invite code) | "קוד לא תקין, נסה שוב." |
| `PGRST301` | Supabase | JWT expired | Redirect to login |
| `42501` | Postgres | RLS policy violation | "אין הרשאה לבצע פעולה זו." |

---

## 11.5 Tournament Standings

### Group Standings

```
Client call:
  supabase.from('group_standings')
    .select('*')
    .order('group_name', { ascending: true })
    .order('points', { ascending: false })
```

Data is populated and updated by the `sync-schedule` Edge Function from API-Football.

### Knockout Bracket

```
Client call:
  supabase.from('matches')
    .select('*')
    .in('stage', ['r32', 'r16', 'qf', 'sf', 'final'])
    .order('kickoff_at', { ascending: true })
```

Uses the existing `matches` table — no new table needed.

---

## 12. Realtime Subscriptions

The frontend uses Supabase Realtime for live updates — no polling from the client.

### 12.1 Leaderboard Updates

```typescript
supabase
  .channel('leaderboard')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'league_members',
    filter: `league_id=eq.${leagueId}`
  }, (payload) => {
    // Re-render leaderboard with updated points
  })
  .subscribe()
```

### 12.2 Match Result & Points

```typescript
supabase
  .channel('predictions')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'predictions',
    filter: `user_id=eq.${uid}`
  }, (payload) => {
    // Show points badge on match card
  })
  .subscribe()
```

### 12.3 Match Lock

```typescript
supabase
  .channel('matches')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'matches'
  }, (payload) => {
    // Disable input on match card when status changes
  })
  .subscribe()
```
