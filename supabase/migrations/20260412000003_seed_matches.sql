-- =============================================================================
-- Mundial Master Predictor — Full WC 2026 Match Schedule
-- Migration: 20260412000003_seed_matches.sql
-- Run after: 20250611000002_seed_data.sql
--
-- Covers all 104 matches:
--   72  group stage  (12 groups × 6 matches)
--   16  Round of 32
--    8  Round of 16
--    4  Quarter-finals
--    2  Semi-finals
--    1  3rd-place play-off
--    1  Final
--
-- Groups (from WC 2026 draw, December 2024):
--   A: Mexico, Egypt, South Africa, Cameroon
--   B: South Korea, Czechia, Switzerland, Honduras
--   C: USA, Paraguay, Poland, Saudi Arabia
--   D: Argentina, Canada, Bosnia-Herz., Chile
--   E: Spain, Morocco, Norway, Algeria
--   F: Germany, Japan, Australia, Costa Rica
--   G: Brazil, Colombia, Croatia, Turkey
--   H: Portugal, Uruguay, Iran, New Zealand
--   I: France, Belgium, DR Congo, Austria
--   J: England, Senegal, Serbia, Ecuador
--   K: Netherlands, Nigeria, Scotland, Panama
--   L: Denmark, Ivory Coast, Mali, Jamaica
--
-- All times UTC. Israel summer time (IDT) = UTC+3.
-- Example: 19:00 UTC = 22:00 Israel.
--
-- Knockout stage team names are TBD — will be updated by poll-results
-- once the group stage concludes and API-Football has 2026 data.
-- =============================================================================

-- Remove the 16 placeholder matches from the original seed
DELETE FROM matches WHERE api_football_id BETWEEN 1001 AND 1016;

-- =============================================================================
-- GROUP STAGE — 72 matches
-- Round 1: June 11–16  (2 groups per day, 4 matches per day)
-- Round 2: June 17–22  (2 groups per day, 4 matches per day)
-- Round 3: June 23–26  (simultaneous pairs within each group)
-- =============================================================================

INSERT INTO matches (api_football_id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status) VALUES

-- ============================================================
-- ROUND 1
-- ============================================================

-- June 11 — Group A + Group B
(1001, 'מקסיקו',       'דרום אפריקה', 'mx',     'za',     '2026-06-11 20:00:00+00', 'group', 'scheduled'),
(1002, 'מצרים',        'קמרון',       'eg',     'cm',     '2026-06-11 23:00:00+00', 'group', 'scheduled'),
(1003, 'קוריאה',       'הונדורס',     'kr',     'hn',     '2026-06-11 16:00:00+00', 'group', 'scheduled'),
(1004, 'שוויץ',        'צ''כיה',      'ch',     'cz',     '2026-06-11 19:00:00+00', 'group', 'scheduled'),

-- June 12 — Group C + Group D
(1005, 'ארה"ב',        'פרגוואי',     'us',     'py',     '2026-06-12 19:00:00+00', 'group', 'scheduled'),
(1006, 'פולין',        'סעודיה',      'pl',     'sa',     '2026-06-12 22:00:00+00', 'group', 'scheduled'),
(1007, 'ארגנטינה',     'צ''ילה',      'ar',     'cl',     '2026-06-12 16:00:00+00', 'group', 'scheduled'),
(1008, 'קנדה',         'בוסניה',      'ca',     'ba',     '2026-06-12 01:00:00+00', 'group', 'scheduled'),

-- June 13 — Group E + Group F
(1009, 'ספרד',         'נורווגיה',    'es',     'no',     '2026-06-13 19:00:00+00', 'group', 'scheduled'),
(1010, 'מרוקו',        'אלג''יריה',   'ma',     'dz',     '2026-06-13 22:00:00+00', 'group', 'scheduled'),
(1011, 'גרמניה',       'אוסטרליה',    'de',     'au',     '2026-06-13 16:00:00+00', 'group', 'scheduled'),
(1012, 'יפן',          'קוסטה ריקה',  'jp',     'cr',     '2026-06-13 01:00:00+00', 'group', 'scheduled'),

-- June 14 — Group G + Group H
(1013, 'ברזיל',        'טורקיה',      'br',     'tr',     '2026-06-14 19:00:00+00', 'group', 'scheduled'),
(1014, 'קולומביה',     'קרואטיה',     'co',     'hr',     '2026-06-14 22:00:00+00', 'group', 'scheduled'),
(1015, 'פורטוגל',      'ניו זילנד',   'pt',     'nz',     '2026-06-14 16:00:00+00', 'group', 'scheduled'),
(1016, 'אורוגוואי',    'איראן',       'uy',     'ir',     '2026-06-14 01:00:00+00', 'group', 'scheduled'),

