-- =============================================================================
-- Mundial Master Predictor — Database Schema
-- Migration: 20250611000001_initial_schema.sql
-- Environment: Supabase (PostgreSQL)
-- =============================================================================

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";
create extension if not exists "pg_net";

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- neighbourhoods
-- Pre-seeded list of Revivim neighbourhoods. See seed_data.sql for values.
-- -----------------------------------------------------------------------------
create table if not exists neighbourhoods (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null unique,
  display_order int  not null default 0
);

-- -----------------------------------------------------------------------------
-- users
-- Extended profile on top of Supabase Auth (auth.users).
-- Created automatically via trigger on first login.
-- -----------------------------------------------------------------------------
create table if not exists users (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      text        not null,
  avatar_url        text,
  provider          text        not null check (provider in ('google', 'apple')),
  neighbourhood_id  uuid        references neighbourhoods(id) on delete set null,
  hood_locked       boolean     not null default false,
  created_at        timestamptz not null default now()
);

comment on column users.hood_locked is
  'Set to true when the first match kicks off. Neighbourhood cannot be changed after this.';

-- -----------------------------------------------------------------------------
-- players
-- Top 40 Golden Boot candidates. Pre-seeded. See seed_data.sql.
-- -----------------------------------------------------------------------------
create table if not exists players (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  country       text not null,
  country_code  text not null,   -- ISO 3166-1 alpha-2, e.g. 'fr'
  flag_url      text,            -- API-Football SVG URL for large display
  display_order int  not null default 0
);

-- -----------------------------------------------------------------------------
-- matches
-- World Cup 2026 fixtures. Populated from API-Football via sync-schedule cron.
-- -----------------------------------------------------------------------------
create table if not exists matches (
  id              uuid primary key default uuid_generate_v4(),
  api_football_id int  unique,                -- external ID from API-Football
  team_a          text        not null,
  team_b          text        not null,
  team_a_code     text        not null,       -- ISO 3166-1 alpha-2, e.g. 'fr'
  team_b_code     text        not null,
  team_a_flag_url text,                       -- API-Football SVG URL
  team_b_flag_url text,
  kickoff_at      timestamptz not null,       -- always stored in UTC
  stage           text        not null check (stage in (
                    'group', 'r32', 'r16', 'qf', 'sf', 'final'
                  )),
  status          text        not null default 'scheduled' check (status in (
                    'scheduled', 'live', 'finished', 'postponed', 'cancelled'
                  )),
  score_a         int,                        -- null until status = 'finished'
  score_b         int,                        -- null until status = 'finished'
  last_synced_at  timestamptz                 -- last time cron updated this row
);

comment on column matches.kickoff_at is
  'Stored in UTC. Displayed in Asia/Jerusalem timezone in the UI.';
comment on column matches.score_a is
  '90-minute result only. Extra time and penalties are not reflected here.';

-- -----------------------------------------------------------------------------
-- leagues
-- Private groups identified by a 6-character invite code.
-- -----------------------------------------------------------------------------
create table if not exists leagues (
  id          uuid primary key default uuid_generate_v4(),
  name        text        not null,
  invite_code text        not null unique,
  created_by  uuid        not null references users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- league_members
-- Join table between users and leagues.
-- total_points is denormalized for fast leaderboard queries.
-- -----------------------------------------------------------------------------
create table if not exists league_members (
  id           uuid primary key default uuid_generate_v4(),
  league_id    uuid        not null references leagues(id) on delete cascade,
  user_id      uuid        not null references users(id) on delete cascade,
  total_points int         not null default 0,
  joined_at    timestamptz not null default now(),
  unique (league_id, user_id)
);

-- -----------------------------------------------------------------------------
-- predictions
-- One row per user per match.
-- -----------------------------------------------------------------------------
create table if not exists predictions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid        not null references users(id) on delete cascade,
  match_id      uuid        not null references matches(id) on delete cascade,
  predicted_a   int         not null check (predicted_a >= 0),
  predicted_b   int         not null check (predicted_b >= 0),
  points_awarded int,                         -- null until match is finished
  is_locked     boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, match_id)
);

-- -----------------------------------------------------------------------------
-- golden_boot_predictions
-- One prediction per user, locked before the first match kicks off.
-- -----------------------------------------------------------------------------
create table if not exists golden_boot_predictions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid        not null references users(id) on delete cascade unique,
  player_id      uuid        not null references players(id) on delete cascade,
  points_awarded int         not null default 0,
  is_locked      boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Leaderboard query: rank members within a league by points
create index if not exists idx_league_members_league_points
  on league_members (league_id, total_points desc);

