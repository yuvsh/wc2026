"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import HistoryStatsBar from "@/components/HistoryStatsBar";
import HistoryMatchCard from "@/components/HistoryMatchCard";
import { computeHistoryStats, filterByResult, type FilterType } from "@/lib/utils/historyStats";
import { useMatchHistory } from "@/hooks/useMatchHistory";

const COPY = {
  title: "היסטוריה",
  filterAll: "הכל",
  filterBingo: "בינגו",
  filterCorrect: "תוצאה נכונה",
  filterMiss: "פספוס",
  empty: "אין משחקים עדיין",
};

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: COPY.filterAll },
  { key: "bingo", label: COPY.filterBingo },
  { key: "correct", label: COPY.filterCorrect },
  { key: "miss", label: COPY.filterMiss },
];

export default function HistoryPage(): React.ReactElement {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function loadUser(): Promise<void> {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;
      setUserId(user.id);
    }
    loadUser();
  }, [supabase]);

  const { entries, isLoading } = useMatchHistory(userId);
  const filtered = filterByResult(entries, filter);

  // Stats always computed from full unfiltered entries
  const { totalMatches, totalPoints, bingoCount, correctCount, missCount } =
    computeHistoryStats(entries);

  // Group filtered entries by date key (YYYY-MM-DD in Israel timezone, newest first)
  const groupedMap = new Map<string, typeof entries>();
  for (const entry of filtered) {
    const dateKey = new Date(entry.match.kickoff_at).toLocaleDateString("sv-SE", {
      timeZone: "Asia/Jerusalem",
    });
    if (!groupedMap.has(dateKey)) groupedMap.set(dateKey, []);
    groupedMap.get(dateKey)!.push(entry);
  }
  const dateKeys = Array.from(groupedMap.keys()).sort().reverse();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 text-right">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      {/* Stats bar */}
      <HistoryStatsBar
        matches={totalMatches}
        points={totalPoints}
        bingo={bingoCount}
        correct={correctCount}
        miss={missCount}
      />

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-[#E5E7EB]">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-label={f.label}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              filter === f.key
                ? "bg-[#0D9488] text-white"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Match list */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-6">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center"><p className="text-[15px] text-[#9CA3AF]">{COPY.empty}</p></div>
        ) : (
          dateKeys.map((dateKey) => (
            <div key={dateKey} className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-[#6B7280] text-right">{dateKey}</p>
              {groupedMap.get(dateKey)!.map((entry) => (
                <HistoryMatchCard
                  key={entry.match_id}
                  teamA={entry.match.team_a}
                  teamB={entry.match.team_b}
                  teamACode={entry.match.team_a_code}
                  teamBCode={entry.match.team_b_code}
                  scoreA={entry.match.score_a}
                  scoreB={entry.match.score_b}
                  predictedA={entry.predicted_a}
                  predictedB={entry.predicted_b}
                  pointsAwarded={entry.points_awarded}
                  kickoffAt={new Date(entry.match.kickoff_at)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
