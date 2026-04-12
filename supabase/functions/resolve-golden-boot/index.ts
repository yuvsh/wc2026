import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Award points for golden boot predictions after the tournament ends.
// Called manually once when the tournament top scorer is known.
//
// Request body: { "player_id": "<uuid of the winning player>" }
//
// Points awarded: 5 points to each user who predicted the correct player.
// TODO: Confirm points value with product owner before running in production.

const GOLDEN_BOOT_POINTS = 5;

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { player_id } = await req.json() as { player_id: string };

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

  if (!winners || winners.length === 0) {
    return new Response(
      JSON.stringify({ awarded: 0, player: player.name }),
      { status: 200 }
    );
  }

  const winnerIds = winners.map((w) => w.user_id);

  // Mark winning predictions as resolved
  const { error: updatePredError } = await supabase
    .from("golden_boot_predictions")
    .update({ points_awarded: GOLDEN_BOOT_POINTS })
    .in("user_id", winnerIds);

  if (updatePredError) {
    return new Response(JSON.stringify({ error: updatePredError.message }), { status: 500 });
  }

  // Mark all other predictions as resolved with 0 points
  const { error: updateMissError } = await supabase
    .from("golden_boot_predictions")
    .update({ points_awarded: 0 })
    .not("user_id", "in", `(${winnerIds.join(",")})`)
    .is("points_awarded", null);

  if (updateMissError) {
    return new Response(JSON.stringify({ error: updateMissError.message }), { status: 500 });
  }

  // Add golden boot points to league_members.total_points for each winner
  for (const userId of winnerIds) {
    const { data: memberships } = await supabase
      .from("league_members")
      .select("league_id, total_points")
      .eq("user_id", userId);

    if (memberships) {
      for (const membership of memberships) {
        await supabase
          .from("league_members")
          .update({ total_points: membership.total_points + GOLDEN_BOOT_POINTS })
          .eq("league_id", membership.league_id)
          .eq("user_id", userId);
      }
    }
  }

  return new Response(
    JSON.stringify({ awarded: winnerIds.length, player: player.name }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