-- Dashboard: fetch upcoming matches ordered by kickoff
create index if not exists idx_matches_kickoff
  on matches (kickoff_at asc)
  where status in ('scheduled', 'live');

-- Prediction lookup per user
create index if not exists idx_predictions_user
  on predictions (user_id, match_id);

-- Cron job: find matches due for locking
create index if not exists idx_matches_lock_candidates
  on matches (kickoff_at, status)
  where status = 'scheduled';

-- Cron job: find finished matches not yet scored
create index if not exists idx_matches_finished_unscored
  on matches (status, last_synced_at)
  where status = 'finished';

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-create users row on first Supabase Auth login
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, display_name, avatar_url, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'provider', 'google')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update predictions.updated_at on change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger predictions_updated_at
  before update on predictions
  for each row execute procedure update_updated_at();

-- =============================================================================
-- TABLES (continued)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- group_standings
-- Pre-computed group stage standings. Updated by sync-schedule cron.
-- -----------------------------------------------------------------------------
create table if not exists group_standings (
  id           uuid primary key default uuid_generate_v4(),
  group_name   text not null,         -- e.g. 'A', 'B', ... 'L'
  team_name    text not null,
  team_code    text not null,         -- ISO 3166-1 alpha-2
  flag_url     text,
  position     int  not null,         -- rank within group (1-4)
  played       int  not null default 0,
  won          int  not null default 0,
  drawn        int  not null default 0,
  lost         int  not null default 0,
  goals_for    int  not null default 0,
  goals_against int not null default 0,
  points       int  not null default 0,
  qualified    boolean not null default false,
  last_updated timestamptz,
  unique (group_name, team_name)
);

-- RLS: public read
alter table group_standings enable row level security;
create policy "group_standings_read" on group_standings
  for select using (true);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Neighbourhood leaderboard per league (Phase 2)
create or replace view neighbourhood_scores as
select
  lm.league_id,
  u.neighbourhood_id,
  n.name                          as neighbourhood_name,
  sum(lm.total_points)            as total_points,
  count(lm.user_id)               as member_count
from league_members lm
join users u on u.id = lm.user_id
join neighbourhoods n on n.id = u.neighbourhood_id
where u.neighbourhood_id is not null
group by lm.league_id, u.neighbourhood_id, n.name;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table neighbourhoods           enable row level security;
alter table users                    enable row level security;
alter table players                  enable row level security;
alter table matches                  enable row level security;
alter table leagues                  enable row level security;
alter table league_members           enable row level security;
alter table predictions              enable row level security;
alter table golden_boot_predictions  enable row level security;

-- neighbourhoods: public read
create policy "neighbourhoods_read" on neighbourhoods
  for select using (true);

-- players: public read
create policy "players_read" on players
  for select using (true);

-- matches: public read
create policy "matches_read" on matches
  for select using (true);

-- users: read own row; service role writes
create policy "users_read_own" on users
  for select using (auth.uid() = id);

create policy "users_update_own" on users
  for update using (auth.uid() = id);

-- leagues: readable by members only
create policy "leagues_read_member" on leagues
  for select using (
    exists (
      select 1 from league_members
      where league_members.league_id = leagues.id
        and league_members.user_id = auth.uid()
    )
  );

create policy "leagues_insert_authenticated" on leagues
  for insert with check (auth.uid() = created_by);

-- league_members: readable by members of same league
create policy "league_members_read" on league_members
  for select using (
    exists (
      select 1 from league_members lm2
      where lm2.league_id = league_members.league_id
        and lm2.user_id = auth.uid()
    )
  );

create policy "league_members_insert_own" on league_members
  for insert with check (auth.uid() = user_id);

-- predictions: own predictions always visible;
-- others' predictions visible only after match is locked
create policy "predictions_read" on predictions
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from matches
      where matches.id = predictions.match_id
        and matches.status in ('finished', 'cancelled', 'postponed')
    )
    or exists (
      select 1 from predictions p2
      where p2.match_id = predictions.match_id
        and p2.user_id = auth.uid()
        and p2.is_locked = true
    )
  );

create policy "predictions_insert_own" on predictions
  for insert with check (auth.uid() = user_id);

create policy "predictions_update_own_unlocked" on predictions
  for update using (auth.uid() = user_id and is_locked = false);

-- golden_boot_predictions: own row only until tournament ends
create policy "gb_read_own" on golden_boot_predictions
  for select using (auth.uid() = user_id);

create policy "gb_insert_own" on golden_boot_predictions
  for insert with check (auth.uid() = user_id);

create policy "gb_update_own_unlocked" on golden_boot_predictions
  for update using (auth.uid() = user_id and is_locked = false);
