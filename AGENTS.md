<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Database

- Any table that starts empty and is populated by a cron/API after the tournament begins (`group_standings`, knockout results, etc.) must have a seed migration with the initial pre-tournament state. Never leave such a table empty and rely solely on the cron to populate it.
- Seed migrations follow the same naming convention: `YYYYMMDD000000_seed_<table>.sql`, idempotent with `ON CONFLICT DO NOTHING`.

## Supabase Client

- Always wrap `createClient()` in `useMemo`: `const supabase = useMemo(() => createClient(), [])`. Never call it bare at component top-level — a new instance per render = a new WebSocket connection per render, causing realtime channel leaks and payload errors.
- Always destructure `authError` from `getUser()` and handle both cases: `const { data: { user }, error: authError } = await supabase.auth.getUser(); if (authError || !user) { setLoading(false); return; }`. Never only check `!user` — on auth failure the spinner stays on screen permanently.
- Never use Supabase nested select joins (e.g. `.select("*, leagues(*)")`) when RLS policies are on both tables — the join silently returns null for the nested rows. Do two separate queries instead.
- Before writing any multi-row query on a table, check its RLS policy in the migrations. If the policy restricts reads to own rows only (e.g. `auth.uid() = id`), a client-side `.in("id", [...])` will silently return only the current user's row — no error, just missing data. Use a `SECURITY DEFINER` RPC instead. The `users` table has this policy; any leaderboard-style query that needs other users' data must go through an RPC.

## Testing

- Test files live in `tests/unit/` and `tests/e2e/`, not next to source files. This overrides the global rule. The Jest config's `testMatch` pattern targets `tests/unit/**/*.test.{ts,tsx}`.
- Before writing unit tests for logic that lives inline in a page component, extract it to a pure function in `lib/utils/` first. Pattern: inline logic → `lib/utils/<name>.ts` → `tests/unit/<name>.test.ts`. Page components can't be unit-tested in isolation because they depend on Supabase and Next.js context.
- For E2E tests requiring auth: unauthenticated redirects run immediately; all auth-dependent flows use `test.skip(true, "Requires authenticated Supabase session — run against staging")`. Playwright's webServer uses a stub Supabase URL that can't issue real sessions.
- Add `/** @jest-environment jsdom */` as the first line of every `.test.tsx` component test file. The global Jest environment is `node` — without the docblock, DOM APIs are undefined and component tests fail.
- When using Jest fake timers, always pass milliseconds: `jest.setSystemTime(date.getTime())` — never pass a Date object directly. Jest 30 uses @sinonjs/fake-timers which requires a numeric timestamp; passing a Date sets time to epoch with no error thrown.
