-- =============================================================================
-- Mundial Master Predictor — Fix all match data with official WC 2026 schedule
-- Migration: 20260412000005_fix_groups.sql
--
-- Replaces ALL matches (group stage + knockout) with correct official data:
--   - Correct group assignments (official WC 2026 draw)
--   - Exact kickoff times converted to UTC from official schedule
--
-- Groups:
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

-- Remove all existing matches
DELETE FROM matches;

-- Remove incorrect group standings
DELETE FROM group_standings;

-- =============================================================================
-- GROUP STAGE — 72 matches, IDs 1001–1072
-- All times UTC (converted from official local-timezone schedule).
-- Israel time = UTC+3.
-- =============================================================================

INSERT INTO matches (api_football_id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status) VALUES

-- ── June 11 ──────────────────────────────────────────────────────────────────
-- Group A MD1
(1001, 'מקסיקו',       'דרום אפריקה',  'mx',     'za',     '2026-06-11 19:00:00+00', 'group', 'scheduled'),
-- Group A MD1 (simultaneous second match in group — early morning Israel)
(1002, 'קוריאה',       'צ''כיה',       'kr',     'cz',     '2026-06-12 02:00:00+00', 'group', 'scheduled'),

-- ── June 12 ──────────────────────────────────────────────────────────────────
-- Group B MD1
(1003, 'קנדה',         'בוסניה',       'ca',     'ba',     '2026-06-12 19:00:00+00', 'group', 'scheduled'),
-- Group D MD1
(1004, 'ארה"ב',        'פרגוואי',      'us',     'py',     '2026-06-13 01:00:00+00', 'group', 'scheduled'),

-- ── June 13 ──────────────────────────────────────────────────────────────────
-- Group B MD1
(1005, 'קטאר',         'שוויץ',        'qa',     'ch',     '2026-06-13 19:00:00+00', 'group', 'scheduled'),
-- Group C MD1
(1006, 'ברזיל',        'מרוקו',        'br',     'ma',     '2026-06-13 22:00:00+00', 'group', 'scheduled'),
-- Group C MD1
(1007, 'האיטי',        'סקוטלנד',      'ht',     'gb-sct', '2026-06-14 01:00:00+00', 'group', 'scheduled'),
-- Group D MD1
(1008, 'אוסטרליה',     'טורקיה',       'au',     'tr',     '2026-06-14 04:00:00+00', 'group', 'scheduled'),

-- ── June 14 ──────────────────────────────────────────────────────────────────
-- Group E MD1
(1009, 'גרמניה',       'קוראסאו',      'de',     'cw',     '2026-06-14 17:00:00+00', 'group', 'scheduled'),
-- Group F MD1
(1010, 'הולנד',        'יפן',          'nl',     'jp',     '2026-06-14 20:00:00+00', 'group', 'scheduled'),
-- Group E MD1
(1011, 'חוף השנהב',    'אקוודור',      'ci',     'ec',     '2026-06-14 23:00:00+00', 'group', 'scheduled'),
-- Group F MD1
(1012, 'שוודיה',       'טוניסיה',      'se',     'tn',     '2026-06-15 02:00:00+00', 'group', 'scheduled'),

-- ── June 15 ──────────────────────────────────────────────────────────────────
-- Group H MD1
(1013, 'ספרד',         'כף ורדה',      'es',     'cv',     '2026-06-15 16:00:00+00', 'group', 'scheduled'),
-- Group G MD1
(1014, 'בלגיה',        'מצרים',        'be',     'eg',     '2026-06-15 19:00:00+00', 'group', 'scheduled'),
-- Group H MD1
(1015, 'סעודיה',       'אורוגוואי',    'sa',     'uy',     '2026-06-15 22:00:00+00', 'group', 'scheduled'),
-- Group G MD1
(1016, 'איראן',        'ניו זילנד',    'ir',     'nz',     '2026-06-16 01:00:00+00', 'group', 'scheduled'),

