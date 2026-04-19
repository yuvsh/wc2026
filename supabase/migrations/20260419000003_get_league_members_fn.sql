-- SECURITY DEFINER function for fetching league members.
-- The users table has a strict "read own row only" RLS policy, so client-side
-- queries cannot fetch other members' display names. This function runs as the
-- DB owner, but first verifies that the caller is actually a member of the
-- requested league before returning any data.

create or replace function get_league_members(p_league_id uuid)
returns table (
  user_id        uuid,
  total_points   int,
  display_name   text,
  neighbourhood  text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only return data if the calling user belongs to this league
  if not exists (
    select 1 from public.league_members lm_check
    where lm_check.league_id = p_league_id
      and lm_check.user_id = auth.uid()
  ) then
    return;
  end if;

  return query
  select
    lm.user_id,
    lm.total_points,
    u.display_name,
    n.name as neighbourhood
  from public.league_members lm
  join public.users u on u.id = lm.user_id
  left join public.neighbourhoods n on n.id = u.neighbourhood_id
  where lm.league_id = p_league_id
  order by lm.total_points desc;
end;
$$;
