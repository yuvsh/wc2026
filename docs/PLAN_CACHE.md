# Caching & Performance Plan

## Goal
Eliminate loading spinners and slow first-loads by adding two caching layers:
1. **ISR (Incremental Static Regeneration)** — server-side cache for the tournament page
2. **SWR** — client-side stale-while-revalidate cache for auth pages

---

## Layer 1 — ISR: Tournament Page

### Why
Tournament page (`/tournament`) shows public data (group standings + matches).
No auth required. Same data for all users. Perfect candidate for server-side caching.

### Pre-conditions (already done — no action needed)
- `@supabase/ssr` is already in `package.json`
- `lib/supabase/server.ts` already exists and is correctly implemented

### Steps

**Step 1 — Verify RLS policies allow `anon` role to SELECT**
In Supabase SQL Editor, confirm:
```sql
SELECT * FROM group_standings LIMIT 1;   -- run as anon (no auth header)
SELECT * FROM matches LIMIT 1;
```
If these return data, RLS is open for anon. If empty — add a policy:
```sql
create policy "public read" on group_standings for select using (true);
create policy "public read" on matches for select using (true);
```

**Step 2 — Add `/tournament` to `PUBLIC_PATHS` in `middleware.ts`**
The middleware currently redirects unauthenticated requests to `/login`.
Vercel's ISR revalidation bot has no auth cookie — it will be redirected and never
cache the page unless `/tournament` is added to public paths.

**Step 3 — Extract shared TypeScript interfaces**
- File: `lib/types/tournament.ts`
- Move `GroupStandingRow` and `KnockoutMatch` interfaces here
- Import in both the server page and the client tab component
- Prevents build errors at the server/client component boundary

**Step 4 — Create `TournamentTabs` client component**
- File: `components/TournamentTabs.tsx`
- The "בתים / סבב פלאיאוף" toggle needs `useState` → must stay client-side
- Props: `groups: { name: string; rows: GroupStandingRow[] }[]` and `knockoutMatches: KnockoutMatch[]`
- Note: pass `groups` as an **array** (not a `Map`) — `Map` is not JSON-serializable
  and will silently lose data across the server/client boundary

**Step 5 — Convert `tournament/page.tsx` to async server component**
- Remove `"use client"` directive
- Remove all hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Use `createClient()` from `lib/supabase/server.ts`
- Fetch both `group_standings` and `matches` in parallel with `Promise.all`
- Add `export const revalidate = 60`
- Build `groups` array (not Map) and pass to `<TournamentTabs>`
- Handle Supabase errors: if fetch fails, render empty state (not an error throw)
  so a Supabase hiccup doesn't cache an error page for 60 seconds

**Step 6 — Add `loading.tsx` for tournament**
- File: `app/(app)/tournament/loading.tsx`
- Shows a skeleton/spinner during ISR cache misses (first request after deploy)
- Prevents blank page on cold cache

**Step 7 — Verify**
- `npm run build` — tournament page shows as `○ (Static)` or `◐ (ISR)` in output
- Open in incognito (no auth) — page should load with data, no redirect

### TTL
`revalidate = 60` — Vercel fetches fresh data every 60 seconds.

---

## Layer 2 — SWR: Auth Pages

### Why
Dashboard, leaderboard, and history require auth so they can't use ISR.
SWR gives instant loads on return visits by showing cached data while fetching fresh.

### Steps

**Step 1 — Install SWR**
```bash
npm install swr
```

**Step 2 — Create data-fetching hooks**

Hooks live in `hooks/` (matching existing project convention, e.g. `hooks/useCountdown.ts`).

| Hook | File | TTL | Notes |
|------|------|-----|-------|
| `useUpcomingMatches` | `hooks/useUpcomingMatches.ts` | 30s | Includes predictions for visible matches |
| `useLeagues` | `hooks/useLeagues.ts` | 2 min | User's league list |
| `useLeagueMembers` | `hooks/useLeagueMembers.ts` | 2 min | Members for a given leagueId |
| `useMatchHistory` | `hooks/useMatchHistory.ts` | 5 min | Past finished matches + predictions |