-- ── June 16 ──────────────────────────────────────────────────────────────────
-- Group I MD1
(1017, 'צרפת',         'סנגל',         'fr',     'sn',     '2026-06-16 19:00:00+00', 'group', 'scheduled'),
-- Group I MD1
(1018, 'עיראק',        'נורווגיה',     'iq',     'no',     '2026-06-16 22:00:00+00', 'group', 'scheduled'),
-- Group J MD1
(1019, 'ארגנטינה',     'אלג''יריה',    'ar',     'dz',     '2026-06-17 01:00:00+00', 'group', 'scheduled'),
-- Group J MD1
(1020, 'אוסטריה',      'ירדן',         'at',     'jo',     '2026-06-17 04:00:00+00', 'group', 'scheduled'),

-- ── June 17 ──────────────────────────────────────────────────────────────────
-- Group K MD1
(1021, 'פורטוגל',      'קונגו ד.ר.',   'pt',     'cd',     '2026-06-17 17:00:00+00', 'group', 'scheduled'),
-- Group L MD1
(1022, 'אנגליה',       'קרואטיה',      'gb-eng', 'hr',     '2026-06-17 20:00:00+00', 'group', 'scheduled'),
-- Group L MD1
(1023, 'גאנה',         'פנמה',         'gh',     'pa',     '2026-06-17 23:00:00+00', 'group', 'scheduled'),
-- Group K MD1
(1024, 'אוזבקיסטן',    'קולומביה',     'uz',     'co',     '2026-06-18 02:00:00+00', 'group', 'scheduled'),

-- ── June 18 ──────────────────────────────────────────────────────────────────
-- Group A MD2
(1025, 'צ''כיה',       'דרום אפריקה',  'cz',     'za',     '2026-06-18 16:00:00+00', 'group', 'scheduled'),
-- Group B MD2
(1026, 'שוויץ',        'בוסניה',       'ch',     'ba',     '2026-06-18 19:00:00+00', 'group', 'scheduled'),
-- Group B MD2
(1027, 'קנדה',         'קטאר',         'ca',     'qa',     '2026-06-18 22:00:00+00', 'group', 'scheduled'),
-- Group A MD2
(1028, 'מקסיקו',       'קוריאה',       'mx',     'kr',     '2026-06-19 01:00:00+00', 'group', 'scheduled'),

-- ── June 19 ──────────────────────────────────────────────────────────────────
-- Group D MD2
(1029, 'ארה"ב',        'אוסטרליה',     'us',     'au',     '2026-06-19 19:00:00+00', 'group', 'scheduled'),
-- Group C MD2
(1030, 'סקוטלנד',      'מרוקו',        'gb-sct', 'ma',     '2026-06-19 22:00:00+00', 'group', 'scheduled'),
-- Group C MD2
(1031, 'ברזיל',        'האיטי',        'br',     'ht',     '2026-06-20 01:00:00+00', 'group', 'scheduled'),
-- Group D MD2
(1032, 'טורקיה',       'פרגוואי',      'tr',     'py',     '2026-06-20 04:00:00+00', 'group', 'scheduled'),

-- ── June 20 ──────────────────────────────────────────────────────────────────
-- Group F MD2
(1033, 'הולנד',        'שוודיה',       'nl',     'se',     '2026-06-20 17:00:00+00', 'group', 'scheduled'),
-- Group E MD2
(1034, 'גרמניה',       'חוף השנהב',    'de',     'ci',     '2026-06-20 20:00:00+00', 'group', 'scheduled'),
-- Group E MD2
(1035, 'אקוודור',      'קוראסאו',      'ec',     'cw',     '2026-06-21 00:00:00+00', 'group', 'scheduled'),
-- Group F MD2
(1036, 'טוניסיה',      'יפן',          'tn',     'jp',     '2026-06-21 04:00:00+00', 'group', 'scheduled'),

