"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import MatchCard from "@/components/MatchCard";
import { useUpcomingMatches, type Match, type Prediction } from "@/hooks/useUpcomingMatches";

const COPY = {
  goldenBootBanner: "חזה מי יהיה מלך השערים ←",
  rank: "דירוג",
  points: (n: number) => `${n} נק'`,
  toastSaved: "הניחוש נשמר ✓",
  toastError: "שגיאה בשמירה, נסה שוב",
  matchLocked: "המשחק נעול. לא ניתן לשנות ניחוש",
  noMatches: "אין משחקים קרובים",
  moreGamesComingSoon: "משחקים נוספים יתעדכנו בהמשך ⚽",
  dateToday: "היום",
};

// Returns YYYY-MM-DD in Israel timezone — sorts lexicographically as dates
function toIsraelDateKey(kickoffAt: string): string {
  return new Date(kickoffAt).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jerusalem",
  });
}

function formatDateLabel(isoDate: string): string {
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" });
  if (isoDate === todayKey) return COPY.dateToday;

  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });
}

function groupByDate(matches: Match[]): Map<string, Match[]> {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const key = toIsraelDateKey(match.kickoff_at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(match);
  }
  return groups;
}

export default function DashboardPage(): React.ReactElement {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showGoldenBootBanner, setShowGoldenBootBanner] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const { data, isLoading: matchesLoading, mutate } = useUpcomingMatches(userId);
  const matches: Match[] = data?.matches ?? [];
  const predictions: Map<string, Prediction> = data?.predictions ?? new Map();

  const loading = userLoading || matchesLoading;

  function showToast(message: string): void {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  // Load user identity + rank + golden boot status
  useEffect(() => {
    async function loadUser(): Promise<void> {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) { setUserLoading(false); return; }
        setUserId(user.id);

        const { data: memberData, error: memberError } = await supabase
          .from("league_members")
          .select("total_points, league_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (memberError) throw memberError;

        if (memberData) {
          setTotalPoints(memberData.total_points);

          const { data: leagueMembers, error: leagueMembersError } = await supabase
            .from("league_members")
            .select("user_id, total_points")
            .eq("league_id", memberData.league_id)
            .order("total_points", { ascending: false });

          if (leagueMembersError) throw leagueMembersError;

          if (leagueMembers) {
            const position = leagueMembers.findIndex((m) => m.user_id === user.id) + 1;
            setRank(position > 0 ? position : null);
          }
        }

        const { data: gbData, error: gbError } = await supabase
          .from("golden_boot_predictions")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (gbError) throw gbError;

        setShowGoldenBootBanner(!gbData);
      } catch {
        showToast(COPY.toastError);
      } finally {
        setUserLoading(false);
      }
    }
    loadUser();
  }, [supabase]);

  // Realtime: match status changes — trigger SWR revalidation
  useEffect(() => {
    const channel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches" },
        () => { mutate(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, mutate]);

  // Realtime: prediction points updates — trigger SWR revalidation
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("predictions-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "predictions",
          filter: `user_id=eq.${userId}`,
        },
        () => { mutate(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, userId, mutate]);

  async function handleSave(matchId: string, predictedA: number, predictedB: number): Promise<void> {
    if (!userId) return;

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const lockTime = new Date(match.kickoff_at).getTime() - 5 * 60 * 1000;
    if (Date.now() >= lockTime) {
      showToast(COPY.matchLocked);
      return;
    }

    // Optimistic update — show saved prediction immediately without waiting for refetch
    const optimisticPredictions = new Map(predictions);
    optimisticPredictions.set(matchId, {
      match_id: matchId,
      predicted_a: predictedA,
      predicted_b: predictedB,
      points_awarded: null,
      is_locked: false,
    });
    mutate(
      data ? { matches: data.matches, predictions: optimisticPredictions } : undefined,
      { revalidate: false }
    );

    const { error } = await supabase.from("predictions").upsert(
      {
        user_id: userId,
        match_id: matchId,
        predicted_a: predictedA,
        predicted_b: predictedB,
      },
      { onConflict: "user_id,match_id" }
    );

    if (error) {
      showToast(COPY.toastError);
      mutate(); // revert optimistic update
      return;
    }

    showToast(COPY.toastSaved);
  }

  const grouped = groupByDate(matches);
  const dateKeys = Array.from(grouped.keys());

  // YYYY-MM-DD keys sort lexicographically; pin today to top
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" });
  dateKeys.sort((a, b) => {
    if (a === todayKey) return -1;
    if (b === todayKey) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rank !== null && (
            <span className="text-[13px] bg-[#F0FDFA] text-[#0D9488] font-medium px-3 py-1 rounded-full">
              {COPY.rank} #{rank}
            </span>
          )}
          <span className="text-[13px] text-[#6B7280]">{COPY.points(totalPoints)}</span>
        </div>
        <h1 className="text-[17px] font-bold text-[#111827]">ניחושים</h1>
      </div>

      {/* Golden Boot banner */}
      {showGoldenBootBanner && (
        <Link href="/golden-boot">
          <div className="bg-[#0D9488] text-white text-[13px] font-medium px-4 py-3 text-center">
            {COPY.goldenBootBanner}
          </div>
        </Link>
      )}

      {/* Match list */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-6">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex-1 flex items-center justify-center"><p className="text-[15px] text-[#9CA3AF]">{COPY.noMatches}</p></div>
        ) : (
          <>
            {dateKeys.map((dateKey) => (
              <div key={dateKey} className="flex flex-col gap-3">
                <p className="text-[13px] font-medium text-[#6B7280] text-right">
                  {formatDateLabel(dateKey)}
                </p>
                {grouped.get(dateKey)!.map((match) => {
                  const prediction = predictions.get(match.id) ?? null;
                  return (
                    <MatchCard
                      key={match.id}
                      matchId={match.id}
                      teamA={match.team_a}
                      teamB={match.team_b}
                      teamACode={match.team_a_code}
                      teamBCode={match.team_b_code}
                      kickoffAt={new Date(match.kickoff_at)}
                      status={match.status}
                      scoreA={match.score_a}
                      scoreB={match.score_b}
                      predictedA={prediction?.predicted_a ?? null}
                      predictedB={prediction?.predicted_b ?? null}
                      pointsAwarded={prediction?.points_awarded ?? null}
                      isLocked={prediction?.is_locked ?? false}
                      onSave={handleSave}
                    />
                  );
                })}
              </div>
            ))}
            <p className="text-[13px] text-[#9CA3AF] text-center py-2">
              {COPY.moreGamesComingSoon}
            </p>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-4 right-4 bg-[#111827] text-white text-[14px] text-center py-3 px-4 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
