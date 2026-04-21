"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateMatchScore, undoMatchScore } from "@/app/actions/admin";
import type { AdminMatch } from "@/app/(admin)/admin/page";

type MatchStatus = "live" | "finished" | "postponed" | "cancelled" | "scheduled";

const STAGES = ["all", "group", "r32", "r16", "qf", "sf", "final"] as const;
type Stage = (typeof STAGES)[number];

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-gray-100 text-gray-600",
  live:       "bg-green-100 text-green-700",
  finished:   "bg-blue-100 text-blue-700",
  postponed:  "bg-yellow-100 text-yellow-700",
  cancelled:  "bg-red-100 text-red-600",
};

interface RowState {
  scoreA: string;
  scoreB: string;
  status: MatchStatus;
  message: string;
  isError: boolean;
}

export default function AdminScoreManager({ matches }: { matches: AdminMatch[] }): React.ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [testMode, setTestMode] = useState(false);
  const [stageFilter, setStageFilter] = useState<Stage>("all");
  const [search, setSearch] = useState("");
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stageFilter !== "all" && m.stage !== stageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.team_a.toLowerCase().includes(q) && !m.team_b.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [matches, stageFilter, search]);

  function isEditable(match: AdminMatch): boolean {
    if (testMode) return true;
    return match.status === "live" || match.status === "finished";
  }

  function getRowState(match: AdminMatch): RowState {
    return rowStates[match.id] ?? {
      scoreA: match.score_a?.toString() ?? "",
      scoreB: match.score_b?.toString() ?? "",
      status: match.status as MatchStatus,
      message: "",
      isError: false,
    };
  }

  function updateRowState(matchId: string, patch: Partial<RowState>): void {
    setRowStates((prev) => ({
      ...prev,
      [matchId]: { ...getRowState(matches.find((m) => m.id === matchId)!), ...prev[matchId], ...patch },
    }));
  }

  async function handleSave(match: AdminMatch): Promise<void> {
    const state = getRowState(match);
    const scoreA = parseInt(state.scoreA, 10);
    const scoreB = parseInt(state.scoreB, 10);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      updateRowState(match.id, { message: "Invalid scores", isError: true });
      return;
    }

    setSavingId(match.id);
    const result = await updateMatchScore(match.id, scoreA, scoreB, state.status);
    setSavingId(null);

    if (!result.ok) {
      updateRowState(match.id, { message: result.error ?? "Save failed", isError: true });
      return;
    }

    const msg = result.scoringError ? `Saved — scoring error: ${result.scoringError}` : "Saved ✓";
    updateRowState(match.id, { message: msg, isError: !!result.scoringError });
    startTransition(() => router.refresh());
  }

  async function handleUndo(match: AdminMatch): Promise<void> {
    setSavingId(match.id);
    const result = await undoMatchScore(match.id);
    setSavingId(null);

    if (!result.ok) {
      updateRowState(match.id, { message: result.error ?? "Undo failed", isError: true });
      return;
    }

    const undoMsg = result.scoringError ? `Undone — scoring error: ${result.scoringError}` : "Undone ✓";
    updateRowState(match.id, {
      message: undoMsg,
      isError: false,
      scoreA: match.prev_score_a?.toString() ?? "",
      scoreB: match.prev_score_b?.toString() ?? "",
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900">Admin — Match Scores</h1>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={testMode}
            onChange={(e) => setTestMode(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <span className="text-sm font-medium text-red-600">Test mode (edit all)</span>
        </label>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search team…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 min-w-[140px]"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as Stage)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All stages" : s.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Match list */}
      <div className="space-y-2">
        {filtered.map((match) => {
          const state = getRowState(match);
          const editable = isEditable(match);
          const isSaving = savingId === match.id;
          const isOpen = activeMatchId === match.id;

          return (
            <div key={match.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Row summary */}
              <button
                onClick={() => setActiveMatchId(isOpen ? null : match.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                {/* Kickoff */}
                <span className="text-xs text-gray-400 shrink-0 w-[90px]">
                  {new Date(match.kickoff_at).toLocaleString("he-IL", {
                    timeZone: "Asia/Jerusalem",
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Teams + score */}
                <span className="flex-1 font-medium text-gray-900 text-sm truncate">
                  {match.team_a} {match.score_a ?? "–"} : {match.score_b ?? "–"} {match.team_b}
                </span>

                {/* Status badge */}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[match.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {match.status}
                </span>

                {/* Undo indicator */}
                {match.prev_score_a !== null && (
                  <span className="text-[11px] text-orange-500 font-semibold shrink-0">UNDO</span>
                )}

                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Edit panel */}
              {isOpen && (
                <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50">
                  {editable ? (
                    <>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Score inputs */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 w-[80px] truncate">{match.team_a}</label>
                          <input
                            type="number"
                            min={0}
                            value={state.scoreA}
                            onChange={(e) => updateRowState(match.id, { scoreA: e.target.value, message: "" })}
                            className="w-14 border border-gray-300 rounded px-2 py-1 text-center text-sm font-mono"
                            disabled={isSaving}
                          />
                          <span className="text-gray-400">:</span>
                          <input
                            type="number"
                            min={0}
                            value={state.scoreB}
                            onChange={(e) => updateRowState(match.id, { scoreB: e.target.value, message: "" })}
                            className="w-14 border border-gray-300 rounded px-2 py-1 text-center text-sm font-mono"
                            disabled={isSaving}
                          />
                          <label className="text-xs text-gray-500 w-[80px] truncate">{match.team_b}</label>
                        </div>

                        {/* Status selector */}
                        <select
                          value={state.status}
                          onChange={(e) => updateRowState(match.id, { status: e.target.value as MatchStatus, message: "" })}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                          disabled={isSaving}
                        >
                          <option value="scheduled">scheduled</option>
                          <option value="live">live</option>
                          <option value="finished">finished</option>
                          <option value="postponed">postponed</option>
                          <option value="cancelled">cancelled</option>
                        </select>

                        {/* Save */}
                        <button
                          onClick={() => handleSave(match)}
                          disabled={isSaving}
                          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>

                        {/* Undo */}
                        {match.prev_score_a !== null && (
                          <button
                            onClick={() => handleUndo(match)}
                            disabled={isSaving}
                            className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
                          >
                            {isSaving ? "…" : `Undo → ${match.prev_score_a}:${match.prev_score_b}`}
                          </button>
                        )}
                      </div>

                      {/* Inline message */}
                      {state.message && (
                        <p className={`text-sm font-medium ${state.isError ? "text-red-600" : "text-green-600"}`}>
                          {state.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Not editable in normal mode — enable Test Mode to edit this match.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No matches found</p>
        )}
      </div>
    </div>
  );
}
