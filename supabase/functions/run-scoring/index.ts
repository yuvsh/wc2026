import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Award points for all predictions on a finished match.
// Called by poll-results after a match reaches FT status.
// Points: exact score = 3 (bingo), correct outcome = 1, miss = 0.
// Users with no prediction get a default 0-0 inserted before scoring.

const BINGO_POINTS = 3;
const CORRECT_POINTS = 1;
const MISS_POINTS = 0;

function calcOutcome(a: number, b: number): "home" | "draw" | "away" {
  if (a > b) return "home";
  if (a < b) return "away";
  return "draw";
}

function calcPoints(
  scoreA: number,
  scoreB: number,
  predA: number,
  predB: number
): number {
  if (predA === scoreA && predB === scoreB) return BINGO_POINTS;
  if (calcOutcome(predA, predB) === calcOutcome(scoreA, scoreB)) return CORRECT_POINTS;
  return MISS_POINTS;
}

// Decode JWT payload without verifying the signature.
// Supabase's gateway verifies the JWT before the request reaches this handler.
// We only need to read the role claim to ensure the caller is service_role.
function getJwtRole(authHeader: string | null): string | null {
  try {
    const token = authHeader?.replace("Bearer ", "") ?? "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req): Promise<Response> => {
  const role = getJwtRole(req.headers.get("Authorization"));
  if (role !== "service_role") {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let matchId: string;
  try {
    const body: unknown = await req.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("match_id" in body) ||
      typeof (body as Record<string, unknown>).match_id !== "string"
    ) {
      return new Response(JSON.stringify({ error: "match_id must be a string" }), { status: 400 });
    }
    matchId = (body as Record<string, string>).match_id;
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), { status: 400 });
  }

  // Fetch the finished match
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, score_a, score_b, status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return new Response(JSON.stringify({ error: "match not found" }), { status: 404 });
  }

  if (match.status !== "finished") {
    return new Response(JSON.stringify({ error: "match not finished" }), { status: 400 });
  }

  if (match.score_a === null || match.score_b === null) {
    return new Response(JSON.stringify({ error: "scores missing" }), { status: 400 });
  }

  // Insert locked 0-0 defaults for any user who never submitted a prediction.
  // ON CONFLICT DO NOTHING ensures existing predictions are untouched.
  const { data: allUsers, error: usersError } = await supabase
    .from("users")
    .select("id");

  if (usersError) {
    return new Response(JSON.stringify({ error: usersError.message }), { status: 500 });
  }

  if (allUsers && allUsers.length > 0) {
    const defaults = allUsers.map((u) => ({
      user_id: u.id,
      match_id: matchId,
      predicted_a: 0,
      predicted_b: 0,
      is_locked: true,
    }));

    const { error: defaultsError } = await supabase
      .from("predictions")
      .upsert(defaults, { onConflict: "user_id,match_id", ignoreDuplicates: true });

    if (defaultsError) {
      return new Response(JSON.stringify({ error: defaultsError.message }), { status: 500 });
    }
  }

  // Fetch all unscored predictions for this match (includes newly inserted defaults)
  const { data: predictions, error: predError } = await supabase
    .from("predictions")
    .select("id, user_id, predicted_a, predicted_b")
    .eq("match_id", matchId)
    .is("points_awarded", null);

  if (predError) {
    return new Response(JSON.stringify({ error: predError.message }), { status: 500 });
  }

  if (!predictions || predictions.length === 0) {
    return new Response(JSON.stringify({ scored: 0 }), { status: 200 });
  }

  const errors: string[] = [];

  // Each score_prediction RPC call is independent — run in parallel for throughput.
  const results = await Promise.allSettled(
    predictions.map(async (pred) => {
      const points = calcPoints(
        match.score_a,
        match.score_b,
        pred.predicted_a,
        pred.predicted_b
      );

      // score_prediction atomically updates predictions.points_awarded
      // and increments league_members.total_points in a single transaction,
      // preventing race conditions when multiple matches finish concurrently.
      const { error: rpcError } = await supabase.rpc("score_prediction", {
        p_prediction_id: pred.id,
        p_points: points,
      });

      if (rpcError) throw new Error(`pred ${pred.id}: ${rpcError.message}`);
    })
  );

  results.forEach((r) => {
    if (r.status === "rejected") errors.push(String(r.reason));
  });

  const scoredCount = results.filter((r) => r.status === "fulfilled").length;

  return new Response(
    JSON.stringify({ scored: scoredCount, errors: errors.length > 0 ? errors : undefined }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
