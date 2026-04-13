-- Enable pg_cron extension (required for scheduled jobs)
create extension if not exists pg_cron;

-- Grant usage to postgres role
grant usage on schema cron to postgres;

-- BEFORE RUNNING: replace the two placeholder values below:
--   __SUPABASE_URL__       → https://ypmxfrxdrmpmletdhzwh.supabase.co
--   __SERVICE_ROLE_KEY__   → your service role key (Dashboard → Settings → API)
-- Do NOT commit the version with your real key to git.

-- Idempotent: unschedule before scheduling to allow re-running this migration.
do $$ begin perform cron.unschedule('lock-predictions'); exception when others then null; end; $$;
do $$ begin perform cron.unschedule('poll-results'); exception when others then null; end; $$;
do $$ begin perform cron.unschedule('sync-schedule'); exception when others then null; end; $$;

-- Lock predictions every minute
select cron.schedule(
  'lock-predictions',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://ypmxfrxdrmpmletdhzwh.supabase.co/functions/v1/lock-predictions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer __SERVICE_ROLE_KEY__'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Poll live results every 10 minutes
select cron.schedule(
  'poll-results',
  '*/10 * * * *',
  $$
  select net.http_post(
    url := 'https://ypmxfrxdrmpmletdhzwh.supabase.co/functions/v1/poll-results',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer __SERVICE_ROLE_KEY__'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Sync match schedule every 60 minutes
select cron.schedule(
  'sync-schedule',
  '0 * * * *',
  $$
  select net.http_post(
    url := 'https://ypmxfrxdrmpmletdhzwh.supabase.co/functions/v1/sync-schedule',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer __SERVICE_ROLE_KEY__'
    ),
    body := '{}'::jsonb
  );
  $$
);
