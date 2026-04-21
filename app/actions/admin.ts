"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type MatchStatus = "live" | "finished" | "postponed" | "cancelled" | "scheduled";

interface ActionResult {
  ok: boolean;
  error?: string;
}

const GLOBAL_LEAGUE_ID = "00000000-0000-0000-0000-000000000001";

function isAdminEmail(email: string | undefined): boolean {
  return !!email && email === process.env.ADMIN_EMAIL;
}

async function verifyAdmin(): Promise<{ ok: true; adminClient: ReturnType<typeof createAdminClient> } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "Not authenticated" };
  if (!isAdminEmail(user.email)) return { ok: false, error: "Not authorized" };
  return { ok: true, adminClient: createAdminClient() };
}

async function triggerScoring(matchId: string): Promise<void> {
  // Best-effort — log failures but don't block the action response
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/run-scoring`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ match_id: matchId }),
      }
    );
    if (!res.ok) {
      console.error("run-scoring failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("run-scoring fetch error:", err);
  }
}

export async function updateMatchScore(
  matchId: string,
  scoreA: number,
  scoreB: number,
  status: MatchStatus
): Promise<ActionResult> {
  const auth = await verifyAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const { adminClient } = auth;

  // Validate inputs
  if (!Number.isInteger(scoreA) || scoreA < 0 || !Number.isInteger(scoreB) || scoreB < 0) {
    return { ok: false, error: "Scores must be non-negative integers" };
  }

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

  // Only trigger scoring when match is finished
  if (status === "finished") {
    await triggerScoring(matchId);
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

  // Re-run scoring in case the reverted score changes point outcomes
  await triggerScoring(matchId);

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
