-- Enforce globally unique league names (case-insensitive, whitespace-trimmed).
-- Uses a unique index on the normalised form so "ליגת רביבים" and "ליגת רביבים " are treated the same.
-- The global league is excluded — its name "כל המשתתפים" is system-reserved anyway.

create unique index if not exists leagues_name_unique
  on leagues (lower(trim(name)))
  where id <> '00000000-0000-0000-0000-000000000001';
