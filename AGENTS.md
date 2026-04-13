<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Database

- Any table that starts empty and is populated by a cron/API after the tournament begins (`group_standings`, knockout results, etc.) must have a seed migration with the initial pre-tournament state. Never leave such a table empty and rely solely on the cron to populate it.
- Seed migrations follow the same naming convention: `YYYYMMDD000000_seed_<table>.sql`, idempotent with `ON CONFLICT DO NOTHING`.