Note: leaderboard is split into **two hooks** (`useLeagues` + `useLeagueMembers`) because
the active league is UI state (`useState`) — one hook can't cleanly own both.

**SWR cache key format:** always use arrays `[tableName, ...params]` to avoid collisions:
```typescript
useSWR(["upcoming-matches", userId], fetcher)
useSWR(["league-members", leagueId], fetcher)
```

**Step 3 — Fetcher error handling**
Each fetcher must **throw** on auth failure or Supabase error (not silently return empty):
```typescript
async function fetchUpcomingMatches(userId: string) {
  const { data, error } = await supabase.from("matches")...
  if (error) throw error;
  return data;
}
```
This ensures SWR's `error` field is populated and pages can show correct error states.

**Step 4 — Refactor `dashboard/page.tsx`**
- Replace `useEffect` + `useState` data fetching with `useUpcomingMatches`
- Remove manual `window.addEventListener("focus", loadData)` — SWR handles this
- Keep all UI, toast, and prediction save logic
- **Realtime handlers:** update to call SWR's `mutate()` instead of `loadData()`
  ```typescript
  const { mutate } = useSWR(...)
  // in realtime handler:
  .on("postgres_changes", ..., () => { mutate(); })
  ```
- **Optimistic save:** use SWR `mutate` with optimistic data for `handleSave`
  so there's no flash between save and revalidation

**Step 5 — Refactor `leaderboard/page.tsx`**
- Use `useLeagues(userId)` for the league list
- Use `useLeagueMembers(activeLeagueId)` for members (conditional on `activeLeagueId`)
- Keep `activeLeagueId` as `useState` in the page
- Remove manual focus listener

**Step 6 — Refactor `history/page.tsx`**
- Replace `useEffect` + `useState` with `useMatchHistory`
- Remove manual focus listener

**Step 7 — Verify**
- Visit dashboard → navigate to another tab → return: data shows instantly
- Network tab: SWR revalidates in background, no loading flash
- Save a prediction: optimistic update shows immediately, no stale flash

### SWR Config per hook

```typescript
// Upcoming matches — live during matches
{ dedupingInterval: 30_000, revalidateOnFocus: true, revalidateOnReconnect: true }

// Leaderboard — updates after scoring cron
{ dedupingInterval: 120_000, revalidateOnFocus: true }

// History — past results rarely change
{ dedupingInterval: 300_000, revalidateOnFocus: false }
```

---

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `swr` |
| `middleware.ts` | Add `/tournament` to `PUBLIC_PATHS` |
| `lib/types/tournament.ts` | New — shared `GroupStandingRow`, `KnockoutMatch` interfaces |
| `app/(app)/tournament/page.tsx` | Convert to async server component |
| `app/(app)/tournament/loading.tsx` | New — skeleton during ISR cache miss |
| `components/TournamentTabs.tsx` | New — client tab switcher extracted from tournament page |
| `hooks/useUpcomingMatches.ts` | New — SWR hook for dashboard |
| `hooks/useLeagues.ts` | New — SWR hook for leaderboard (league list) |
| `hooks/useLeagueMembers.ts` | New — SWR hook for leaderboard (members) |
| `hooks/useMatchHistory.ts` | New — SWR hook for history |
| `app/(app)/dashboard/page.tsx` | Use `useUpcomingMatches`, update realtime to use `mutate()` |
| `app/(app)/leaderboard/page.tsx` | Use `useLeagues` + `useLeagueMembers` |
| `app/(app)/history/page.tsx` | Use `useMatchHistory` |

## What Does NOT Change
- All UI components (`MatchCard`, `GroupTable`, `KnockoutBracket`, etc.)
- Auth flow and all other pages (profile, onboarding, golden-boot)
- Prediction save logic (only the post-save state update changes to use `mutate`)
- Supabase realtime subscriptions (still present, updated to call `mutate`)
