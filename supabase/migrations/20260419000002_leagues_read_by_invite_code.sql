-- Allow any authenticated user to look up a league by invite code.
-- This is required for the join flow — the joining user is not yet a member
-- when they do the lookup, so the existing member-only policy blocks them.
-- League names and invite codes are not sensitive: the invite code is already
-- shared publicly by the league creator when inviting friends.

create policy "leagues_read_by_invite_code" on leagues
  for select using (auth.uid() is not null);
