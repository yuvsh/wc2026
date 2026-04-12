-- Atomic scoring functions to prevent race conditions when multiple matches
-- finish concurrently and poll-results triggers scoring in parallel.

-- Awards points for a single prediction and updates all league totals atomically.
-- Returns true if the prediction was newly scored, false if already resolved.
--
-- NOTE: Do NOT combine UPDATE ... RETURNING ... INTO with GET DIAGNOSTICS ROW_COUNT
-- in PL/pgSQL — ROW_COUNT always returns 1 when RETURNING ... INTO is used, which
-- breaks the idempotency guard. Use a plain UPDATE + ROW_COUNT, then a separate SELECT.
create or replace function score_prediction(p_prediction_id uuid, p_points int)
returns boolean language plpgsql security definer as $$
declare
  v_user_id uuid;
  v_updated int;
begin
  -- Mark prediction as resolved only if not already scored
  update predictions
  set points_awarded = p_points
  where id = p_prediction_id and points_awarded is null;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    -- Already scored — idempotent, not an error
    return false;
  end if;

  -- Fetch the user_id in a separate statement (after confirming the row was updated)
  select user_id into v_user_id
  from predictions
  where id = p_prediction_id;

  -- Increment total_points for every league this user belongs to
  update league_members
  set total_points = total_points + p_points
  where user_id = v_user_id;

  return true;
end;
$$;

-- Awards golden boot points for a specific user+player prediction and updates league totals.
-- Returns true if newly scored, false if already resolved.
create or replace function score_golden_boot(
  p_user_id uuid,
  p_player_id uuid,
  p_points int
) returns boolean language plpgsql security definer as $$
declare
  v_updated int;
begin
  update golden_boot_predictions
  set points_awarded = p_points
  where user_id = p_user_id and player_id = p_player_id and points_awarded is null;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    return false;
  end if;

  update league_members
  set total_points = total_points + p_points
  where user_id = p_user_id;

  return true;
end;
$$;
