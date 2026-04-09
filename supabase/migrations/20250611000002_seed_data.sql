-- =============================================================================
-- Mundial Master Predictor — Seed Data
-- Migration: 20250611000002_seed_data.sql
-- Run after: 20250611000001_initial_schema.sql
-- =============================================================================
-- NOTE: All inserts use ON CONFLICT DO NOTHING — safe to run multiple times.
-- =============================================================================

-- =============================================================================
-- NEIGHBOURHOODS
-- TODO: Replace placeholder names with the real Revivim neighbourhood names
-- =============================================================================

insert into neighbourhoods (id, name, display_order) values
  ('00000000-0000-0000-0000-000000000001', 'מרכז',    1),
  ('00000000-0000-0000-0000-000000000002', 'צפון',    2),
  ('00000000-0000-0000-0000-000000000003', 'דרום',    3),
  ('00000000-0000-0000-0000-000000000004', 'מזרח',    4),
  ('00000000-0000-0000-0000-000000000005', 'מערב',    5),
  ('00000000-0000-0000-0000-000000000006', 'שכונה ו', 6)
on conflict (name) do nothing;

-- =============================================================================
-- PLAYERS — Top 40 Golden Boot Candidates
-- World Cup 2026
-- country_code: ISO 3166-1 alpha-2 (used by flag-icons CSS library)
-- =============================================================================

insert into players (name, country, country_code, display_order) values

  -- France
  ('קיליאן מבאפה',        'צרפת',      'fr', 1),
  ('אנטואן גריזמן',       'צרפת',      'fr', 2),
  ('אוסמן דמבלה',         'צרפת',      'fr', 3),

  -- Brazil
  ('ויניסיוס ג''וניור',   'ברזיל',     'br', 4),
  ('רודריגו',              'ברזיל',     'br', 5),
  ('ראפינייה',             'ברזיל',     'br', 6),

  -- Argentina
  ('ליאונל מסי',           'ארגנטינה',  'ar', 7),
  ('חוליאן אלבארז',       'ארגנטינה',  'ar', 8),
  ('לאוטארו מרטינז',      'ארגנטינה',  'ar', 9),

  -- England
  ('הארי קיין',            'אנגליה',    'gb-eng', 10),
  ('ג''וד בלינגהם',       'אנגליה',    'gb-eng', 11),
  ('בוקאיו סאקה',          'אנגליה',    'gb-eng', 12),

  -- Norway
  ('ארלינג הולנד',         'נורווגיה',  'no', 13),

  -- Portugal
  ('רפאל לאאו',            'פורטוגל',   'pt', 14),
  ('ברונו פרננדש',         'פורטוגל',   'pt', 15),
  ('גונסאלו ראמוס',        'פורטוגל',   'pt', 16),

  -- Spain
  ('למין ימאל',            'ספרד',      'es', 17),
  ('ניקו וויליאמס',        'ספרד',      'es', 18),
  ('אלבארו מורטה',         'ספרד',      'es', 19),

  -- Germany
  ('פלוריאן וירץ',         'גרמניה',    'de', 20),
  ('ג''מאל מוסיאלה',      'גרמניה',    'de', 21),
  ('קאי האברץ',            'גרמניה',    'de', 22),

  -- Netherlands
  ('קודי גאקפו',           'הולנד',     'nl', 23),
  ('ממפיס דפאי',           'הולנד',     'nl', 24),

  -- Poland
  ('רוברט לבנדובסקי',     'פולין',     'pl', 25),

  -- Egypt
  ('מוחמד סלאח',           'מצרים',     'eg', 26),

  -- Nigeria
  ('ויקטור אוסימן',        'ניגריה',    'ng', 27),

  -- USA
  ('כריסטיאן פוליסיץ',    'ארה"ב',     'us', 28),
  ('פולדי פריאה',          'ארה"ב',     'us', 29),

  -- Morocco
  ('אשרף חכימי',           'מרוקו',     'ma', 30),
  ('האכים זייך',           'מרוקו',     'ma', 31),

  -- Senegal
  ('סאדיו מאנה',           'סנגל',      'sn', 32),

  -- Japan
  ('ריוהי קיסה',           'יפן',       'jp', 33),

  -- South Korea
  ('הואנג הי-צ''אן',      'קוריאה',    'kr', 34),

  -- Mexico
  ('סנטיאגו חימנז',        'מקסיקו',    'mx', 35),

  -- Colombia
  ('לואיס דיאז',           'קולומביה',  'co', 36),

  -- Uruguay
  ('דארווין נונייז',       'אורוגוואי', 'uy', 37),

  -- Belgium
  ('לואיס אופנדה',         'בלגיה',     'be', 38),

  -- Croatia
  ('לוקה מודריץ',          'קרואטיה',   'hr', 39),

  -- Canada
  ('אלפונסו דאוויס',       'קנדה',      'ca', 40)

