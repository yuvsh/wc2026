import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Lock predictions for matches starting within 5 minutes.
// Also locks golden boot and neighbourhoods on the very first match.
// Schedule: every 1 minute via Supabase cron.

const LOCK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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

  const now = new Date();
  const lockBefore = new Date(now.getTime() + LOCK_WINDOW_MS).toISOString();

  // Find scheduled matches that should now be locked
  const { data: matchesToLock, error: matchError } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "scheduled")
    .lte("kickoff_at", lockBefore);

  if (matchError) {
    return new Response(JSON.stringify({ error: matchError.message }), { status: 500 });
  }

  if (!matchesToLock || matchesToLock.length === 0) {
    return new Response(JSON.stringify({ locked: 0 }), { status: 200 });
  }

  const matchIds = matchesToLock.map((m) => m.id);

  // Lock all predictions for these matches
  const { error: predError } = await supabase
    .from("predictions")
    .update({ is_locked: true })
    .in("match_id", matchIds)
    .eq("is_locked", false);

  if (predError) {
    return new Response(JSON.stringify({ error: predError.message }), { status: 500 });
  }

  // Check if this is the first match — exclude postponed/cancelled from "first" determination
  const { data: firstMatch } = await supabase
    .from("matches")
    .select("id")
    .in("status", ["scheduled", "live", "finished"])
    .order("kickoff_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstMatch && matchIds.includes(firstMatch.id)) {
    const { error: gbError } = await supabase
      .from("golden_boot_predictions")
      .update({ is_locked: true })
      .eq("is_locked", false);

    if (gbError) {
      console.error("Failed to lock golden boot predictions:", gbError.message);
    }

    const { error: hoodError } = await supabase
      .from("users")
      .update({ hood_locked: true })
      .eq("hood_locked", false);

    if (hoodError) {
      console.error("Failed to lock neighbourhoods:", hoodError.message);
    }
  }

  return new Response(
    JSON.stringify({ locked: matchIds.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
