-- =============================================================================
-- Global league — all app users are automatically members.
-- Users cannot leave this league.
-- =============================================================================

-- Allow created_by to be NULL for the system-owned global league
alter table leagues alter column created_by drop not null;

-- Fixed UUID for the global league so the trigger can reference it by constant
insert into leagues (id, name, invite_code, created_by)
values ('00000000-0000-0000-0000-000000000001', 'כל המשתתפים', 'GLOBAL', null)
on conflict (id) do nothing;

-- Backfill all existing users into the global league
insert into league_members (league_id, user_id)
select '00000000-0000-0000-0000-000000000001', id from users
on conflict (league_id, user_id) do nothing;

-- Trigger: auto-join every new user to the global league on insert
create or replace function add_user_to_global_league()
returns trigger
language plpgsql
security definer
-- Explicit search_path prevents schema-poisoning attacks on SECURITY DEFINER functions
set search_path = ''
as $$
begin
  insert into public.league_members (league_id, user_id)
  values ('00000000-0000-0000-0000-000000000001', new.id)
  on conflict (league_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_user_created_join_global on public.users;
create trigger on_user_created_join_global
  after insert on public.users
  for each row execute function add_user_to_global_league();
