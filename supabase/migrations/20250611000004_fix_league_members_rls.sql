-- Fix league_members RLS — original policy was recursive (queried league_members
-- from within a league_members policy) causing infinite loop → 500 error.
-- Simplified to: users can read their own membership rows only.

drop policy if exists "league_members_read" on league_members;

create policy "league_members_read" on league_members
  for select using (user_id = auth.uid());
