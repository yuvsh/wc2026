-- =============================================================================
-- recalculate_group_standings_for_match
--
-- Recomputes W/D/L/GF/GA/Pts/Position for all teams in the same group as the
-- given match, based on all finished group-stage matches in the DB.
--
-- Called by the admin after any manual score update so the tournament table
-- reflects the corrected result immediately.
--
-- Returns early (no-op) for:
--   - knockout matches (stage != 'group')
--   - non-finished matches (status != 'finished')
--   - matches whose teams cannot be found in group_standings
-- =============================================================================

create or replace function recalculate_group_standings_for_match(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_stage        text;
  v_status       text;
  v_team_a_code  text;
  v_group_name   text;
begin
  select stage, status, team_a_code
  into   v_stage, v_status, v_team_a_code
  from   public.matches
  where  id = p_match_id;

  if v_stage is null or v_stage <> 'group' then return; end if;
  if v_status <> 'finished'               then return; end if;

  select group_name
  into   v_group_name
  from   public.group_standings
  where  team_code = v_team_a_code
  limit  1;

  if v_group_name is null then return; end if;

  -- Recompute stats for every team in this group from all finished group matches
  with group_teams as (
    select team_code
    from   public.group_standings
    where  group_name = v_group_name
  ),
  group_matches as (
    select id, team_a_code, team_b_code, score_a, score_b
    from   public.matches
    where  stage  = 'group'
      and  status = 'finished'
      and  score_a is not null
      and  score_b is not null
      and  (team_a_code in (select team_code from group_teams)
            or team_b_code in (select team_code from group_teams))
  ),
  team_stats as (
    select
      t.team_code,
      count(m.id)                                                               as played,
      count(m.id) filter (
        where (m.team_a_code = t.team_code and m.score_a > m.score_b)
           or (m.team_b_code = t.team_code and m.score_b > m.score_a)
      )                                                                         as won,
      count(m.id) filter (
        where m.score_a = m.score_b
          and (m.team_a_code = t.team_code or m.team_b_code = t.team_code)
      )                                                                         as drawn,
      count(m.id) filter (
        where (m.team_a_code = t.team_code and m.score_a < m.score_b)
           or (m.team_b_code = t.team_code and m.score_b < m.score_a)
      )                                                                         as lost,
      coalesce(sum(
        case when m.team_a_code = t.team_code then m.score_a else m.score_b end
      ), 0)                                                                     as goals_for,
      coalesce(sum(
        case when m.team_a_code = t.team_code then m.score_b else m.score_a end
      ), 0)                                                                     as goals_against
    from        group_teams t
    left join   group_matches m
      on m.team_a_code = t.team_code or m.team_b_code = t.team_code
    group by    t.team_code
  ),
  ranked as (
    select
      team_code,
      played::int                                  as played,
      won::int                                     as won,
      drawn::int                                   as drawn,
      lost::int                                    as lost,
      goals_for::int                               as goals_for,
      goals_against::int                           as goals_against,
      (won * 3 + drawn)::int                       as points,
      row_number() over (
        order by (won * 3 + drawn)       desc,
                 (goals_for - goals_against) desc,
                 goals_for               desc
      )::int                                       as position
    from team_stats
  )
  update public.group_standings gs
  set
    played        = r.played,
    won           = r.won,
    drawn         = r.drawn,
    lost          = r.lost,
    goals_for     = r.goals_for,
    goals_against = r.goals_against,
    points        = r.points,
    position      = r.position,
    last_updated  = now()
  from ranked r
  where gs.group_name = v_group_name
    and gs.team_code  = r.team_code;
end;
$$;

grant execute on function recalculate_group_standings_for_match(uuid) to service_role;
