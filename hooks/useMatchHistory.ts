import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

interface MatchData {
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  score_a: number | null;
  score_b: number | null;
  kickoff_at: string;
}

interface HistoryEntry {
  match_id: string;
  predicted_a: number;
  predicted_b: number;
  points_awarded: number;
  match: MatchData;
}

async function fetchMatchHistory(
  supabase: SupabaseClient,
  userId: string
): Promise<HistoryEntry[]> {
  // Two separate queries instead of a nested join on predictions+matches,
  // because nested joins silently return null rows when RLS is on both tables (AGENTS.md).
  const { data: predRows, error: predError } = await supabase
    .from("predictions")
    .select("match_id, predicted_a, predicted_b, points_awarded")
    .eq("user_id", userId)
    .not("points_awarded", "is", null);

  if (predError) throw predError;
  if (!predRows || predRows.length === 0) return [];

  const matchIds = predRows.map((p) => p.match_id);

  const { data: matchRows, error: matchError } = await supabase
    .from("matches")
    .select("id, team_a, team_b, team_a_code, team_b_code, score_a, score_b, kickoff_at")
    .in("id", matchIds)
    .order("kickoff_at", { ascending: false });

  if (matchError) throw matchError;

  const matchMap = new Map<string, MatchData>();
  for (const m of matchRows ?? []) {
    matchMap.set(m.id, {
      team_a: m.team_a,
      team_b: m.team_b,
      team_a_code: m.team_a_code,
      team_b_code: m.team_b_code,
      score_a: m.score_a,
      score_b: m.score_b,
      kickoff_at: m.kickoff_at,
    });
  }

  // Join on client side and sort by kickoff descending (newest first)
  return predRows
    .filter((p) => matchMap.has(p.match_id))
    .map((p) => ({
      match_id: p.match_id,
      predicted_a: p.predicted_a,
      predicted_b: p.predicted_b,
      points_awarded: p.points_awarded,
      match: matchMap.get(p.match_id)!,
    }))
    .sort((a, b) =>
      new Date(b.match.kickoff_at).getTime() - new Date(a.match.kickoff_at).getTime()
    );
}

export function useMatchHistory(userId: string | null): {
  entries: HistoryEntry[];
  isLoading: boolean;
  error: unknown;
} {
  // Memoized client — one WebSocket connection per component mount, not per revalidation
  const supabase = useMemo(() => createClient(), []);

  const { data, error, isLoading } = useSWR(
    userId ? ["match-history", userId] : null,
    ([, id]) => fetchMatchHistory(supabase, id),
    {
      dedupingInterval: 300_000,
      revalidateOnFocus: false,
    }
  );

  return { entries: data ?? [], isLoading, error };
}
