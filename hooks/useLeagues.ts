import useSWR, { type KeyedMutator } from "swr";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

interface League {
  id: string;
  name: string;
}

async function fetchLeagues(supabase: SupabaseClient, userId: string): Promise<League[]> {
  const { data: memberRows, error: memberError } = await supabase
    .from("league_members")
    .select("league_id")
    .eq("user_id", userId);

  if (memberError) throw memberError;
  if (!memberRows || memberRows.length === 0) return [];

  const leagueIds = memberRows.map((r) => r.league_id);

  const { data: leagueRows, error: leagueError } = await supabase
    .from("leagues")
    .select("id, name")
    .in("id", leagueIds);

  if (leagueError) throw leagueError;

  return (leagueRows ?? []) as League[];
}

export function useLeagues(userId: string | null): {
  leagues: League[];
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<League[]>;
} {
  // Memoized client — one WebSocket connection per component mount, not per revalidation
  const supabase = useMemo(() => createClient(), []);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["leagues", userId] : null,
    ([, id]) => fetchLeagues(supabase, id),
    {
      dedupingInterval: 120_000,
      revalidateOnFocus: true,
    }
  );

  return { leagues: data ?? [], isLoading, error, mutate };
}
