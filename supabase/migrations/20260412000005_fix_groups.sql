-- =============================================================================
-- Mundial Master Predictor — Fix Groups (correct WC 2026 draw)
-- Migration: 20260412000005_fix_groups.sql
--
-- Replaces incorrect group assignments from migration 20260412000003/04
-- with the actual official WC 2026 draw groups.
--
-- Correct groups:
--   A: Mexico, South Africa, South Korea, Czechia
--   B: Canada, Bosnia-Herz., Qatar, Switzerland
--   C: Brazil, Morocco, Haiti, Scotland
--   D: USA, Paraguay, Australia, Türkiye
--   E: Germany, Curaçao, Ivory Coast, Ecuador
--   F: Netherlands, Japan, Sweden, Tunisia
--   G: Belgium, Egypt, Iran, New Zealand
--   H: Spain, Cape Verde, Saudi Arabia, Uruguay
--   I: France, Senegal, Iraq, Norway
--   J: Argentina, Algeria, Austria, Jordan
--   K: Portugal, DR Congo, Uzbekistan, Colombia
--   L: England, Croatia, Ghana, Panama
-- =============================================================================

-- Remove incorrect group stage matches
DELETE FROM matches WHERE stage = 'group';

-- Remove incorrect group standings
DELETE FROM group_standings;

-- =============================================================================
-- GROUP STAGE — 72 matches
-- Round 1: June 11–16  (2 groups/day — slot A: 16:00+19:00 UTC, slot B: 20:00+23:00 UTC)
-- Round 2: June 17–22  (same structure)
-- Round 3: June 23–26  (3 groups/day — simultaneous pairs: 16:00 / 19:00 / 22:00 UTC)
--
-- Within each group, fixture pairs follow FIFA standard format:
--   Round 1: T1 vs T2, T3 vs T4
--   Round 2: T1 vs T3, T2 vs T4
--   Round 3: T1 vs T4 (simultaneous), T2 vs T3 (simultaneous)
-- =============================================================================

INSERT INTO matches (api_football_id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status) VALUES

-- ============================================================
-- ROUND 1 (June 11–16)
-- ============================================================

-- June 11 — Group A (slot B: 20:00/23:00) + Group B (slot A: 16:00/19:00)
(1001, 'מקסיקו',       'דרום אפריקה',  'mx',     'za',     '2026-06-11 20:00:00+00', 'group', 'scheduled'),
(1002, 'קוריאה',       'צ''כיה',       'kr',     'cz',     '2026-06-11 23:00:00+00', 'group', 'scheduled'),
(1003, 'קנדה',         'בוסניה',       'ca',     'ba',     '2026-06-11 16:00:00+00', 'group', 'scheduled'),
(1004, 'קטאר',         'שוויץ',        'qa',     'ch',     '2026-06-11 19:00:00+00', 'group', 'scheduled'),

-- June 12 — Group C (slot B: 20:00/23:00) + Group D (slot A: 16:00/19:00)
(1005, 'ברזיל',        'מרוקו',        'br',     'ma',     '2026-06-12 20:00:00+00', 'group', 'scheduled'),
(1006, 'האיטי',        'סקוטלנד',      'ht',     'gb-sct', '2026-06-12 23:00:00+00', 'group', 'scheduled'),
(1007, 'ארה"ב',        'פרגוואי',      'us',     'py',     '2026-06-12 16:00:00+00', 'group', 'scheduled'),
(1008, 'אוסטרליה',     'טורקיה',       'au',     'tr',     '2026-06-12 19:00:00+00', 'group', 'scheduled'),

-- June 13 — Group E (slot B: 20:00/23:00) + Group F (slot A: 16:00/19:00)
(1009, 'גרמניה',       'קוראסאו',      'de',     'cw',     '2026-06-13 20:00:00+00', 'group', 'scheduled'),
(1010, 'חוף השנהב',    'אקוודור',      'ci',     'ec',     '2026-06-13 23:00:00+00', 'group', 'scheduled'),
(1011, 'הולנד',        'יפן',          'nl',     'jp',     '2026-06-13 16:00:00+00', 'group', 'scheduled'),
(1012, 'שוודיה',       'טוניסיה',      'se',     'tn',     '2026-06-13 19:00:00+00', 'group', 'scheduled'),

