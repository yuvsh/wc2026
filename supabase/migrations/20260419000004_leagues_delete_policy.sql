-- Allow league creators to delete their own leagues.
-- Cascades automatically remove all league_members rows (on delete cascade).
-- The global league has created_by = null so this policy never matches it.

create policy "leagues_delete_own" on leagues
  for delete using (auth.uid() = created_by);
