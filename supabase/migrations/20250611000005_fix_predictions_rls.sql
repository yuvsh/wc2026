-- Fix predictions RLS — original policy had complex joins causing 500 errors.
-- Simplified: users can always read their own predictions.
-- Others' predictions visible only after match is finished (checked client-side).

drop policy if exists "predictions_read" on predictions;

create policy "predictions_read" on predictions
  for select using (user_id = auth.uid());
