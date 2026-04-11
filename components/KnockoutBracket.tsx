interface KnockoutMatch {
  id: string;
  stage: "r32" | "r16" | "qf" | "sf" | "final";
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  score_a: number | null;
  score_b: number | null;
  kickoff_at: string;
  status: string;
}

interface KnockoutBracketProps {
  matches: KnockoutMatch[];
}

type Stage = "r32" | "r16" | "qf" | "sf" | "final";

const COPY = {
  emptyStages: "שלב הנוקאאוט טרם החל",
};

const STAGE_LABELS: Record<Stage, { he: string; en: string }> = {
  r32: { he: "סבב 32", en: "Round of 32" },
  r16: { he: "סבב 16", en: "Round of 16" },
  qf: { he: "רבע גמר", en: "Quarter-finals" },
  sf: { he: "חצי גמר", en: "Semi-finals" },
  final: { he: "גמר", en: "Final" },
};

const STAGE_ORDER: Stage[] = ["r32", "r16", "qf", "sf", "final"];

function FlagIcon({ code, faded }: { code: string; faded?: boolean }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm shrink-0 ${faded ? "opacity-30" : ""}`}
      style={{ width: 20, height: 14, display: "inline-block" }}
    />
  );
}

function MatchRow({ match }: { match: KnockoutMatch }): React.ReactElement {
  const isFinished = match.status === "finished";
  const isFinal = match.stage === "final";

  let winnerSide: "a" | "b" | null = null;
  if (isFinished && match.score_a !== null && match.score_b !== null) {
    if (match.score_a > match.score_b) winnerSide = "a";
    else if (match.score_b > match.score_a) winnerSide = "b";
  }

  const teamAFaded = winnerSide === "b";
  const teamBFaded = winnerSide === "a";

  return (
    <div
      className={`bg-white rounded-xl border px-4 py-3 ${
        isFinal ? "border-[#EF9F27]" : "border-[#E5E7EB]"
      }`}
      dir="rtl"
    >
      {/* Team A */}
      <div className={`flex items-center justify-between mb-2 ${teamAFaded ? "opacity-40" : ""}`}>
        <div className="flex items-center gap-2">
          <FlagIcon code={match.team_a_code} />
          <span className={`text-[14px] font-medium ${winnerSide === "a" ? "text-[#0D9488]" : "text-[#111827]"}`}>
            {match.team_a || "—"}
          </span>
        </div>
        <span className={`text-[16px] font-bold tabular-nums ${winnerSide === "a" ? "text-[#0D9488]" : "text-[#111827]"}`}>
          {isFinished && match.score_a !== null ? match.score_a : "—"}
        </span>
      </div>

      {/* Separator */}
      <div className="border-t border-[#F3F4F6] mb-2" />

      {/* Team B */}
      <div className={`flex items-center justify-between ${teamBFaded ? "opacity-40" : ""}`}>
        <div className="flex items-center gap-2">
          <FlagIcon code={match.team_b_code} />
          <span className={`text-[14px] font-medium ${winnerSide === "b" ? "text-[#0D9488]" : "text-[#111827]"}`}>
            {match.team_b || "—"}
          </span>
        </div>
        <span className={`text-[16px] font-bold tabular-nums ${winnerSide === "b" ? "text-[#0D9488]" : "text-[#111827]"}`}>
          {isFinished && match.score_b !== null ? match.score_b : "—"}
        </span>
      </div>
    </div>
  );
}

export default function KnockoutBracket({ matches }: KnockoutBracketProps): React.ReactElement {
  const byStage = new Map<Stage, KnockoutMatch[]>();
  for (const stage of STAGE_ORDER) {
    byStage.set(stage, []);
  }
  for (const match of matches) {
    byStage.get(match.stage)?.push(match);
  }

  // Only render stages that have matches
  const activeStages = STAGE_ORDER.filter((s) => (byStage.get(s) ?? []).length > 0);

  if (activeStages.length === 0) {
    return (
      <p className="text-center text-[#9CA3AF] text-[15px] py-12" dir="rtl">
        {COPY.emptyStages}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {activeStages.map((stage) => {
        const label = STAGE_LABELS[stage];
        const stageMatches = byStage.get(stage) ?? [];
        return (
          <div key={stage} className="flex flex-col gap-3">
            {/* Stage header */}
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-bold text-[#111827]">{label.he}</span>
              <span className="text-[12px] text-[#9CA3AF]">{label.en}</span>
            </div>
            {/* Matches */}
            {stageMatches.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