-- ── June 21 ──────────────────────────────────────────────────────────────────
-- Group H MD2
(1037, 'ספרד',         'סעודיה',       'es',     'sa',     '2026-06-21 16:00:00+00', 'group', 'scheduled'),
-- Group G MD2
(1038, 'בלגיה',        'איראן',        'be',     'ir',     '2026-06-21 19:00:00+00', 'group', 'scheduled'),
-- Group H MD2
(1039, 'אורוגוואי',    'כף ורדה',      'uy',     'cv',     '2026-06-21 22:00:00+00', 'group', 'scheduled'),
-- Group G MD2
(1040, 'ניו זילנד',    'מצרים',        'nz',     'eg',     '2026-06-22 01:00:00+00', 'group', 'scheduled'),

-- ── June 22 ──────────────────────────────────────────────────────────────────
-- Group J MD2
(1041, 'ארגנטינה',     'אוסטריה',      'ar',     'at',     '2026-06-22 17:00:00+00', 'group', 'scheduled'),
-- Group I MD2
(1042, 'צרפת',         'עיראק',        'fr',     'iq',     '2026-06-22 21:00:00+00', 'group', 'scheduled'),
-- Group I MD2
(1043, 'נורווגיה',     'סנגל',         'no',     'sn',     '2026-06-23 00:00:00+00', 'group', 'scheduled'),
-- Group J MD2
(1044, 'ירדן',         'אלג''יריה',    'jo',     'dz',     '2026-06-23 03:00:00+00', 'group', 'scheduled'),

-- ── June 23 ──────────────────────────────────────────────────────────────────
-- Group K MD2
(1045, 'פורטוגל',      'אוזבקיסטן',    'pt',     'uz',     '2026-06-23 17:00:00+00', 'group', 'scheduled'),
-- Group L MD2
(1046, 'אנגליה',       'גאנה',         'gb-eng', 'gh',     '2026-06-23 20:00:00+00', 'group', 'scheduled'),
-- Group L MD2
(1047, 'פנמה',         'קרואטיה',      'pa',     'hr',     '2026-06-23 23:00:00+00', 'group', 'scheduled'),
-- Group K MD2
(1048, 'קולומביה',     'קונגו ד.ר.',   'co',     'cd',     '2026-06-24 02:00:00+00', 'group', 'scheduled'),

-- ── June 24 — Group A Round 3 (simultaneous) ─────────────────────────────────
(1049, 'צ''כיה',       'מקסיקו',       'cz',     'mx',     '2026-06-25 01:00:00+00', 'group', 'scheduled'),
(1050, 'דרום אפריקה',  'קוריאה',       'za',     'kr',     '2026-06-25 01:00:00+00', 'group', 'scheduled'),
-- Group B Round 3 (simultaneous)
(1051, 'שוויץ',        'קנדה',         'ch',     'ca',     '2026-06-24 19:00:00+00', 'group', 'scheduled'),
(1052, 'בוסניה',       'קטאר',         'ba',     'qa',     '2026-06-24 19:00:00+00', 'group', 'scheduled'),
-- Group C Round 3 (simultaneous)
(1053, 'סקוטלנד',      'ברזיל',        'gb-sct', 'br',     '2026-06-24 22:00:00+00', 'group', 'scheduled'),
(1054, 'מרוקו',        'האיטי',        'ma',     'ht',     '2026-06-24 22:00:00+00', 'group', 'scheduled'),

-- ── June 25 — Group D Round 3 (simultaneous) ─────────────────────────────────
(1055, 'טורקיה',       'ארה"ב',        'tr',     'us',     '2026-06-26 02:00:00+00', 'group', 'scheduled'),
(1056, 'פרגוואי',      'אוסטרליה',     'py',     'au',     '2026-06-26 02:00:00+00', 'group', 'scheduled'),
-- Group E Round 3 (simultaneous)
(1057, 'קוראסאו',      'חוף השנהב',    'cw',     'ci',     '2026-06-25 20:00:00+00', 'group', 'scheduled'),
(1058, 'אקוודור',      'גרמניה',       'ec',     'de',     '2026-06-25 20:00:00+00', 'group', 'scheduled'),
-- Group F Round 3 (simultaneous)
(1059, 'יפן',          'שוודיה',       'jp',     'se',     '2026-06-25 23:00:00+00', 'group', 'scheduled'),
(1060, 'טוניסיה',      'הולנד',        'tn',     'nl',     '2026-06-25 23:00:00+00', 'group', 'scheduled'),

