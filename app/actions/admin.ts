"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type MatchStatus = "live" | "finished" | "postponed" | "cancelled" | "scheduled";

interface ActionResult {
  ok: boolean;
  error?: string;
  scoringError?: string;
}

const GLOBAL_LEAGUE_ID = "00000000-0000-0000-0000-000000000001";

function isAdminEmail(email: string | undefined): boolean {
  return !!email && email === process.env.ADMIN_EMAIL;
}

async function verifyAdmin(): Promise<{ ok: true; adminClient: ReturnType<typeof createAdminClient> } | { ok: false; error: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "Service role key not configured" };
  }
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "Not authenticated" };
  if (!isAdminEmail(user.email)) return { ok: false, error: "Not authorized" };
  return { ok: true, adminClient: createAdminClient() };
}

async function triggerScoring(
  adminClient: ReturnType<typeof createAdminClient>,
  matchId: string
): Promise<string | null> {
  try {
    const { error } = await adminClient.functions.invoke("run-scoring", {
      body: { match_id: matchId },
    });
    if (error) {
      console.error("run-scoring failed:", error);
      return `Scoring failed: ${String(error)}`;
    }
    return null;
  } catch (err) {
    console.error("run-scoring fetch error:", err);
    return `Scoring error: ${String(err)}`;
  }
}

async function resetAndScore(
  adminClient: ReturnType<typeof createAdminClient>,
  matchId: string
): Promise<string | null> {
  const { error: resetError } = await adminClient.rpc("reset_match_scoring", {
    p_match_id: matchId,
  });
  if (resetError) {
    console.error("reset_match_scoring failed:", resetError.message);
    return `Reset failed — existing scores were not cleared, re-scoring was skipped: ${resetError.message}`;
  }
  return triggerScoring(adminClient, matchId);
}

export async function updateMatchScore(
  matchId: string,
  scoreA: number,
  scoreB: number,
  status: MatchStatus
): Promise<ActionResult> {
  // Validate inputs before any DB round-trip
  if (!Number.isInteger(scoreA) || scoreA < 0 || !Number.isInteger(scoreB) || scoreB < 0) {
    return { ok: false, error: "Scores must be non-negative integers" };
  }

  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const { adminClient } = auth;

  // Read current scores before overwriting (for undo)
  const { data: current, error: fetchError } = await adminClient
    .from("matches")
    .select("score_a, score_b")
    .eq("id", matchId)
    .single();

  if (fetchError || !current) {
    return { ok: false, error: "Match not found" };
  }

  const { error: updateError } = await adminClient
    .from("matches")
    .update({
      score_a: scoreA,
      score_b: scoreB,
      status,
      prev_score_a: current.score_a,
      prev_score_b: current.score_b,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", matchId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  // Update group standings from the new score (no-op for knockout matches)
  const { error: standingsError } = await adminClient.rpc("recalculate_group_standings_for_match", { p_match_id: matchId });
  if (standingsError) {
    console.error("recalculate_group_standings_for_match failed:", standingsError.message);
    return { ok: true, scoringError: `Standings update failed: ${standingsError.message}` };
  }

  // Reset existing scoring and re-score so corrected results are applied
  // even if predictions were already scored by the cron.
  if (status === "finished") {
    const scoringError = await resetAndScore(adminClient, matchId);
    if (scoringError) return { ok: true, scoringError };
  }

  return { ok: true };
}

export async function undoMatchScore(matchId: string): Promise<ActionResult> {
  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const { adminClient } = auth;

  const { data: current, error: fetchError } = await adminClient
    .from("matches")
    .select("score_a, score_b, prev_score_a, prev_score_b")
    .eq("id", matchId)
    .single();

  if (fetchError || !current) {
    return { ok: false, error: "Match not found" };
  }

  if (current.prev_score_a === null && current.prev_score_b === null) {
    return { ok: false, error: "Nothing to undo" };
  }

  const { error: updateError } = await adminClient
    .from("matches")
    .update({
      score_a: current.prev_score_a,
      score_b: current.prev_score_b,
      prev_score_a: null,
      prev_score_b: null,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", matchId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  // Update group standings with the reverted score (no-op for knockout matches)
  const { error: standingsError } = await adminClient.rpc("recalculate_group_standings_for_match", { p_match_id: matchId });
  if (standingsError) {
    console.error("recalculate_group_standings_for_match failed:", standingsError.message);
    return { ok: true, scoringError: `Standings update failed: ${standingsError.message}` };
  }

  // Reset and re-score with the reverted values
  const scoringError = await resetAndScore(adminClient, matchId);
  if (scoringError) return { ok: true, scoringError };

  return { ok: true };
}

export async function deleteLeague(leagueId: string): Promise<ActionResult> {
  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  if (leagueId === GLOBAL_LEAGUE_ID) {
    return { ok: false, error: "Cannot delete the global league" };
  }

  const { error } = await auth.adminClient.from("leagues").delete().eq("id", leagueId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteAllLeagues(): Promise<ActionResult> {
  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const { error } = await auth.adminClient
    .from("leagues")
    .delete()
    .neq("id", GLOBAL_LEAGUE_ID);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  // Deleting from auth.users cascades to public.users → league_members, predictions, etc.
  const { error } = await auth.adminClient.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