-- June 15 — Group I + Group J
(1017, 'צרפת',         'אוסטריה',     'fr',     'at',     '2026-06-15 19:00:00+00', 'group', 'scheduled'),
(1018, 'בלגיה',        'קונגו ד.ר.',  'be',     'cd',     '2026-06-15 22:00:00+00', 'group', 'scheduled'),
(1019, 'אנגליה',       'אקוודור',     'gb-eng', 'ec',     '2026-06-15 16:00:00+00', 'group', 'scheduled'),
(1020, 'סנגל',         'סרביה',       'sn',     'rs',     '2026-06-15 01:00:00+00', 'group', 'scheduled'),

-- June 16 — Group K + Group L
(1021, 'הולנד',        'פנמה',        'nl',     'pa',     '2026-06-16 19:00:00+00', 'group', 'scheduled'),
(1022, 'ניגריה',       'סקוטלנד',     'ng',     'gb-sct', '2026-06-16 22:00:00+00', 'group', 'scheduled'),
(1023, 'דנמרק',        'ג''מייקה',    'dk',     'jm',     '2026-06-16 16:00:00+00', 'group', 'scheduled'),
(1024, 'חוף השנהב',    'מאלי',        'ci',     'ml',     '2026-06-16 01:00:00+00', 'group', 'scheduled'),

-- ============================================================
-- ROUND 2
-- ============================================================

-- June 17 — Group A + Group B
(1025, 'מקסיקו',       'מצרים',       'mx',     'eg',     '2026-06-17 19:00:00+00', 'group', 'scheduled'),
(1026, 'דרום אפריקה',  'קמרון',       'za',     'cm',     '2026-06-17 22:00:00+00', 'group', 'scheduled'),
(1027, 'קוריאה',       'צ''כיה',      'kr',     'cz',     '2026-06-17 16:00:00+00', 'group', 'scheduled'),
(1028, 'שוויץ',        'הונדורס',     'ch',     'hn',     '2026-06-17 01:00:00+00', 'group', 'scheduled'),

-- June 18 — Group C + Group D
(1029, 'ארה"ב',        'סעודיה',      'us',     'sa',     '2026-06-18 19:00:00+00', 'group', 'scheduled'),
(1030, 'פולין',        'פרגוואי',     'pl',     'py',     '2026-06-18 22:00:00+00', 'group', 'scheduled'),
(1031, 'ארגנטינה',     'בוסניה',      'ar',     'ba',     '2026-06-18 16:00:00+00', 'group', 'scheduled'),
(1032, 'קנדה',         'צ''ילה',      'ca',     'cl',     '2026-06-18 01:00:00+00', 'group', 'scheduled'),

-- June 19 — Group E + Group F
(1033, 'ספרד',         'אלג''יריה',   'es',     'dz',     '2026-06-19 19:00:00+00', 'group', 'scheduled'),
(1034, 'מרוקו',        'נורווגיה',    'ma',     'no',     '2026-06-19 22:00:00+00', 'group', 'scheduled'),
(1035, 'גרמניה',       'קוסטה ריקה',  'de',     'cr',     '2026-06-19 16:00:00+00', 'group', 'scheduled'),
(1036, 'יפן',          'אוסטרליה',    'jp',     'au',     '2026-06-19 01:00:00+00', 'group', 'scheduled'),

-- June 20 — Group G + Group H
(1037, 'ברזיל',        'קרואטיה',     'br',     'hr',     '2026-06-20 19:00:00+00', 'group', 'scheduled'),
(1038, 'קולומביה',     'טורקיה',      'co',     'tr',     '2026-06-20 22:00:00+00', 'group', 'scheduled'),
(1039, 'פורטוגל',      'איראן',       'pt',     'ir',     '2026-06-20 16:00:00+00', 'group', 'scheduled'),
(1040, 'אורוגוואי',    'ניו זילנד',   'uy',     'nz',     '2026-06-20 01:00:00+00', 'group', 'scheduled'),

-- June 21 — Group I + Group J
(1041, 'צרפת',         'קונגו ד.ר.',  'fr',     'cd',     '2026-06-21 19:00:00+00', 'group', 'scheduled'),
(1042, 'בלגיה',        'אוסטריה',     'be',     'at',     '2026-06-21 22:00:00+00', 'group', 'scheduled'),
(1043, 'אנגליה',       'סרביה',       'gb-eng', 'rs',     '2026-06-21 16:00:00+00', 'group', 'scheduled'),
(1044, 'סנגל',         'אקוודור',     'sn',     'ec',     '2026-06-21 01:00:00+00', 'group', 'scheduled'),