-- ── June 26 — Group G Round 3 (simultaneous) ─────────────────────────────────
(1061, 'מצרים',        'איראן',        'eg',     'ir',     '2026-06-27 03:00:00+00', 'group', 'scheduled'),
(1062, 'ניו זילנד',    'בלגיה',        'nz',     'be',     '2026-06-27 03:00:00+00', 'group', 'scheduled'),
-- Group H Round 3 (simultaneous)
(1063, 'כף ורדה',      'סעודיה',       'cv',     'sa',     '2026-06-27 00:00:00+00', 'group', 'scheduled'),
(1064, 'אורוגוואי',    'ספרד',         'uy',     'es',     '2026-06-27 00:00:00+00', 'group', 'scheduled'),
-- Group I Round 3 (simultaneous)
(1065, 'נורווגיה',     'צרפת',         'no',     'fr',     '2026-06-26 19:00:00+00', 'group', 'scheduled'),
(1066, 'סנגל',         'עיראק',        'sn',     'iq',     '2026-06-26 19:00:00+00', 'group', 'scheduled'),

-- ── June 27 — Group J Round 3 (simultaneous) ─────────────────────────────────
(1067, 'אלג''יריה',    'אוסטריה',      'dz',     'at',     '2026-06-28 02:00:00+00', 'group', 'scheduled'),
(1068, 'ירדן',         'ארגנטינה',     'jo',     'ar',     '2026-06-28 02:00:00+00', 'group', 'scheduled'),
-- Group K Round 3 (simultaneous)
(1069, 'קולומביה',     'פורטוגל',      'co',     'pt',     '2026-06-27 23:30:00+00', 'group', 'scheduled'),
(1070, 'קונגו ד.ר.',   'אוזבקיסטן',    'cd',     'uz',     '2026-06-27 23:30:00+00', 'group', 'scheduled'),
-- Group L Round 3 (simultaneous)
(1071, 'פנמה',         'אנגליה',       'pa',     'gb-eng', '2026-06-27 21:00:00+00', 'group', 'scheduled'),
(1072, 'קרואטיה',      'גאנה',         'hr',     'gh',     '2026-06-27 21:00:00+00', 'group', 'scheduled')

ON CONFLICT (api_football_id) DO NOTHING;

-- =============================================================================
-- KNOCKOUT STAGE — 32 matches, IDs 1073–1104
-- Team names TBD — updated by poll-results once group stage ends.
-- All times UTC (converted from official schedule).
-- =============================================================================

INSERT INTO matches (api_football_id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status) VALUES

