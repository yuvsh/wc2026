import useSWR, { type KeyedMutator } from "swr";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

interface Member {
  user_id: string;
  total_points: number;
  users: {
    display_name: string;
    neighbourhood_id: string | null;
    neighbourhoods: { name: string } | { name: string }[] | null;
  } | {
    display_name: string;
    neighbourhood_id: string | null;
    neighbourhoods: { name: string } | { name: string }[] | null;
  }[];
}

async function fetchLeagueMembers(
  supabase: SupabaseClient,
  leagueId: string
): Promise<Member[]> {
  // Three separate queries instead of nested joins — nested joins with RLS silently return
  // null rows when both tables have policies (project rule in AGENTS.md).
  const { data: memberRows, error: memberError } = await supabase
    .from("league_members")
    .select("user_id, total_points")
    .eq("league_id", leagueId)
    .order("total_points", { ascending: false });

  if (memberError) throw memberError;
  if (!memberRows || memberRows.length === 0) return [];

  const userIds = memberRows.map((m) => m.user_id);

  const { data: userRows, error: userError } = await supabase
    .from("users")
    .select("id, display_name, neighbourhood_id")
    .in("id", userIds);

  if (userError) throw userError;

  const neighbourhoodIds = (userRows ?? [])
    .map((u) => u.neighbourhood_id)
    .filter((id): id is string => id !== null);

  const { data: hoodRows, error: hoodError } = await supabase
    .from("neighbourhoods")
    .select("id, name")
    .in("id", neighbourhoodIds.length > 0 ? neighbourhoodIds : ["00000000-0000-0000-0000-000000000000"]);

  if (hoodError) throw hoodError;

  const hoodMap = new Map<string, string>();
  for (const h of hoodRows ?? []) hoodMap.set(h.id, h.name);

  const userMap = new Map<string, { display_name: string; neighbourhood_id: string | null }>();
  for (const u of userRows ?? []) userMap.set(u.id, u);

  return memberRows.map((m) => {
    const u = userMap.get(m.user_id);
    const hoodName = u?.neighbourhood_id ? hoodMap.get(u.neighbourhood_id) ?? null : null;
    return {
      user_id: m.user_id,
      total_points: m.total_points,
      users: {
        display_name: u?.display_name ?? "—",
        neighbourhood_id: u?.neighbourhood_id ?? null,
        neighbourhoods: hoodName ? { name: hoodName } : null,
      },
    };
  });
}

export function useLeagueMembers(leagueId: string | null): {
  members: Member[];
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<Member[]>;
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
