-- Fix leagues RLS — allow direct read when user is a member
-- The original policy caused a 500 when joining from league_members

drop policy if exists "leagues_read_member" on leagues;

create policy "leagues_read_member" on leagues
  for select using (
    auth.uid() = created_by
    or exists (
      select 1 from league_members
      where league_members.league_id = leagues.id
        and league_members.user_id = auth.uid()
    )
  );