-- Round of 32 (IDs 1073–1088)
(1073, 'TBD', 'TBD', 'xx', 'xx', '2026-06-28 19:00:00+00', 'r32', 'scheduled'),
(1074, 'TBD', 'TBD', 'xx', 'xx', '2026-06-29 20:30:00+00', 'r32', 'scheduled'),
(1075, 'TBD', 'TBD', 'xx', 'xx', '2026-06-29 17:00:00+00', 'r32', 'scheduled'),
(1076, 'TBD', 'TBD', 'xx', 'xx', '2026-06-30 01:00:00+00', 'r32', 'scheduled'),
(1077, 'TBD', 'TBD', 'xx', 'xx', '2026-06-30 17:00:00+00', 'r32', 'scheduled'),
(1078, 'TBD', 'TBD', 'xx', 'xx', '2026-06-30 21:00:00+00', 'r32', 'scheduled'),
(1079, 'TBD', 'TBD', 'xx', 'xx', '2026-07-01 01:00:00+00', 'r32', 'scheduled'),
(1080, 'TBD', 'TBD', 'xx', 'xx', '2026-07-01 16:00:00+00', 'r32', 'scheduled'),
(1081, 'TBD', 'TBD', 'xx', 'xx', '2026-07-01 20:00:00+00', 'r32', 'scheduled'),
(1082, 'TBD', 'TBD', 'xx', 'xx', '2026-07-02 00:00:00+00', 'r32', 'scheduled'),
(1083, 'TBD', 'TBD', 'xx', 'xx', '2026-07-02 19:00:00+00', 'r32', 'scheduled'),
(1084, 'TBD', 'TBD', 'xx', 'xx', '2026-07-02 23:00:00+00', 'r32', 'scheduled'),
(1085, 'TBD', 'TBD', 'xx', 'xx', '2026-07-03 03:00:00+00', 'r32', 'scheduled'),
(1086, 'TBD', 'TBD', 'xx', 'xx', '2026-07-03 18:00:00+00', 'r32', 'scheduled'),
(1087, 'TBD', 'TBD', 'xx', 'xx', '2026-07-03 22:00:00+00', 'r32', 'scheduled'),
(1088, 'TBD', 'TBD', 'xx', 'xx', '2026-07-04 01:30:00+00', 'r32', 'scheduled'),

-- Round of 16 (IDs 1089–1096)
(1089, 'TBD', 'TBD', 'xx', 'xx', '2026-07-04 17:00:00+00', 'r16', 'scheduled'),
(1090, 'TBD', 'TBD', 'xx', 'xx', '2026-07-04 21:00:00+00', 'r16', 'scheduled'),
(1091, 'TBD', 'TBD', 'xx', 'xx', '2026-07-05 20:00:00+00', 'r16', 'scheduled'),
(1092, 'TBD', 'TBD', 'xx', 'xx', '2026-07-06 00:00:00+00', 'r16', 'scheduled'),
(1093, 'TBD', 'TBD', 'xx', 'xx', '2026-07-06 19:00:00+00', 'r16', 'scheduled'),
(1094, 'TBD', 'TBD', 'xx', 'xx', '2026-07-07 00:00:00+00', 'r16', 'scheduled'),
(1095, 'TBD', 'TBD', 'xx', 'xx', '2026-07-07 16:00:00+00', 'r16', 'scheduled'),
(1096, 'TBD', 'TBD', 'xx', 'xx', '2026-07-07 20:00:00+00', 'r16', 'scheduled'),

-- Quarter-finals (IDs 1097–1100)
(1097, 'TBD', 'TBD', 'xx', 'xx', '2026-07-09 20:00:00+00', 'qf', 'scheduled'),
(1098, 'TBD', 'TBD', 'xx', 'xx', '2026-07-10 19:00:00+00', 'qf', 'scheduled'),
(1099, 'TBD', 'TBD', 'xx', 'xx', '2026-07-11 21:00:00+00', 'qf', 'scheduled'),
(1100, 'TBD', 'TBD', 'xx', 'xx', '2026-07-12 01:00:00+00', 'qf', 'scheduled'),

-- Semi-finals (IDs 1101–1102)
(1101, 'TBD', 'TBD', 'xx', 'xx', '2026-07-14 19:00:00+00', 'sf', 'scheduled'),
(1102, 'TBD', 'TBD', 'xx', 'xx', '2026-07-15 19:00:00+00', 'sf', 'scheduled'),

-- Third place & Final (IDs 1103–1104)
(1103, 'TBD', 'TBD', 'xx', 'xx', '2026-07-18 21:00:00+00', 'final', 'scheduled'),
(1104, 'TBD', 'TBD', 'xx', 'xx', '2026-07-19 19:00:00+00', 'final', 'scheduled')

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
