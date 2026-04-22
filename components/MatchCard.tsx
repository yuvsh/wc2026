"use client";

import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";
export type PointsType = "bingo" | "correct" | "miss" | null;

export interface MatchCardProps {
  matchId: string;
  teamA: string;
  teamB: string;
  teamACode: string;
  teamBCode: string;
  kickoffAt: Date;
  status: MatchStatus;
  scoreA: number | null;
  scoreB: number | null;
  predictedA: number | null;
  predictedB: number | null;
  pointsAwarded: number | null;
  isLocked: boolean;
  onSave: (matchId: string, predictedA: number, predictedB: number) => Promise<void>;
}

const COPY = {
  btnSave: "שמור",
  locked: "נעול",
  live: "חי",
  lockLabel: "⏱ ננעל בעוד",
  bingo: "⚽ בינגו · 3 נקודות",
  correct: "✓ תוצאה נכונה · 1 נקודה",
  miss: "✗ פספוס · 0 נקודות",
  pending: "מחכים לתוצאה...",
  predictionLabel: (score: string) => `ניחוש שלך: ${score}`,
};

export function getPointsType(points: number | null): PointsType {
  if (points === null) return null;
  if (points === 3) return "bingo";
  if (points === 1) return "correct";
  return "miss";
}

function PointsBadge({ points }: { points: number | null }): React.ReactElement | null {
  const type = getPointsType(points);
  if (!type) return null;

  const styles: Record<NonNullable<PointsType>, string> = {
    bingo: "bg-[#FAEEDA] text-[#EF9F27]",
    correct: "bg-[#DCFCE7] text-[#22C55E]",
    miss: "bg-[#F3F4F6] text-[#6B7280]",
  };

  const labels: Record<NonNullable<PointsType>, string> = {
    bingo: COPY.bingo,
    correct: COPY.correct,
    miss: COPY.miss,
  };

  return (
    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

function FlagIcon({ code }: { code: string }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm`}
      style={{ width: 20, height: 14, display: "inline-block" }}
    />
  );
}

function ScoreBox({
  value,
  onChange,
  disabled,
  finished,
}: {
  value: string;
  onChange?: (v: string) => void;
  disabled: boolean;
  finished: boolean;
}): React.ReactElement {
  if (finished) {
    return (
      <div className="w-[44px] h-[44px] rounded-lg bg-[#111827] flex items-center justify-center">
        <span className="text-white text-[17px] font-bold">{value}</span>
      </div>
    );
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className="w-[44px] h-[44px] rounded-lg border text-center text-[17px] font-bold outline-none transition-colors
        disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:border-[#E5E7EB]
        enabled:border-[#0D9488] enabled:text-[#111827] enabled:bg-white
        focus:ring-2 focus:ring-[#0D9488] focus:ring-opacity-30"
    />
  );
}

export default function MatchCard({
  matchId,
  teamA,
  teamB,
  teamACode,
  teamBCode,
  kickoffAt,
  status,
  scoreA,
  scoreB,
  predictedA,
  predictedB,
  pointsAwarded,
  isLocked,
  onSave,
}: MatchCardProps): React.ReactElement {
  const [inputA, setInputA] = useState(predictedA !== null ? String(predictedA) : "");
  const [inputB, setInputB] = useState(predictedB !== null ? String(predictedB) : "");
  const [saving, setSaving] = useState(false);

  const { display: timerDisplay, isUnderOneHour, isLocked: timerLocked } = useCountdown(kickoffAt);
  const effectiveLocked = isLocked || timerLocked || status !== "scheduled";
  const isFinished = status === "finished";
  const isLive = status === "live";

  const pointsType = getPointsType(pointsAwarded);
  const borderAccent =
    pointsType === "bingo"
      ? "border-r-4 border-r-[#EF9F27]"
      : pointsType === "correct"
      ? "border-r-4 border-r-[#22C55E]"
      : pointsType === "miss"
      ? "border-r-4 border-r-[#6B7280]"
      : isLive
      ? "border-r-4 border-r-[#DC2626]"
      : "";

  async function handleSave(): Promise<void> {
    const a = parseInt(inputA);
    const b = parseInt(inputB);
    if (isNaN(a) || isNaN(b)) return;
    setSaving(true);
    await onSave(matchId, a, b);
    setSaving(false);
  }

  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] p-4 ${borderAccent}`}>
      {/* Teams + scores row */}
      <div className="flex items-center justify-between gap-3">
        {/* Team A (right in RTL) */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-[15px] font-medium text-[#111827]">{teamA}</span>
          <FlagIcon code={teamACode} />
        </div>

        {/* Score inputs */}
        <div className="flex items-center gap-2">
          <ScoreBox
            value={isFinished || isLive ? String(scoreA ?? "") : inputA}
            onChange={setInputA}
            disabled={effectiveLocked}
            finished={isFinished || isLive}
          />
          <span className="text-[#9CA3AF] text-[15px]">—</span>
          <ScoreBox
            value={isFinished || isLive ? String(scoreB ?? "") : inputB}
            onChange={setInputB}
            disabled={effectiveLocked}
            finished={isFinished || isLive}
          />
        </div>

        {/* Team B (left in RTL) */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <FlagIcon code={teamBCode} />
          <span className="text-[15px] font-medium text-[#111827]">{teamB}</span>
        </div>
      </div>

      {/* Timer / locked / finished info */}
      <div className="mt-3 flex flex-col items-center gap-2">
        {isFinished ? (
          <>
            {pointsAwarded !== null ? (
              <PointsBadge points={pointsAwarded} />
            ) : (
              <span className="text-[13px] text-[#9CA3AF]">{COPY.pending}</span>
            )}
            {predictedA !== null && predictedB !== null && (
              <span className="text-[13px] text-[#6B7280]">
                {COPY.predictionLabel(`${predictedA}–${predictedB}`)}
              </span>
            )}
          </>
        ) : isLive ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] motion-safe:animate-pulse">
              {COPY.live}
            </span>
            {predictedA !== null && predictedB !== null && (
              <span className="text-[13px] text-[#6B7280]">
                {COPY.predictionLabel(`${predictedA}–${predictedB}`)}
              </span>
            )}
          </div>
        ) : effectiveLocked ? (
          <div className="flex items-center gap-1 text-[#6B7280]">
            <LockIcon />
            <span className="text-[13px]">{COPY.locked}</span>
          </div>
        ) : (
          <>
            <span
              className={`text-[13px] tabular-nums font-medium ${
                isUnderOneHour ? "text-[#0D9488]" : "text-[#6B7280]"
              }`}
            >
              {COPY.lockLabel} {timerDisplay}
            </span>
            <button
              onClick={handleSave}
              disabled={saving || inputA === "" || inputB === ""}
              className="w-full h-[44px] rounded-lg bg-[#0D9488] text-white text-[13px] font-medium disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              {COPY.btnSave}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LockIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 6V4.5a2.5 2.5 0 015 0V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
