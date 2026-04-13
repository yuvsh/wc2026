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
