-- =============================================================================
-- Mundial Master Predictor — Initial Group Standings
-- Migration: 20260412000004_seed_group_standings.sql
--
-- Seeds all 48 teams at 0 points before tournament begins.
-- Positions will be updated by sync-schedule cron once API-Football
-- has 2026 match results (from June 2026 onwards).
-- =============================================================================

INSERT INTO group_standings (group_name, team_name, team_code, position)
VALUES
  -- Group A
  ('A', 'מקסיקו',      'mx',     1),
  ('A', 'מצרים',       'eg',     2),
  ('A', 'דרום אפריקה', 'za',     3),
  ('A', 'קמרון',       'cm',     4),

  -- Group B
  ('B', 'קוריאה',      'kr',     1),
  ('B', 'שוויץ',       'ch',     2),
  ('B', 'צ''כיה',      'cz',     3),
  ('B', 'הונדורס',     'hn',     4),

  -- Group C
  ('C', 'ארה"ב',       'us',     1),
  ('C', 'פולין',       'pl',     2),
  ('C', 'פרגוואי',     'py',     3),
  ('C', 'סעודיה',      'sa',     4),

  -- Group D
  ('D', 'ארגנטינה',    'ar',     1),
  ('D', 'קנדה',        'ca',     2),
  ('D', 'צ''ילה',      'cl',     3),
  ('D', 'בוסניה',      'ba',     4),

  -- Group E
  ('E', 'ספרד',        'es',     1),
  ('E', 'מרוקו',       'ma',     2),
  ('E', 'נורווגיה',    'no',     3),
  ('E', 'אלג''יריה',   'dz',     4),

  -- Group F
  ('F', 'גרמניה',      'de',     1),
  ('F', 'יפן',         'jp',     2),
  ('F', 'אוסטרליה',    'au',     3),
  ('F', 'קוסטה ריקה',  'cr',     4),

  -- Group G
  ('G', 'ברזיל',       'br',     1),
  ('G', 'קולומביה',    'co',     2),
  ('G', 'קרואטיה',     'hr',     3),
  ('G', 'טורקיה',      'tr',     4),

  -- Group H
  ('H', 'פורטוגל',     'pt',     1),
  ('H', 'אורוגוואי',   'uy',     2),
  ('H', 'ניו זילנד',   'nz',     3),
  ('H', 'איראן',       'ir',     4),

  -- Group I
  ('I', 'צרפת',        'fr',     1),
  ('I', 'בלגיה',       'be',     2),
  ('I', 'אוסטריה',     'at',     3),
  ('I', 'קונגו ד.ר.',  'cd',     4),

  -- Group J
  ('J', 'אנגליה',      'gb-eng', 1),
  ('J', 'סנגל',        'sn',     2),
  ('J', 'אקוודור',     'ec',     3),
  ('J', 'סרביה',       'rs',     4),

  -- Group K
  ('K', 'הולנד',       'nl',     1),
  ('K', 'ניגריה',      'ng',     2),
  ('K', 'פנמה',        'pa',     3),
  ('K', 'סקוטלנד',     'gb-sct', 4),

  -- Group L
  ('L', 'דנמרק',       'dk',     1),
  ('L', 'חוף השנהב',   'ci',     2),
  ('L', 'ג''מייקה',    'jm',     3),
  ('L', 'מאלי',        'ml',     4)

ON CONFLICT (group_name, team_name) DO NOTHING;
