-- =============================================================================
-- Make handle_new_user() also insert directly into league_members.
-- Previously it relied on a cascade trigger (on_user_created_join_global)
-- which proved unreliable in some Supabase environments.
-- Belt-and-suspenders: both triggers now attempt the insert; ON CONFLICT
-- DO NOTHING on the unique index makes the double-write safe.
-- =============================================================================

create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.users (id, display_name, avatar_url, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case
      when lower(coalesce(new.app_metadata->>'provider', new.raw_user_meta_data->>'provider', 'google')) = 'apple'
        then 'apple'
      else 'google'
    end
  )
  on conflict (id) do nothing;

  -- Join global league immediately — do not rely on the cascade trigger alone
  insert into public.league_members (league_id, user_id)
  values ('00000000-0000-0000-0000-000000000001', new.id)
  on conflict (league_id, user_id) do nothing;

  return new;
end;
$$;

-- =============================================================================
-- RPC: called from the auth callback as a safety net for any edge case
-- where the trigger fired but the league_members insert was missed.
-- Uses auth.uid() so it can only add the calling user to their own slot.
-- =============================================================================

create or replace function ensure_user_in_global_league()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then return; end if;

  insert into public.league_members (league_id, user_id)
  values ('00000000-0000-0000-0000-000000000001', v_uid)
  on conflict (league_id, user_id) do nothing;
end;
$$;

-- =============================================================================
-- Backfill: any user who exists in public.users but missed the global league
-- (e.g. signed up before this migration, or during a trigger outage).
-- =============================================================================

insert into public.league_members (league_id, user_id)
select '00000000-0000-0000-0000-000000000001', id
from public.users
on conflict (league_id, user_id) do nothing;
