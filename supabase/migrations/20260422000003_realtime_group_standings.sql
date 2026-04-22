-- Enable Realtime on group_standings so the tournament page updates live.
-- REPLICA IDENTITY FULL ensures UPDATE events include the full changed row.
alter table public.group_standings replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'group_standings'
  ) then
    alter publication supabase_realtime add table public.group_standings;
  end if;
end;
$$;
