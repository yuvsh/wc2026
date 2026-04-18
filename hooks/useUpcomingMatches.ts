import useSWR, { type KeyedMutator } from "swr";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Match {
  id: string;
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  kickoff_at: string;
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
  score_a: number | null;
  score_b: number | null;
}

export interface Prediction {
  match_id: string;
  predicted_a: number;
  predicted_b: number;
  points_awarded: number | null;
  is_locked: boolean;
}

interface UpcomingMatchesData {
  matches: Match[];
  predictions: Map<string, Prediction>;
}

// Group stage ends after last group match (June 28 00:00 UTC).
// Show only group stage until then; switch to knockout stages after.
const GROUP_STAGE_END = new Date("2026-06-28T00:00:00Z");

async function fetchUpcomingMatches(
  supabase: SupabaseClient,
  userId: string
): Promise<UpcomingMatchesData> {
  const activeStages = new Date() < GROUP_STAGE_END
    ? ["group"]
    : ["r32", "r16", "qf", "sf", "final"];

  // Include matches up to 3 hours after kickoff so live matches remain visible
  const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();

  const { data: allUpcoming, error: matchError } = await supabase
    .from("matches")
    .select("id, team_a, team_b, team_a_code, team_b_code, kickoff_at, status, score_a, score_b")
    .neq("status", "cancelled")
    .neq("status", "finished")
    .gte("kickoff_at", cutoff)
    .in("stage", activeStages)
    .order("kickoff_at", { ascending: true });

  if (matchError) throw matchError;

  // Show only the next 7-day window from the earliest upcoming match
  let matchData: typeof allUpcoming = [];
  if (allUpcoming && allUpcoming.length > 0) {
    const firstKickoff = new Date(allUpcoming[0].kickoff_at);
    const windowEnd = new Date(firstKickoff.getTime() + 7 * 24 * 60 * 60 * 1000);
    matchData = allUpcoming.filter((m) => new Date(m.kickoff_at) <= windowEnd);
  }

  const matches = matchData as Match[];
  const matchIds = matches.map((m) => m.id);

  const { data: predData, error: predError } = await supabase
    .from("predictions")
    .select("match_id, predicted_a, predicted_b, points_awarded, is_locked")
    .eq("user_id", userId)
    .in("match_id", matchIds.length > 0 ? matchIds : ["00000000-0000-0000-0000-000000000000"]);

  if (predError) throw predError;

  const predictions = new Map<string, Prediction>();
  for (const p of predData ?? []) {
    predictions.set(p.match_id, p as Prediction);
  }

  return { matches, predictions };
}

export function useUpcomingMatches(userId: string | null): {
  data: UpcomingMatchesData | undefined;
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<UpcomingMatchesData>;
} {
  // Memoized client — one WebSocket connection per component mount, not per revalidation
  const supabase = useMemo(() => createClient(), []);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["upcoming-matches", userId] : null,
    // Inline arrow captures the stable supabase ref from useMemo
    ([, id]) => fetchUpcomingMatches(supabase, id),
    {
      dedupingInterval: 30_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return { data, isLoading, error, mutate };
}
