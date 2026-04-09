import { getPointsType } from "@/components/MatchCard";

interface HistoryMatchCardProps {
  teamA: string;
  teamB: string;
  teamACode: string;
  teamBCode: string;
  scoreA: number;
  scoreB: number;
  predictedA: number;
  predictedB: number;
  pointsAwarded: number;
  kickoffAt: Date;
}

const COPY = {
  bingo: "⚽ בינגו · 3 נקודות",
  correct: "✓ תוצאה נכונה · 1 נקודה",
  miss: "✗ פספוס · 0 נקודות",
  predictionLabel: (a: number, b: number) => `ניחוש שלך: ${a}–${b}`,
};

function FlagIcon({ code }: { code: string }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm`}
      style={{ width: 20, height: 14, display: "inline-block" }}
    />
  );
}

export default function HistoryMatchCard({
  teamA,
  teamB,
  teamACode,
  teamBCode,
  scoreA,
  scoreB,
  predictedA,
  predictedB,
  pointsAwarded,
  kickoffAt,
}: HistoryMatchCardProps): React.ReactElement {
  const type = getPointsType(pointsAwarded);

  const borderAccent =
    type === "bingo"
      ? "border-r-4 border-r-[#EF9F27]"
      : type === "correct"
      ? "border-r-4 border-r-[#22C55E]"
      : "border-r-4 border-r-[#6B7280]";

  const badgeStyles = {
    bingo: "bg-[#FAEEDA] text-[#EF9F27]",
    correct: "bg-[#DCFCE7] text-[#22C55E]",
    miss: "bg-[#F3F4F6] text-[#6B7280]",
  };

  const badgeLabels = {
    bingo: COPY.bingo,
    correct: COPY.correct,
    miss: COPY.miss,
  };

  const dateStr = kickoffAt.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "numeric",
    timeZone: "Asia/Jerusalem",
  });

  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] p-4 ${borderAccent}`}>
      {/* Teams + result */}
      <div className="flex items-center justify-between gap-3">
        {/* Team A */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-[15px] font-medium text-[#111827]">{teamA}</span>
          <FlagIcon code={teamACode} />
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <div className="w-[38px] h-[38px] rounded-lg bg-[#111827] flex items-center justify-center">
            <span className="text-white text-[17px] font-bold">{scoreA}</span>
          </div>
          <span className="text-[#9CA3AF]">—</span>
          <div className="w-[38px] h-[38px] rounded-lg bg-[#111827] flex items-center justify-center">
            <span className="text-white text-[17px] font-bold">{scoreB}</span>
          </div>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <FlagIcon code={teamBCode} />
          <span className="text-[15px] font-medium text-[#111827]">{teamB}</span>
        </div>
      </div>

      {/* Badge + prediction + date */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[13px] text-[#9CA3AF]">{dateStr}</span>
        <div className="flex flex-col items-end gap-1">
          {type && (
            <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${badgeStyles[type]}`}>
              {badgeLabels[type]}
            </span>
          )}
          <span className="text-[13px] text-[#6B7280]">
            {COPY.predictionLabel(predictedA, predictedB)}
          </span>
        </div>
      </div>
    </div>
  );
}
