import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Award points for all predictions on a finished match.
// Called by poll-results after a match reaches FT status.
// Points: exact score = 3 (bingo), correct outcome = 1, miss = 0.

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

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { match_id } = await req.json() as { match_id: string };

  if (!match_id) {
    return new Response(JSON.stringify({ error: "match_id required" }), { status: 400 });
  }

  // Fetch the finished match
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, score_a, score_b, status")
    .eq("id", match_id)
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

  // Fetch all predictions for this match
  const { data: predictions, error: predError } = await supabase
    .from("predictions")
    .select("id, user_id, predicted_a, predicted_b")
    .eq("match_id", match_id)
    .is("points_awarded", null);

  if (predError) {
    return new Response(JSON.stringify({ error: predError.message }), { status: 500 });
  }

  if (!predictions || predictions.length === 0) {
    return new Response(JSON.stringify({ scored: 0 }), { status: 200 });
  }

  // Calculate and apply points for each prediction
  for (const pred of predictions) {
    const points = calcPoints(
      match.score_a,
      match.score_b,
      pred.predicted_a,
      pred.predicted_b
    );

    // Update prediction
    const { error: updateError } = await supabase
      .from("predictions")
      .update({ points_awarded: points })
      .eq("id", pred.id);

    if (updateError) continue;

    // Update total_points for all leagues this user belongs to
    const { data: memberships } = await supabase
      .from("league_members")
      .select("league_id, total_points")
      .eq("user_id", pred.user_id);

    if (memberships) {
      for (const membership of memberships) {
        await supabase
          .from("league_members")
          .update({ total_points: membership.total_points + points })
          .eq("league_id", membership.league_id)
          .eq("user_id", pred.user_id);
      }
    }
  }

  return new Response(
    JSON.stringify({ scored: predictions.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
