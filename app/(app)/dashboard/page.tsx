"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import MatchCard from "@/components/MatchCard";

interface Match {
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

interface Prediction {
  match_id: string;
  predicted_a: number;
  predicted_b: number;
  points_awarded: number | null;
  is_locked: boolean;
}

interface LeagueMember {
  total_points: number;
  league_id: string;
}

const COPY = {
  goldenBootBanner: "חזה מי יהיה מלך השערים ←",
  rank: "דירוג",
  points: (n: number) => `${n} נק'`,
  toastSaved: "הניחוש נשמר ✓",
  toastError: "שגיאה בשמירה, נסה שוב",
  matchLocked: "המשחק נעול. לא ניתן לשנות ניחוש",
  noMatches: "אין משחקים היום",
  dateToday: "היום",
};

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday =
    date.toDateString() === today.toDateString();

  if (isToday) return COPY.dateToday;

  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    timeZone: "Asia/Jerusalem",
  });
}

function groupByDate(matches: Match[]): Map<string, Match[]> {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const date = new Date(match.kickoff_at).toLocaleDateString("he-IL", {
      timeZone: "Asia/Jerusalem",
    });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(match);
  }
  return groups;
}

export default function DashboardPage(): React.ReactElement {
  const supabase = createClient();

  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Map<string, Prediction>>(new Map());
  const [rank, setRank] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showGoldenBootBanner, setShowGoldenBootBanner] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  function showToast(message: string): void {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  const loadData = useCallback(async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Fetch matches (exclude cancelled)
    const { data: matchData } = await supabase
      .from("matches")
      .select("id, team_a, team_b, team_a_code, team_b_code, kickoff_at, status, score_a, score_b")
      .neq("status", "cancelled")
      .order("kickoff_at", { ascending: true });

    if (matchData) setMatches(matchData);

    // Fetch predictions
    const { data: predData } = await supabase
      .from("predictions")
      .select("match_id, predicted_a, predicted_b, points_awarded, is_locked")
      .eq("user_id", user.id);

    if (predData) {
      const predMap = new Map<string, Prediction>();
      predData.forEach((p) => predMap.set(p.match_id, p));
      setPredictions(predMap);
    }

    // Fetch rank from first league
    const { data: memberData } = await supabase
      .from("league_members")
      .select("total_points, league_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (memberData) {
      setTotalPoints(memberData.total_points);

      const { data: leagueMembers } = await supabase
        .from("league_members")
        .select("user_id, total_points")
        .eq("league_id", memberData.league_id)
        .order("total_points", { ascending: false });

      if (leagueMembers) {
        const position = leagueMembers.findIndex((m) => m.user_id === user.id) + 1;
        setRank(position > 0 ? position : null);
      }
    }

    // Check golden boot
    const { data: gbData } = await supabase
      .from("golden_boot_predictions")
      .select("id")
      .eq("user_id", user.id)
      .single();

    setShowGoldenBootBanner(!gbData);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime: match status changes
  useEffect(() => {
    const channel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches" },
        () => { loadData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, loadData]);

  // Realtime: prediction points updates
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
        () => { loadData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, userId, loadData]);

  async function handleSave(matchId: string, predictedA: number, predictedB: number): Promise<void> {
    if (!userId) return;

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    // Check if locked
    const lockTime = new Date(match.kickoff_at).getTime() - 5 * 60 * 1000;
    if (Date.now() >= lockTime) {
      showToast(COPY.matchLocked);
      return;
    }

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
      return;
    }

    setPredictions((prev) => {
      const next = new Map(prev);
      next.set(matchId, {
        match_id: matchId,
        predicted_a: predictedA,
        predicted_b: predictedB,
        points_awarded: null,
        is_locked: false,
      });
      return next;
    });

    showToast(COPY.toastSaved);
  }

  const grouped = groupByDate(matches);
  const dateKeys = Array.from(grouped.keys());

  // Sort: today first
  const today = new Date().toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
  dateKeys.sort((a, b) => {
    if (a === today) return -1;
    if (b === today) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col min-h-full">
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
        {matches.length === 0 ? (
          <p className="text-center text-[#9CA3AF] text-[15px] mt-12">{COPY.noMatches}</p>
        ) : (
          dateKeys.map((dateKey) => (
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
          ))
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
