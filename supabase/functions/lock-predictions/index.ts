import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Lock predictions for matches starting within 5 minutes.
// Also locks golden boot and neighbourhoods on the very first match.
// Schedule: every 1 minute via Supabase cron.

const LOCK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

Deno.serve(async () => {
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

  // Check if this is the first match ever (i.e. any match is starting now)
  // If so, lock golden boot predictions and neighbourhood selections for all users
  const { data: firstMatch } = await supabase
    .from("matches")
    .select("id")
    .not("status", "eq", "cancelled")
    .order("kickoff_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstMatch && matchIds.includes(firstMatch.id)) {
    // Lock all golden boot predictions
    await supabase
      .from("golden_boot_predictions")
      .update({ is_locked: true })
      .eq("is_locked", false);

    // Lock neighbourhood for all users
    await supabase
      .from("users")
      .update({ hood_locked: true })
      .eq("hood_locked", false);
  }

  return new Response(
    JSON.stringify({ locked: matchIds.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
