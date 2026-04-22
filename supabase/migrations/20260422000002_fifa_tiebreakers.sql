-- =============================================================================
-- recalculate_group_standings_for_match (v2 — FIFA tiebreaker rules)
--
-- Tiebreaker order (FIFA WC 2026 regulations):
--   1. Points
--   2. Overall goal difference
--   3. Overall goals scored
--   4. Head-to-head points        (among tied teams only)
--   5. Head-to-head goal difference
--   6. Head-to-head goals scored
--
-- "Tied teams only" is implemented via dense_rank() on (pts, GD, GF) to
-- identify the tier, then H2H stats are summed only against opponents in the
-- same tier. This correctly handles 2-way, 3-way, and 4-way ties.
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

  with
  -- All teams in this group
  group_teams as (
    select team_code
    from   public.group_standings
    where  group_name = v_group_name
  ),
  -- All finished group matches involving teams in this group
  group_matches as (
    select id, team_a_code, team_b_code, score_a, score_b
    from   public.matches
    where  stage    = 'group'
      and  status   = 'finished'
      and  score_a  is not null
      and  score_b  is not null
      and  (team_a_code in (select team_code from group_teams)
            or team_b_code in (select team_code from group_teams))
  ),
  -- Overall stats per team
  overall as (
    select
      t.team_code,
      count(m.id) as played,
      count(m.id) filter (
        where (m.team_a_code = t.team_code and m.score_a > m.score_b)
           or (m.team_b_code = t.team_code and m.score_b > m.score_a)
      ) as won,
      count(m.id) filter (
        where m.score_a = m.score_b
          and (m.team_a_code = t.team_code or m.team_b_code = t.team_code)
      ) as drawn,
      count(m.id) filter (
        where (m.team_a_code = t.team_code and m.score_a < m.score_b)
           or (m.team_b_code = t.team_code and m.score_b < m.score_a)
      ) as lost,
      coalesce(sum(case when m.team_a_code = t.team_code then m.score_a else m.score_b end), 0) as goals_for,
      coalesce(sum(case when m.team_a_code = t.team_code then m.score_b else m.score_a end), 0) as goals_against
    from      group_teams t
    left join group_matches m
      on m.team_a_code = t.team_code or m.team_b_code = t.team_code
    group by  t.team_code
  ),
  -- Add points + GD, then assign a "tier" via dense_rank so we can identify
  -- which teams are tied before applying H2H tiebreakers.
  tiered as (
    select *,
      (won * 3 + drawn)::int                  as points,
      (goals_for - goals_against)::int        as gd,
      dense_rank() over (
        order by (won * 3 + drawn) desc,
                 (goals_for - goals_against) desc,
                 goals_for desc
      )::int                                  as tier
    from overall
  ),
  -- H2H stats between every pair of teams in the group.
  -- Uses CROSS JOIN to enumerate all pairs, then LEFT JOINs the single
  -- direct match between them.
  h2h_pairs as (
    select
      t1.team_code                                          as team,
      t2.team_code                                          as opponent,
      coalesce(sum(case
        when m.team_a_code = t1.team_code and m.score_a > m.score_b then 3
        when m.team_b_code = t1.team_code and m.score_b > m.score_a then 3
        when m.score_a = m.score_b                                   then 1
        else 0
      end), 0)                                              as h2h_pts,
      coalesce(
        sum(case when m.team_a_code = t1.team_code then m.score_a else m.score_b end) -
        sum(case when m.team_a_code = t1.team_code then m.score_b else m.score_a end),
        0
      )                                                     as h2h_gd,
      coalesce(
        sum(case when m.team_a_code = t1.team_code then m.score_a else m.score_b end),
        0
      )                                                     as h2h_gf
    from      group_teams t1
    cross join group_teams t2
    left join group_matches m on (
      (m.team_a_code = t1.team_code and m.team_b_code = t2.team_code) or
      (m.team_b_code = t1.team_code and m.team_a_code = t2.team_code)
    )
    where t1.team_code <> t2.team_code
    group by  t1.team_code, t2.team_code
  ),
  -- Aggregate H2H stats for each team, but only counting results against
  -- opponents in the same tier (i.e., the actual tied teams).
  h2h_vs_tier as (
    select
      r.team_code,
      coalesce(sum(h.h2h_pts), 0)::int  as tier_h2h_pts,
      coalesce(sum(h.h2h_gd),  0)::int  as tier_h2h_gd,
      coalesce(sum(h.h2h_gf),  0)::int  as tier_h2h_gf
    from      tiered r
    left join h2h_pairs h  on h.team = r.team_code
    left join tiered r2    on r2.team_code = h.opponent and r2.tier = r.tier
    group by  r.team_code
  ),
  -- Final ranking with full FIFA tiebreaker cascade
  ranked as (
    select
      r.team_code,
      r.played::int         as played,
      r.won::int            as won,
      r.drawn::int          as drawn,
      r.lost::int           as lost,
      r.goals_for::int      as goals_for,
      r.goals_against::int  as goals_against,
      r.points              as points,
      row_number() over (
        order by
          r.points          desc,   -- 1. Points
          r.gd              desc,   -- 2. Overall GD
          r.goals_for       desc,   -- 3. Overall GF
          ht.tier_h2h_pts   desc,   -- 4. H2H points (among tied teams)
          ht.tier_h2h_gd    desc,   -- 5. H2H goal difference
          ht.tier_h2h_gf    desc    -- 6. H2H goals scored
      )::int                as position
    from      tiered r
    join      h2h_vs_tier ht on ht.team_code = r.team_code
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
