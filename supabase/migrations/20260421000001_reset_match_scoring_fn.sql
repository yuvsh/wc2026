-- =============================================================================
-- reset_match_scoring: wipes existing scoring for a match so it can be
-- re-scored from scratch with corrected results.
--
-- Called by the admin before every manual score update so that already-scored
-- predictions are not skipped by the score_prediction idempotency guard.
--
-- Steps:
--   1. Subtract each prediction's awarded points from the user's league totals
--      (only for points > 0 to avoid no-op updates)
--   2. Null out points_awarded on all predictions for the match
-- =============================================================================

create or replace function reset_match_scoring(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Subtract previously awarded points from every league the user belongs to
  update public.league_members lm
  set total_points = greatest(0, total_points - p.points_awarded)
  from public.predictions p
  where p.match_id = p_match_id
    and p.points_awarded is not null
    and p.points_awarded > 0
    and lm.user_id = p.user_id;

  -- Reset predictions to unscored so run-scoring will process them again
  update public.predictions
  set points_awarded = null
  where match_id = p_match_id;
end;
$$;
