-- SECURITY DEFINER function for fetching a league member's predictions.
-- Only returns predictions for matches that have already started (live/finished/postponed/cancelled).
-- Verifies that the caller and the target user are both members of the specified league
-- before returning any data.

create or replace function get_user_predictions(p_user_id uuid, p_league_id uuid)
returns table (
  match_id       uuid,
  predicted_a    int,
  predicted_b    int,
  points_awarded int,
  is_locked      bool,
  team_a         text,
  team_b         text,
  team_a_code    text,
  team_b_code    text,
  kickoff_at     timestamptz,
  status         text,
  score_a        int,
  score_b        int
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Caller must be a member of this league
  if not exists (
    select 1 from public.league_members lm
    where lm.league_id = p_league_id
      and lm.user_id = auth.uid()
  ) then
    return;
  end if;

  -- Target user must also be a member of this league
  if not exists (
    select 1 from public.league_members lm
    where lm.league_id = p_league_id
      and lm.user_id = p_user_id
  ) then
    return;
  end if;

  return query
  select
    p.match_id,
    p.predicted_a,
    p.predicted_b,
    p.points_awarded,
    p.is_locked,
    m.team_a,
    m.team_b,
    m.team_a_code,
    m.team_b_code,
    m.kickoff_at,
    m.status::text,
    m.score_a,
    m.score_b
  from public.predictions p
  join public.matches m on m.id = p.match_id
  where p.user_id = p_user_id
    and m.status in ('live', 'finished', 'postponed', 'cancelled')
  order by m.kickoff_at desc;
end;
$$;

grant execute on function get_user_predictions(uuid, uuid) to authenticated;
