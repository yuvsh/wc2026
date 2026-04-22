/**
 * Pure functions for prediction lock logic.
 * The edge function (supabase/functions/lock-predictions) uses these rules:
 * a match locks when kickoff_at is within 5 minutes of now.
 */

const LOCK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Returns true if the match should be locked right now.
 * A match locks when kickoff is within LOCK_WINDOW_MS of the current time.
 */
export function shouldLockMatch(kickoffAt: Date, now: Date): boolean {
  return kickoffAt.getTime() - now.getTime() <= LOCK_WINDOW_MS;
}

/**
 * Returns true if a user can still submit or edit a prediction.
 */
export function canSubmitPrediction(isLocked: boolean): boolean {
  return !isLocked;
}