-- June 14 — Group G (slot B: 20:00/23:00) + Group H (slot A: 16:00/19:00)
(1013, 'בלגיה',        'מצרים',        'be',     'eg',     '2026-06-14 20:00:00+00', 'group', 'scheduled'),
(1014, 'איראן',        'ניו זילנד',    'ir',     'nz',     '2026-06-14 23:00:00+00', 'group', 'scheduled'),
(1015, 'ספרד',         'כף ורדה',      'es',     'cv',     '2026-06-14 16:00:00+00', 'group', 'scheduled'),
(1016, 'סעודיה',       'אורוגוואי',    'sa',     'uy',     '2026-06-14 19:00:00+00', 'group', 'scheduled'),

-- June 15 — Group I (slot B: 20:00/23:00) + Group J (slot A: 16:00/19:00)
(1017, 'צרפת',         'סנגל',         'fr',     'sn',     '2026-06-15 20:00:00+00', 'group', 'scheduled'),
(1018, 'עיראק',        'נורווגיה',     'iq',     'no',     '2026-06-15 23:00:00+00', 'group', 'scheduled'),
(1019, 'ארגנטינה',     'אלג''יריה',    'ar',     'dz',     '2026-06-15 16:00:00+00', 'group', 'scheduled'),
(1020, 'אוסטריה',      'ירדן',         'at',     'jo',     '2026-06-15 19:00:00+00', 'group', 'scheduled'),

-- June 16 — Group K (slot B: 20:00/23:00) + Group L (slot A: 16:00/19:00)
(1021, 'פורטוגל',      'קונגו ד.ר.',   'pt',     'cd',     '2026-06-16 20:00:00+00', 'group', 'scheduled'),
(1022, 'אוזבקיסטן',    'קולומביה',     'uz',     'co',     '2026-06-16 23:00:00+00', 'group', 'scheduled'),
(1023, 'אנגליה',       'קרואטיה',      'gb-eng', 'hr',     '2026-06-16 16:00:00+00', 'group', 'scheduled'),
(1024, 'גאנה',         'פנמה',         'gh',     'pa',     '2026-06-16 19:00:00+00', 'group', 'scheduled'),

-- ============================================================
-- ROUND 2 (June 17–22)
-- ============================================================

-- June 17 — Group A (T1 vs T3, T2 vs T4) + Group B
(1025, 'מקסיקו',       'קוריאה',       'mx',     'kr',     '2026-06-17 20:00:00+00', 'group', 'scheduled'),
(1026, 'דרום אפריקה',  'צ''כיה',       'za',     'cz',     '2026-06-17 23:00:00+00', 'group', 'scheduled'),
(1027, 'קנדה',         'קטאר',         'ca',     'qa',     '2026-06-17 16:00:00+00', 'group', 'scheduled'),
(1028, 'בוסניה',       'שוויץ',        'ba',     'ch',     '2026-06-17 19:00:00+00', 'group', 'scheduled'),

-- June 18 — Group C + Group D
(1029, 'ברזיל',        'האיטי',        'br',     'ht',     '2026-06-18 20:00:00+00', 'group', 'scheduled'),
(1030, 'מרוקו',        'סקוטלנד',      'ma',     'gb-sct', '2026-06-18 23:00:00+00', 'group', 'scheduled'),
(1031, 'ארה"ב',        'אוסטרליה',     'us',     'au',     '2026-06-18 16:00:00+00', 'group', 'scheduled'),
(1032, 'פרגוואי',      'טורקיה',       'py',     'tr',     '2026-06-18 19:00:00+00', 'group', 'scheduled'),

-- June 19 — Group E + Group F
(1033, 'גרמניה',       'חוף השנהב',    'de',     'ci',     '2026-06-19 20:00:00+00', 'group', 'scheduled'),
(1034, 'קוראסאו',      'אקוודור',      'cw',     'ec',     '2026-06-19 23:00:00+00', 'group', 'scheduled'),
(1035, 'הולנד',        'שוודיה',       'nl',     'se',     '2026-06-19 16:00:00+00', 'group', 'scheduled'),
(1036, 'יפן',          'טוניסיה',      'jp',     'tn',     '2026-06-19 19:00:00+00', 'group', 'scheduled'),