-- June 22 — Group K + Group L
(1045, 'הולנד',        'סקוטלנד',     'nl',     'gb-sct', '2026-06-22 19:00:00+00', 'group', 'scheduled'),
(1046, 'ניגריה',       'פנמה',        'ng',     'pa',     '2026-06-22 22:00:00+00', 'group', 'scheduled'),
(1047, 'דנמרק',        'מאלי',        'dk',     'ml',     '2026-06-22 16:00:00+00', 'group', 'scheduled'),
(1048, 'חוף השנהב',    'ג''מייקה',    'ci',     'jm',     '2026-06-22 01:00:00+00', 'group', 'scheduled'),

-- ============================================================
-- ROUND 3 — simultaneous pairs within each group
-- ============================================================

-- June 23 — Groups A, B (final round)
(1049, 'מקסיקו',       'קמרון',       'mx',     'cm',     '2026-06-23 18:00:00+00', 'group', 'scheduled'),
(1050, 'מצרים',        'דרום אפריקה', 'eg',     'za',     '2026-06-23 18:00:00+00', 'group', 'scheduled'),
(1051, 'קוריאה',       'שוויץ',       'kr',     'ch',     '2026-06-23 21:00:00+00', 'group', 'scheduled'),
(1052, 'צ''כיה',       'הונדורס',     'cz',     'hn',     '2026-06-23 21:00:00+00', 'group', 'scheduled'),

-- June 24 — Groups C, D
(1053, 'ארה"ב',        'פולין',       'us',     'pl',     '2026-06-24 18:00:00+00', 'group', 'scheduled'),
(1054, 'פרגוואי',      'סעודיה',      'py',     'sa',     '2026-06-24 18:00:00+00', 'group', 'scheduled'),
(1055, 'ארגנטינה',     'קנדה',        'ar',     'ca',     '2026-06-24 21:00:00+00', 'group', 'scheduled'),
(1056, 'בוסניה',       'צ''ילה',      'ba',     'cl',     '2026-06-24 21:00:00+00', 'group', 'scheduled'),

-- June 25 — Groups E, F, G, H
(1057, 'ספרד',         'מרוקו',       'es',     'ma',     '2026-06-25 16:00:00+00', 'group', 'scheduled'),
(1058, 'נורווגיה',     'אלג''יריה',   'no',     'dz',     '2026-06-25 16:00:00+00', 'group', 'scheduled'),
(1059, 'גרמניה',       'יפן',         'de',     'jp',     '2026-06-25 19:00:00+00', 'group', 'scheduled'),
(1060, 'אוסטרליה',     'קוסטה ריקה',  'au',     'cr',     '2026-06-25 19:00:00+00', 'group', 'scheduled'),
(1061, 'ברזיל',        'קולומביה',    'br',     'co',     '2026-06-25 22:00:00+00', 'group', 'scheduled'),
(1062, 'קרואטיה',      'טורקיה',      'hr',     'tr',     '2026-06-25 22:00:00+00', 'group', 'scheduled'),
(1063, 'פורטוגל',      'אורוגוואי',   'pt',     'uy',     '2026-06-26 01:00:00+00', 'group', 'scheduled'),
(1064, 'איראן',        'ניו זילנד',   'ir',     'nz',     '2026-06-26 01:00:00+00', 'group', 'scheduled'),

-- June 26 — Groups I, J, K, L
(1065, 'צרפת',         'בלגיה',       'fr',     'be',     '2026-06-26 15:00:00+00', 'group', 'scheduled'),
(1066, 'קונגו ד.ר.',   'אוסטריה',     'cd',     'at',     '2026-06-26 15:00:00+00', 'group', 'scheduled'),
(1067, 'אנגליה',       'סנגל',        'gb-eng', 'sn',     '2026-06-26 18:00:00+00', 'group', 'scheduled'),
(1068, 'סרביה',        'אקוודור',     'rs',     'ec',     '2026-06-26 18:00:00+00', 'group', 'scheduled'),
(1069, 'הולנד',        'ניגריה',      'nl',     'ng',     '2026-06-26 21:00:00+00', 'group', 'scheduled'),
(1070, 'סקוטלנד',      'פנמה',        'gb-sct', 'pa',     '2026-06-26 21:00:00+00', 'group', 'scheduled'),
(1071, 'דנמרק',        'חוף השנהב',   'dk',     'ci',     '2026-06-26 00:00:00+00', 'group', 'scheduled'),
(1072, 'מאלי',         'ג''מייקה',    'ml',     'jm',     '2026-06-26 00:00:00+00', 'group', 'scheduled'),

-- =============================================================================
-- ROUND OF 32 — 16 matches, June 28 – July 2
-- Teams TBD (determined by group results)
-- =============================================================================

