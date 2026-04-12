-- Enable pg_cron extension (required for scheduled jobs)
create extension if not exists pg_cron;

-- Grant usage to postgres role
grant usage on schema cron to postgres;

-- PREREQUISITES: These database settings must be configured before applying this migration.
-- Run via Supabase dashboard: Database > SQL Editor, or via psql:
--   ALTER DATABASE postgres SET app.supabase_url = 'https://<project>.supabase.co';
--   ALTER DATABASE postgres SET app.service_role_key = '<your-service-role-key>';
-- Without these, the cron jobs will fail silently on every run.

-- Idempotent: unschedule before scheduling to allow re-running this migration.
-- Using EXCEPTION block because cron.unschedule raises an error if the job does not exist.
do $$ begin perform cron.unschedule('lock-predictions'); exception when others then null; end; $$;
do $$ begin perform cron.unschedule('poll-results'); exception when others then null; end; $$;
do $$ begin perform cron.unschedule('sync-schedule'); exception when others then null; end; $$;

-- Lock predictions every minute
select cron.schedule(
  'lock-predictions',
  '* * * * *',
  $$
  select net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/lock-predictions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
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
    url := current_setting('app.supabase_url') || '/functions/v1/poll-results',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
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
    url := current_setting('app.supabase_url') || '/functions/v1/sync-schedule',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