on conflict do nothing;

-- =============================================================================
-- MATCHES — World Cup 2026 Group Stage (Sample)
-- Full schedule: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
-- kickoff_at: stored in UTC (Israel time = UTC+3 in summer)
-- To convert: Israel 21:00 = UTC 18:00
--
-- TODO: Complete all 104 matches before launch.
--       Below is a representative sample of Group Stage matches.
-- =============================================================================

insert into matches (
  api_football_id, team_a, team_b,
  team_a_code, team_b_code,
  kickoff_at, stage, status
) values

  -- June 11, 2026
  (1001, 'מקסיקו',     'דרום אפריקה', 'mx', 'za', '2026-06-11 20:00:00+00', 'group', 'scheduled'),
  (1002, 'קוריאה',     'צ''כיה',      'kr', 'cz', '2026-06-12 01:00:00+00', 'group', 'scheduled'),

  -- June 12, 2026
  (1003, 'ארה"ב',      'פרגוואי',     'us', 'py', '2026-06-12 18:00:00+00', 'group', 'scheduled'),
  (1004, 'קנדה',       'בוסניה',      'ca', 'ba', '2026-06-12 21:00:00+00', 'group', 'scheduled'),

  -- June 13, 2026
  (1005, 'ארגנטינה',   'קנדה',        'ar', 'ca', '2026-06-13 00:00:00+00', 'group', 'scheduled'),
  (1006, 'ספרד',       'מרוקו',       'es', 'ma', '2026-06-13 18:00:00+00', 'group', 'scheduled'),
  (1007, 'גרמניה',     'יפן',         'de', 'jp', '2026-06-13 21:00:00+00', 'group', 'scheduled'),

  -- June 14, 2026
  (1008, 'ברזיל',      'קולומביה',    'br', 'co', '2026-06-14 00:00:00+00', 'group', 'scheduled'),
  (1009, 'פורטוגל',    'אורוגוואי',   'pt', 'uy', '2026-06-14 18:00:00+00', 'group', 'scheduled'),
  (1010, 'צרפת',       'בלגיה',       'fr', 'be', '2026-06-14 21:00:00+00', 'group', 'scheduled'),

  -- June 15, 2026
  (1011, 'אנגליה',     'סנגל',        'gb-eng', 'sn', '2026-06-15 00:00:00+00', 'group', 'scheduled'),
  (1012, 'הולנד',      'ניגריה',      'nl', 'ng', '2026-06-15 18:00:00+00', 'group', 'scheduled'),
  (1013, 'מצרים',      'מקסיקו',      'eg', 'mx', '2026-06-15 21:00:00+00', 'group', 'scheduled'),

  -- June 16, 2026
  (1014, 'פולין',      'ארה"ב',       'pl', 'us', '2026-06-16 00:00:00+00', 'group', 'scheduled'),
  (1015, 'קרואטיה',    'ברזיל',       'hr', 'br', '2026-06-16 18:00:00+00', 'group', 'scheduled'),
  (1016, 'נורווגיה',   'ספרד',        'no', 'es', '2026-06-16 21:00:00+00', 'group', 'scheduled')

on conflict (api_football_id) do nothing;

-- =============================================================================
-- NOTES FOR DEVELOPER
-- =============================================================================
-- 1. Neighbourhood names above are placeholders.
--    Replace with real Revivim neighbourhood names before launch.
--
-- 2. Match schedule above is a partial sample (16 of 104 matches).
--    Two options for completing the full schedule:
--    a) Manual: add all 104 matches here before launch.
--    b) Automated: let the sync-schedule cron job populate matches
--       from API-Football on first run. Recommended approach.
--
-- 3. Player list is based on expected 2026 World Cup squads.
--    Review and update closer to tournament start (June 2026)
--    as squads may change due to injury or form.
--
-- 4. All kickoff times are stored in UTC.
--    Israel summer time (IDT) = UTC+3.
--    Example: Israel 21:00 = UTC 18:00:00+00
-- =============================================================================