(1073, 'TBD', 'TBD', 'xx', 'xx', '2026-06-28 18:00:00+00', 'r32', 'scheduled'),
(1074, 'TBD', 'TBD', 'xx', 'xx', '2026-06-28 21:00:00+00', 'r32', 'scheduled'),
(1075, 'TBD', 'TBD', 'xx', 'xx', '2026-06-29 18:00:00+00', 'r32', 'scheduled'),
(1076, 'TBD', 'TBD', 'xx', 'xx', '2026-06-29 21:00:00+00', 'r32', 'scheduled'),
(1077, 'TBD', 'TBD', 'xx', 'xx', '2026-06-30 18:00:00+00', 'r32', 'scheduled'),
(1078, 'TBD', 'TBD', 'xx', 'xx', '2026-06-30 21:00:00+00', 'r32', 'scheduled'),
(1079, 'TBD', 'TBD', 'xx', 'xx', '2026-07-01 18:00:00+00', 'r32', 'scheduled'),
(1080, 'TBD', 'TBD', 'xx', 'xx', '2026-07-01 21:00:00+00', 'r32', 'scheduled'),
(1081, 'TBD', 'TBD', 'xx', 'xx', '2026-07-02 18:00:00+00', 'r32', 'scheduled'),
(1082, 'TBD', 'TBD', 'xx', 'xx', '2026-07-02 21:00:00+00', 'r32', 'scheduled'),
(1083, 'TBD', 'TBD', 'xx', 'xx', '2026-07-03 18:00:00+00', 'r32', 'scheduled'),
(1084, 'TBD', 'TBD', 'xx', 'xx', '2026-07-03 21:00:00+00', 'r32', 'scheduled'),
(1085, 'TBD', 'TBD', 'xx', 'xx', '2026-07-04 18:00:00+00', 'r32', 'scheduled'),
(1086, 'TBD', 'TBD', 'xx', 'xx', '2026-07-04 21:00:00+00', 'r32', 'scheduled'),
(1087, 'TBD', 'TBD', 'xx', 'xx', '2026-07-05 18:00:00+00', 'r32', 'scheduled'),
(1088, 'TBD', 'TBD', 'xx', 'xx', '2026-07-05 21:00:00+00', 'r32', 'scheduled'),

-- =============================================================================
-- ROUND OF 16 — 8 matches, July 6–9
-- =============================================================================

(1089, 'TBD', 'TBD', 'xx', 'xx', '2026-07-06 18:00:00+00', 'r16', 'scheduled'),
(1090, 'TBD', 'TBD', 'xx', 'xx', '2026-07-06 21:00:00+00', 'r16', 'scheduled'),
(1091, 'TBD', 'TBD', 'xx', 'xx', '2026-07-07 18:00:00+00', 'r16', 'scheduled'),
(1092, 'TBD', 'TBD', 'xx', 'xx', '2026-07-07 21:00:00+00', 'r16', 'scheduled'),
(1093, 'TBD', 'TBD', 'xx', 'xx', '2026-07-08 18:00:00+00', 'r16', 'scheduled'),
(1094, 'TBD', 'TBD', 'xx', 'xx', '2026-07-08 21:00:00+00', 'r16', 'scheduled'),
(1095, 'TBD', 'TBD', 'xx', 'xx', '2026-07-09 18:00:00+00', 'r16', 'scheduled'),
(1096, 'TBD', 'TBD', 'xx', 'xx', '2026-07-09 21:00:00+00', 'r16', 'scheduled'),

-- =============================================================================
-- QUARTER-FINALS — 4 matches, July 11–12
-- =============================================================================

(1097, 'TBD', 'TBD', 'xx', 'xx', '2026-07-11 18:00:00+00', 'qf', 'scheduled'),
(1098, 'TBD', 'TBD', 'xx', 'xx', '2026-07-11 21:00:00+00', 'qf', 'scheduled'),
(1099, 'TBD', 'TBD', 'xx', 'xx', '2026-07-12 18:00:00+00', 'qf', 'scheduled'),
(1100, 'TBD', 'TBD', 'xx', 'xx', '2026-07-12 21:00:00+00', 'qf', 'scheduled'),

-- =============================================================================
-- SEMI-FINALS — 2 matches, July 15–16
-- =============================================================================

(1101, 'TBD', 'TBD', 'xx', 'xx', '2026-07-15 21:00:00+00', 'sf', 'scheduled'),
(1102, 'TBD', 'TBD', 'xx', 'xx', '2026-07-16 21:00:00+00', 'sf', 'scheduled'),

-- =============================================================================
-- 3RD PLACE PLAY-OFF — July 19
-- =============================================================================

(1103, 'TBD', 'TBD', 'xx', 'xx', '2026-07-19 16:00:00+00', 'sf', 'scheduled'),

-- =============================================================================
-- FINAL — July 19, MetLife Stadium, New Jersey
-- =============================================================================

(1104, 'TBD', 'TBD', 'xx', 'xx', '2026-07-19 20:00:00+00', 'final', 'scheduled')

ON CONFLICT (api_football_id) DO NOTHING;

-- Verify: should return 104
-- SELECT COUNT(*) FROM matches;
