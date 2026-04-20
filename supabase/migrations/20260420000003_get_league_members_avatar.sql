-- Add avatar_url to get_league_members so the leaderboard and podium
-- can display Google profile photos.

create or replace function get_league_members(p_league_id uuid)
returns table (
  user_id        uuid,
  total_points   int,
  display_name   text,
  neighbourhood  text,
  avatar_url     text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
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
    n.name as neighbourhood,
    u.avatar_url
  from public.league_members lm
  join public.users u on u.id = lm.user_id
  left join public.neighbourhoods n on n.id = u.neighbourhood_id
  where lm.league_id = p_league_id
  order by lm.total_points desc;
end;
$$;
