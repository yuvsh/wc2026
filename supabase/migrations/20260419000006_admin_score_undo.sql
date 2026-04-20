-- Add previous-score columns for one-level undo on admin score edits.
-- When an admin overrides a score, the old values are stored here so they
-- can be restored with a single undo action.

alter table matches
  add column if not exists prev_score_a int,
  add column if not exists prev_score_b int;
