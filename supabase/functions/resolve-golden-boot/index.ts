import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Award points for golden boot predictions after the tournament ends.
// Called manually once when the tournament top scorer is known.
//
// Request body: { "player_id": "<uuid of the winning player>" }
//
// Points awarded: 5 points to each user who predicted the correct player.
// TODO: Confirm points value with product owner before running in production.

const GOLDEN_BOOT_POINTS = 5;

Deno.serve(async (req): Promise<Response> => {
  const authHeader = req.headers.get("Authorization");
  const expectedAuth = `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`;
  if (authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let body: { player_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), { status: 400 });
  }

  const { player_id } = body;

  if (!player_id) {
    return new Response(JSON.stringify({ error: "player_id required" }), { status: 400 });
  }

  // Verify player exists
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("id, name")
    .eq("id", player_id)
    .single();

  if (playerError || !player) {
    return new Response(JSON.stringify({ error: "player not found" }), { status: 404 });
  }

  // Find all correct golden boot predictions (not yet resolved)
  const { data: winners, error: winnersError } = await supabase
    .from("golden_boot_predictions")
    .select("user_id")
    .eq("player_id", player_id)
    .is("points_awarded", null);

  if (winnersError) {
    return new Response(JSON.stringify({ error: winnersError.message }), { status: 500 });
  }

  const winnerIds = winners?.map((w) => w.user_id) ?? [];

  const errors: string[] = [];

  // Award points to correct predictors via atomic RPC
  for (const userId of winnerIds) {
    const { error: rpcError } = await supabase.rpc("score_golden_boot", {
      p_user_id: userId,
      p_player_id: player_id,
      p_points: GOLDEN_BOOT_POINTS,
    });
    if (rpcError) {
      errors.push(`user ${userId}: ${rpcError.message}`);
    }
  }

  // If any winner failed to be scored, do NOT proceed to zero-out losers.
  // Running the zero-out sweep after a partial failure would set those failed
  // winners to points_awarded = 0, making the failure unrecoverable on retry.
  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ error: "partial failure — aborting zero-out", errors }),
      { status: 500 }
    );
  }

  // Zero out all remaining unresolved predictions (those who guessed wrong).
  // This runs even if winnerIds is empty (nobody guessed correctly).
  const { error: updateMissError } = await supabase
    .from("golden_boot_predictions")
    .update({ points_awarded: 0 })
    .neq("player_id", player_id)
    .is("points_awarded", null);

  if (updateMissError) {
    return new Response(JSON.stringify({ error: updateMissError.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ awarded: winnerIds.length, player: player.name }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