-- June 20 — Group G + Group H
(1037, 'בלגיה',        'איראן',        'be',     'ir',     '2026-06-20 20:00:00+00', 'group', 'scheduled'),
(1038, 'מצרים',        'ניו זילנד',    'eg',     'nz',     '2026-06-20 23:00:00+00', 'group', 'scheduled'),
(1039, 'ספרד',         'סעודיה',       'es',     'sa',     '2026-06-20 16:00:00+00', 'group', 'scheduled'),
(1040, 'כף ורדה',      'אורוגוואי',    'cv',     'uy',     '2026-06-20 19:00:00+00', 'group', 'scheduled'),

-- June 21 — Group I + Group J
(1041, 'צרפת',         'עיראק',        'fr',     'iq',     '2026-06-21 20:00:00+00', 'group', 'scheduled'),
(1042, 'סנגל',         'נורווגיה',     'sn',     'no',     '2026-06-21 23:00:00+00', 'group', 'scheduled'),
(1043, 'ארגנטינה',     'אוסטריה',      'ar',     'at',     '2026-06-21 16:00:00+00', 'group', 'scheduled'),
(1044, 'אלג''יריה',    'ירדן',         'dz',     'jo',     '2026-06-21 19:00:00+00', 'group', 'scheduled'),

-- June 22 — Group K + Group L
(1045, 'פורטוגל',      'אוזבקיסטן',    'pt',     'uz',     '2026-06-22 20:00:00+00', 'group', 'scheduled'),
(1046, 'קונגו ד.ר.',   'קולומביה',     'cd',     'co',     '2026-06-22 23:00:00+00', 'group', 'scheduled'),
(1047, 'אנגליה',       'גאנה',         'gb-eng', 'gh',     '2026-06-22 16:00:00+00', 'group', 'scheduled'),
(1048, 'קרואטיה',      'פנמה',         'hr',     'pa',     '2026-06-22 19:00:00+00', 'group', 'scheduled'),

-- ============================================================
-- ROUND 3 (June 23–26) — simultaneous pairs within each group
-- 3 groups per day: 16:00 / 19:00 / 22:00 UTC
-- ============================================================

-- June 23 — Groups A, B, C
(1049, 'מקסיקו',       'צ''כיה',       'mx',     'cz',     '2026-06-23 16:00:00+00', 'group', 'scheduled'),
(1050, 'דרום אפריקה',  'קוריאה',       'za',     'kr',     '2026-06-23 16:00:00+00', 'group', 'scheduled'),
(1051, 'קנדה',         'שוויץ',        'ca',     'ch',     '2026-06-23 19:00:00+00', 'group', 'scheduled'),
(1052, 'בוסניה',       'קטאר',         'ba',     'qa',     '2026-06-23 19:00:00+00', 'group', 'scheduled'),
(1053, 'ברזיל',        'סקוטלנד',      'br',     'gb-sct', '2026-06-23 22:00:00+00', 'group', 'scheduled'),
(1054, 'מרוקו',        'האיטי',        'ma',     'ht',     '2026-06-23 22:00:00+00', 'group', 'scheduled'),

-- June 24 — Groups D, E, F
(1055, 'ארה"ב',        'טורקיה',       'us',     'tr',     '2026-06-24 16:00:00+00', 'group', 'scheduled'),
(1056, 'פרגוואי',      'אוסטרליה',     'py',     'au',     '2026-06-24 16:00:00+00', 'group', 'scheduled'),
(1057, 'גרמניה',       'אקוודור',      'de',     'ec',     '2026-06-24 19:00:00+00', 'group', 'scheduled'),
(1058, 'קוראסאו',      'חוף השנהב',    'cw',     'ci',     '2026-06-24 19:00:00+00', 'group', 'scheduled'),
(1059, 'הולנד',        'טוניסיה',      'nl',     'tn',     '2026-06-24 22:00:00+00', 'group', 'scheduled'),
(1060, 'יפן',          'שוודיה',       'jp',     'se',     '2026-06-24 22:00:00+00', 'group', 'scheduled'),

-- June 25 — Groups G, H, I
(1061, 'בלגיה',        'ניו זילנד',    'be',     'nz',     '2026-06-25 16:00:00+00', 'group', 'scheduled'),
(1062, 'מצרים',        'איראן',        'eg',     'ir',     '2026-06-25 16:00:00+00', 'group', 'scheduled'),
(1063, 'ספרד',         'אורוגוואי',    'es',     'uy',     '2026-06-25 19:00:00+00', 'group', 'scheduled'),
(1064, 'כף ורדה',      'סעודיה',       'cv',     'sa',     '2026-06-25 19:00:00+00', 'group', 'scheduled'),
(1065, 'צרפת',         'נורווגיה',     'fr',     'no',     '2026-06-25 22:00:00+00', 'group', 'scheduled'),
(1066, 'סנגל',         'עיראק',        'sn',     'iq',     '2026-06-25 22:00:00+00', 'group', 'scheduled'),

