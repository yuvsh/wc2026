"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import HistoryStatsBar from "@/components/HistoryStatsBar";
import HistoryMatchCard from "@/components/HistoryMatchCard";

interface MatchData {
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  score_a: number;
  score_b: number;
  kickoff_at: string;
}

interface HistoryEntry {
  match_id: string;
  predicted_a: number;
  predicted_b: number;
  points_awarded: number;
  matches: MatchData | MatchData[];
}

type FilterType = "all" | "bingo" | "correct" | "miss";

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

function getMatch(entry: HistoryEntry) {
  const m = Array.isArray(entry.matches) ? entry.matches[0] : entry.matches;
  return m;
}

export default function HistoryPage(): React.ReactElement {
  const supabase = createClient();

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("predictions")
        .select(`
          match_id,
          predicted_a,
          predicted_b,
          points_awarded,
          matches (
            team_a, team_b, team_a_code, team_b_code,
            score_a, score_b, kickoff_at
          )
        `)
        .eq("user_id", user.id)
        .not("points_awarded", "is", null)
        .order("match_id", { ascending: false });

      if (data) setEntries(data as unknown as HistoryEntry[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = entries.filter((e) => {
    if (filter === "all") return true;
    if (filter === "bingo") return e.points_awarded === 3;
    if (filter === "correct") return e.points_awarded === 1;
    if (filter === "miss") return e.points_awarded === 0;
    return true;
  });

  // Stats (always from full entries, not filtered)
  const totalMatches = entries.length;
  const totalPoints = entries.reduce((sum, e) => sum + (e.points_awarded ?? 0), 0);
  const bingoCount = entries.filter((e) => e.points_awarded === 3).length;
  const correctCount = entries.filter((e) => e.points_awarded === 1).length;
  const missCount = entries.filter((e) => e.points_awarded === 0).length;

  // Group filtered entries by date (newest first)
  const groupedMap = new Map<string, HistoryEntry[]>();
  for (const entry of filtered) {
    const m = getMatch(entry);
    if (!m) continue;
    const date = new Date(m.kickoff_at).toLocaleDateString("he-IL", {
      timeZone: "Asia/Jerusalem",
    });
    if (!groupedMap.has(date)) groupedMap.set(date, []);
    groupedMap.get(date)!.push(entry);
  }
  const dateKeys = Array.from(groupedMap.keys()).reverse();

  return (
    <div className="flex flex-col min-h-full">
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
        {loading ? (
          <div className="flex items-center justify-center mt-12">
            <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#9CA3AF] text-[15px] mt-12">{COPY.empty}</p>
        ) : (
          dateKeys.map((dateKey) => (
            <div key={dateKey} className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-[#6B7280] text-right">{dateKey}</p>
              {groupedMap.get(dateKey)!.map((entry) => {
                const m = getMatch(entry);
                if (!m) return null;
                return (
                  <HistoryMatchCard
                    key={entry.match_id}
                    teamA={m.team_a}
                    teamB={m.team_b}
                    teamACode={m.team_a_code}
                    teamBCode={m.team_b_code}
                    scoreA={m.score_a}
                    scoreB={m.score_b}
                    predictedA={entry.predicted_a}
                    predictedB={entry.predicted_b}
                    pointsAwarded={entry.points_awarded}
                    kickoffAt={new Date(m.kickoff_at)}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
