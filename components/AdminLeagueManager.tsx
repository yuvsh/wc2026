"use client";

import { useState } from "react";
import { deleteLeague, deleteAllLeagues } from "@/app/actions/admin";
import type { AdminLeague } from "@/app/(admin)/admin/page";

interface AdminLeagueManagerProps {
  initialLeagues: AdminLeague[];
}

export default function AdminLeagueManager({ initialLeagues }: AdminLeagueManagerProps): React.ReactElement {
  const [leagues, setLeagues] = useState<AdminLeague[]>(initialLeagues);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteLeague(leagueId: string): Promise<void> {
    setDeletingId(leagueId);
    setError(null);
    const result = await deleteLeague(leagueId);
    setDeletingId(null);
    setConfirmDeleteId(null);

    if (!result.ok) {
      setError(result.error ?? "Delete failed");
      return;
    }
    setLeagues((prev) => prev.filter((l) => l.id !== leagueId));
  }

  async function handleDeleteAll(): Promise<void> {
    setDeletingAll(true);
    setError(null);
    const result = await deleteAllLeagues();
    setDeletingAll(false);
    setConfirmDeleteAll(false);

    if (!result.ok) {
      setError(result.error ?? "Delete failed");
      return;
    }
    setLeagues([]);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin — Leagues</h1>
        {leagues.length > 0 && (
          confirmDeleteAll ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-medium">Delete all {leagues.length} leagues?</span>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingAll ? "Deleting…" : "Yes, delete all"}
              </button>
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="px-3 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded hover:bg-red-200 transition-colors"
            >
              Delete all leagues
            </button>
          )
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {leagues.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No leagues (global league is always preserved)</p>
      ) : (
        <div className="space-y-2">
          {leagues.map((league) => {
            const isConfirming = confirmDeleteId === league.id;
            const isDeleting = deletingId === league.id;

            return (
              <div
                key={league.id}
                className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3"
              >
                {/* League info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{league.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Code: <span className="font-mono">{league.invite_code}</span>
                    {" · "}
                    {league.member_count} {league.member_count === 1 ? "member" : "members"}
                    {" · "}
                    {new Date(league.created_at).toLocaleDateString("he-IL")}
                  </p>
                </div>

                {/* Delete controls */}
                {isConfirming ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-red-600">Sure?</span>
                    <button
                      onClick={() => handleDeleteLeague(league.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? "…" : "Delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(league.id)}
                    className="shrink-0 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