-- June 26 — Groups J, K, L
(1067, 'ארגנטינה',     'ירדן',         'ar',     'jo',     '2026-06-26 16:00:00+00', 'group', 'scheduled'),
(1068, 'אלג''יריה',    'אוסטריה',      'dz',     'at',     '2026-06-26 16:00:00+00', 'group', 'scheduled'),
(1069, 'פורטוגל',      'קולומביה',     'pt',     'co',     '2026-06-26 19:00:00+00', 'group', 'scheduled'),
(1070, 'קונגו ד.ר.',   'אוזבקיסטן',    'cd',     'uz',     '2026-06-26 19:00:00+00', 'group', 'scheduled'),
(1071, 'אנגליה',       'פנמה',         'gb-eng', 'pa',     '2026-06-26 22:00:00+00', 'group', 'scheduled'),
(1072, 'קרואטיה',      'גאנה',         'hr',     'gh',     '2026-06-26 22:00:00+00', 'group', 'scheduled')

ON CONFLICT (api_football_id) DO NOTHING;

-- =============================================================================
-- GROUP STANDINGS — 48 teams at pre-tournament 0 stats
-- =============================================================================

INSERT INTO group_standings (group_name, team_name, team_code, position) VALUES
  ('A', 'מקסיקו',      'mx',     1),
  ('A', 'דרום אפריקה', 'za',     2),
  ('A', 'קוריאה',      'kr',     3),
  ('A', 'צ''כיה',      'cz',     4),

  ('B', 'קנדה',        'ca',     1),
  ('B', 'בוסניה',      'ba',     2),
  ('B', 'קטאר',        'qa',     3),
  ('B', 'שוויץ',       'ch',     4),

  ('C', 'ברזיל',       'br',     1),
  ('C', 'מרוקו',       'ma',     2),
  ('C', 'האיטי',       'ht',     3),
  ('C', 'סקוטלנד',     'gb-sct', 4),

  ('D', 'ארה"ב',       'us',     1),
  ('D', 'פרגוואי',     'py',     2),
  ('D', 'אוסטרליה',    'au',     3),
  ('D', 'טורקיה',      'tr',     4),

  ('E', 'גרמניה',      'de',     1),
  ('E', 'קוראסאו',     'cw',     2),
  ('E', 'חוף השנהב',   'ci',     3),
  ('E', 'אקוודור',     'ec',     4),

  ('F', 'הולנד',       'nl',     1),
  ('F', 'יפן',         'jp',     2),
  ('F', 'שוודיה',      'se',     3),
  ('F', 'טוניסיה',     'tn',     4),

  ('G', 'בלגיה',       'be',     1),
  ('G', 'מצרים',       'eg',     2),
  ('G', 'איראן',       'ir',     3),
  ('G', 'ניו זילנד',   'nz',     4),

  ('H', 'ספרד',        'es',     1),
  ('H', 'כף ורדה',     'cv',     2),
  ('H', 'סעודיה',      'sa',     3),
  ('H', 'אורוגוואי',   'uy',     4),

  ('I', 'צרפת',        'fr',     1),
  ('I', 'סנגל',        'sn',     2),
  ('I', 'עיראק',       'iq',     3),
  ('I', 'נורווגיה',    'no',     4),

  ('J', 'ארגנטינה',    'ar',     1),
  ('J', 'אלג''יריה',   'dz',     2),
  ('J', 'אוסטריה',     'at',     3),
  ('J', 'ירדן',        'jo',     4),

  ('K', 'פורטוגל',     'pt',     1),
  ('K', 'קונגו ד.ר.',  'cd',     2),
  ('K', 'אוזבקיסטן',   'uz',     3),
  ('K', 'קולומביה',    'co',     4),

  ('L', 'אנגליה',      'gb-eng', 1),
  ('L', 'קרואטיה',     'hr',     2),
  ('L', 'גאנה',        'gh',     3),
  ('L', 'פנמה',        'pa',     4)

ON CONFLICT (group_name, team_name) DO NOTHING;
