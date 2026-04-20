import useSWR, { type KeyedMutator } from "swr";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface LeagueMember {
  user_id: string;
  total_points: number;
  display_name: string;
  neighbourhood: string | null;
  avatar_url: string | null;
}

async function fetchLeagueMembers(
  supabase: SupabaseClient,
  leagueId: string
): Promise<LeagueMember[]> {
  // Use a SECURITY DEFINER RPC — the users table has "read own row" RLS,
  // so a plain client query cannot fetch other members' display names.
  // The function verifies league membership before returning any data.
  const { data, error } = await supabase.rpc("get_league_members", {
    p_league_id: leagueId,
  });

  if (error) throw error;
  return (data ?? []) as LeagueMember[];
}

export function useLeagueMembers(leagueId: string | null): {
  members: LeagueMember[];
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<LeagueMember[]>;
} {
  // Memoized client — one WebSocket connection per component mount, not per revalidation
  const supabase = useMemo(() => createClient(), []);

  const { data, error, isLoading, mutate } = useSWR(
    leagueId ? ["league-members", leagueId] : null,
    ([, id]) => fetchLeagueMembers(supabase, id),
    {
      dedupingInterval: 120_000,
      revalidateOnFocus: true,
    }
  );

  return { members: data ?? [], isLoading, error, mutate };
}
