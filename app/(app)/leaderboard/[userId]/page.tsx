"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HistoryMatchCard from "@/components/HistoryMatchCard";
import { useUserPredictions } from "@/hooks/useUserPredictions";

const COPY = {
  back: "חזרה",
  empty: "עדיין אין ניחושים שהתחילו",
  live: "שידור חי",
};

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function UserPredictionsPage({ params }: PageProps): React.ReactElement {
  const { userId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const leagueId = searchParams.get("leagueId");
  const displayName = searchParams.get("name") ?? "";

  const { predictions, isLoading } = useUserPredictions(userId, leagueId);

  // Group by date (YYYY-MM-DD in Israel timezone), newest first
  const groupedMap = new Map<string, typeof predictions>();
  for (const p of predictions) {
    const dateKey = new Date(p.kickoff_at).toLocaleDateString("sv-SE", {
      timeZone: "Asia/Jerusalem",
    });
    if (!groupedMap.has(dateKey)) groupedMap.set(dateKey, []);
    groupedMap.get(dateKey)!.push(p);
  }
  const dateKeys = Array.from(groupedMap.keys()).sort().reverse();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label={COPY.back}
          className="text-[#0D9488] text-[15px] font-medium shrink-0"
        >
          {"→"}
        </button>
        <h1 className="text-[17px] font-bold text-[#111827] flex-1 text-right truncate">
          {displayName}
        </h1>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : predictions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[15px] text-[#9CA3AF]">{COPY.empty}</p>
        </div>
      ) : (
        <div className="flex-1 px-4 py-4 flex flex-col gap-6 pb-6">
          {dateKeys.map((dateKey) => (
            <div key={dateKey} className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-[#6B7280] text-right">{dateKey}</p>
              {groupedMap.get(dateKey)!.map((p) => (
                <div key={p.match_id} className="relative">
                  {p.status === "live" && (
                    <span className="absolute top-2 left-2 z-10 text-[11px] font-bold text-white bg-[#EF4444] px-2 py-0.5 rounded-full">
                      {COPY.live}
                    </span>
                  )}
                  <HistoryMatchCard
                    teamA={p.team_a}
                    teamB={p.team_b}
                    teamACode={p.team_a_code}
                    teamBCode={p.team_b_code}
                    scoreA={p.score_a}
                    scoreB={p.score_b}
                    predictedA={p.predicted_a}
                    predictedB={p.predicted_b}
                    pointsAwarded={p.points_awarded ?? 0}
                    kickoffAt={new Date(p.kickoff_at)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
