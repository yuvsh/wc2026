interface StatsBarProps {
  matches: number;
  points: number;
  bingo: number;
  correct: number;
  miss: number;
}

const LABELS = {
  matches: "משחקים",
  points: "נקודות",
  bingo: "בינגו",
  correct: "נכון",
  miss: "פספוס",
};

function StatCell({ value, label }: { value: number; label: string }): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5">
      <span className="text-[22px] font-bold text-[#111827] tabular-nums">{value}</span>
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
    </div>
  );
}

export default function HistoryStatsBar({
  matches,
  points,
  bingo,
  correct,
  miss,
}: StatsBarProps): React.ReactElement {
  return (
    <div className="bg-white border-b border-[#E5E7EB] flex py-4 px-2">
      <StatCell value={matches} label={LABELS.matches} />
      <div className="w-px bg-[#E5E7EB]" />
      <StatCell value={points} label={LABELS.points} />
      <div className="w-px bg-[#E5E7EB]" />
      <StatCell value={bingo} label={LABELS.bingo} />
      <div className="w-px bg-[#E5E7EB]" />
      <StatCell value={correct} label={LABELS.correct} />
      <div className="w-px bg-[#E5E7EB]" />
      <StatCell value={miss} label={LABELS.miss} />
    </div>
  );
}
