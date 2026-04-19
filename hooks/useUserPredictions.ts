import useSWR from "swr";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UserPrediction {
  match_id: string;
  predicted_a: number;
  predicted_b: number;
  points_awarded: number | null;
  is_locked: boolean;
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  kickoff_at: string;
  status: string;
  score_a: number | null;
  score_b: number | null;
}

export function useUserPredictions(
  userId: string | null,
  leagueId: string | null
): { predictions: UserPrediction[]; isLoading: boolean } {
  const supabase = useMemo(() => createClient(), []);

  const key = userId && leagueId ? `user-predictions-${userId}-${leagueId}` : null;

  const { data, isLoading } = useSWR(key, async () => {
    const { data, error } = await supabase.rpc("get_user_predictions", {
      p_user_id: userId!,
      p_league_id: leagueId!,
    });
    if (error) throw error;
    return (data ?? []) as UserPrediction[];
  });

  return { predictions: data ?? [], isLoading };
}
